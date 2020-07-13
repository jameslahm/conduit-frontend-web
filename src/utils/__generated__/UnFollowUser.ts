/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UnFollowUser
// ====================================================

export interface UnFollowUser_unfollow {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface UnFollowUser {
  unfollow: UnFollowUser_unfollow | null;
}

export interface UnFollowUserVariables {
  username: string;
}
