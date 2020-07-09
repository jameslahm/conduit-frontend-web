import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { ArticleResponseType, api } from "../utils";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import Typography from "@material-ui/core/Typography";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import { rootStateType } from "../store";
import { useSnackbar } from "notistack";
import { useMutation, queryCache } from "react-query";
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  favoritesCount: {
    marginRight: `${theme.spacing(1)}px`,
  },
}));

interface ArticleContentPropsType {
  article: ArticleResponseType;
  queryKey: [string, ...any[]];
}

const ArticleContent: React.FC<ArticleContentPropsType> = ({
  article,
  queryKey,
}) => {
  const classes = useStyles();

  const token = useSelector((state: rootStateType) => state.auth.token);
  const { enqueueSnackbar } = useSnackbar();
  const [mutate] = useMutation(
    article.favorited ? api.unfavoriteArticle : api.favoriteArticle,
    {
      onMutate: (data) => {
        queryCache.cancelQueries(queryKey);

        const previousData = queryCache.getQueryData(queryKey);

        queryCache.setQueryData(
          queryKey,
          (old: { article: ArticleResponseType } | undefined) => {
            if (old) {
              const favorited = !old.article.favorited;
              const favoritesCount = favorited
                ? old.article.favoritesCount + 1
                : old.article.favoritesCount - 1;
              return {
                article: { ...old.article, favorited, favoritesCount },
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
  async function handleFavorite() {
    if (!token) {
      enqueueSnackbar("Please Login first", {
        variant: "error",
      });
    } else {
      await mutate({ payload: article.slug, token: token });
    }
  }

  return (
    <div className={classes.root}>
      <Card>
        <CardHeader
          action={
            <>
              <IconButton onClick={handleFavorite}>
                {article.favorited ? (
                  <FavoriteIcon color="secondary" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="caption" className={classes.favoritesCount}>
                {article.favoritesCount}
              </Typography>
            </>
          }
          title={article.title}
          subheader={format(new Date(article.createdAt), "LLL d,  yyyy")}
        >
        </CardHeader>
        <CardContent>
            <ReactMarkdown source={article.body}></ReactMarkdown>
          </CardContent>
      </Card>
    </div>
  );
};

const ArticleContentSkeleton = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Skeleton
        width="90%"
        variant="rect"
        height={"80vh"}
        style={{ margin: "auto" }}
      >
        {" "}
      </Skeleton>
    </div>
  );
};

export { ArticleContent, ArticleContentSkeleton };
