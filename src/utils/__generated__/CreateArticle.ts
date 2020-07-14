/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateArticleInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: CreateArticle
// ====================================================

export interface CreateArticle_createArticle_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface CreateArticle_createArticle {
  __typename: "Article";
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: (string | null)[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: CreateArticle_createArticle_author;
}

export interface CreateArticle {
  createArticle: CreateArticle_createArticle | null;
}

export interface CreateArticleVariables {
  input: CreateArticleInput;
}
