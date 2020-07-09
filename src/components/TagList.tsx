import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import { useQuery } from "react-query";
import { api } from "../utils";
import { useSelector } from "react-redux";
import { rootStateType } from "../store";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: `${theme.spacing(2)}px`,
  },
  content: {
    padding: `${theme.spacing(2)}px`,
  },
  tag: {
    margin: `${theme.spacing(0.5)}px`,
  },
}));

interface TagListPropsType {
  setCurrentTag: React.Dispatch<React.SetStateAction<string>>;
  tag: string;
}

const TagList: React.FC<TagListPropsType> = ({
  setCurrentTag,
  tag: currentTag,
}) => {
  const classes = useStyles();
  const token = useSelector((state: rootStateType) => state.auth.token);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading } = useQuery(["getTags"], (key) => {
    return api.getTags();
  });

  function handleClick(tag: string) {
    if (tag === "FEED") {
      if (!token) {
        return enqueueSnackbar("Please Login first", { variant: "error" });
      }
    }
    setCurrentTag(tag);
  }

  return (
    <div className={classes.root}>
      {isLoading || !data ? (
        <Skeleton variant="rect" height={200}></Skeleton>
      ) : (
        <Paper className={classes.content}>
          {["GLOBAL", "FEED"].map((tag) => (
            <Chip
              label={tag}
              key={tag}
              className={classes.tag}
              color="secondary"
              variant={tag === currentTag ? "default" : "outlined"}
              onClick={() => handleClick(tag)}
            ></Chip>
          ))}
          {data.tags.map((tag) => (
            <Chip
              label={tag}
              key={tag}
              className={classes.tag}
              color="primary"
              variant={tag === currentTag ? "default" : "outlined"}
              onClick={() => setCurrentTag(tag)}
            ></Chip>
          ))}
        </Paper>
      )}
    </div>
  );
};

export default TagList;
