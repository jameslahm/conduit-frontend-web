import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { makeStyles } from "@material-ui/core/styles";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import { rootStateType } from "../store";
import { useSnackbar } from "notistack";
import { useQuery } from "@apollo/react-hooks";
import { GetTags } from "../utils/__generated__/GetTags";
import { GET_TAGS } from "../utils";

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
  const { data: tagsData, loading } = useQuery<GetTags>(GET_TAGS);

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
      {loading || !tagsData?.getTags ? (
        <Skeleton variant="rect" height={300}></Skeleton>
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
          {(tagsData.getTags as string[]).map((tag) => (
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
