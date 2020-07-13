/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: FollowUser
// ====================================================

export interface FollowUser_follow {
  __typename: "Profile";
  id: string;
  username: string;
  bio: string;
  image: string;
  following: boolean;
}

export interface FollowUser {
  follow: FollowUser_follow | null;
}

export interface FollowUserVariables {
  username: string;
}
