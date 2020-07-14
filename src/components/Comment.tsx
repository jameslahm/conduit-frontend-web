import Card from "@material-ui/core/Card";
import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import { format } from "date-fns";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector } from "react-redux";
import { rootStateType } from "../store";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import { useSnackbar } from "notistack";
import { AddComment } from "../utils/__generated__/AddComment";
import { md, DELETE_COMMENT } from "../utils";
import { useMutation } from "@apollo/react-hooks";
import {
  DeleteComment,
  DeleteCommentVariables,
} from "../utils/__generated__/DeleteComment";

interface CommentPropsType {
  comment: Exclude<AddComment["addComment"], null>;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    paddingLeft: `${theme.spacing(2)}px`,
    paddingTop: `${theme.spacing(0)}px`,
  },
}));

const Comment: React.FC<CommentPropsType> = ({ comment }) => {
  const classes = useStyles();
  const auth = useSelector((state: rootStateType) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const [deleteComment] = useMutation<DeleteComment, DeleteCommentVariables>(
    DELETE_COMMENT,
    {
      variables: {
        id: comment.id,
      },
    }
  );

  function handleClick() {
    if (!auth.token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
    } else {
      deleteComment();
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          avatar={<Avatar src={comment.author.image}></Avatar>}
          title={comment.author.username}
          action={
            comment.author.username === auth.username ? (
              <IconButton onClick={handleClick}>
                <DeleteIcon color="secondary"></DeleteIcon>
              </IconButton>
            ) : null
          }
          subheader={format(new Date(comment.createdAt), "LLL d,  yyyy")}
        ></CardHeader>
        <Paper
          className={classes.paper}
          elevation={0}
          dangerouslySetInnerHTML={{ __html: md.render(comment.body) }}
        ></Paper>
      </Card>
    </>
  );
};

export default Comment;
