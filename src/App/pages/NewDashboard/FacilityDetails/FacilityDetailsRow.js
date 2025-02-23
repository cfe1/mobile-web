import React, { useState } from "react";
import { makeStyles } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { convertDate, formatAsDollar } from "../utills/common";
import { decimalToHoursMinutes } from "../utills/common";
import DobuleArrowIcon from "../../../assets/icons/double-arrow.svg";
import moment from "moment";

const FacilityDetailsRow = ({ row, onTimelineClick }) => {
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
    <TableRow
      className={classes.tableRow}
      onClick={() => {
        onTimelineClick(row);
      }}
    >
      <TableCell className={`${classes.headerCell} ${classes.minWidth}`}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {convertDate(row?.date_range?.start_date, "MMM D")}-
          {convertDate(row?.date_range?.end_date, "MMM D")}
          {moment(row?.date_range?.start_date) > moment() ? (
            <img src={DobuleArrowIcon} style={{ margin: "0 7px" }} alt="back" />
          ) : null}
        </div>
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
    </TableRow>
  );
};

export default FacilityDetailsRow;

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
