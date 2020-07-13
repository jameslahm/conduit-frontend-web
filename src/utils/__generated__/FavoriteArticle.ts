/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FavoriteArticle
// ====================================================

export interface FavoriteArticle_favoriteArticle_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface FavoriteArticle_favoriteArticle {
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
  author: FavoriteArticle_favoriteArticle_author;
}

export interface FavoriteArticle {
  favoriteArticle: FavoriteArticle_favoriteArticle | null;
}

export interface FavoriteArticleVariables {
  slug: string;
}
