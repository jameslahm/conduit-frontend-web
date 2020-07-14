import Card from "@material-ui/core/Card";
import React from "react";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Skeleton from "@material-ui/lab/Skeleton";
import { useSnackbar } from "notistack";
import Chip from "@material-ui/core/Chip";
import { useNavigate } from "@reach/router";
import { GetArticle } from "../utils/__generated__/GetArticle";
import { FAVORITE_ARTICLE, UNFAVORITE_ARTICLE } from "../utils";
import {
  UnFavoriteArticle,
  UnFavoriteArticleVariables,
} from "../utils/__generated__/UnFavoriteArticle";
import { useMutation } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import { rootStateType } from "../store";
import {
  FavoriteArticle,
  FavoriteArticleVariables,
} from "../utils/__generated__/FavoriteArticle";

interface ArticlePreviewPropsType {
  article: Exclude<GetArticle["getArticle"], null>;
}

const useStyles = makeStyles((theme) => ({
  content: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  favoritesCount: {
    marginRight: `${theme.spacing(1)}px`,
  },
  tag: {
    marginRight: `${theme.spacing(0.5)}px`,
    marginTop: `${theme.spacing(1)}px`,
  },
}));

const ArticlePreview: React.FC<ArticlePreviewPropsType> = ({ article }) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const token = useSelector((state: rootStateType) => state.auth.token);
  const navigate = useNavigate();
  const [favorite] = useMutation<FavoriteArticle, FavoriteArticleVariables>(
    FAVORITE_ARTICLE,
    {
      variables: {
        slug: article.slug,
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
  });

  async function handleFavorite() {
    if (!token) {
      enqueueSnackbar("Please Login first", {
        variant: "error",
      });
    } else {
      if (article.favorited) {
        await favorite();
      } else {
        await unfavorite();
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <IconButton
              onClick={() => navigate(`/profiles/${article.author.username}`)}
            >
              <Avatar
                src={
                  article.author.image
                    ? article.author.image
                    : "https://i.pravatar.cc/40"
                }
              ></Avatar>
            </IconButton>
          }
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
          title={article.author.username}
          subheader={format(new Date(article.createdAt), "LLL d,  yyyy")}
        ></CardHeader>
        <CardContent>
          <Typography variant="subtitle1" className={classes.content}>
            {article.title}
          </Typography>
          <Typography variant="subtitle2" className={classes.content}>
            {article.description}
          </Typography>
          <Typography variant="caption" className={classes.content}>
            {article.tagList.map((tag) => {
              if (tag) {
                return (
                  <Chip
                    label={tag}
                    key={tag}
                    variant="default"
                    className={classes.tag}
                    size="small"
                    onClick={() => {}}
                  ></Chip>
                );
              } else {
                return null;
              }
            })}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              navigate(`/articles/${article.slug}`);
            }}
          >
            Read More
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

const ArticlePreviewSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Skeleton variant="circle" width={40} height={40}></Skeleton>}
        action={null}
        title={<Skeleton height={15} width="80%"></Skeleton>}
        subheader={<Skeleton height={10} width="40%"></Skeleton>}
      ></CardHeader>
      <CardContent>
        <Typography variant="h5">
          <Skeleton></Skeleton>
        </Typography>
        <Typography variant="h6">
          <Skeleton></Skeleton>
        </Typography>
      </CardContent>
      <CardActions>
        <Skeleton style={{ marginLeft: "10px" }}>
          <Button>Read More</Button>
        </Skeleton>
      </CardActions>
    </Card>
  );
};

export { ArticlePreview, ArticlePreviewSkeleton };
