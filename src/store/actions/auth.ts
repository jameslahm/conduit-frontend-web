const LOGIN = "LOGIN";
const LOGOUT = "LOGOUT";

interface AuthStateType {
  username: string;
  token: string;
  bio: string;
  image: string;
  email: string;
}

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
    username: "",
    token: "",
    bio: "",
    image: "",
    email: "",
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
