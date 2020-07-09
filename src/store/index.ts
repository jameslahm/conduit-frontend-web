import { themeReducer, authReducer } from "./reducers";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
});

type rootStateType = ReturnType<typeof rootReducer>;

export { rootReducer };
export type { rootStateType };
export * from './actions'
export * from './reducers'
