import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import TagList from "./TagList";
import ArticlePreviewList from "./ArticlePreviewList";

interface HomePropsType {
  path: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: "96px",
    maxWidth: "1200px",
    width: "100%",
    margin: "auto",
    padding: `${theme.spacing(3)}px`,
  },
}));

const Home: React.FC<HomePropsType> = () => {
  const classes = useStyles();
  const [currentTag, setCurrentTag] = useState("GLOBAL");

  return (
    <div className={classes.root}>
      <Grid container justify="space-between" alignItems="flex-start">
        <Grid item xs={12} md={4}>
          <TagList setCurrentTag={setCurrentTag} tag={currentTag}></TagList>
        </Grid>
        <Grid item xs={12} md={8}>
          <ArticlePreviewList tag={currentTag}></ArticlePreviewList>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
