/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArticle
// ====================================================

export interface GetArticle_getArticle_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface GetArticle_getArticle {
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
  author: GetArticle_getArticle_author;
}

export interface GetArticle {
  getArticle: GetArticle_getArticle | null;
}

export interface GetArticleVariables {
  slug: string;
}
