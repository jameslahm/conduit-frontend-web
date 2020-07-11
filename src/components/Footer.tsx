import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    color: `${theme.palette.primary.main}`,
    textAlign: "center",
    marginBottom: `${theme.spacing(2)}px`,
    marginTop: `${theme.spacing(2)}px`,
  },
}));

const Footer = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="caption">
        copyright &copy; 2020 jameslahm v0.2.4
      </Typography>
    </div>
  );
};

export default Footer;
