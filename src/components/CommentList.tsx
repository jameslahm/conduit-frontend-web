import { CommentResponseType } from "../utils";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Comment from "./Comment";

import { Typography } from "@material-ui/core";


const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    display: "grid",
    gridRowGap: `${theme.spacing(3)}px`,
  },
}));
interface CommentListPropsType {
  comments: CommentResponseType[];
  deleteCommentMutate:(data:any)=>any
}

const CommentList: React.FC<CommentListPropsType> = ({ comments,deleteCommentMutate }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Comments</Typography>
      {comments.map((comment) => {
        return <Comment deleteCommentMutate={deleteCommentMutate} comment={comment} key={comment.id}></Comment>;
      })}
      
    </div>
  );
};

export default CommentList;
