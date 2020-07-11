import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { Router, Link as NavLink, useNavigate } from "@reach/router";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Article from "./components/Article";
import { useSelector, useDispatch } from "react-redux";
import { rootStateType } from "./store";
import HomeIcon from "@material-ui/icons/Home";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import CreateIcon from "@material-ui/icons/Create";
import Avatar from "@material-ui/core/Avatar";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { logout } from "./store";
import EditArticle from "./components/EditArticle";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import { useSnackbar } from "notistack";

declare global {
  interface Window {
    api: {
      send: (channel: string, ...args: any[]) => void;
      recieve: (channel: string, fn: (...args: any[]) => void) => void;
    };
  }
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minHeight: "100%",
  },
  title: {
    flexGrow: 1,
    cursor: "pointer",
  },
  navButton: {
    color: theme.palette.primary.contrastText,
  },
  navLink: {
    textDecoration: "none",
  },
}));

const App: React.FC = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  window.api.recieve("update_downloaded", () => {
    enqueueSnackbar("Update Available, Restart Now ?", {
      variant: "success",
      autoHideDuration: null,
      action: (key) => (
        <>
          <Button
            onClick={() => {
              window.api.send("restart_app");
            }}
          >
            Restart
          </Button>
          <Button
            onClick={() => {
              closeSnackbar(key);
            }}
          >
            Dismiss
          </Button>
        </>
      ),
    });
  });

  const classes = useStyles();
  const token = useSelector((state: rootStateType) => state.auth.token);
  const image = useSelector((state: rootStateType) => state.auth.image);
  const username = useSelector((state: rootStateType) => state.auth.username);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <React.Fragment>
      <CssBaseline></CssBaseline>
      <div className={classes.root}>
        <AppBar color="primary">
          <Toolbar>
            <Typography
              variant="h5"
              className={classes.title}
              onClick={() => {
                navigate("/");
              }}
            >
              Conduit
            </Typography>
            <NavLink to="/" className={classes.navLink}>
              <Button
                className={classes.navButton}
                startIcon={<HomeIcon></HomeIcon>}
              >
                Home
              </Button>
            </NavLink>
            {token ? (
              <>
                <NavLink to="/article/edit" className={classes.navLink}>
                  <Button
                    className={classes.navButton}
                    startIcon={<CreateIcon></CreateIcon>}
                  >
                    Article
                  </Button>
                </NavLink>
                <NavLink
                  to={`/profiles/${username}`}
                  className={classes.navLink}
                >
                  <Button
                    className={classes.navButton}
                    startIcon={
                      <Avatar
                        src={image}
                        style={{ height: "20px", width: "20px" }}
                      ></Avatar>
                    }
                  >
                    Account
                  </Button>
                </NavLink>
                <div className={classes.navLink}>
                  <Button
                    className={classes.navButton}
                    startIcon={<ExitToAppIcon></ExitToAppIcon>}
                    onClick={() => {
                      dispatch(logout());
                    }}
                  >
                    logout
                  </Button>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/register" className={classes.navLink}>
                  <Button
                    className={classes.navButton}
                    startIcon={<AccountCircleIcon></AccountCircleIcon>}
                  >
                    Register
                  </Button>
                </NavLink>
                <NavLink to="/login" className={classes.navLink}>
                  <Button
                    className={classes.navButton}
                    startIcon={<VpnKeyIcon></VpnKeyIcon>}
                  >
                    Login
                  </Button>
                </NavLink>
              </>
            )}
          </Toolbar>
        </AppBar>
        <Router>
          <Home path="/"></Home>
          <Login path="/login"></Login>
          <Register path="/register"></Register>
          <Article path="/articles/:slug"></Article>
          <EditArticle path="/article/edit"></EditArticle>
          <Profile path="/profiles/:username"></Profile>
        </Router>
        <Footer></Footer>
      </div>
    </React.Fragment>
  );
};

export default App;

/* <Menu
// TODO: Understand
anchorEl={anchorEl}
getContentAnchorEl={null}
anchorOrigin={{
  vertical: "bottom",
  horizontal: "center",
}}
transformOrigin={{
  vertical: "top",
  horizontal: "center",
}}
open={Boolean(anchorEl)}
onClose={handleClose}
>
<MenuItem className={classes.navLink}>
  <Button
    className={classes.navButton}
    startIcon={<SettingsIcon></SettingsIcon>}
    color="primary"
    variant="contained"
  >
    Settings
  </Button>
</MenuItem>
<MenuItem className={classes.navLink}>
  <Button
    color="primary"
    variant="contained"
    className={classes.navButton}
    startIcon={<ExitToAppIcon></ExitToAppIcon>}
    onClick={() => dispatch(logout())}
  >
    logout
  </Button>
</MenuItem>
</Menu> */
