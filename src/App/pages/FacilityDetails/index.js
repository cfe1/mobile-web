import React, { useState, useEffect } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Link as Route } from "react-router-dom";
import Link from "@material-ui/core/Link";
import { Grid, makeStyles, Typography, Paper } from "@material-ui/core";
import ManagerInformationDialog from "../Dashboard/components/ManagerInformationDialog";
import {
  Loader,
  TransparentButton,
  Select,
  Toast,
  DailyWeeklyFilter,
} from "App/components";
import moment from "moment";
import { API, ENDPOINTS } from "api/apiService";
import FacilityInfo from "./components/FacilityInfo";
import EmployeeListing from "./components/EmloyeeListing";
import FacilityBudget from "./FacilityBudget";
import NursePositionTable from "./NursePositionTable";
import { useHistory, useLocation } from "react-router-dom";
const FacilityDetails = (props) => {
  const history = useHistory();
  const location = useLocation();
  //************************All states*****************//
  const [loading, setLoading] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [facilityId, setFacilityId] = useState(props?.match?.params?.id);
  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState(
    location?.state?.content?.selectedType
      ? location?.state?.content?.selectedType
      : "Daily"
  );
  const [allJobTitles, setAllJobTitles] = useState([]);
  const [facilityData, setFacilityData] = useState({});
  const [openAssignEmployee, setOpenAssignEmployee] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    getFacilityList();
    getJobTitles();
  }, []);

  const getFacilityList = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.OWNER_FACILITY_LISTING);
      if (resp.success) {
        let facilitynames = resp.data.map((data) => {
          return {
            value: data.id,
            label: data.name,
          };
        });
        setFacilityList(facilitynames);
      }
    } catch (e) {
      e && Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      getFacilityDetails();
    }
  }, [date, facilityId]);

  useEffect(() => {
    if (weekStartDate) {
      getFacilityDetails();
    }
  }, [weekStartDate]);

  const getFacilityDetails = async () => {
    try {
      setLoading(true);
      const startDate = moment(
        selectedType === "Daily" ? date : weekStartDate
      ).format("YYYY-MM-DD");
      const endDate = moment(
        selectedType === "Daily" ? date : weekEndDate
      ).format("YYYY-MM-DD");

      const resp = await API.get(
        ENDPOINTS.FACILITY_DETAILS(facilityId, startDate, endDate)
      );
      if (resp?.success) {
        setFacilityData(resp?.data);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const getJobTitles = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.FETCH_JOB_TITLES);
      if (resp.success) {
        let facilitynames = resp.data.map((data) => {
          return {
            value: data.id,
            label: data.name,
          };
        });
        setAllJobTitles(facilitynames);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      // setLoading(false);
    }
  };
  const handleFacilityChange = (id) => {
    setFacilityId(id);
  };
  const handlePushDashboard = () => {
    history.push({
      pathname: "/dashboard",
      state: {
        content: {
          selectedType: selectedType,
          date: moment(date).format("YYYY-MM-DD"),
          weekStartDate: moment(weekStartDate).format("YYYY-MM-DD"),
        },
      },
    });
  };
  const getDailyDate = (currentType) => {
    if (location?.state?.content) {
      const {
        selectedType: type,
        date: dailyDate,
        weekStartDate: weekDate,
      } = location?.state?.content;

      if (type && type === "Daily" && currentType === "Daily") {
        return dailyDate;
      } else if (type && type === "Weekly" && currentType === "Weekly") {
        return weekDate;
      }
    }
  };
  const handleOpenAssignEmployee = () => {
    setOpenAssignEmployee(true);
  };
  const handleCloseAssignEmployee = () => {
    setOpenAssignEmployee(false);
  };
  return (
    <>
      {loading && <Loader />}
      <Grid container justify="space-between" alignItems="center">
        <div className="module-nav">
          <div className="mls">
            <div className="module-title">Dashboard</div>
            <div className="module-breadcrumb">
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                Route{" "}
                <Link color="inherit" component={Route} to={"/dashboard"}>
                  Agalia
                </Link>{" "}
                <Link color="inherit" component={Route} to={"/dashboard"}>
                  Dashboard
                </Link>
                <Typography style={{ color: "#FF0083" }}>Facility</Typography>
              </Breadcrumbs>
            </div>
          </div>
        </div>
        <Grid justify="space-between" className={classes.selectContainer}>
          <Select
            id="facilityList"
            items={facilityList}
            onChange={(value) => {
              handleFacilityChange(value);
            }}
            style={{
              backgroundColor: "white",
              height: 44,
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 15,
              color: "#17174A",
              width: "234px",
              marginRight: 8,
            }}
            value={facilityId}
            padding={0}
            fontWeight
            formControlClasses={{ root: classes.formRoot }}
            hideSelected={true}
            ellipse={true}
          />
          <TransparentButton
            className={classes.backButton}
            onClick={handlePushDashboard}
          >
            Back to Dashboard
          </TransparentButton>
        </Grid>
      </Grid>
      <FacilityInfo FACILITY_ID={facilityId} />
      <Paper className={classes.paddingBottom}>
        <Grid container className={`${classes.whiteBg} ${classes.tableDiv}`}>
          <Grid container justify="space-between">
            <Grid className={`${classes.shiftOpeningsTxt}`}>Details</Grid>{" "}
            <div className="mrs">
              <DailyWeeklyFilter
                setDate={setDate}
                setWeekStartDate={setWeekStartDate}
                setWeeEndDate={setWeeEndDate}
                setSelectedType={setSelectedType}
                selectedType={selectedType}
                dailyDate={getDailyDate("Daily")}
                startDate={getDailyDate("Weekly")}
              />
            </div>
          </Grid>
        </Grid>

        {facilityData && (
          <FacilityBudget
            facility={facilityData?.budget_data}
            positionData={facilityData?.position_data}
            selectedType={selectedType}
            facility_id={facilityId}
            date={date}
            weekStartDate={weekStartDate}
            weekEndDate={weekEndDate}
            handleOpenAssignEmployee={handleOpenAssignEmployee}
            getFacilityDetails = {getFacilityDetails}
          />
        )}
        {facilityData && (
          <NursePositionTable
            positionData={facilityData?.position_data}
            nurseData={facilityData?.nurse_hours_data}
            facility_id={facilityId}
            startDate={weekStartDate}
            endDate={weekStartDate}
            date={date}
            selectedType={selectedType}
            allJobTitles={allJobTitles}
          />
        )}
      </Paper>
      <EmployeeListing facilityId={facilityId} />
    </>
  );
};

