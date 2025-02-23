import React from "react";
import { makeStyles } from "@material-ui/core";
const ProgressBar = (props) => {
  const { value, showOnlyProgress, textBeforPercent, textBeforPercentTxt } =
    props;
  let spanStyle;

  if (value > 70) {
    spanStyle = { marginLeft: `${63}%` };
  } else {
    spanStyle = { marginLeft: `${value}%` };
  }

  const progressStyle = {
    width: `${value}%`,
  };
  const classes = useStyles();
  return (
    <>
      <div className={`${classes.mainContainer}`}>
        {showOnlyProgress && (
          <div  className={classes.textContainer}>
            {textBeforPercent && (
              <span className={classes.beforeTxt}> {textBeforPercentTxt}</span>
            )}{" "}
            <span
              style={spanStyle}
              className={`${textBeforPercent ? classes.marginleft : ""} ${
                classes.fontweight
              }`}
            >
              {value.toFixed(2)}%
            </span>
          </div>
        )}
        <div className={classes.barStyle}>
          <div
            style={progressStyle}
            className={`${classes.progressStyle} ${
              value > 100 ? classes.progressStyleExcess : ""
            }`}
          ></div>
        </div>
        {!showOnlyProgress && (
          <>
            {" "}
            <div className={classes.hundred}>100%</div>
            <div className={classes.max}>
              {" "}
              {value >= 100 ? null : (
                <span style={spanStyle}>{value.toFixed(2)}%</span>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProgressBar;
const useStyles = makeStyles({
  mainContainer: {
    width: "100%",
    overflow: "hidden",
    color: "#82889C",
    fontSize: 15,
    fontWeight: 600,
    marginTop: -15,
  },
  progressStyle: {
    backgroundColor: "#FF0083",
    borderRadius: 8,
    height: 8,
    maxWidth: "100%",
    color: "#ff0083",
  },
  progressStyleExcess: {
    backgroundColor: "#FF0040",
  },
  barStyle: {
    maxWidth: "100%",
    width: "100% !important",
    backgroundColor: "#EDECF5",
    textAlign: "right",
    borderRadius: 8,
  },
  max: {
    maxWidth: "100%",
  },
  hundred: {
    width: "100%",
    textAlign: "right",
  },
  marginleft: {
    marginLeft: "8px !important",
  },
  fontweight: {
    fontWeight: 700,
    fontSize:12
  },
  beforeTxt: {
    fontSize: "10px !important",
    fontWeight: "600 !important",
  },
  textContainer:{
    display:'flex',
    justifyContent:'space-between',
    width:'100%'
  }
});
