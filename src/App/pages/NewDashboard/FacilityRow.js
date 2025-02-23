import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { decimalToHoursMinutes, formatAsDollar } from "./utills/common";
import BellIcon from "../../assets/icons/bell.svg";
import PlusIcon from "../../assets/icons/plus.svg";

const FacilityRow = ({ row, onFacilityClick, handleAlertOpen }) => {
  const classes = useStyles();

  return (
    <TableRow className={classes.tableRow}>
      <TableCell
        className={`${classes.headerCell} ${classes.minWidth}`}
        onClick={() => {
          onFacilityClick(row.id, row.name);
        }}
      >
        {row.name}
      </TableCell>
      <TableCell className={`${classes.headerCell}`}>
        {decimalToHoursMinutes(row.posted_hours)}
      </TableCell>
      <TableCell className={`${classes.headerCell}`}>
        {decimalToHoursMinutes(row.scheduled_hours)}
      </TableCell>
      <TableCell className={`${classes.headerCell} `}>
        {decimalToHoursMinutes(row.actual_hours)}
      </TableCell>
      <TableCell className={`${classes.headerCell} `}>
        {decimalToHoursMinutes(row.overtime_hours)}
      </TableCell>
      <TableCell className={`${classes.headerCell} `}>
        {formatAsDollar(row.confirmed_spend)}
      </TableCell>
      <TableCell className={`${classes.headerCell} `}>
        {formatAsDollar(row.actual_spend)}
      </TableCell>
      <TableCell
        className={`${classes.headerCell} `}
        onClick={() => handleAlertOpen(row)}
      >
        <img
          src={row.has_threshold_limit ? BellIcon : PlusIcon}
          style={{ margin: "0 7px" }}
          alt="back"
        />
      </TableCell>
    </TableRow>
  );
};

export default FacilityRow;

const useStyles = makeStyles(() => ({
  table: {
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#FAFBFC",
    zIndex: 600,
  },

  headerCell: {
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  container: {
    marginTop: 16,
  },
  minWidth: {
    minWidth: 270,
  },
  tableRow: {
    height: 50,
  },
}));
