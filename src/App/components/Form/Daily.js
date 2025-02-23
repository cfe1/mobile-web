import React, { useState, useEffect } from "react";
import moment from "moment";
import { CalendarDatePicker } from "App/components";
import { makeStyles } from "@material-ui/core";
import leftArrow from "App/assets/icons/arrowPrev.svg";
import rightArrow from "App/assets/icons/arrowNext.svg";
const useStyles = makeStyles({
  dayPicker: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: 200,
    height: 44,
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
    // marginRight: 8,
  },
  arrowDown: {
    cursor: "pointer",
  },
  flex: {
    display: "flex",
    alignItems: "center",
  },
  dateTxt: {
    fontSize: 20,
    fontWeight: 700,
    color: "#17174A",
  },
});

const Daily = ({ setDate, dailyDate }) => {
  const [todayDate, setTodayDate] = useState(
    dailyDate ? dailyDate : moment(new Date())
  );
  useEffect(() => {
    setDate(moment(todayDate));
  }, [todayDate]);
  const handlePrevious = () => {
    setTodayDate(moment(todayDate).subtract(1, "d"));
  };

  const handleNext = () => {
    setTodayDate(moment(todayDate).add(1, "d"));
  };

  const handleDateChange = (todayDate) => {
    setTodayDate(moment(todayDate));
  };

  const classes = useStyles();
  return (
    <>
      <div className={classes.flex}>
        <div className={`${classes.dayPicker} `}>
          <img
            className={classes.arrowDown}
            src={leftArrow}
            alt=""
            onClick={() => handlePrevious()}
          />
          <span className={classes.dateTxt}>
            {`${moment(todayDate).format("MMM DD, YYYY")} `}
          </span>
          <img
            className={`${classes.rightArrow} ${classes.arrowDown}`}
            src={rightArrow}
            alt=""
            onClick={() => handleNext()}
          />
        </div>
        <div className={classes.calender}>
          <CalendarDatePicker
            value={todayDate}
            // value={moment(new Date())}
            onChange={(todayDate) => handleDateChange(todayDate)}
          />
        </div>
      </div>
    </>
  );
};

export default Daily;
