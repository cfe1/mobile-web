import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  makeStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import SelectShift from "./SelectShift";
import {
  PinkPrimaryButton,
  Divider,
  SearchInput,
  TablePagination,
  Loader,
  Toast,
  CloseCrossButton,
  DailyWeeklyFilter,
  SelectFilter,
} from "App/components";
import NurseCard from "App/components/card/NurseCard";
import queryString from "query-string";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import { useWindowSize } from "App/hooks";

const AssignEmployeeDialog = (props) => {
  const {
    open,
    close,
    date,
    getDashboardPositons,
    facility_id,
    handleForceRender,
    jobTitleIndex,
  } = props;
  const [nurses, setNurses] = useState([]);
  const [nurseSelect, setNurseSelect] = useState(true);
  const [selectedNurse, setSelectedNurse] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState("");
  const [assignedShifts, setAssignedShifts] = useState(null);
  const [employeeName, setEmployeeName] = useState("");
  const [jobTitleName, setJobTitleName] = useState("");
  const [ordering, setOrdering] = useState("-hourly_rate");
  const [positions, setPositions] = useState([]);
  const [dateAssign, setDateAssign] = useState(null);
  const [selectedType, setSelectedType] = useState("Daily");
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitleSelectedIndex, setJobTitleSelectedIndex] = useState(
    jobTitleIndex || 0
  );
  const [jobTitleSelectedValue, setJobTitleSelectedeValue] = useState(null);

  useEffect(() => {
    getJobTitles();
  }, []);

  useEffect(() => {
    if (jobTitles.length > 0) {
      getAllEmployees();
    }
  }, [search, pageSize, page, ordering, jobTitleSelectedIndex, jobTitles]);
  useEffect(() => {
    if (selectedNurse !== "") getEmployeeDailyData();
  }, [selectedNurse]);

  const getEmployeeDailyData = async () => {
    const currDate = moment(date).format("YYYY-MM-DD");
    try {
      setLoading(true);
      const resp = await API.get(
        ENDPOINTS.EMPLOYEE_SHIFTS(
          facility_id,
          selectedNurse,
          currDate,
          currDate
        )
      );
      if (resp?.success) {
        setAssignedShifts(resp?.data);
      }
    } catch (error) {
      Toast.showError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getAllEmployees = async () => {
    setLoading(true);
    const params = {
      search: search,
      page_size: pageSize,
      page: page,
      detailed: false,
      ordering: ordering,
      status: "ACTIVE",
    };
    if (jobTitleSelectedIndex) {
      params.job_title = jobTitles[jobTitleSelectedIndex]?.id || "";
    }
    const urlParams = queryString.stringify(params, {
      encode: false,
      //arrayFormat: "bracket",
    });

    try {
      const resp = await API.get(
        `${ENDPOINTS.FACILITY_EMPLOYEES(facility_id, urlParams)}?${urlParams}`
      );
      if (resp.success) {
        setCount(resp.data.count);
        setNurses(resp.data.results);
        setLoading(false);
      }
    } catch (e) {
      Toast.showErrorToast("Something went Wrong");
    } finally {
      setLoading(false);
    }
  };
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
      setLoading(false);
    }
  };
  const handleShiftSelect = () => {
    if (nurseSelect) {
      setNurseSelect(false);
    } else {
    }
  };
  const handleSelectNurse = (nurse) => {
    if (selectedNurse === "" || selectedNurse !== nurse.id) {
      setSelectedNurse(nurse.id);
      setEmployeeName(nurse?.fullname);
      setJobTitleName(nurse?.job_title);
      // setImageURl
    } else if (selectedNurse === nurse.id) {
      setSelectedNurse("");
      setEmployeeName("");
      setJobTitleName("");
    }
  };
  const handleChangePageSize = (pageSize) => {
    setPageSize(pageSize);
  };
  const handleClose = () => {
    setNurseSelect(true);
  };
  const handlePageChange = (e, page) => {
    setPage(page);
  };
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

  const classes = useStyles();
  const { width } = useWindowSize();
  const breakPoint = 1030;
  return (
    <>
      <Dialog open={open} disableBackdropClick maxWidth="md" fullWidth>
        <DialogContent>
          {loading && <Loader />}
          {nurseSelect ? (
            <>
              <Grid container justify="space-between">
                <Grid
                  alignItems="center"
                  className={`${classes.marginBottomTen} ${classes.flexDisplay} ${classes.justifyContent}${classes.alignCenter} ${classes.fullWidthClass}`}
                  item
                >
                  <Grid item className={`${classes.titlePosition} `}>
                    {jobTitleFilter()}
                  </Grid>
                  <Grid item>
                    <CloseCrossButton onClick={close} />
                  </Grid>
                </Grid>
                <Grid
                  item
                  justifyContent='flex-end'
                  container
                  className={`${classes.flexDisplay} ${classes.header} ${classes.justifyEnd} ${classes.alignCenter}`}
                >
                  <div className={classes.containHeight}>
                    <SearchInput
                      value={search}
                      onChange={(e) => {
                        // setCurrentPage(1);
                        setSearch(e.target.value);
                      }}
                      onClose={(e) => {
                        // setCurrentPage(1);
                        setSearch("");
                      }}
                    />
                  </div>
                  <DailyWeeklyFilter
                    setDate={setDateAssign}
                    setSelectedType={setSelectedType}
                    selectedType={selectedType}
                    dailyDate={date}
                    startDate={date}
                    hideSelect
                  />
                </Grid>
                <Divider />
              </Grid>
              <Grid
                container
                justifyContent="space-between"
                spacing={1}
                className={classes.nurseContainer}
              >
                {nurses.length > 0 ? (
                  nurses.map((nurse) => {
                    return (
                      <Grid item xs={6} md={4}>
                        <NurseCard
                          fromDashBoard={true}
                          details={nurse}
                          selected={selectedNurse}
                          onClick={handleSelectNurse.bind(null, nurse)}
                          facility_id={facility_id}
                        />
                      </Grid>
                    );
                  })
                ) : (
                  <Grid container className={classes.noEmployee}>
                    {!loading && "No Employee Found"}
                  </Grid>
                )}
              </Grid>
              <TablePagination
                isNurse={true}
                count={count}
                page={page}
                rowsPerPage={pageSize}
                setRowsPerPage={handleChangePageSize}
                onChangePage={(e, page) => handlePageChange(e, page)}
              />
            </>
          ) : (
            <SelectShift
              asShifts={assignedShifts}
              date={dateAssign}
              job_title_name={jobTitleName}
              emp_name={employeeName}
              emp_id={selectedNurse}
              closeModal={close}
              handleClose={handleClose}
              prevDayShiftsData={getDashboardPositons}
              facility_id={facility_id}
              handleForceRender={handleForceRender}
            />
          )}
        </DialogContent>
        {nurseSelect ? (
          <div
            className={`${classes.flexDisplay} ${classes.alignCenter} ${classes.justifyCenter} ${classes.marginTopFooter}`}
          >
            <PinkPrimaryButton
              onClick={handleShiftSelect}
              className={`${classes.btns} matrix-btn ${classes.marginLeft} ${
                !selectedNurse ? classes.disabledColor : ""
              }`}
              disabled={!selectedNurse}
            >
              {nurseSelect ? "Next" : "Confirm"}
            </PinkPrimaryButton>
          </div>
        ) : null}
      </Dialog>
    </>
  );
};

