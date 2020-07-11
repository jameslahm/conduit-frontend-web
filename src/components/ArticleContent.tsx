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
import DeleteIcon from '@material-ui/icons/Delete'
import { navigate } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  favoritesCount: {
    marginRight: `${theme.spacing(1)}px`,
  },
  delete:{
  }
}));

interface ArticleContentPropsType {
  article: ArticleResponseType;
  queryKey: [string, ...any[]];
  updateFn: (data: any) => any;
}

const ArticleContent: React.FC<ArticleContentPropsType> = ({
  article,
  queryKey,
  updateFn,
}) => {
  const classes = useStyles();

  const token = useSelector((state: rootStateType) => state.auth.token);
  const auth = useSelector((state: rootStateType) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [mutateFavorite] = useMutation(api.favoriteArticle, {
    onMutate: (data) => {
      const newArticle = { ...article };
      newArticle.favorited = true;
      newArticle.favoritesCount++;
      return updateFn(newArticle);
    },
    onError: (err, data, rollback: any) => {
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(queryKey);
    },
  });

  const [mutateUnFavorite] = useMutation(api.unfavoriteArticle, {
    onMutate: (data) => {
      const newArticle = { ...article };
      newArticle.favorited = false;
      newArticle.favoritesCount--;
      return updateFn(newArticle);
    },
    onError: (err, data, rollback: any) => {
      rollback();
    },
    onSettled: () => {
      queryCache.invalidateQueries(queryKey);
    },
  });

  async function handleFavorite() {
    if (!token) {
      enqueueSnackbar("Please Login first", {
        variant: "error",
      });
    } else {
      if (article.favorited) {
        await mutateUnFavorite({ payload: article.slug, token: token });
      } else {
        await mutateFavorite({ payload: article.slug, token: token });
      }
    }
  }

  const [mutateDeleteArticle]=useMutation(api.deleteArticle)

  async function handleClick(){
    if(!token){
      enqueueSnackbar("Please Login first", {
        variant: "error",
      });
    }
    else{
      await mutateDeleteArticle({payload:article.slug,token:token})
      navigate('/')
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
              {article.author.username === auth.username ? (
              <IconButton className={classes.delete} onClick={handleClick}>
                <DeleteIcon color="secondary"></DeleteIcon>
              </IconButton>
            ) : null}
            </>
          }
          title={article.title}
          subheader={format(new Date(article.createdAt), "LLL d,  yyyy")}
        ></CardHeader>
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
        width="100%"
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
