/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteComment
// ====================================================

export interface DeleteComment_deleteComment_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface DeleteComment_deleteComment {
  __typename: "Comment";
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: DeleteComment_deleteComment_author;
}

export interface DeleteComment {
  deleteComment: DeleteComment_deleteComment | null;
}

export interface DeleteCommentVariables {
  id: string;
}
