import { AuthStateType, AuthActionType } from "../actions";

const token = localStorage.getItem("token");

const initialState: AuthStateType = {
  username: "",
  token: token ? token : "",
  bio: "",
  image: "",
  email: "",
};

const authReducer = (
  state = initialState,
  action: AuthActionType
): AuthStateType => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        username: "",
        token: "",
        bio: "",
        image: "",
        email: "",
      };
    default:
      return state;
  }
};

export { authReducer };
