import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, makeStyles, Grid } from "@material-ui/core";
import {
  Loader,
  DailyWeeklyFilter,
  PinkPrimaryButton,
  SelectFilter,
  Toast,
  SearchInput,
} from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import { PositionModalTable } from "./PositionModalTable";
import { useWindowSize } from "App/hooks";
import StatsAndProgressBar from "./StatsAndProgressBar";
import AssignEmployeeDialog from "./AssignEmployeeDialog";
import { hasDayPassed } from "../../../utils/dateUtils";

export const PositionModal = ({ facility_id, startDate, onClose }) => {
  // <========== All Use States =============>
  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState("Daily");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(null);
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitleSelectedIndex, setJobTitleSelectedIndex] = useState(0);
  const [jobTitleSelectedValue, setJobTitleSelectedeValue] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [openAssignEmployee, setOpenAssignEmployee] = useState(false);

  // <============ All Use Effects ===========>
  useEffect(() => {
    getJobTitles();
  }, []);

  // <============ All API calls ==============>

  const getJobTitles = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.FETCH_JOB_TITLES);
      if (resp.success) {
        setJobTitles([
          { title: "All", id: null },
          ...resp.data.map((data) => {
            return { title: data?.name, id: data?.id };
          }),
        ]);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      // setLoading(false);
      setLoading(false);
    }
  };

  // <============ All Helper Functions =============>

  const jobTitleFilter = () => {
    const menu = jobTitles.map((jobTitle) => jobTitle.title);
    return (
      <SelectFilter
        menu={menu}
        selectedIndex={jobTitleSelectedIndex}
        setSelectedIndex={setJobTitleSelectedIndex}
        setSelectedValue={setJobTitleSelectedeValue}
        isTextNeeded
        extraText={"Positions"}
        ellispe={true}
      />
    );
  };

  const getStartDate = () => {
    return date || weekStartDate
      ? moment(selectedType === "Daily" ? date : weekStartDate).format(
          "YYYY-MM-DD"
        )
      : null;
  };

  const getEndDate = () => {
    return date || weekEndDate
      ? moment(selectedType === "Daily" ? date : weekEndDate).format(
          "YYYY-MM-DD"
        )
      : null;
  };

  const handleForceRender = () => {
    setForceRender(!forceRender);
  };
  const handleOpenAssignEmployee = () => {
    setOpenAssignEmployee(true);
  };
  const handleCloseAssignEmployee = () => {
    setOpenAssignEmployee(false);
  };

  const getSearchWeekFilter = () => (
    <>
      <SearchInput
        style={{ height: 40 }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onClose={(e) => {
          setSearch("");
        }}
      />
      <DailyWeeklyFilter
        setDate={setDate}
        setWeekStartDate={setWeekStartDate}
        setWeeEndDate={setWeeEndDate}
        setSelectedType={setSelectedType}
        selectedType={selectedType}
        dailyDate={startDate}
        startDate={startDate}
        hideSelect
      />
    </>
  );

  // <============= All constants ====================>

  const classes = useStyles();
  const { width } = useWindowSize();
  const breakPoint = 1000;
  return (
    <>
      {loading && <Loader />}
      <Dialog open={true} maxWidth="lg" fullWidth disableBackdropClick>
        <DialogContent className={classes.dialogContent}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item className={classes.title}>
              {jobTitleFilter()}
            </Grid>
            <Grid item className={classes.flex}>
              {width > breakPoint && getSearchWeekFilter()}
              <PinkPrimaryButton
                className={`${classes.assignBtn} ${hasDayPassed(date)?classes.disabled:""}  matrix-btn`}
                onClick={() => {
                  handleOpenAssignEmployee();
                }}
                disabled={hasDayPassed(date)}
              >
                Assign
              </PinkPrimaryButton>
              {/* {CrossButton()} */}
            </Grid>
          </Grid>
          {width <= breakPoint && (
            <Grid container justify="flex-end">
              {getSearchWeekFilter()}{" "}
            </Grid>
          )}
          <StatsAndProgressBar
            weekStartDate={weekStartDate}
            weekEndDate={weekEndDate}
            date={date}
            facility_id={facility_id}
            forceRender={forceRender}
            job_title_id={jobTitles[jobTitleSelectedIndex]?.id || ""}
            />
          {facility_id && (
            <PositionModalTable
              facility_id={facility_id}
              job_title_id={jobTitles[jobTitleSelectedIndex]?.id || ""}
              startDate={getStartDate()}
              endDate={getEndDate()}
              search={search}
              handleForceRender={handleForceRender}
              forceRender={forceRender}
            />
          )}
          {openAssignEmployee && (
            <AssignEmployeeDialog
              open={openAssignEmployee}
              close={handleCloseAssignEmployee}
              date={date}
              facility_id={facility_id}
              handleForceRender={handleForceRender}
              jobTitleIndex = {jobTitleSelectedIndex}
              jobTitles={jobTitles}
            />
          )}
        </DialogContent>
        <Grid
          container
          className={classes.grayBg}
          justify="center"
          alignItems="center"
        >
          <PinkPrimaryButton
            className={`${classes.cancelbtn} matrix-btn`}
            onClick={onClose}
          >
            Close
          </PinkPrimaryButton>
        </Grid>
      </Dialog>
    </>
  );
};

const useStyles = makeStyles({
  dialogContent: {
    boxSizing: "border-box",
    padding: 24,
  },
  title: {
    color: "#17174A",
    fontWeight: "600",
    fontSize: "30px",
    display: "flex",
    "@media (max-width:940px)": {
      fontSize: "25px",
    },
  },
  flex: {
    display: "flex",
  },
  totalBlock: {
    background: "#DDDFE6 !important",
  },
  assignBtn: {
    height: 44,
    padding:0
  },
  grayBg: {
    backgroundColor: "#F3F4F7",
    height: 165,
  },
  cancelbtn: {
    height: 50,
    width: 200,
  },
  disabled:{
    backgroundColor:'lightgray !important'
  }
});
