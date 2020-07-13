/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetComments
// ====================================================

export interface GetComments_getComments_comments_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface GetComments_getComments_comments {
  __typename: "Comment";
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: GetComments_getComments_comments_author;
}

export interface GetComments_getComments {
  __typename: "MultipleComments";
  comments: (GetComments_getComments_comments | null)[];
}

export interface GetComments {
  getComments: GetComments_getComments | null;
}

export interface GetCommentsVariables {
  slug: string;
}
