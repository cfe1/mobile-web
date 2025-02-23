import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { LinearProgress } from "@material-ui/core";

const LinearProgressBar = ({ belowHeader = false }) => {
  const classes = useStyles();

  return (
    <LinearProgress
      className={belowHeader ? classes.sticky : ""}
      classes={{
        root: classes.root,
      }}
    />
  );
};

export default LinearProgressBar;
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    borderRadius: "8px 8px 0px 0px",
    width: "100%",
    "& .MuiLinearProgress-bar": {
      backgroundColor: `${theme.palette.secondary.grey3} !important`,
    },
  },
  sticky: {
    position: "fixed !important",
    top: 71,
    left: 0,
    width: "100%",
    zIndex: "5 !important",
  },
}));
