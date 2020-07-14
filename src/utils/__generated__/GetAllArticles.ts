/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetAllArticlesInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetAllArticles
// ====================================================

export interface GetAllArticles_getAllArticles_articles_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface GetAllArticles_getAllArticles_articles {
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
  author: GetAllArticles_getAllArticles_articles_author;
}

export interface GetAllArticles_getAllArticles {
  __typename: "MultipleArticles";
  articles: (GetAllArticles_getAllArticles_articles | null)[];
  articlesCount: number;
}

export interface GetAllArticles {
  getAllArticles: GetAllArticles_getAllArticles | null;
}

export interface GetAllArticlesVariables {
  input: GetAllArticlesInput;
}
