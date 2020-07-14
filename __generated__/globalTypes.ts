/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface AddCommentInput {
  body: string;
}

export interface CreateArticleInput {
  title: string;
  description: string;
  body: string;
  tagList: (string | null)[];
}

export interface GetAllArticlesInput {
  tag?: string | null;
  author?: string | null;
  favorited?: string | null;
  limit?: number | null;
  offset?: number | null;
}

export interface GetFeedArticlesInput {
  limit?: number | null;
  offset?: number | null;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string | null;
  username?: string | null;
  password?: string | null;
  image?: string | null;
  bio?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
