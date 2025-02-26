import React, { useMemo } from "react";
import PropTypes from "prop-types";
import ArrowUpward from "../../../assets/icons/arrowUpPink.svg";
import ArrowUpwardBlack from "../../../assets/icons/arrowUpBlack.svg";
import ArrowDownward from "../../../assets/icons/arrowDownGreen.svg";
import TickCircleGreen from "../../../assets/icons/tickCircleGreen.svg";
import { makeStyles, TableCell } from "@material-ui/core";

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
    color: `#08083D !important`,
    fontWeight: "600 !important",
    fontSize: "11px !important",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
  },
  cellInactive2: {
    // textAlign: "center",
    color: `#08083D !important`,
    fontWeight: "600 !important",
    fontSize: "11px !important",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    borderRight: `1px solid ${theme.palette.secondary.gray300} !important`,
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
    color: "#08083D",
    fontWeight: "700 !important",
    fontSize: "10px !important",
  },
  negative: {
    color: "#08083D",
    fontWeight: "700 !important",
    fontSize: "10px !important",
  },
  inactiveHours: {
    fontWeight: "600 !important",
    fontSize: "9px !important",
    color: "#08083D",
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
}));
const HppdRowCalculationModal = ({ firstData, secondData, type }) => {
  const classes = useStyles();

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
  }; // Scheduled HPPD and Percentage

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
  const actualPercentage = calculatePercentage(actualHPPD, actualYesterdayHPPD);

  return (
    <>
      {/* Third cell: Scheduled HPPD */}
      <TableCell className={classes.cellInactive}>
        {removeTrailingZero(scheduledHPPD)}
        {parseFloat(scheduledPercentage) != 0 && (
          <span
            className={
              parseFloat(scheduledPercentage) > 0
                ? classes.positive
                : classes.negative
            }
          >
            {parseFloat(scheduledPercentage) > 0 ? (
              <img
                className={classes.arrow}
                src={ArrowUpwardBlack}
                alt="uparrow"
              />
            ) : (
              <img
                className={classes.arrow}
                src={ArrowUpwardBlack}
                alt="downarrow"
              />
            )}
            {Math.abs(scheduledPercentage)}%
          </span>
        )}
        <div className={classes.inactiveHours}>
          {formatHours(processedFirstData.scheduled_hours)}
        </div>
      </TableCell>
      {/* Fourth cell: Actual HPPD */}
      <TableCell className={classes.cellInactive2}>
        {removeTrailingZero(actualHPPD)}
        {parseFloat(actualPercentage) != 0 && (
          <span
            className={
              parseFloat(actualPercentage) > 0
                ? classes.positive
                : classes.negative
            }
          >
            {parseFloat(actualPercentage) > 0 ? (
              <img className={classes.arrow} src={ArrowUpward} alt="uparrow" />
            ) : (
              <img
                className={classes.arrow}
                src={ArrowDownward}
                alt="downarrow"
              />
            )}
            {Math.abs(actualPercentage)}%
          </span>
        )}
        <div className={classes.inactiveHours}>
          {formatHours(processedFirstData.actual_hours)}
        </div>
      </TableCell>
    </>
  );
};

export default HppdRowCalculationModal;
