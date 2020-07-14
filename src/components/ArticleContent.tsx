import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
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
import DeleteIcon from "@material-ui/icons/Delete";
import { useNavigate } from "@reach/router";
import { GetArticle } from "../utils/__generated__/GetArticle";
import {
  FavoriteArticle,
  FavoriteArticleVariables,
} from "../utils/__generated__/FavoriteArticle";
import { FAVORITE_ARTICLE, UNFAVORITE_ARTICLE, DELETE_ARTICLE } from "../utils";
import { useMutation } from "@apollo/react-hooks";
import {
  UnFavoriteArticle,
  UnFavoriteArticleVariables,
} from "../utils/__generated__/UnFavoriteArticle";
import {
  DeleteArticle,
  DeleteArticleVariables,
} from "../utils/__generated__/DeleteArticle";
import ReactMarkdown from "react-markdown";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  favoritesCount: {
    marginRight: `${theme.spacing(1)}px`,
  },
  delete: {},
}));

interface ArticleContentPropsType {
  article: Exclude<GetArticle["getArticle"], null>;
}

const ArticleContent: React.FC<ArticleContentPropsType> = ({ article }) => {
  const classes = useStyles();

  const token = useSelector((state: rootStateType) => state.auth.token);
  const auth = useSelector((state: rootStateType) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [favorite] = useMutation<FavoriteArticle, FavoriteArticleVariables>(
    FAVORITE_ARTICLE,
    {
      variables: {
        slug: article.slug,
      },
      optimisticResponse: {
        favoriteArticle: {
          ...article,
          favorited: true,
          favoritesCount: article.favoritesCount + 1,
        },
      },
    }
  );

  const [unfavorite] = useMutation<
    UnFavoriteArticle,
    UnFavoriteArticleVariables
  >(UNFAVORITE_ARTICLE, {
    variables: {
      slug: article.slug,
    },
    optimisticResponse: {
      unfavoriteArticle: {
        ...article,
        favorited: false,
        favoritesCount: article.favoritesCount - 1,
      },
    },
  });

  async function handleFavorite() {
    if (!token) {
      enqueueSnackbar("Please Login first", {
        variant: "error",
      });
    } else {
      if (article.favorited) {
        await unfavorite();
      } else {
        await favorite();
      }
    }
  }

  const [deleteArticle] = useMutation<DeleteArticle, DeleteArticleVariables>(
    DELETE_ARTICLE,
    {
      variables: {
        slug: article.slug,
      },
    }
  );
  const navigate = useNavigate();

  async function handleClick() {
    if (!token) {
      enqueueSnackbar("Please Login first", {
        variant: "error",
      });
    } else {
      await deleteArticle();
      navigate("/");
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
