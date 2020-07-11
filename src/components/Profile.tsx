import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useParams } from "@reach/router";
import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import { QueryKeyType, api, ProfileResponseType } from "../utils";
import { useQuery, queryCache } from "react-query";
import { UserAvatar, UserAvatarSkeleton } from "./UserAvatar";
import { ArticleContentSkeleton } from "./ArticleContent";
import ProfileTab from "./ProfileTab";

interface ArticlePropsType {
  path: string;
}

const useStyles = makeStyles(() => ({
  root: {
    paddingTop: "96px",
    maxWidth: "1200px",
    width: "100%",
    margin: "auto",
  },
}));

const Profile: React.FC<ArticlePropsType> = () => {
  const classes = useStyles();
  const { username }: { username: string } = useParams();
  const auth = useSelector((state: rootStateType) => state.auth);
  const queryKey: QueryKeyType = ["getProfile", { payload: username, token:auth.token }];
  const { data, isLoading } = useQuery(queryKey, (key, options) => {
    return api.getProfile(options);
  });

  const updateProfileFn = (data: ProfileResponseType["profile"]) => {
    queryCache.cancelQueries(queryKey);

    const previousData = queryCache.getQueryData(queryKey);

    queryCache.setQueryData(
      queryKey,
      (old: ProfileResponseType | undefined) => {
        if (!old) {
          return old;
        } else {
          const newProfile = { profile: data };
          return newProfile;
        }
      }
    );

    return () => queryCache.setQueryData(queryKey, previousData);
  };

  if (isLoading || !data) {
    return (
      <div className={classes.root}>
        <Grid container justify="space-between" alignItems="flex-start">
          <Grid item xs={12} md={3}>
            <UserAvatarSkeleton></UserAvatarSkeleton>
          </Grid>
          <Grid item xs={12} md={9}>
            <ArticleContentSkeleton></ArticleContentSkeleton>
          </Grid>
        </Grid>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Grid container justify="space-between" alignItems="flex-start">
        <Grid item xs={12} md={3}>
          {data.profile.username === auth.username ? (
            <UserAvatar.self user={auth}></UserAvatar.self>
          ) : (
            <UserAvatar.other
              user={data.profile}
              queryKey={queryKey}
              updateFn={updateProfileFn}
            ></UserAvatar.other>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <ProfileTab user={data.profile}></ProfileTab>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
