/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnFavoriteArticle
// ====================================================

export interface UnFavoriteArticle_unfavoriteArticle_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface UnFavoriteArticle_unfavoriteArticle {
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
  author: UnFavoriteArticle_unfavoriteArticle_author;
}

export interface UnFavoriteArticle {
  unfavoriteArticle: UnFavoriteArticle_unfavoriteArticle | null;
}

export interface UnFavoriteArticleVariables {
  slug: string;
}
