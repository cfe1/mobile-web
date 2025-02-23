import React from "react";
import TooltipRef from "@material-ui/core/Tooltip";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

const HoverText = ({ hovertxt, fullTxt, fulltxtClass = false }) => {
  const classes = useStyles();

  return (
    <>
      <TooltipRef title={hovertxt}>
        <Typography
          noWrap
          className={`${classes.maxWidth} ${fulltxtClass && fulltxtClass}`}
        >
          {fullTxt}
        </Typography>
      </TooltipRef>
    </>
  );
};

export default HoverText;

const useStyles = makeStyles({
  maxWidth: {
    maxWidth: "90%",
    fontSize: 20,
    fontWeight: 600,
  },
});
