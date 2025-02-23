import { Typography, makeStyles } from "@material-ui/core";
import React from "react";

const NewFacilityCard = (props) => {
  const { title, current, required, subTitle, handleOpenStatsDetails } = props;
  const getPercentValue = (current, required) => {
    return (current / required) * 100;
  };
  const kFormatter = (num) => {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(2) +
          `${title === "TOTAL SPENT" ? "K" : ""}`
      : `${title === "TOTAL SPENT" ? "$" : ""} ${
          Math.sign(num) * Math.abs(num)
        }`;
  };

  const classes = useStyles();
  return (
    <div
      className={`${classes.cardFlex} ${
        title === "TOTAL SPENT" ? classes.noMarginRight : ""
      } cursor-pointer`}
      onClick={() => handleOpenStatsDetails(title)}
    >
      {title !== "OPEN POSITIONS" ? (
        <>
          <Typography className={`${classes.title}`}>{title}</Typography>
          <Typography className={classes.current}>
            {current
              ? title === "TOTAL SPENT"
                ? `$ ${parseFloat(current).toFixed(2).toLocaleString()}`
                : parseFloat(current).toFixed(2).toLocaleString()
              : "-"}
          </Typography>
          {
            <Typography className={`${classes.subTitle}`}>{`${
              required ? kFormatter(required).toLocaleString() : 0
            }${title === "HPPD" ? " BUDGETED" : ""} ${
              title === "EXTERNAL HOURS" ||
              title === "AGENCY HOURS" ||
              title === "INTERNAL HOURS"
                ? "SCHEDULED"
                : title === "TOTAL SPENT"
                ? "SCHEDULED"
                : title === "OVERTIME"
                ? "HRS"
                : ""
            }`}</Typography>
          }
        </>
      ) : (
        <>
          <Typography className={`${classes.title}`}>{title}</Typography>
          {required ? (
            <div className={classes.openPos}>
              <Typography className={classes.currentPos}>{current}/</Typography>
              <Typography className={classes.current}>{required}</Typography>
            </div>
          ) : (
            <span className={classes.current}>-</span>
          )}
          <Typography className={`${classes.subTitle}`}>
            {`${
              current && required
                ? getPercentValue(current, required).toFixed(2)
                : 0
            }% ${subTitle}`}
          </Typography>
        </>
      )}
    </div>
  );
};

export default NewFacilityCard;
const useStyles = makeStyles({
  cardFlex: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 4,
    width: "13.4%",
    height: 90,
    background: "#FFFFFF",
    marginRight: "1%",
    "@media (min-width:1900px)": {
      // width: 230,
    },
    "@media (min-width:800px)": {
      //   width: 166,
    },

    borderRadius: 8,
    "@media (max-width:1350px)": {
      justifyContent: "unset",
      flexWrap: "wrap",
      marginTop: 10,
      fontSize: 25,
      height: 80,
    },
    "@media (max-width:765px)": {
      fontSize: 18,
      width: 128,
    },
  },
  noMarginRight: {
    marginRight: 0,
  },
  title: {
    color: "#434966",
    fontSize: "0.9rem",
    fontWeight: "800",
    fontFamily: "Manrope",
    "@media (max-width:1075px)": {
      fontSize: "0.65rem",
    },
  },
  current: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ff0084",
    "@media (max-width:1400px)": {
      fontSize: 19,
    },
  },
  currentPos: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ff0084",
    "@media (max-width:1400px)": {
      fontSize: 20,
    },
  },
  openPos: {
    display: "flex",
  },
  subTitle: {
    color: "#82889C",
    fontWeight: "700",
    fontSize: "0.8rem",
    "@media (max-width:1130px)": {
      fontSize: "0.6rem",
    },
    "@media (max-width:785px)": {
      fontSize: "0.59rem",
    },
  },
});
