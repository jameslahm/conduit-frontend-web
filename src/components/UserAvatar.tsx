import Avatar from "@material-ui/core/Avatar";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import { ProfileResponseType, ArticleResponseType } from "../utils";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useMutation, queryCache } from "react-query";
import { api } from "../utils";
import { useSelector } from "react-redux";
import { rootStateType } from "../store";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
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
}));

interface UserAvatarPropsType {
  user: ProfileResponseType["profile"];
  queryKey: [string, ...any[]];
}

const UserAvatar: React.FC<UserAvatarPropsType> = ({ user, queryKey }) => {
  const classes = useStyles();
  const [mutate] = useMutation(
    user.following ? api.unfollowUser : api.followUser,
    {
      onMutate: (data) => {
        queryCache.cancelQueries(queryKey);

        const previousData = queryCache.getQueryData(queryKey);

        queryCache.setQueryData(
          queryKey,
          (old: { article: ArticleResponseType } | undefined) => {
            if (old) {
              return {
                article: {
                  ...old.article,
                  author: {
                    ...old.article.author,
                    following: !old.article.author.following,
                  },
                },
              };
            } else {
              return old;
            }
          }
        );

        return () => queryCache.setQueryData(queryKey, previousData);
      },
      onError: (err, data, rollback: any) => {
        rollback();
      },
      onSettled: () => {
        queryCache.invalidateQueries(queryKey);
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
      await mutate({ payload: user.username, token: token });
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
            {user.following ? "Follow" : "unFollow"}
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
        width="90%"
        height={"300px"}
        style={{ margin: "auto" }}
      ></Skeleton>
    </div>
  );
};

export { UserAvatar, UserAvatarSkeleton };