export default FacilityDetails;
const useStyles = makeStyles({
  paddingBottom: {
    padding: "8px 10px",
    marginTop: -20,
    borderRadius: 8,
    background: "#FFFFFF",
  },
  facilityName: {
    fontSize: 32,
    fontWeight: 700,
    paddingLeft: "3%",
  },
  details: {
    fontSize: 14,
    fontWeight: 600,
    paddingLeft: "4%",
  },
  backButton: {
    width: 150,
    height: 44,
    backgroundColor: "unset",
    fontSize: 14,
    fontWeight: 800,
    textAlign: "center",
    border: "1px solid black",
    padding: 0,
  },
  formRoot: {
    "& .MuiInputBase-root": {
      width: "100% !important",
      height: "44px !important",
      "& .MuiSelect-root": {
        fontSize: "15px !important",
        fontWeight: "700 !important",
        "& div": {
          marginTop: 4,
        },
      },
    },
    width: "200px !important",
    "& .MuiOutlinedInput-root": {
      borderColor: "#FF0083",
      "&.Mui-focused fieldset": {
        borderColor: "#FF0083 !important",
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#FF0083 !important",
    },
  },
  selectContainer: {
    marginTop: -20,
  },
  paddingBottom: {
    padding: "30px 24px 24px 24px",
    marginTop: 24,
  },
  shiftOpeningsTxt: {
    fontSize: "1.6em",
    fontWeight: 700,
  },
});
