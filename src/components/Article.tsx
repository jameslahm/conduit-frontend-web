import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useParams } from "@reach/router";
import { useQuery } from "react-query";
import { api } from "../utils";
import { UserAvatar, UserAvatarSkeleton } from "./UserAvatar";
import { ArticleContent, ArticleContentSkeleton } from "./ArticleContent";

interface ArticlePropsType {
  path: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "96px",
    maxWidth: "1200px",
    width: "100%",
    margin: "auto",
  },
}));

const Article: React.FC<ArticlePropsType> = () => {
  const classes = useStyles();
  const { slug }: { slug: string } = useParams();
  const { data, isLoading } = useQuery(
    [
      "getArticle",
      {
        payload: slug,
      },
    ],
    (key, options) => {
      return api.getArticle(options);
    }
  );

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
          <UserAvatar
            user={data.article.author}
            queryKey={[
              "getArticle",
              {
                payload: slug,
              },
            ]}
          ></UserAvatar>
        </Grid>
        <Grid item xs={12} md={9}>
          <ArticleContent
            article={data.article}
            queryKey={[
              "getArticle",
              {
                payload: slug,
              },
            ]}
          ></ArticleContent>
        </Grid>
      </Grid>
    </div>
  );
};

export default Article;
