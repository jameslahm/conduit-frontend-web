import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Autocomplele from "@material-ui/lab/Autocomplete";
import TabPanel from "./TabPanel";
import { md, CREATE_ARTICLE, GET_TAGS } from "../utils";

import { rootStateType } from "../store";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "@reach/router";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  CreateArticle,
  CreateArticleVariables,
} from "../utils/__generated__/CreateArticle";
import { GetTags } from "../utils/__generated__/GetTags";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "96px",
    maxWidth: "800px",
    width: "100%",
    margin: "auto",
    padding: `${theme.spacing(3)}px`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  input: {
    maxWidth: "500px",
    width: "100%",
    marginTop: `${theme.spacing(2)}px`,
  },
  tabPanel: {
    maxWidth: "800px",
    width: "100%",
  },
  paper: {
    marginTop: `${theme.spacing(2)}px`,
    maxWidth: "800px",
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
}));

const EditArticle: React.FC<{ path: string }> = () => {
  const classes = useStyles();

  const [mdText, setMdText] = useState("## Heading 1");
  const [status, setStatus] = useState<0 | 1>(0);
  const token = useSelector((state: rootStateType) => state.auth.token);
  const { enqueueSnackbar } = useSnackbar();
  const [title, setTitle] = useState("Hello");
  const [description, setDescription] = useState("Nice to meet You!");
  const [tagList, setTagList] = useState<string[]>([]);

  const { data: tagsData, loading } = useQuery<GetTags>(GET_TAGS);

  const [createArticle] = useMutation<CreateArticle, CreateArticleVariables>(
    CREATE_ARTICLE,
    {
      variables: {
        input: {
          body: mdText,
          title: title,
          description: description,
          tagList: tagList,
        },
      },
    }
  );

  const navigate = useNavigate();
  async function handleClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    if (!token) {
      enqueueSnackbar("Please Login first", { variant: "error" });
    } else {
      try {
        const res = await createArticle();
        if (res.data?.createArticle) {
          navigate(`/articles/${res.data.createArticle.slug}`);
        }
      } catch (err) {}
    }
  }

  return (
    <div className={classes.root}>
      <TextField
        variant="outlined"
        label="title"
        required
        className={classes.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></TextField>
      <TextField
        variant="outlined"
        label="description"
        required
        className={classes.input}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></TextField>
      <Autocomplele
        multiple
        className={classes.input}
        ChipProps={{ variant: "outlined", color: "primary" }}
        options={tagsData?.getTags ? (tagsData.getTags as string[]) : []}
        loading={loading}
        value={tagList}
        onChange={(e, v) => {
          setTagList(v);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="tags"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      ></Autocomplele>
      <Paper className={classes.paper}>
        <Tabs
          value={status}
          onChange={(_, newStatus) => setStatus(newStatus)}
          indicatorColor="primary"
        >
          <Tab label="WRITE"></Tab>
          <Tab label="PREVIEW"></Tab>
        </Tabs>
        <TabPanel className={classes.tabPanel} value={status} index={0}>
          <TextField
            value={mdText}
            onChange={(event) => setMdText(event.target.value)}
            className={classes.mdText}
            variant="outlined"
            multiline
            rows={20}
            rowsMax={40}
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
        className={classes.save}
        color="primary"
        variant="contained"
        size="large"
        onClick={handleClick}
      >
        Save
      </Button>
    </div>
  );
};

export default EditArticle;
