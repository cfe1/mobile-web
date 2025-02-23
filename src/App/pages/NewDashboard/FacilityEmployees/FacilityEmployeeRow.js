import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import {
  decimalToHoursMinutes,
  getNurseTypeText,
  formatAsDollar,
} from "../utills/common";
const FacilityEmployeeRow = ({ row }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ key: "", dir: "asc" });

  const classes = useStyles();
  return (
    <TableRow className={classes.tableRow}>
      <TableCell className={`${classes.headerCell} ${classes.minWidth}`}>
        {row?.employee_first_name} {row?.employee_last_name}
      </TableCell>
      <TableCell className={`${classes.headerCell}`}>
        {row?.employee_job_title || ""}
      </TableCell>
      <TableCell className={`${classes.headerCell}`}>
        {getNurseTypeText(row?.employee_type)}
      </TableCell>
      <TableCell className={`${classes.headerCell} `}>
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
    </TableRow>
  );
};

export default FacilityEmployeeRow;

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
