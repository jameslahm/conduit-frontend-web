/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: ArticleFragment
// ====================================================

export interface ArticleFragment {
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
}
