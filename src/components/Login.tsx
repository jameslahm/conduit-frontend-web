import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LockIcon from "@material-ui/icons/Lock";
import { Link as NavLink, useNavigate } from "@reach/router";
import validator from "validator";
import { useDispatch } from "react-redux";
import { api } from "../utils";
import { login } from "../store";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";

interface LoginPropsType {
  path: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "96px",
    maxWidth: "1000px",
    width: "100%",
    margin: "auto",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.spacing(2),
  },
  input: {
    maxWidth: "400px",
    width: "100%",
    marginTop: theme.spacing(3),
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    marginBottom: theme.spacing(2),
  },
  navLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
}));

const Login: React.FC<LoginPropsType> = () => {
  const classes = useStyles();
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidation, setemailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const dispatch = useDispatch();
  const [mutate] = useMutation(api.login);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    let isValid = true;
    if (validator.isEmpty(email)) {
      isValid = false;
      setemailValidation(`email Can't be Empty`);
    }
    if (!validator.isLength(password, { min: 5 })) {
      isValid = false;
      setPasswordValidation("Password Need To Be Least 5 Length");
    }
    if (!isValid) {
      return;
    } else {
      try {
        const data = await mutate({
          payload: { user: { email, password } },
        });
        dispatch(login(data.user));
        navigate("/");
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    }

    // email
  }

  return (
    <div className={classes.root}>
      <Container className={classes.container} maxWidth="md">
        <Avatar className={classes.avatar}>
          <LockIcon></LockIcon>
        </Avatar>
        <Typography variant="h5">Sign In</Typography>
        <TextField
          className={classes.input}
          label="Email"
          variant="outlined"
          name="email"
          type="email"
          value={email}
          onChange={(event) => setemail(event.target.value)}
          error={emailValidation ? true : false}
          helperText={emailValidation}
        ></TextField>
        <TextField
          type="password"
          name="password"
          className={classes.input}
          label="Password"
          variant="outlined"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          error={passwordValidation ? true : false}
          helperText={passwordValidation}
        ></TextField>
        <Button
          variant="contained"
          color="primary"
          className={classes.input}
          onClick={handleSubmit}
        >
          Sign In
        </Button>
        <Grid
          container
          spacing={0}
          className={classes.input}
          justify="space-between"
        >
          <Grid item>
            <NavLink to="/login" className={classes.navLink}>
              Forget Password?
            </NavLink>
          </Grid>
          <Grid item>
            <NavLink to="/login" className={classes.navLink}>
              Don't have Account? Register!
            </NavLink>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Login;
