import React, { useState, useEffect } from "react";
import moment from "moment";
import { WeekPicker } from "App/components";
import { makeStyles } from "@material-ui/core";
import leftArrow from "App/assets/icons/left-arrow.svg";
import rightArrow from "App/assets/icons/right-caret-arrow.svg";
const useStyles = makeStyles({
  dayPicker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 215,
    height: 40,
    background: "#FFF",
    borderRadius: 8,
  },
  arrowDown: {
    cursor: "pointer",
  },
  calender: {
    marginLeft: 16,
  },
  rightArrow: {
    marginRight: 8,
  },
  arrowDown: {
    cursor: "pointer",
  },
  flex: {
    display: "flex",
  },
});

const Weekly = (props) => {
  let startDateofWeek = moment(new Date()).clone().startOf("week");
  const classes = useStyles();
  return (
    <>
      <div className={classes.dateContainer}>
        <div className={classes.weekPicker}>
          {/* <img
            className={classes.arrowDown}
            src={leftArrow}
            alt=""
            // onClick={() => setToday(moment(today).subtract(7, "d"))}
          /> */}

          <WeekPicker />
          {/* <img
            className={classes.arrowUp}
            src={rightArrow}
            alt=""
            // onClick={() => setToday(moment(today).add(7, "d"))}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Weekly;
