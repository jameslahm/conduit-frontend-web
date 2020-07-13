/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AddCommentInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: AddComment
// ====================================================

export interface AddComment_addComment_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface AddComment_addComment {
  __typename: "Comment";
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: AddComment_addComment_author;
}

export interface AddComment {
  addComment: AddComment_addComment | null;
}

export interface AddCommentVariables {
  slug: string;
  input: AddCommentInput;
}
