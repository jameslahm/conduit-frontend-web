import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useParams } from "@reach/router";
import { useQuery } from "react-query";
import {
  api,
  QueryKeyType,
  ArticleResponseType,
  md,
  CommentResponseType,
} from "../utils";
import { UserAvatar, UserAvatarSkeleton } from "./UserAvatar";
import { ArticleContent, ArticleContentSkeleton } from "./ArticleContent";
import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import { queryCache } from "react-query";
import CommentList from "./CommentList";
import { Divider } from "@material-ui/core";
import TabPanel from "./TabPanel";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { useSnackbar } from "notistack";
import { useMutation } from "react-query";

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
  tabPanel: {
    width: "100%",
  },
  paper: {
    // marginTop: `${theme.spacing(2)}px`,
    width: "100%",
  },
  mdText: {
    width: "100%",
  },
  renderedHtml: {
    padding: `${theme.spacing(2)}px`,
  },
  save: {
    marginTop: `${theme.spacing(2)}px`,
  },
  comment: {
    padding: `${theme.spacing(2)}px`,
  },
}));

const Article: React.FC<ArticlePropsType> = () => {
  const classes = useStyles();
  const [mdText, setMdText] = useState("## Hello");
  const [status, setStatus] = useState<0 | 1>(0);
  const { enqueueSnackbar } = useSnackbar();
  const { slug }: { slug: string } = useParams();
  const auth = useSelector((state: rootStateType) => state.auth);
  const queryKey: QueryKeyType = [
    "getArticle",
    {
      payload: slug,
      token: auth.token,
    },
  ];
  const { data, isLoading } = useQuery(queryKey, (key, options) => {
    return api.getArticle(options);
  });

  const updateArticleContentFn = (data: ArticleResponseType) => {
    queryCache.cancelQueries(queryKey);

    const previousData = queryCache.getQueryData(queryKey);

    queryCache.setQueryData(
      queryKey,
      (old: { article: ArticleResponseType } | undefined) => {
        return { article: { ...data } };
      }
    );

    return () => queryCache.setQueryData(queryKey, previousData);
  };

  const updateArticleAuthorFn = (data: ArticleResponseType["author"]) => {
    queryCache.cancelQueries(queryKey);

    const previousData = queryCache.getQueryData(queryKey);

    queryCache.setQueryData(
      queryKey,
      (old: { article: ArticleResponseType } | undefined) => {
        if (!old) {
          return old;
        } else {
          const newArticle = { article: { ...old.article } };
          newArticle.article.author = data;
          return newArticle;
        }
      }
    );

    return () => queryCache.setQueryData(queryKey, previousData);
  };

  const { data: commentsData } = useQuery(
    ["getComments", { payload: slug, token: auth.token }],
    (key, options) => {
      const controller = new AbortController();
      // Get the abortController's signal
      const signal = controller.signal;
      const promise=api.getComments(options,{signal})
      // @ts-ignore
      promise.cancel=() => controller.abort()
      return promise;
    }
  );
  const commentsQueryKey: QueryKeyType = [
    "getComments",
    { payload: slug, token: auth.token },
  ];
  const [mutate] = useMutation(api.addComment, {
    onMutate: function (data) {
      queryCache.cancelQueries(commentsQueryKey);

      const previousData = queryCache.getQueryData(commentsQueryKey);

      queryCache.setQueryData(
        commentsQueryKey,
        (old: { comments: CommentResponseType[] } | undefined) => {
          if (old) {
            old.comments.unshift({
              id: (Math.random()*Math.pow(36,6)).toString(36),
              body: mdText,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              author: { ...auth, following: false },
            });
            return old;
          } else {
            return old;
          }
        }
      );

      return () => queryCache.setQueryData(commentsQueryKey, previousData);
    },
    onError: function (err, data, rollback: any) {
      rollback();
    },
    onSettled: function () {
      queryCache.invalidateQueries(commentsQueryKey);
    },
  });

  async function handleClick() {
    if (!auth.token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
      return;
    }
    try {
      setMdText("");
      await mutate({
        slug: slug,
        payload: { comment: { body: mdText } },
        token: auth.token,
      });
    } catch (err) {
      console.log(err);
    }
  }

  const [mutateDeleteComment] = useMutation(api.deleteComment, {
    onMutate: (data) => {
      queryCache.cancelQueries(commentsQueryKey);

      const previousData = queryCache.getQueryData(commentsQueryKey);

      queryCache.setQueryData(
        commentsQueryKey,
        (old: { comments: CommentResponseType[] } | undefined) => {
          if (!old) return old;
          else {
            const index = old.comments.findIndex(
              (comment) => comment.id === data.id
            );
            if (index !== -1) {
              old.comments.splice(index, 1);
              return old;
            }
            return old;
          }
        }
      );

      return () => queryCache.setQueryData(commentsQueryKey, previousData);
    },
    onError: function (err, data, rollback: any) {
      rollback();
    },
    onSettled: function () {
      queryCache.invalidateQueries(commentsQueryKey);
    },
  });

  const deleteCommentMutate = (data: CommentResponseType) => {
    mutateDeleteComment({
      slug: slug,
      id: data.id,
      token: auth.token,
    });
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
          {auth.username === data.article.author.username ? (
            <UserAvatar.self user={auth}></UserAvatar.self>
          ) : (
            <UserAvatar.other
              user={data.article.author}
              queryKey={queryKey}
              updateFn={updateArticleAuthorFn}
            ></UserAvatar.other>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <ArticleContent
            article={data.article}
            queryKey={queryKey}
            updateFn={updateArticleContentFn}
          ></ArticleContent>
          <Divider variant="middle"></Divider>

          {commentsData ? (
            <CommentList
              deleteCommentMutate={deleteCommentMutate}
              comments={commentsData.comments}
            ></CommentList>
          ) : null}
          <div className={classes.comment}>
            <Paper className={classes.paper}>
              <Tabs
                value={status}
                onChange={(_, newStatus) => setStatus(newStatus)}
                indicatorColor="primary"
              >
                <Tab label="Comment"></Tab>
                <Tab label="PREVIEW"></Tab>
              </Tabs>
              <TabPanel className={classes.tabPanel} value={status} index={0}>
                <TextField
                  value={mdText}
                  onChange={(event) => setMdText(event.target.value)}
                  className={classes.mdText}
                  variant="outlined"
                  multiline
                  rows={5}
                  rowsMax={10}
                ></TextField>
              </TabPanel>
              <TabPanel className={classes.tabPanel} value={status} index={1}>
                <Paper
                  className={classes.renderedHtml}
                  elevation={0}
                  dangerouslySetInnerHTML={{ __html: md.render(mdText) }}
                ></Paper>
              </TabPanel>
            </Paper>
            <Button
              onClick={handleClick}
              fullWidth
              color="primary"
              variant="contained"
              className={classes.save}
            >
              Save
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Article;
