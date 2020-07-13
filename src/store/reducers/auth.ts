import { AuthStateType, AuthActionType } from "../actions";

const auth = localStorage.getItem("auth");

const initialState: AuthStateType = auth
  ? JSON.parse(auth)
  : {
      username: "",
      token: "",
      bio: "",
      image: "",
      email: "",
      id: "",
      __typename: "User",
    };

const authReducer = (
  state = initialState,
  action: AuthActionType
): AuthStateType => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("auth", JSON.stringify(action.payload));
      return {
        ...state,
        ...action.payload,
      };
    case "LOGOUT":
      localStorage.removeItem("auth");
      return {
        username: "",
        token: "",
        bio: "",
        image: "",
        email: "",
        __typename: "User",
        id: "",
      };
    default:
      return state;
  }
};

export { authReducer };
