import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import { Router, Link as NavLink, navigate } from "@reach/router";
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
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import SettingsIcon from "@material-ui/icons/Settings";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import {logout} from './store'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    minHeight: "100%",
  },
  title: {
    flexGrow: 1,
  },
  navButton: {
    color: theme.palette.primary.contrastText,
  },
  navLink: {
    textDecoration: "none",
  },
}));

const App: React.FC = () => {
  const classes = useStyles();
  const token = useSelector((state: rootStateType) => state.auth.token);
  const image = useSelector((state: rootStateType) => state.auth.image);
  const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement>(
    null as any
  );
  const dispatch=useDispatch()

  function handleClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    setAnchorEl(null as any);
  }

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
                <NavLink to="/article" className={classes.navLink}>
                  <Button
                    className={classes.navButton}
                    startIcon={<CreateIcon></CreateIcon>}
                  >
                    Article
                  </Button>
                </NavLink>
                <div className={classes.navLink}>
                  <Button
                    className={classes.navButton}
                    startIcon={
                      <Avatar
                        src={image}
                        style={{ height: "20px", width: "20px" }}
                      ></Avatar>
                    }
                    onClick={handleClick}
                  >
                    Account
                  </Button>
                  <Menu
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
                  </Menu>
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
        </Router>
      </div>
    </React.Fragment>
  );
};

export default App;
