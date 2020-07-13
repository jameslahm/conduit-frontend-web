/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { LoginInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_login {
  __typename: "User";
  id: string;
  username: string;
  token: string;
  bio: string;
  image: string;
  email: string;
}

export interface Login {
  login: Login_login | null;
}

export interface LoginVariables {
  input: LoginInput;
}
