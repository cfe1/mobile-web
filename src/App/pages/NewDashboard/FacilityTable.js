import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { TableSort } from "App/components";
import FacilityRow from "./FacilityRow";
import ManagerInformationDialog from "./components/ManagerInformationDialog";

const FacilityTable = ({
  data,
  onFacilityClick,
  handleSortClick,
  sort,
  handleAlertOpen,
}) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [tableData, setTableData] = useState(data?.results || []);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
              Facility
            </TableCell>
            <TableCell className={`${classes.headerCell}`}>
              Posted Hours
            </TableCell>
            <TableCell
              className={`${classes.headerCell}`}
              onClick={() => {
                handleSortClick("scheduled_hours");
              }}
            >
              Scheduled Hours{" "}
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
              Overtime{" "}
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
            <TableCell className={`${classes.headerCell} `}>
              Set Limits
            </TableCell>
          </TableRow>
        </TableHead>
        {tableData.map((row, index) => (
          <FacilityRow
            key={index}
            row={row}
            onFacilityClick={onFacilityClick}
            handleAlertOpen={handleAlertOpen}
          />
        ))}
      </Table>
      {data?.results && !tableData.length && (
        <h3 style={{ textAlign: "center" }}>No records found</h3>
      )}
    </TableContainer>
  );
};

export default FacilityTable;

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
