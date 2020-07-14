import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useParams } from "@reach/router";
import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import { UserAvatar, UserAvatarSkeleton } from "./UserAvatar";
import { ArticleContentSkeleton } from "./ArticleContent";
import ProfileTab from "./ProfileTab";
import { useQuery } from "@apollo/react-hooks";
import {
  GetProfile,
  GetProfileVariables,
} from "../utils/__generated__/GetProfile";
import { GET_PROFILE } from "../utils";

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
  const { data: profileData, loading } = useQuery<
    GetProfile,
    GetProfileVariables
  >(GET_PROFILE, {
    variables: {
      username: username,
    },
  });

  if (loading || !profileData?.getProfile) {
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
          {profileData.getProfile.username === auth.username ? (
            <UserAvatar.self user={auth}></UserAvatar.self>
          ) : (
            <UserAvatar.other user={profileData.getProfile}></UserAvatar.other>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <ProfileTab user={profileData.getProfile}></ProfileTab>
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