export default AssignEmployeeDialog;

const useStyles = makeStyles({
  btns: {
    width: "208px !important",
    height: "50px !important",
    color: "#FFFFFF",
  },
  marginLeft: {
    marginLeft: 10,
  },
  flexDisplay: {
    display: "flex",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyEnd: {
    justifyContent: "flex-end",
  },
  alignCenter: {
    alignItems: "center",
  },
  header: {
    marginBottom: 10,
    marginLeft: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    fontFamily: "Manrope",
  },
  select: {
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    width: 180,
    marginRight: 10,
    marginLeft: 10,
    height: "44px !important",
  },
  containHeight: {
    height: 40,
    marginRight: 10,
  },
  nurseContainer: {
    maxHeight: 440,
    boxSizing: "border-box",
    padding: 4,
    backgroundColor: "#F3F4F7",
    borderRadius: 8,
  },
  marginTopFooter: {
    backgroundColor: "#F3F4F7",
    height: 90,
  },
  titlePosition: {
    color: "#17174A",
    fontWeight: "600",
    fontSize: "30px",
    display: "flex",
    "@media (max-width:940px)": {
      fontSize: "25px",
    },
  },
  marginBottomTen: {
    marginBottom: 10,
  },
  disabledColor: {
    background: "lightgray !important",
  },
  fullWidthClass: {
    width: "100%",
    justifyContent: "space-between",
  },
});
