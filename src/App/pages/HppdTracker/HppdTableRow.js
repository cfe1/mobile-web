import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  Popover,
  Button,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpward from "../../assets/icons/arrowUpPink.svg";
import ArrowDownward from "../../assets/icons/arrowDownGreen.svg";
import TickCircleGreen from "../../assets/icons/tickCircleGreen.svg";
import AddCensus from "./AddCensus";
import HppdRowCalculation from "./HppdRowCalculation";
import { API, ENDPOINTS } from "api/apiService";
import { LinearProgressBar, Loader, Toast } from "App/components";
import queryString from "query-string";

const useStyles = makeStyles((theme) => ({
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
    borderBottom: '1px solid #F3F4F7',
    // padding: '4px',
  },
  popMain: {
    padding: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  input: {
    width: "auto",
    // marginBottom: "7px",
    // marginTop: "7px",
    "& .MuiInputBase-input": {
      fontSize: "14px !important",
      padding: "8px !important",
    },
  },
  inputMain:{
    gap: '8px',
    display: 'flex',
    flexDirection: 'column',
  }
}));
const HppdTableRow = ({ row, updateRowData, department }) => {
  const classes = useStyles();
  const [openModal, setOpenModal] = useState(false);
  const [censusType, setCensusType] = useState("");
  const [censusFacilityId, setFacilityId] = useState("");
  const [anchorEl, setAnchorEl] = useState(null); // To control the visibility of Popover
  const [initialTarget, setInitialTarget] = useState();
  const [target, setTarget] = useState();
  const openTarget = Boolean(anchorEl);

  const [openTodayCensus, setOpenTodayCensus] = useState(false);
  const [anchorElTodayCensus, setAnchorElTodayCensus] = useState(null);
  const [todaysCensus, setTodaysCensus] = useState("");
  const [yesterdayCensus, setYesterdayCensus] = useState("");
  const [initialCensus, setInitialCensus] = useState({});

  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState(false);
  const [loadingCensus, setLoadingCensus] = useState(false);

  // for week and month
  const handleCensusClick = (type, facilityId) => {
    setCensusType(type);
    setFacilityId(facilityId);
    setOpenModal(true);
  };

  // for week and month
  const handleCloseModal = () => {
    setCensusType("");
    setFacilityId("");
    setOpenModal(false);
  };

  const handleTargetClick = (event, target, facilityId) => {
    setTarget(target);
    setInitialTarget(target);
    setFacilityId(facilityId);
    setAnchorEl(event.currentTarget);
  };

  // Close popover
  const handleTargetClose = () => {
    setTarget("");
    setInitialTarget("");
    setFacilityId("");
    setAnchorEl(null);
  };

  // Handle input change
  const handleTargetChange = (e) => {
    setTarget(e.target.value);
  };

  // Handle confirm action
  const handleTargetConfirm = () => {
    if (initialTarget == target) {
      handleTargetClose();
      return;
    }

    const finalData = {
      department: department,
      facility: censusFacilityId, // Replace with actual facility_id
      target,
    };

    getTargetUpdate(finalData);
  };

  const getTargetUpdate = async (finalData) => {
    try {
      setLoadingTarget(true);
      const resp = await API.post(ENDPOINTS.HPPD_TARGET_UPDATE, finalData);
      if (resp.success && resp.data) {
        updateRowData(censusFacilityId);
        setFacilityId("");
        setTarget("");
        setInitialTarget("");
        handleTargetClose(); // Close the popover after confirmation
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoadingTarget(false);
    }
  };

  const fetchCensusData = async (facilityId) => {
    try {
      setLoadingCensus(true);
      setFacilityId(facilityId);

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

        setTodaysCensus(censusLookup[end_date] || "");
        setYesterdayCensus(censusLookup[start_date] || "");
        setInitialCensus({
          [start_date]: censusLookup[start_date] || "",
          [end_date]: censusLookup[end_date] || "",
        });
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0] || "An error occurred");
    } finally {
      setLoadingCensus(false);
    }
  };

  // input change for today's census
  const handleTodaysChange = (e) => {
    setTodaysCensus(e.target.value);
  };

  // input change for yesterday's census
  const handleYesterdaysChange = (e) => {
    setYesterdayCensus(e.target.value);
  };

  // census open popover
  const handleTodaysCensusClick = (event, facilityId) => {
    setAnchorElTodayCensus(event.currentTarget);
    fetchCensusData(facilityId);
    setOpenTodayCensus(true);
  };

  // census close popover
  const handleTodayCensusClose = () => {
    setOpenTodayCensus(false);
  };

  // Census confirm
  const handleDayCensusConfirm = () => {
    const changedData = [];
    const end_date = new Date().toISOString().split("T")[0];
    const start_date = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];

    if (todaysCensus !== initialCensus[end_date]) {
      changedData.push({
        date: end_date,
        patient_count: parseInt(todaysCensus),
      });
    }
    if (yesterdayCensus !== initialCensus[start_date]) {
      changedData.push({
        date: start_date,
        patient_count: parseInt(yesterdayCensus),
      });
    }

    const finalData = {
      census_data: changedData,
      facility_id: censusFacilityId, // Replace with actual facility_id
      census_type: "FACILITY",
    };

    getCensusUpdate(finalData);
  };

  const getCensusUpdate = async (finalData) => {
    try {
      setLoadingCensus(true);

      const resp = await API.patch(ENDPOINTS.HPPD_CENSUS_UPDATE, finalData);
      if (resp.success && resp.data) {
        updateRowData(censusFacilityId);
        setFacilityId("");
        handleTodayCensusClose(); // Close the popover after confirmation
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoadingCensus(false);
    }
  };
  return (
    <>
      {loading && <LinearProgressBar belowHeader />}

      <TableRow key={row.id}>
        <TableCell className={classes.rowHeader}>{row.name}</TableCell>
        {/* Today's Data */}
        <HppdRowCalculation
          key={`${row.id}-today`}
          firstData={{
            name: row.name,
            ...row.time_range_data.today,
          }}
          secondData={{
            ...row.time_range_data.yesterday,
          }}
          onCensusClick={(event) => handleTodaysCensusClick(event, row.id)}
          onTargetClick={(event) =>
            handleTargetClick(event, row.time_range_data.today.target, row.id)
          }
          type="day"
        />
        {/* 15 Days Data */}
        <HppdRowCalculation
          key={`${row.id}-15-days`}
          firstData={{
            name: row.name,
            ...row.time_range_data.last_15_days,
          }}
          secondData={{
            ...row.time_range_data.days_15_30,
          }}
          onCensusClick={() => handleCensusClick("week", row.id)}
          onTargetClick={(event) =>
            handleTargetClick(
              event,
              row.time_range_data.last_15_days.target,
              row.id
            )
          }
          type="week"
        />
        {/* 30 Days Data */}
        <HppdRowCalculation
          key={`${row.id}-30-days`}
          firstData={{
            name: row.name,
            ...row.time_range_data.last_30_days,
          }}
          secondData={{
            ...row.time_range_data.days_30_60,
          }}
          onCensusClick={() => handleCensusClick("month", row.id)}
          onTargetClick={(event) =>
            handleTargetClick(
              event,
              row.time_range_data.days_15_30.target,
              row.id
            )
          }
          type="month"
        />
      </TableRow>

      {/* add update census week and month */}
      {openModal && (
        <AddCensus
          onClose={handleCloseModal}
          censusType={censusType}
          censusFacilityId={censusFacilityId}
          updateRowData={updateRowData}
        />
      )}

      {/* target popover */}
      <Popover
        open={openTarget}
        anchorEl={anchorEl}
        onClose={handleTargetClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{ paper: classes.dialog }}
        PaperProps={{
          style: {
            boxShadow: "0px 6px 12px 0px #04043405 !important", // Apply the shadow here
          },
        }}
      >
        {loadingTarget && <LinearProgressBar />}

        <div className={classes.popMain}>
        <div className={classes.popoverTitle}>Target</div>
        <div>
            <TextField
              placeholder="Enter Here"
              variant="outlined"
              size="small"
              type="Number"
              value={target}
              onChange={handleTargetChange}
              className={classes.input}
            />
          </div>
          <div>
            <Button
              variant="contained"
              color=""
              onClick={handleTargetClose}
              className={classes.confirmButton}
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTargetConfirm}
              className={classes.confirmButton}
              disabled={loadingTarget}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Popover>

      {/* census popover */}
      <Popover
        open={openTodayCensus}
        anchorEl={anchorElTodayCensus}
        onClose={handleTodayCensusClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{ paper: classes.dialog }}
        PaperProps={{
          style: {
            boxShadow: "0px 6px 12px 0px #04043405 !important", // Apply the shadow here
          },
        }}
      >
        {loadingCensus && <LinearProgressBar />}

        <div className={classes.popMain}>
          <div className={classes.popoverTitle}>Census</div>
          <div className={classes.popoverHr}></div>
          <div className={classes.inputMain}>
            <span className={classes.popoverLabel}>Today's Census</span>
            <div>
              <TextField
                placeholder="Enter Here"
                variant="outlined"
                size="small"
                type="Number"
                value={todaysCensus}
                onChange={handleTodaysChange}
                className={classes.input}
              />
            </div>
          </div>
          <div className={classes.inputMain}>
            <span className={classes.popoverLabel}>Yesterday's Census</span>
            <div>
              <TextField
                placeholder="Enter Here"
                variant="outlined"
                size="small"
                type="Number"
                value={yesterdayCensus}
                onChange={handleYesterdaysChange}
                className={classes.input}
              />
            </div>
          </div>
          <div>
            <Button
              variant="contained"
              color=""
              onClick={handleTodayCensusClose}
              className={classes.confirmButton}
              style={{ marginRight: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleDayCensusConfirm}
              className={classes.confirmButton}
              disabled={loadingCensus}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Popover>
    </>
  );
};

export default HppdTableRow;
