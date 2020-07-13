/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteArticle
// ====================================================

export interface DeleteArticle_deleteArticle_author {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface DeleteArticle_deleteArticle {
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
  author: DeleteArticle_deleteArticle_author;
}

export interface DeleteArticle {
  deleteArticle: DeleteArticle_deleteArticle | null;
}

export interface DeleteArticleVariables {
  slug: string;
}
