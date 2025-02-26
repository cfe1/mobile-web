import React, { useState, useRef, useEffect } from "react";
import { TableCell, TableRow, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import rightTick from "../../../assets/icons/rightTick.svg";
import HppdRowCalculationModal from "./HppdRowCalculationModal";
import { API, ENDPOINTS } from "api/apiService";
import { Toast } from "App/components";
import queryString from "query-string";
import Checkbox from "@material-ui/core/Checkbox";
import CheckIcon from "@material-ui/icons/CheckCircleOutline"; // Outline version
import CheckCircleIcon from "@material-ui/icons/CheckCircle"; // Filled version

const HppdTableRow = ({
  JobTitleArrayMapped,
  row,
  setjobTitleSelectedValues,
  jobTitleSelectedValues,
  JobTitleArray,
  methodUpdate,
}) => {
  const classes = useStyles();
  const cellRef = useRef(null);
  const [checked, setChecked] = React.useState(false);
  const [isOverflow, setIsOverflow] = useState(false);

  const fetchCensusData = async (facilityId) => {
    try {
      // Calculate yesterday's and today's dates
      const end_date = new Date().toISOString().split("T")[0];
      const start_date = new Date(new Date().setDate(new Date().getDate() - 1))
        .toISOString()
        .split("T")[0];

      const params = {
        start_date,
        end_date,
        facility_id: facilityId, // Replace with actual facility_id
      };

      const urlParams = queryString.stringify(params);

      const resp = await API.get(ENDPOINTS.HPPD_CENSUS_LISTING(urlParams));
      if (resp.success) {
        const censusData = resp.data;

        const censusLookup = censusData.reduce((acc, item) => {
          acc[item.date] = item.patient_count;
          return acc;
        }, {});
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0] || "An error occurred");
    }
  }; // census open popover

  const handleTodaysCensusClick = (event, facilityId) => {
    fetchCensusData(facilityId);
  };

  useEffect(() => {
    if (cellRef.current) {
      setIsOverflow(cellRef.current.scrollWidth > cellRef.current.clientWidth);
    }
  }, [row.name]);

  const handleCheckboxChange = (e, job_title, job_title_id) => {
    setjobTitleSelectedValues((prevState) => {
      if (e.target.checked) {
        setChecked(e.target.checked); // Check for duplicate before adding
        if (!prevState.some((item) => item.job_title_id === job_title_id)) {
          return [...prevState, { job_title, job_title_id, isdisabled: false }];
        }
        return prevState;
      } else {
        // Remove item if unchecked
        setChecked(e.target.checked);
        return prevState.filter((item) => item.job_title_id !== job_title_id);
      }
    });
  };

  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (methodUpdate === "patch") {
      if (JobTitleArrayMapped.includes(row?.job_title_id ?? "")) {
        setChecked(true);
        setIsDisabled(false);
      }
    } else {
      if (JobTitleArray.includes(row?.job_title_id ?? "")) {
        setChecked(false);
        setIsDisabled(true);
      }
    }
  }, []);

  return (
    <>
           {" "}
      <TableRow key={row.id} style={isDisabled ? { Opacity: "0.5" } : {}}>
               {" "}
        <TableCell
          className={classes.rowHeaderFirst}
          style={
            isDisabled ? { pointerEvents: "none", background: "#afa3a324" } : {}
          }
        >
                   {" "}
          <Checkbox
            classes={{ root: classes.checkboxRoot }}
            icon={<span className={classes.iconSizeuncheck} />} // Unchecked
            checkedIcon={
              <CheckCircleIcon className={classes.iconSizeChecked} />
            } // Checked
            checked={checked}
            onChange={(e) =>
              isDisabled
                ? {}
                : handleCheckboxChange(
                    e,
                    row?.job_title ?? "",
                    row?.job_title_id ?? ""
                  )
            }
          />
                 {" "}
        </TableCell>
               {" "}
        <TableCell
          className={
            !isDisabled
              ? classes.rowHeaderJobTitledisabled
              : classes.rowHeaderJobTitle
          }
        >
                   {" "}
          {isDisabled ? (
            <div className={classes.affecting}>
                            <span>{row?.job_title ?? ""}</span>             {" "}
              <span className={classes.affectinghppd}>Affecting HPPD</span>     
                   {" "}
            </div>
          ) : (
            <Tooltip title={isOverflow ? row.name : ""} arrow>
                           {" "}
              <div ref={cellRef} className={classes.rowellipses}>
                                {row?.job_title ?? ""}             {" "}
              </div>
                         {" "}
            </Tooltip>
          )}
                 {" "}
        </TableCell>
                {/* Today's Data */}
               {" "}
        <HppdRowCalculationModal
          key={`${row.id}-today`}
          firstData={{
            name: row.name,
            ...(row?.time_range_data?.today ?? {}),
          }}
          secondData={{
            ...(row?.time_range_data?.yesterday ?? {}),
          }}
          onCensusClick={(event) => handleTodaysCensusClick(event, row.id)}
          onTargetClick={(event) => {}}
          type="day"
        />
                {/* 15 Days Data */}
               {" "}
        <HppdRowCalculationModal
          key={`${row.id}-15-days`}
          firstData={{
            name: row.name,
            ...(row?.time_range_data?.last_15_days ?? {}),
          }}
          secondData={{
            ...(row?.time_range_data?.days_15_30 ?? {}),
          }}
          onCensusClick={() => {}}
          onTargetClick={(event) => {}}
          type="week"
        />
                {/* 30 Days Data */}
               {" "}
        <HppdRowCalculationModal
          key={`${row.id}-30-days`}
          firstData={{
            name: row.name,
            ...(row?.time_range_data?.last_30_days ?? {}),
          }}
          secondData={{
            ...(row?.time_range_data?.days_30_60 ?? {}),
          }}
          onCensusClick={() => {}}
          onTargetClick={(event) => {}}
          type="month"
        />
             {" "}
      </TableRow>
         {" "}
    </>
  );
};

