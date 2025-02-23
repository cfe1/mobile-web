import React, { useState, useEffect } from "react";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import moment from "moment";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { Loader, TablePagination, ArrowBackButton } from "App/components";
import { useLocation } from "react-router-dom";
import Filters from "App/components/Filter/Filters";
import { LimitAlertModal } from "./manageAlerts/LimitAlertModal";
import {
  FilterConts,
  PARAM_NAME,
  ITEMS,
} from "App/components/Filter/filterConts";
import DrawerSearchInput from "App/components/Form/DrawerSearchInput";
import FacilityTable from "./FacilityTable";
import { transformJobTitles } from "./utills/common";
import JobTitleService from "./utills/JobTitleService";
import FacilityService from "./utills/FacilityService";
import FacilityDetailsTable from "./FacilityDetails/FacilityDetailsTable";
import FacilityEmployeesTable from "./FacilityEmployees/FacilityEmployeesTable";

import DateRangePicker from "App/components/Form/DateRangePicker/index";
import "./NewDashboard.scss";
import { useModal } from "App/hooks";
import { ModalTypes } from "App/constants/ModalConstants";
import { PdfSettings } from "./PdfSettings/PdfSettings";
import {
  FacilityContext,
  FacilityProvider,
} from "./PdfSettings/FacilityListContext";
import { StackedBarGraph } from "./GraphView/StackedBarGraph";
const DEFAULT_PAGE_NO = 1;
const DEFAULT_PAGE_SIZE = 10;
const GRAPH = "GRAPH";
const TABLE = "TABLE";
const getWeekStartDate = () => {
  return moment().startOf("week").toDate(); // Start of the current week (Sunday)
};

const getWeekEndDate = () => {
  return moment().endOf("week").toDate(); // End of the current week (Saturday)
};

