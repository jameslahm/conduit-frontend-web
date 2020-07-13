import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Comment from "./Comment";
import { Typography } from "@material-ui/core";
import { AddComment } from "../utils/__generated__/AddComment";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    display: "grid",
    gridRowGap: `${theme.spacing(3)}px`,
  },
}));
interface CommentListPropsType {
  comments: Exclude<AddComment["addComment"], null>[];
}

const CommentList: React.FC<CommentListPropsType> = ({ comments }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Comments</Typography>
      {comments.map((comment) => {
        return <Comment comment={comment} key={comment.id}></Comment>;
      })}
    </div>
  );
};

export default CommentList;
