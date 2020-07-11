import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { ProfileResponseType } from "../utils";
import ArticlePreviewList from "./ArticlePreviewList";
import TabPanel from "./TabPanel";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  tabPanel: {
    maxWidth: "800px",
    width: "100%",
  },
  paper: {
    marginTop: `${theme.spacing(2)}px`,
    maxWidth: "800px",
    width: "100%",
    margin:'auto'
  },
}));

interface ProfileTab {
  user: ProfileResponseType["profile"];
}

const ProfileTab: React.FC<ProfileTab> = ({ user }) => {
  const classes = useStyles();
  const [status, setStatus] = useState<0 | 1>(0);

  return (
    <Paper className={classes.paper}>
      <Tabs
        value={status}
        onChange={(_, newStatus) => setStatus(newStatus)}
        indicatorColor="primary"
      >
        <Tab label="ARTICLES"></Tab>
        <Tab label="FAVORITES"></Tab>
      </Tabs>
      <TabPanel className={classes.tabPanel} value={status} index={0}>
        <ArticlePreviewList author={user.username}></ArticlePreviewList>
      </TabPanel>
      <TabPanel className={classes.tabPanel} value={status} index={1}>
        <ArticlePreviewList favorited={user.username}></ArticlePreviewList>
      </TabPanel>
    </Paper>
  );
};

export default ProfileTab;
