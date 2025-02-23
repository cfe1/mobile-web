import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FacilityEmployeeRow from "./FacilityEmployeeRow";
import { TableSort } from "App/components";
import { Typography } from "@material-ui/core";

const FacilityEmployeesTable = ({ data, handleSortClick, sort }) => {
  const [tableData, setTableData] = useState(data?.results || []);

  const classes = useStyles();

  useEffect(() => {
    setTableData(data?.results || []);
  }, [data?.results]);

  return (
    <TableContainer className={classes.container}>
      <Table className={classes.table}>
        <TableHead className={classes.tableHeader}>
          <TableRow className={classes.tableRow}>
            <TableCell className={`${classes.headerCell} ${classes.minWidth}`}>
              Employee
            </TableCell>
            <TableCell className={`${classes.headerCell}`}>Position</TableCell>
            <TableCell className={`${classes.headerCell}`}>Type</TableCell>
            <TableCell
              className={`${classes.headerCell} `}
              onClick={() => {
                handleSortClick("scheduled_hours");
              }}
            >
              Schedule Hours
              <TableSort
                active={sort.key === "scheduled_hours"}
                direction={"asc"}
              />
            </TableCell>
            <TableCell
              className={`${classes.headerCell} `}
              onClick={() => {
                handleSortClick("actual_hours");
              }}
            >
              Actual Hours{" "}
              <TableSort
                active={sort.key === "actual_hours"}
                direction={"asc"}
              />
            </TableCell>
            <TableCell
              className={`${classes.headerCell} `}
              onClick={() => {
                handleSortClick("overtime_hours");
              }}
            >
              Overtime
              <TableSort
                active={sort.key === "overtime_hours"}
                direction={"asc"}
              />
            </TableCell>
            <TableCell
              className={`${classes.headerCell} `}
              onClick={() => {
                handleSortClick("confirmed_spend");
              }}
            >
              Scheduled Spend
              <TableSort
                active={sort.key === "confirmed_spend"}
                direction={"asc"}
              />
            </TableCell>
            <TableCell
              className={`${classes.headerCell} `}
              onClick={() => {
                handleSortClick("actual_spend");
              }}
            >
              Actual Spend
              <TableSort
                active={sort.key === "actual_spend"}
                direction={"asc"}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        {tableData.map((row, index) => (
          <FacilityEmployeeRow key={index} row={row} />
        ))}
      </Table>
      {data?.results && !tableData.length && (
        <h3 style={{ textAlign: "center" }}>No records found</h3>
      )}
    </TableContainer>
  );
};

export default FacilityEmployeesTable;

const useStyles = makeStyles(() => ({
  table: {
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#FAFBFC",
    zIndex: 600,
  },
  headerCell: {
    color: "#888FA0",
    fontSize: 11,
    fontWeight: 600,
  },
  headerCell: {
    color: "#888FA0",
    fontSize: 11,
    fontWeight: 600,
  },
  container: {
    marginTop: 16,
  },
  minWidth: {
    minWidth: 270,
  },
}));
