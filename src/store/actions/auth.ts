import { Login } from "../../utils/__generated__/Login";

const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

type AuthStateType = Exclude<Login["login"], null>;

interface LogInActionType {
  type: typeof LOGIN;
  payload: AuthStateType;
}

interface LogOutActionType {
  type: typeof LOGOUT;
}

type AuthActionType = LogInActionType | LogOutActionType;

const login = (
  payload: AuthStateType = {
    __typename: "User",
    username: "",
    token: "",
    bio: "",
    image: "",
    email: "",
    id: "",
  }
): AuthActionType => {
  return {
    type: LOGIN,
    payload: payload,
  };
};

const logout = (): AuthActionType => {
  return {
    type: LOGOUT,
  };
};

export { login, logout };
export type { AuthActionType, AuthStateType };
