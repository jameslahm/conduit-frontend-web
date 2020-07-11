import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { useSelector, Provider as ReduxStoreProvider } from "react-redux";
import { createStore } from "redux";
import { rootStateType, rootReducer } from "./store";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { ReactQueryDevtools } from "react-query-devtools";
import {
  LocationProvider,
  createMemorySource,
  createHistory,
} from "@reach/router";

let source = createMemorySource("/");
let history = createHistory(source);

const store = createStore(rootReducer);

const AppWrapper: React.FC = (props) => {
  const themeOptions = useSelector((state: rootStateType) => state.theme);

  const theme = createMuiTheme(themeOptions);

  return (
    <LocationProvider history={history}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
          <App></App>
        </SnackbarProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </ThemeProvider>
    </LocationProvider>
  );
};

ReactDOM.render(
  // <React.StrictMode>
  <ReduxStoreProvider store={store}>
    <AppWrapper />
  </ReduxStoreProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