const NewDashboard = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [startDate, setWeekStartDate] = useState(getWeekStartDate());
  const [endDate, setWeekEndDate] = useState(getWeekEndDate());
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [search, setSearch] = useState(null);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [page, setPage] = useState(DEFAULT_PAGE_NO);
  const [count, setCount] = useState();
  const [sort, setSort] = useState({ key: "", dir: "asc" });
  const [facilityId, setFacilityId] = useState(null);
  const [allJobTitles, setAllJobTitles] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [selectedJobTitleIds, setSelectedJobTitleIds] = useState([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
  const [selectedDay, setSelectedDay] = useState([]);
  const [facilityTitle, setFacilityTitle] = useState("");
  const [step, setStep] = useState(0);
  const [selectedWeekRow, setSelectedWeekRow] = useState();
  const [stepOneFilters, setStepOneFilters] = useState([]);
  const [stepTwoFilters, setStepTwoFilters] = useState([]);
  const [stepOneDate, setStepOneDate] = useState();
  const [stepTwoDate, setStepTwoDate] = useState();
  const [stepOnePagination, setStepOnePagination] = useState();
  const [stepTwoPagination, setStepTwoPagination] = useState();
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [isFacilityDetailsLoaded, setIsFacilityDetailsLoading] =
    useState(false);
  const [selectedFilters, setSelectedFilters] = useState([
    {
      value: "CLEAR_ALL",
      label: "Clear All",
      index: -1,
    },
  ]);

  const [view, setView] = useState(TABLE); // graph and table

  const { openModal, closeModal, actionType, modalData, isOpen } =
    useModal() || {};
  const [modalOpen, setModalOpen] = useState(false);

  const handleAlertOpen = (facility) => {
    setSelectedFacility(facility);
    setModalOpen(true);
  };

  const handleClose = (isRefreshPage) => {
    setModalOpen(false);
    if (isRefreshPage) {
      fetchStats();
    }
  };

  const classes = useStyles();

  useEffect(() => {
    if (view === TABLE) {
      getJobTitles();
      fetchStats();
      getFacilityList();
    }
  }, [view]);

  const updatedFiltersOnScreenChange = (filtersParam) => {
    const selectedDays = filtersParam
      .filter((filter) => filter.index == 1)
      ?.map((row) => row.value);
    const selectedJobIds = filtersParam
      .filter((filter) => filter.index == 0)
      ?.map((row) => row.value);
    setSelectedDay(selectedDays);
    setSelectedJobTitleIds(selectedJobIds);
  };

  useEffect(() => {
    if (view === TABLE) {
      if (isInitialRender) {
        setIsInitialRender(false);
        return;
      }

      if (step == 0) {
        fetchStats();
      } else if (step == 1) {
        fetchFacilityDetails();
      } else if (step == 2) {
        fetchFacilityEmployees();
      }
    }
  }, [
    selectedJobTitleIds,
    selectedFacilityIds,
    selectedDay,
    pageSize,
    page,
    step,
    sort,
    search,
    endDate,
  ]);

  const handleSortClick = (key) => {
    const newSort = {};
    if (sort.key === "" || sort.key !== key) {
      newSort.key = key;
      newSort.dir = "asc";
    } else {
      newSort.key = key;
      if (sort.dir === "asc") {
        newSort.dir = "desc";
      } else {
        newSort.key = "";
      }
    }
    setSort(newSort);
  };

  const getJobTitles = async () => {
    setLoading(true);
    const data = await JobTitleService.fetchJobTitles();
    const jobTitles = transformJobTitles(data);
    setAllJobTitles(jobTitles);
    setLoading(false);
  };

  const getFacilityList = async () => {
    setLoading(true);
    const data = await FacilityService.fetchFacilityList();
    const facilityList = transformJobTitles(data);
    setFacilityList(facilityList);
    setLoading(false);
  };

  const handleChangePageSize = (pageSize) => {
    setPageSize(pageSize);
  };
  const handlePageChange = (e, page) => {
    setPage(page);
  };

  const fetchStats = async () => {
    try {
      setIsFacilityDetailsLoading(true);
      const params = {
        position: selectedJobTitleIds,
        facility_id: selectedFacilityIds,
        day: selectedDay,
        page_size: pageSize,
        page: page,
      };

      if (search) {
        params.search = search;
      }

      let ordering = "";

      if (sort.key !== "") {
        if (sort.dir === "asc") {
          ordering = `${sort.key}`;
        } else {
          ordering = `-${sort.key}`;
        }
        params.ordering = ordering;
      }
      const urlParams = queryString.stringify(params);

      const startDateF = moment(startDate).format("YYYY-MM-DD");
      const endDateF = moment(endDate).format("YYYY-MM-DD");

      const response = await API.get(
        ENDPOINTS.FETCH_FACILITIES(startDateF, endDateF, urlParams)
      );
      if (response.success) {
        setStatsData(response?.data);
        setCount(response?.data?.count || 0);
      }
    } catch (error) {
      setStatsData([]);
    } finally {
      setIsFacilityDetailsLoading(false);
    }
  };

  const fetchFacilityDetails = async () => {
    try {
      setIsFacilityDetailsLoading(true);
      const params = {
        position: selectedJobTitleIds,
        day: selectedDay,
        page_size: pageSize,
        page: page,
      };

      let ordering = "";

      if (sort.key !== "") {
        if (sort.dir === "asc") {
          ordering = `${sort.key}`;
        } else {
          ordering = `-${sort.key}`;
        }
        params.ordering = ordering;
      }

      const urlParams = queryString.stringify(params);

      const startDateF = moment(startDate).format("YYYY-MM-DD");
      const endDateF = moment(endDate).format("YYYY-MM-DD");

      const response = await API.get(
        ENDPOINTS.FETCH_FACILITY_DETAILS(
          startDateF,
          endDateF,
          facilityId,
          urlParams
        )
      );
      if (response.success) {
        setStatsData(response?.data);
        setCount(response?.data?.count || 0);
      }
    } catch (error) {
      setStatsData([]);
    } finally {
      setIsFacilityDetailsLoading(false);
    }
  };

  const fetchFacilityEmployees = async () => {
    try {
      setLoading(true);
      setFacilityId(facilityId);
      const params = {
        position: selectedJobTitleIds,
        facility_id: selectedFacilityIds,
        day: selectedDay,
        page_size: pageSize,
        page: page,
      };

      if (search) {
        params.search = search;
      }

      let ordering = "";

      if (sort.key !== "") {
        if (sort.dir === "asc") {
          ordering = `${sort.key}`;
        } else {
          ordering = `-${sort.key}`;
        }
        params.ordering = ordering;
      }

      const urlParams = queryString.stringify(params);

      const startDateF = moment(startDate).format("YYYY-MM-DD");
      const endDateF = moment(endDate).format("YYYY-MM-DD");

      const response = await API.get(
        ENDPOINTS.FETCH_FACILITY_EMPLOYEE_DETAILS(
          startDateF,
          endDateF,
          facilityId,
          urlParams
        )
      );

      if (response.success) {
        setStatsData(response?.data);
        setCount(response?.data?.count || 0);
      }
    } catch (error) {
      setStatsData([]);
    } finally {
      setLoading(false);
    }
  };

  const onFacilityClick = (facilityId, facilityTitle) => {
    if (!facilityId) return;
    setStep(1);
    setStepOneFilters(selectedFilters);
    setStepOnePagination({ page, pageSize });
    setPage(DEFAULT_PAGE_NO);
    setPageSize(DEFAULT_PAGE_SIZE);
    setStepOneDate({ startDate, endDate });
    const updatedFilters = selectedFilters.filter((row) => row.index != 2);
    setSelectedFilters(updatedFilters);
    setFacilityTitle(facilityTitle);
    setFacilityId(facilityId);
    setSearch("");
  };

  const onTimelineClick = (row) => {
    setStepTwoFilters(selectedFilters);
    setSelectedWeekRow(row);
    setStepTwoDate({ startDate, endDate });
    setStepTwoPagination({ page, pageSize });
    setPage(DEFAULT_PAGE_NO);
    setPageSize(DEFAULT_PAGE_SIZE);
    const sDate = row?.date_range?.start_date;
    const eDate = row?.date_range?.end_date;
    setWeekStartDate(moment(sDate).toDate());
    setWeekEndDate(moment(eDate).toDate());
    setStep(2);
  };
  const handleAccept = (startDate, endDate) => {
    setWeekEndDate(endDate);
    setWeekStartDate(startDate);
  };
  const handleCancel = () => {
    // setIsModalOpen(false);
  };

  const handleBack = () => {
    if (step > 0) {
      if (step == 1) {
        const startDate = stepOneDate.startDate;
        const endDate = stepOneDate.endDate;
        const page = stepOnePagination.page;
        const pageSize = stepOnePagination.pageSize;
        setPage(page);
        setPageSize(pageSize);
        setWeekStartDate(startDate);
        setWeekEndDate(endDate);
        updatedFiltersOnScreenChange(stepOneFilters);
        setSelectedFilters(stepOneFilters);
        setStepOneFilters([]);
        setStepTwoFilters([]);
        setStepOneDate({ startDate: "", endDate: "" });
        setStepTwoDate({ startDate: "", endDate: "" });
      } else if (step == 2) {
        updatedFiltersOnScreenChange(stepTwoFilters);
        setSelectedFilters(stepTwoFilters);
        const startDate = stepTwoDate.startDate;
        const endDate = stepTwoDate.endDate;
        setWeekStartDate(startDate);
        setWeekEndDate(endDate);
        const page = stepTwoPagination.page;
        const pageSize = stepTwoPagination.pageSize;
        setPage(page);
        setPageSize(pageSize);
      }
      setStep((prevStep) => prevStep - 1);
    }
  };

  const filtersObj = [
    {
      paramName: PARAM_NAME.POSITION,
      items: allJobTitles,
      key: "position",
      // type: FilterConts.MULTIPLE_SELECT,
      setFunction: (value) => {
        setSelectedJobTitleIds(value);
      },
      value: selectedJobTitleIds,
      initialValue: [],
    },
    {
      paramName: PARAM_NAME.DAY,
      items: ITEMS.DAYS_OF_WEEK,
      key: "day",
      // type: FilterConts.MULTIPLE_SELECT,
      setFunction: (value) => {
        setSelectedDay(value);
      },
      value: selectedDay,
      initialValue: [],
    },
    {
      paramName: PARAM_NAME.FACILITY,
      items: facilityList,
      key: "facility",
      // type: FilterConts.MULTIPLE_SELECT,
      setFunction: (value) => {
        setSelectedFacilityIds(value);
      },
      value: selectedFacilityIds,
      initialValue: [],
    },
  ];

  if (step !== 0) {
    filtersObj.splice(2, 1);
  }

  return (
    <>
      {(loading || isFacilityDetailsLoaded) && <Loader />}
      <Grid container justifyContent="space-between">
        <Grid item>
          <div className="module-nav">
            <div className="mls">
              <div className="module-title">Dashboard</div>
            </div>
            <DateRangePicker
              title="Change date"
              initialDateRange={{
                startDate,
                endDate,
              }}
              open={true}
              onAccept={handleAccept}
              onCancel={handleCancel}
              dateStringFormatter="DD/MM/YYYY"
            />
          </div>
        </Grid>
        <Grid item className="flex select-container gap-10 items-center">
          <span
            className={`select-option ${view === GRAPH && "selected-option"}`}
            onClick={() => setView(GRAPH)}
          >
            Graph
          </span>
          <span
            className={`select-option ${view === TABLE && "selected-option"}`}
            onClick={() => setView(TABLE)}
          >
            List
          </span>
        </Grid>
      </Grid>

      {view === TABLE && (
        <>
          <Grid
            className="mt-10"
            container
            alignItems="center"
            justifyContent="space-between"
          >
            <div>
              {!step && (
                <Typography className={`${classes.title1}`}>
                  You have <span className={classes.pinkColor}>{count} </span>
                  Facilities
                </Typography>
              )}
              {step > 0 && (
                <div className="row-center cursor-pointer" onClick={handleBack}>
                  <ArrowBackButton />
                  <Typography className={`${classes.title1}`}>
                    {facilityTitle}
                  </Typography>
                </div>
              )}
            </div>

            <div
              className="pdf-btn cursor-pointer"
              onClick={() => openModal(ModalTypes.EDIT)}
            >
              Pdf Settings
            </div>
          </Grid>
          <Grid
            container
            className={classes.filterAndSearch}
            justifyContent="space-between"
          >
            <Filters
              gridSize={8}
              filterObject={filtersObj}
              onFilterSelected={(data) => setSelectedFilters(data)}
              selectedFiltersPopulate={selectedFilters}
            />
            {step != 1 && (
              <DrawerSearchInput
                //     value={this.state.search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                // setSearch={this.setSeacrh}
                label={`Find an ${step == 2 ? "Employee" : "Facility"}`}
                widthClass={classes.searchWidth}
              />
            )}
          </Grid>

          {step === 0 && (
            <FacilityTable
              data={statsData}
              onFacilityClick={onFacilityClick}
              handleSortClick={handleSortClick}
              sort={sort}
              handleAlertOpen={handleAlertOpen}
            />
          )}
          {step === 1 && (
            <FacilityDetailsTable
              data={statsData}
              onTimelineClick={onTimelineClick}
              handleSortClick={handleSortClick}
              sort={sort}
            />
          )}
          {step === 2 && (
            <FacilityEmployeesTable
              data={statsData}
              handleSortClick={handleSortClick}
              sort={sort}
            />
          )}
          <TablePagination
            count={count}
            page={page}
            rowsPerPage={pageSize}
            setRowsPerPage={handleChangePageSize}
            onChangePage={(e, page) => handlePageChange(e, page)}
          />
          <LimitAlertModal
            open={modalOpen}
            handleClose={handleClose}
            facility={selectedFacility}
          />
          <FacilityProvider value={{ facilityList }}>
            {isOpen && actionType === ModalTypes.EDIT && (
              <PdfSettings onClose={closeModal} />
            )}
          </FacilityProvider>
        </>
      )}

      {view === GRAPH && (
        <StackedBarGraph startDate={startDate} endDate={endDate} />
      )}
    </>
  );
};
export default NewDashboard;

const useStyles = makeStyles((theme) => ({
  title1: {
    fontSize: 26,
    fontWeight: 700,
    "@media (min-width:1279px)": {
      fontSize: 22,
    },
  },
  pinkColor: {
    color: theme.palette.primary.main,
  },
  filterAndSearch: {
    marginTop: 16,
  },
  searchWidth: {
    width: 380,
  },
}));
