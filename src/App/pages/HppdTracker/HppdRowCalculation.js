import React from "react";
import PropTypes from "prop-types";
import ArrowUpward from "../../assets/icons/arrowUpPink.svg";
import ArrowUpwardWhite from "../../assets/icons/arrowUpWhite.svg";
import ArrowDownward from "../../assets/icons/arrowDownGreen.svg";
import ArrowDownwardWhite from "../../assets/icons/arrowDownWhite.svg";
import ArrowUpwardred from "../../assets/icons/arrowUpred.svg";
import ArrowDownwardgreen from "../../assets/icons/arrowDowngreentick.svg";
import TickCircleGreen from "../../assets/icons/tickCircleGreen.svg";
import blackPlace from "../../assets/icons/blackPlace.svg";
import { makeStyles, TableCell } from "@material-ui/core";
import { useColorForValue, useFontColorForValue } from "./helper";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
  },

  cell: {
    color: `${theme.palette.secondary.extradarkBlue} !important`,
    fontWeight: "600 !important",
    fontSize: "11px !important",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
  },
  cellInactive: {
    // textAlign: "center",
    color: `${theme.palette.background.grey2} !important`,
    fontWeight: "600 !important",
    fontSize: "11px !important",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
  },
  rowHeader: {
    fontWeight: "600 !important",
    fontSize: "12px !important",
    color: `${theme.palette.secondary.gray4} !important`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
  },
  arrow: {
    marginLeft: 4,
  },
  positive: {
    color: theme.palette.secondary.red,
    fontWeight: "700 !important",
    fontSize: "10px !important",
  },
  negative: {
    color: theme.palette.secondary.green,
    fontWeight: "700 !important",
    fontSize: "10px !important",
  },
  inactiveHours: {
    fontWeight: "600 !important",
    fontSize: "9px !important",
    color: theme.palette.background.grey2,
  },
  remove: {
    color: theme.palette.secondary.red,
  },

  underline: {
    textDecoration: "underline",
    cursor: "pointer",
  },
  varianceCell: {
    fontWeight: 600,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
  },
  inputField: {
    marginBottom: "5px",
  },
  popover: {
    border: `1px solid ${theme.palette.secondary.gray300}`,
  },

  input: {
    width: "auto",
    marginBottom: "7px",
    marginTop: "7px",
    "& .MuiInputBase-input": {
      fontSize: "14px !important",
      padding: "8px !important",
    },
  },

  blankSpace: {
    backgroundImage: (props) => `url(${props.blackPlace})`, // Dynamic background image
    backgroundSize: "cover", // Ensures the image fully covers the div
    backgroundPosition: "center", // Centers the image
    backgroundRepeat: "no-repeat", // Prevents image repetition
  },
}));
const HppdRowCalculation = ({
  firstData,
  secondData,
  onCensusClick,
  onTargetClick,
  type,
  HppdJobTitleData = "",
}) => {
  const classes = useStyles({ blackPlace });

  const processData = (data, type) => {
    if (!data) return null; // Handle null cases safely

    const divisor = type === "week" ? 15 : type === "month" ? 30 : 1;

    return {
      scheduled_hours:
        data.scheduled_hours !== null ? data.scheduled_hours / divisor : null,
      actual_hours:
        data.actual_hours !== null ? data.actual_hours / divisor : null,
      census: data.census !== null ? data.census / divisor : null,
      target: data.target !== null ? data.target / divisor : null,
    };
  }; // Process firstData and secondData

  const processedFirstData = processData(firstData, type);
  const processedSecondData = processData(secondData, type);

  function removeTrailingZero(num) {
    // Convert the number to a string
    let numStr = num.toString(); // Check if the number contains a decimal point

    if (numStr.includes(".")) {
      // Remove trailing zeros and the decimal point if necessary
      numStr = numStr.replace(/(\.\d*?[1-9])0+|(\.0+)$/, "$1");
      numStr = parseFloat(numStr).toFixed(2);
    }

    return parseFloat(numStr);
  }

  const calculateHPPD = (hours, census) =>
    census != 0 ? (hours / census).toFixed(2) : 0;

  const calculatePercentage = (current, previous) =>
    previous != 0 ? (((current - previous) / previous) * 100).toFixed(2) : 0;

  const formatHours = (hours) => {
    return hours ? `${removeTrailingZero(hours)} Hrs` : "0 Hrs";
  }; // Census Percentage

  const censusPercentage = calculatePercentage(
    processedFirstData.census,
    processedSecondData.census
  ); // Scheduled HPPD and Percentage

  const scheduledHPPD = calculateHPPD(
    processedFirstData.scheduled_hours,
    processedFirstData.census
  );
  const scheduledYesterdayHPPD = calculateHPPD(
    processedSecondData.scheduled_hours,
    processedSecondData.census
  );
  const scheduledPercentage = calculatePercentage(
    scheduledHPPD,
    scheduledYesterdayHPPD
  ); // Actual HPPD and Percentage

  const actualHPPD = calculateHPPD(
    processedFirstData.actual_hours,
    processedFirstData.census
  );
  const actualYesterdayHPPD = calculateHPPD(
    processedSecondData.actual_hours,
    processedSecondData.census
  );
  const actualPercentage = calculatePercentage(actualHPPD, actualYesterdayHPPD); // Target HPPD, Target Hours, and Target Percentage

  const targetHPPD = processedFirstData.target || 0;
  const targetHours = targetHPPD * processedFirstData.census;
  const targetYesterdayHPPD = processedSecondData.target || 0;
  const targetPercentage = calculatePercentage(targetHPPD, targetYesterdayHPPD); // Variance HPPD and Hours

  const varianceHPPD = scheduledHPPD - targetHPPD;
  const varianceHours = processedFirstData.scheduled_hours - targetHours;
  const varianceWithinThreshold =
    Math.abs(varianceHours / targetHours) * 100 < 5;

  const colorValue =
    useFontColorForValue(
      Number(removeTrailingZero(Math.abs(varianceHPPD))) || 0
    ) || "inherit";
  const scheduledHPPDColor =
    useFontColorForValue(Number(removeTrailingZero(scheduledHPPD)) || 0) ||
    "inherit";
  const actualHPPDColor =
    useFontColorForValue(Number(removeTrailingZero(actualHPPD)) || 0) ||
    "inherit";

  return (
    <>
      {/* Second cell: census */}
      <TableCell
        className={`${classes.cell} ${classes.censusCell} ${
          HppdJobTitleData !== "" && classes.blankSpace
        }`}
      >
        {HppdJobTitleData === "" && (
          <div onClick={onCensusClick} className={`${classes.underline}`}>
            {processedFirstData.census.toFixed(1)}
          </div>
        )}
        {HppdJobTitleData === "" &&
          type !== "day" &&
          parseFloat(censusPercentage) != 0 && (
            <div
              className={
                parseFloat(censusPercentage) > 0
                  ? classes.negative
                  : classes.positive
              }
            >
              {/* ArrowUpwardred */} {/* ArrowDownwardgreen */}
              {parseFloat(censusPercentage) > 0 ? (
                <img src={ArrowUpwardred} alt="uparrow" />
              ) : (
                <img src={ArrowDownwardgreen} alt="downarrow" />
              )}
              {Math.abs(censusPercentage)}%
            </div>
          )}
      </TableCell>
      {/* Third cell: Scheduled HPPD */}
      <TableCell
        className={classes.cellInactive}
        style={{
          background: useColorForValue(removeTrailingZero(scheduledHPPD) ?? 0),
          color: scheduledHPPDColor,
        }}
      >
        <span style={{ color: scheduledHPPDColor }}>
          {removeTrailingZero(scheduledHPPD)}
        </span>
        {parseFloat(scheduledPercentage) != 0 && (
          <span
            className={
              parseFloat(scheduledPercentage) > 0
                ? classes.positive
                : classes.negative
            }
            style={{ color: scheduledHPPDColor }}
          >
            {parseFloat(scheduledPercentage) > 0 ? (
              <img
                className={classes.arrow}
                src={ArrowUpwardWhite}
                alt="uparrow"
              />
            ) : (
              <img
                className={classes.arrow}
                src={ArrowDownwardWhite}
                alt="downarrow"
              />
            )}
            {Math.abs(scheduledPercentage)}%
          </span>
        )}
        <div
          className={classes.inactiveHours}
          style={{ color: scheduledHPPDColor }}
        >
          {formatHours(processedFirstData.scheduled_hours)}
        </div>
      </TableCell>
      {/* Fourth cell: Actual HPPD */}
      <TableCell
        className={classes.cellInactive}
        style={{
          background: useColorForValue(removeTrailingZero(actualHPPD) ?? 0),
          color: actualHPPDColor,
        }}
      >
        <span style={{ color: actualHPPDColor }}>
          {removeTrailingZero(actualHPPD)}
        </span>
        {parseFloat(actualPercentage) != 0 && (
          <span
            className={
              parseFloat(actualPercentage) > 0
                ? classes.positive
                : classes.negative
            }
            style={{ color: actualHPPDColor }}
          >
            {parseFloat(actualPercentage) > 0 ? (
              <img
                className={classes.arrow}
                src={ArrowUpwardWhite}
                alt="uparrow"
              />
            ) : (
              <img
                className={classes.arrow}
                src={ArrowDownwardWhite}
                alt="downarrow"
              />
            )}
            {Math.abs(actualPercentage)}%
          </span>
        )}
        <div
          style={{ color: actualHPPDColor }}
          className={classes.inactiveHours}
        >
          {formatHours(processedFirstData.actual_hours)}
        </div>
      </TableCell>
      {/* Fifth cell: Target HPPD */}
      <TableCell className={`${classes.cell} ${classes.targetCell} `}>
        <span onClick={onTargetClick} className={classes.underline}>
          {/* {removeTrailingZero(targetHPPD)} */}
          {HppdJobTitleData
            ? parseFloat(firstData.target.toFixed(2))
            : // : firstData.target || targetHPPD}
              targetHPPD.toFixed(2)}
          {/* {targetHPPD} */}
        </span>
        {parseFloat(targetPercentage) != 0 && (
          <span
            className={
              parseFloat(targetPercentage) > 0
                ? classes.positive
                : classes.negative
            }
          >
            {parseFloat(targetPercentage) > 0 ? (
              <img className={classes.arrow} src={ArrowUpward} alt="uparrow" />
            ) : (
              <img
                className={classes.arrow}
                src={ArrowDownward}
                alt="downarrow"
              />
            )}
            {Math.abs(targetPercentage)}%{/* {targetHPPD} */}
          </span>
        )}
        {!HppdJobTitleData && (
          <div className={classes.inactiveHours}>
            {formatHours(targetHours)}
          </div>
        )}
      </TableCell>
      <TableCell
        className={`${classes.cell} ${classes.varianceCell}`}
        style={{
          background: useColorForValue(
            removeTrailingZero(Math.abs(varianceHPPD)) ?? 0
          ),
        }}
      >
        <span // className={` ${varianceHPPD > 0 ? classes.positive : classes.negative //  }`}
          style={{ color: colorValue }}
        >
          {removeTrailingZero(varianceHPPD)}
        </span>
        <div className={classes.inactiveHours} style={{ color: colorValue }}>
          {formatHours(Math.abs(varianceHours))}
        </div>
      </TableCell>
    </>
  );
};

export default HppdRowCalculation;
