import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import LockOpenIcon from "@material-ui/icons/LockOpen";
import { Link as NavLink, navigate } from "@reach/router";
import validator from "validator";
import { api } from "../utils";
import { useDispatch } from "react-redux";
import { login } from "../store";
import { useMutation } from "react-query";
import { useSnackbar } from "notistack";

interface RegisterPropsType {
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
    backgroundColor: theme.palette.success.main,
    marginBottom: theme.spacing(2),
  },
  navLink: {
    textDecoration: "none",
    color: theme.palette.primary.main,
  },
}));

const Register: React.FC<RegisterPropsType> = () => {
  const classes = useStyles();
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [usernameValidation, setUsernameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [password2Validation, setPassword2Validation] = useState("");
  const dispatch = useDispatch();
  const [mutate] = useMutation(api.register);
  const { enqueueSnackbar } = useSnackbar();

  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    let isValid = true;
    if (validator.isEmpty(username)) {
      isValid = false;
      setUsernameValidation(`Username Can't be Empty`);
    }
    if (!validator.isEmail(email)) {
      isValid = false;
      setEmailValidation("Need To Be Email");
    }
    if (!validator.isLength(password, { min: 5 })) {
      isValid = false;
      setPasswordValidation("Password Need To Be Least 5 Length");
    }
    if (password2 !== password) {
      isValid = false;
      setPassword2Validation("Password Need To Be The Same");
    }
    if (!isValid) {
      return;
    } else {
      try {
        const data = await mutate({
          payload: { user: { username, password, email } },
        });
        dispatch(login(data.user));
        navigate("/");
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    }
  }

  return (
    <div className={classes.root}>
      <Container className={classes.container} maxWidth="md">
        <Avatar className={classes.avatar}>
          <LockOpenIcon></LockOpenIcon>
        </Avatar>
        <Typography variant="h5">Register</Typography>
        <TextField
          className={classes.input}
          label="Username"
          variant="outlined"
          value={username}
          name="username"
          onChange={(event) => setUserName(event.target.value)}
          error={usernameValidation ? true : false}
          helperText={usernameValidation}
        ></TextField>
        <TextField
          className={classes.input}
          label="Email"
          variant="outlined"
          value={email}
          type="email"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          error={emailValidation ? true : false}
          helperText={emailValidation}
        ></TextField>
        <TextField
          type="password"
          className={classes.input}
          label="Password"
          variant="outlined"
          value={password}
          name="password"
          onChange={(event) => setPassword(event.target.value)}
          error={passwordValidation ? true : false}
          helperText={passwordValidation}
        ></TextField>
        <TextField
          type="password"
          className={classes.input}
          label="Password Again"
          variant="outlined"
          name="password2"
          value={password2}
          onChange={(event) => setPassword2(event.target.value)}
          error={password2Validation ? true : false}
          helperText={password2Validation}
        ></TextField>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          className={classes.input}
        >
          Register
        </Button>
        <Grid
          container
          spacing={0}
          className={classes.input}
          direction="row-reverse"
        >
          <Grid item>
            <NavLink to="/login" className={classes.navLink}>
              Already has Account? Login!
            </NavLink>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Register;
