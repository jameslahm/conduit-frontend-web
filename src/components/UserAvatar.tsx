import Avatar from "@material-ui/core/Avatar";
import React, { useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { rootStateType, AuthStateType, login } from "../store";
import Modal from "@material-ui/core/Modal";
import TextField from "@material-ui/core/TextField";
import Fade from "@material-ui/core/Fade";
import validator from "validator";
import Paper from "@material-ui/core/Paper";
import { ProfileFragment } from "../utils/__generated__/ProfileFragment";
import {
  FollowUser,
  FollowUserVariables,
} from "../utils/__generated__/FollowUser";
import { FOLLOW_USER, UNFOLLOW_USER, UPDATE_USER } from "../utils";
import { useMutation } from "@apollo/react-hooks";
import {
  UnFollowUser,
  UnFollowUserVariables,
} from "../utils/__generated__/UnFollowUser";
import {
  UpdateUserVariables,
  UpdateUser,
} from "../utils/__generated__/UpdateUser";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
    margin: "auto",
  },
  avatar: {
    width: theme.breakpoints.up("md") ? `120px` : `40px`,
    height: theme.breakpoints.up("md") ? `120px` : `40px`,
    margin: "auto",
    marginTop: `${theme.spacing(2)}px`,
    marginBottom: `${theme.spacing(2)}px`,
  },
  card: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: theme.breakpoints.up("md") ? "column" : "row",
  },
  input: {
    maxWidth: "400px",
    width: "100%",
    marginTop: theme.spacing(3),
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    outline: "none",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "550px",
    padding: `${theme.spacing(3)}px ${theme.spacing(2)}px`,
    alignItems: "center",
  },
  avatarInput: {
    display: "none",
  },
}));

interface UserAvatarOther {
  user: ProfileFragment;
}

interface UserAvatarSelf {
  user: AuthStateType;
}
// const UserAvatar: React.FC<UserAvatarPropsType> = (props) => {
//   if ("querykey" in props) {
//     const { user, queryKey, updateFn } = props;
//     return (
//       <UserAvatarOther
//         user={user}
//         queryKey={queryKey}
//         updateFn={updateFn}
//       ></UserAvatarOther>
//     );
//   } else {
//     return (
//       <UserAvatarSelf user={(props as UserAvatarSelf).user}></UserAvatarSelf>
//     );
//   }
// };

const UserAvatarSelf: React.FC<UserAvatarSelf> = ({ user }) => {
  const INITAL_FAKE_PASSWORD = "123456789";
  const classes = useStyles();
  const token = useSelector((state: rootStateType) => state.auth.token);
  const [username, setUserName] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(INITAL_FAKE_PASSWORD);
  const [password2, setPassword2] = useState(INITAL_FAKE_PASSWORD);
  const [usernameValidation, setUsernameValidation] = useState("");
  const [emailValidation, setEmailValidation] = useState("");
  const [passwordValidation, setPasswordValidation] = useState("");
  const [password2Validation, setPassword2Validation] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const [updateUser] = useMutation<UpdateUser, UpdateUserVariables>(
    UPDATE_USER
  );
  const { enqueueSnackbar } = useSnackbar();
  const imageContainer = useRef<HTMLInputElement>(null as any);
  async function handleSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    if (!token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
      return;
    }

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
        const input: UpdateUserVariables["input"] = {
          username: username,
          email: email,
        };
        if (password !== INITAL_FAKE_PASSWORD) {
          input.password = password;
        }
        const res = await updateUser({
          variables: {
            input: input,
          },
        });
        if (res.data?.updateUser) {
          dispatch(login(res.data?.updateUser));
        }
      } catch (err) {
        enqueueSnackbar(err.message, { variant: "error" });
      }
    }
  }

  function handleClick() {
    imageContainer.current.click();
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (!token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
      return;
    }
    if (event.target.files && event.target.files) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = async function (e) {
        const res = await updateUser({
          variables: {
            input: {
              image: (e.target ? e.target.result : user.image) as any,
            },
          },
        });
        if (res.data?.updateUser) {
          dispatch(login(res.data.updateUser));
        }
      };
      reader.readAsDataURL(file);
    }
  }
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Button onClick={() => handleClick()}>
          <Avatar src={user.image} className={classes.avatar}></Avatar>
          <input
            ref={imageContainer}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e)}
            className={classes.avatarInput}
          ></input>
        </Button>
        <CardContent>
          <Typography variant="h6">{user.username}</Typography>
          <Typography variant="subtitle1">{user.bio}</Typography>
        </CardContent>
        <CardActions>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </CardActions>
      </Card>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        className={classes.modal}
      >
        <Fade in={open} timeout={{ exit: 0 }}>
          <Paper className={classes.paper}>
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
              Save
            </Button>
          </Paper>
        </Fade>
      </Modal>
    </div>
  );
};

const UserAvatarOther = ({ user }: { user: ProfileFragment }) => {
  const classes = useStyles();
  const [follow] = useMutation<FollowUser, FollowUserVariables>(FOLLOW_USER, {
    variables: {
      username: user.username,
    },
    optimisticResponse: {
      follow: {
        ...user,
        following: true,
      },
    },
  });

  const [unfollow] = useMutation<UnFollowUser, UnFollowUserVariables>(
    UNFOLLOW_USER,
    {
      variables: {
        username: user.username,
      },
      optimisticResponse: {
        unfollow: {
          ...user,
          following: false,
        },
      },
    }
  );

  const token = useSelector((state: rootStateType) => state.auth.token);
  const { enqueueSnackbar } = useSnackbar();

  async function handleClick() {
    if (!token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
      return;
    } else {
      if (user.following) {
        await follow();
      } else {
        await unfollow();
      }
    }
  }

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <Avatar src={user.image} className={classes.avatar}></Avatar>
        <CardContent>
          <Typography variant="h6">{user.username}</Typography>
          <Typography variant="subtitle1">{user.bio}</Typography>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="primary" onClick={handleClick}>
            {user.following ? "unFollow" : "Follow"}
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

const UserAvatarSkeleton = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Skeleton
        variant="rect"
        width="100%"
        height={"300px"}
        style={{ margin: "auto" }}
      ></Skeleton>
    </div>
  );
};

const UserAvatar = {
  self: UserAvatarSelf,
  other: UserAvatarOther,
};

export { UserAvatar, UserAvatarSkeleton };
