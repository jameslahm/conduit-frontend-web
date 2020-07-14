/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RegisterInput } from "./../../../__generated__/globalTypes";

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "User";
  id: string;
  username: string;
  token: string;
  bio: string;
  image: string;
  email: string;
}

export interface Register {
  register: Register_register | null;
}

export interface RegisterVariables {
  input: RegisterInput;
}
