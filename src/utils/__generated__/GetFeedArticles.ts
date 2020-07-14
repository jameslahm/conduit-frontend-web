/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetFeedArticlesInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL query operation: GetFeedArticles
// ====================================================

export interface GetFeedArticles_getFeedArticles_articles_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface GetFeedArticles_getFeedArticles_articles {
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
  author: GetFeedArticles_getFeedArticles_articles_author;
}

export interface GetFeedArticles_getFeedArticles {
  __typename: "MultipleArticles";
  articles: (GetFeedArticles_getFeedArticles_articles | null)[];
  articlesCount: number;
}

export interface GetFeedArticles {
  getFeedArticles: GetFeedArticles_getFeedArticles | null;
}

export interface GetFeedArticlesVariables {
  input: GetFeedArticlesInput;
}
