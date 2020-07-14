import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { useParams } from "@reach/router";
import { md, GET_COMMENTS, ADD_COMMENT } from "../utils";
import { UserAvatar, UserAvatarSkeleton } from "./UserAvatar";
import { ArticleContent, ArticleContentSkeleton } from "./ArticleContent";
import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import CommentList from "./CommentList";
import { Divider } from "@material-ui/core";
import TabPanel from "./TabPanel";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import { useSnackbar } from "notistack";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_ARTICLE } from "../utils";
import {
  GetComments,
  GetCommentsVariables,
  GetComments_getComments_comments,
} from "../utils/__generated__/GetComments";
import {
  AddComment,
  AddCommentVariables,
} from "../utils/__generated__/AddComment";
import {
  GetArticleVariables,
  GetArticle,
} from "../utils/__generated__/GetArticle";

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

  const { data: articleData } = useQuery<GetArticle, GetArticleVariables>(
    GET_ARTICLE,
    {
      variables: {
        slug: slug,
      },
    }
  );

  const { data: commentsData } = useQuery<GetComments, GetCommentsVariables>(
    GET_COMMENTS,
    {
      variables: {
        slug: slug,
      },
    }
  );

  const [addComment] = useMutation<AddComment, AddCommentVariables>(
    ADD_COMMENT,
    {
      variables: {
        slug: slug,
        input: {
          body: mdText,
        },
      },
    }
  );

  async function handleClick() {
    if (!auth.token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
      return;
    }
    try {
      setMdText("");
      await addComment();
    } catch (err) {
      console.log(err);
    }
  }

  if (!articleData?.getArticle) {
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
          {auth.username === articleData.getArticle?.author.username ? (
            <UserAvatar.self user={auth}></UserAvatar.self>
          ) : (
            <UserAvatar.other
              user={articleData.getArticle.author}
            ></UserAvatar.other>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          <ArticleContent article={articleData.getArticle}></ArticleContent>
          <Divider variant="middle"></Divider>

          {commentsData?.getComments ? (
            <CommentList
              comments={
                commentsData.getComments
                  .comments as GetComments_getComments_comments[]
              }
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
