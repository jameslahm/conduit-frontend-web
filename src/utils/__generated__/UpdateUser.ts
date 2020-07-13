/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UpdateUserInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateUser
// ====================================================

export interface UpdateUser_updateUser {
  __typename: "User";
  id: string;
  username: string;
  token: string;
  bio: string;
  image: string;
  email: string;
}

export interface UpdateUser {
  updateUser: UpdateUser_updateUser | null;
}

export interface UpdateUserVariables {
  input: UpdateUserInput;
}