export default HppdTableRow;

const useStyles = makeStyles((theme) => ({
  checkboxRoot: {
    color: "#FF007F", // Default unchecked color
    "&.Mui-checked": {
      color: "#086375", // Checked color
    },
  },
  iconSizeuncheck: {
    fontSize: "20px", // Adjust icon size
    border: "none",
    background: "#F3F4F7",
    borderRadius: "50%",
    height: "20px",
    width: "20px",
  },
  iconSizeChecked: {
    fontSize: "20px", // Adjust icon size
    border: "none",
    color: "#086375",
    borderRadius: "50%",
    height: "20px",
    width: "20px",
  },
  check: {
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    background: "#086375",
    textAlign: "center",
    position: "relative",
    "& img": {
      position: "absolute !important",
      top: "35% !important",
      right: "5px !important",
    },
  },
  rowHeaderFirst: {
    // display: "flex",
    // left: "10px",
    paddingLeft: "20px !important",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: "15px",
    fontWeight: "600 !important",
    fontSize: "12px !important",
    color: `${theme.palette.secondary.gray4} !important`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    position: "relative",
  },
  rowHeaderJobTitle: {
    lineHeight: "15px",
    fontWeight: "600 !important",
    fontSize: "12px !important",
    color: `${theme.palette.secondary.gray4} !important`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    position: "relative",
    background: "#F1EEFF",
  },
  rowHeaderJobTitledisabled: {
    lineHeight: "15px",
    fontWeight: "600 !important",
    fontSize: "12px !important",
    color: `${theme.palette.secondary.gray4} !important`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    position: "relative",
  },
  affecting: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
    fontSize: "12px",
    fontWeight: 500,
    lineHeight: "15px",
    color: "#565674",
  },
  affectinghppd: {
    color: "#6945FC",
    fontSize: "9px",
    fontWeight: 500,
    lineHeight: "11.25px",
  }, /////////////////////////

  root: {
    width: "100%",
    overflowX: "auto",
  },
  dialog: {
    boxShadow: "0px 2px 8px 1px rgba(0, 0, 0, 0.2)",
  },
  cell: {
    color: `${theme.palette.secondary.extradarkBlue} !important`,
    fontWeight: "600 !important",
    fontSize: "11px !important",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
  },
  cellInactive: {
    // textAlign: "center",
    color: theme.palette.background.grey2,
    fontWeight: "600 !important",
    fontSize: "11px !important",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
  },
  rowHeader: {
    lineHeight: "15px",
    fontWeight: "600 !important",
    fontSize: "12px !important",
    color: `${theme.palette.secondary.gray4} !important`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    position: "relative",
    "& img": {
      position: "absolute",
      top: "50%",
      right: "12px",
      cursor: "pointer",
    },
  },
  rowellipses: {
    cursor: "pointer",
    maxWidth: "120px", // Adjust width as needed
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    display: "block", // Required for ellipsis effect
    paddingRight: "22px",
  },
  expandStyles: {
    background: "#F3F4F7",
  },
  expandButton: {
    backgroundColor: "#F3F4F7",
  },
  fullWidthCell: {
    padding: "20px",
    width: "100%",
  },
  customButton: {
    background: "#FFFFFF",
    borderRadius: "30px",
    fontSize: "12px",
    fontWeight: "600",
    lineHeight: "15px",
    color: "#434966",
    padding: "6px 12px",
    boxShadow: "0px 4px 4px 0px #9854CB1A",
    "&:hover": {
      borderColor: "darkred",
      backgroundColor: "rgba(255, 0, 0, 0.1)",
    },
  },
  customIcon: {
    color: "#086375",
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
  varianceCell: {
    fontWeight: 600,
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
  },
  popoverTitle: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#667085",
  },
  popoverLabel: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#434966",
  },
  inputField: {
    marginBottom: "5px",
  },
  popover: {
    border: `1px solid ${theme.palette.secondary.gray300}`,
  },
  popoverHr: {
    borderBottom: "1px solid #F3F4F7", // padding: '4px',
  },
  popMain: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    width: "auto", // marginBottom: "7px", // marginTop: "7px",
    "& .MuiInputBase-input": {
      fontSize: "14px !important",
      padding: "8px !important",
    },
  },
  inputMain: {
    gap: "8px",
    display: "flex",
    flexDirection: "column",
  },
}));
