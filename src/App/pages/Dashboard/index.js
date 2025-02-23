import React, { useEffect, useState } from "react";
import { Grid, makeStyles, Typography, Paper } from "@material-ui/core";
import {
  Loader,
  StatsView,
  DailyWeeklyFilter,
  PinkPrimaryButton,
  SearchInput,
  TablePagination,
  TableSort,
  FacilityfilterMultiSelecte,
} from "App/components";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import moment from "moment";
import { API, ENDPOINTS } from "api/apiService";
import { API_TOKEN, AGALIA_ID } from "../../../storage/StorageKeys";
import StorageManager from "../../../storage/StorageManager";
import $ from "jquery";
import WeekDataModal from "./WeekDataModal";
import ManagerInformationDialog from "./components/ManagerInformationDialog";
import queryString from "query-string";
import exclaimGray from "App/assets/icons/exclaimGray.svg";
import Tooltip from "@material-ui/core/Tooltip";
import { hasDayPassed } from "../../../utils/dateUtils";
import { useHistory, useLocation } from "react-router-dom";
const NewDashboard = (props) => {
  const history = useHistory();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState(
    location?.state?.content?.selectedType
      ? location?.state?.content?.selectedType
      : "Daily"
  );
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ key: "", dir: "asc" });
  const [facilityId, setFacilityId] = useState(null);
  const [facilityName, setFacilityName] = useState(null);
  const [openWeekModal, setOpenWeekModal] = useState(false);
  const classes = useStyles();

  /**************************All UseEffects *********************/
  useEffect(() => {});
  useEffect(() => {
    if (date) {
      fetchStats();
    }
  }, [date]);
  useEffect(() => {
    if (weekStartDate) {
      fetchStats();
    }
  }, [weekStartDate, sort]);
  useEffect(() => {
    if (date) {
      shiftOpeningsTableData();
    }
  }, [search, pageSize, currentPage]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const startDate = moment(
        selectedType === "Daily" ? date : weekStartDate
      ).format("YYYY-MM-DD");
      const endDate = moment(
        selectedType === "Daily" ? date : weekEndDate
      ).format("YYYY-MM-DD");

      const response = await API.get(ENDPOINTS.FETCH_STATS(startDate, endDate));
      if (response.success) {
        setStatsData(response?.data);
      }
    } catch (error) {
      setStatsData([]);
    } finally {
      setLoading(false);
      shiftOpeningsTableData();
    }
  };
  const shiftOpeningsTableData = async () => {
    const params = {
      page: currentPage,
      page_size: pageSize,
      search: search,
    };

    const urlParams = queryString.stringify(params, {
      encode: false,
      arrayFormat: "bracket",
    });
    try {
      setLoading(true);
      const startDate = moment(
        selectedType === "Daily" ? date : weekStartDate
      ).format("YYYY-MM-DD");
      const endDate = moment(
        selectedType === "Daily" ? date : weekEndDate
      ).format("YYYY-MM-DD");

      const response = await API.get(
        ENDPOINTS.SHIFT_OPENINGS_TABLE_DATA(startDate, endDate, urlParams)
      );
      if (response?.success) {
        setTableData(response?.data);
      }
    } catch (error) {
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // =========== Other functions
  const numberAndTxt = (
    number,
    text,
    setBtn = false,
    facilityId,
    prefix = ""
  ) => (
    <div className={`${classes.flexCenter} ${classes.coloumnFlex}`}>
      {!setBtn ? (
        <span className={number ? "" : classes.current}>
          {number ? `${prefix && prefix} ${number.toLocaleString()}` : "-"}
        </span>
      ) : (
        <>
          {number !== 0 && (
            <span className={number ? "" : classes.current}>
              {" "}
              {number ? number : "-"}
            </span>
          )}
          {!number && (
            <PinkPrimaryButton
              className={`${classes.setBtn}    ${
                hasDayPassed(date) ? classes.disableSet : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                handleViewBudget(facilityId);
              }}
              disabled={hasDayPassed(date)}
            >
              Set
            </PinkPrimaryButton>
          )}
        </>
      )}
      <span className={classes.footerTxt}>{text}</span>
    </div>
  );
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

  // <============= All Helper Functions ===============>

  const handleOpenWeekModal = (facilityId, facilityName) => {
    if (selectedType === "Weekly") {
      setOpenWeekModal(true);
      setFacilityId(facilityId);
      setFacilityName(facilityName);
    }
  };

  const handleCloseWeekModal = () => {
    setOpenWeekModal(false);
    shiftOpeningsTableData();
    setFacilityId(null);
    setFacilityName(null);
  };

  const handleViewBudget = (id) => {
    //Add authentication headers as params
    let params = {
      access_token: StorageManager.get(API_TOKEN),
      facility_id: id,
      route_to: "Budget",
      date: moment(selectedType === "Daily" ? date : weekStartDate).format(
        "YYYY-MM-DD"
      ),
      fromOwner: true,
    };

    //Add authentication headers in URL
    //var url = ["http://localhost:3001/", $.param(params)].join("?");
    var url = [process.env.REACT_APP_URL, $.param(params)].join("?");
    var win = window.open(url);
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
  const handlePushFacilityDetails = (facilityID) => {
    history.push({
      pathname: `/dashboard/facility-details/${facilityID}`,
      state: {
        content: {
          selectedType: selectedType,
          date: moment(date).format("YYYY-MM-DD"),
          weekStartDate: moment(weekStartDate).format("YYYY-MM-DD"),
        },
      },
    });
  };

  return (
    <>
      {loading && <Loader />}
      <div className="module-nav">
        <div className="mls">
          <div className="module-title">Dashboard</div>
          <div className="module-breadcrumb">
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              <Link color="inherit">Agalia</Link>
              <Typography style={{ color: "#FF0083" }}>Dashboard</Typography>
            </Breadcrumbs>
          </div>
        </div>
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
      </div>
      <Paper className={classes.paddingBottom}>
        <Grid item xs={12}>
          <StatsView
            cardData={statsData}
            selectedTypeFromParent={selectedType}
            dailyDate={date}
            startDate={weekStartDate}
          />
        </Grid>
        <Grid container className={`${classes.whiteBg} ${classes.tableDiv}`}>
          <Grid container justify="space-between">
            <Grid className={`${classes.shiftOpeningsTxt}`}>
              Shift Openings
            </Grid>
            <SearchInput
              style={{ marginRight: 20, height: 40 }}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              onClose={(e) => {
                setSearch("");
              }}
            />
          </Grid>

          <Grid
            container
            className={`${classes.grayBg} ${classes.tableContainer} ${
              hasDayPassed(date) ? classes.disableTableCOntainer : ""
            }`}
          >
            <Grid className={classes.tableRow} container>
              <div
                className={`${classes.facilityName} ${classes.TableHead} ${classes.flexCenter} `}
              >
                Facility Name
              </div>
              <div
                className={`${classes.budgetedHrs} ${classes.TableHead} ${classes.flexCenter} `}
              >
                Budgeted Hrs
              </div>
              <div
                className={`${classes.budgetedHrs} ${classes.TableHead} ${classes.flexCenter} `}
              >
                HPPD
              </div>
              <div
                className={`${classes.spend} ${classes.TableHead} ${classes.flexCenter} `}
              >
                Spend
              </div>
              <div
                className={`${classes.openingsFilled} ${classes.TableHead} ${classes.flexCenter} `}
                onClick={() => handleSortClick("openings_filled")}
              >
                Openings Filled
                <TableSort
                  active={sort.key === "openings_filled"}
                  direction={sort.dir}
                />
              </div>
            </Grid>
            {tableData.length > 0 ? (
              tableData.map((facility) => {
                return (
                  <Grid className={classes.tableRow} container>
                    <div
                      className={`${classes.facilityName} ${classes.tableCell} ${classes.flexCenter} ${classes.facilityNameTxt} cursor-pointer`}
                      onClick={handlePushFacilityDetails.bind(
                        null,
                        facility?.id
                      )}
                    >
                      <span> {facility?.name}</span>
                    </div>
                    <div
                      className={`${classes.budgetedHrs} ${classes.tableCell} ${
                        classes.flexSpaceBetweein
                      } ${
                        !facility?.is_budget_complete &&
                        facility?.budget_hours?.budgeted_hours &&
                        selectedType === "Weekly"
                          ? classes.pinkBorderBottom
                          : ""
                      } ${selectedType === "Weekly" ? "cursor-pointer" : ""}`}
                      onClick={handleOpenWeekModal.bind(
                        null,
                        facility?.id,
                        facility?.name
                      )}
                    >
                      {numberAndTxt(
                        facility?.budget_hours?.budgeted_hours,
                        "Budgeted",
                        true,
                        facility?.id
                      )}
                      {numberAndTxt(
                        facility?.budget_hours?.confirmed_hours,
                        "Scheduled"
                      )}
                      {numberAndTxt(
                        facility?.budget_hours?.actual_hours,
                        "Actual"
                      )}
                    </div>
                    <div
                      className={`${classes.budgetedHrs} ${classes.tableCell} ${
                        classes.flexSpaceBetweein
                      } ${
                        !facility?.is_budget_complete &&
                        facility?.budget_hours?.budgeted_hours &&
                        selectedType === "Weekly"
                          ? classes.pinkBorderBottom
                          : ""
                      }`}
                    >
                      {numberAndTxt(
                        facility?.hppd?.budgeted_hppd_hours,
                        "Budgeted"
                      )}
                      {numberAndTxt(
                        facility?.hppd?.confirmed_hppd_hours,
                        "Scheduled"
                      )}
                      {numberAndTxt(
                        facility?.hppd?.actual_hppd_hours,
                        "Actual"
                      )}
                      {!facility?.is_budget_complete &&
                        selectedType === "Weekly" && (
                          <div className={classes.toolTipPosition}>
                            <Tooltip
                              title={
                                <div className={classes.toolTipDiv}>
                                  <div
                                    style={{
                                      backgroundColor: "#F3F4F7",
                                      color: "black",
                                      padding: "4px 8px",
                                    }}
                                  >
                                    Set the budget for all day for this week
                                  </div>
                                </div>
                              }
                              arrow
                              classes={{
                                tooltip: classes.toolTip,
                                arrow: classes.arrow,
                              }}
                              followCursor
                            >
                              <img src={exclaimGray} />
                            </Tooltip>
                          </div>
                        )}
                    </div>
                    <div
                      className={`${classes.spend} ${classes.tableCell} ${classes.flexSpaceBetweein} `}
                    >
                      {numberAndTxt(
                        facility?.spend?.confirmed_spend,
                        "Scheduled",
                        false,
                        false,
                        "$"
                      )}
                      {numberAndTxt(
                        facility?.spend?.actual_spend,
                        "Actual",
                        false,
                        false,
                        "$"
                      )}
                    </div>
                    <div
                      className={`${classes.openingsFilled} ${classes.tableCell} ${classes.flexCenter} `}
                    >
                      {facility?.openings?.total_accepted_applicants ? (
                        `${(
                          Number(
                            facility?.openings?.total_accepted_applicants /
                              facility?.openings?.total_open_positions
                          ) * 100
                        ).toFixed(2)} %`
                      ) : (
                        <Typography className={classes.current}>
                          {"-"}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                );
              })
            ) : (
              <Grid
                className={`${classes.noDataFound} ${classes.whiteBg}`}
                container
              >
                No data found
              </Grid>
            )}
          </Grid>
        </Grid>
        {tableData.length > 0 && (
          <TablePagination
            count={tableData.length}
            page={currentPage}
            rowsPerPage={pageSize}
            setRowsPerPage={(size) => {
              setPageSize(size);
              setCurrentPage(currentPage);
            }}
            onChangePage={(e, page) => {
              setCurrentPage(page);
            }}
          />
        )}
      </Paper>
      {openWeekModal && facilityId && facilityName && (
        <WeekDataModal
          onClose={handleCloseWeekModal}
          facility_id={facilityId}
          startDate={weekStartDate}
          endDate={weekStartDate}
          facilityName={facilityName}
        />
      )}
    </>
  );
};

export default NewDashboard;

const useStyles = makeStyles({
  paddingBottom: {
    paddingBottom: 10,
    backgroundColor: "unset !important",
    marginTop: -20,
  },
  whiteBg: {
    backgroundColor: "#FFFFFF",
  },
  grayBg: {
    backgroundColor: "#F3F4F7   ",
  },
  tableDiv: {
    padding: 16,
    borderRadius: 4,
  },
  shiftOpeningsTxt: {
    color: "#FF0083",
    fontSize: "1.6em",
    fontWeight: 700,
    marginLeft: 20,
  },
  tableContainer: {
    padding: 8,
    width: "100%",
    marginTop: 16,
    borderRadius: 4,
    paddingRight: 0,
  },
  tableRow: {
    width: "100%",
  },
  facilityName: {
    width: "16%",
  },
  budgetedHrs: {
    width: "23%",
  },
  spend: {
    width: "20%",
  },
  openingsFilled: {
    width: "15.32%",
  },
  TableHead: {
    height: 40,
    fontSize: 16,
    fontWeight: 700,
    color: "#929AB3",
    marginRight: "0.5%",
    boxSizing: "border-box",
    "@media (max-width:1000px)": {
      fontSize: 14,
      fontWeight: "600",
    },
    "@media (max-width:810px)": {
      fontSize: 12,
      fontWeight: "600",
    },
  },
  tableCell: {
    textAlign: "center",
    height: 70,
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginRight: "0.5%",
    boxSizing: "border-box",
    borderRadius: 4,
    marginTop: 8,
    position: "relative",
    "@media (max-width:1000px)": {
      fontSize: "17px",
      fontWeight: "600",
      height: 63,
    },
    "@media (max-width:850px)": {
      fontSize: "15px",
      fontWeight: "600",
      height: 56,
    },
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  facilityNameTxt: {
    fontSize: 14,
    fontWeight: "800 !important",
    padding: "4px 10px",
    "@media (max-width:1150px)": {
      fontSize: 12,
      fontWeight: "600",
    },
    "@media (max-width:1010px)": {
      fontSize: 10,
      fontWeight: "600",
      height: 63,
      padding: "3px 4px",
    },
  },
  coloumnFlex: {
    flexDirection: "column",
  },
  footerTxt: {
    fontSize: 12,
    fontWeight: 600,
    color: "#82889C",
    "@media (max-width:1000px)": {
      fontSize: "10px",
    },
    "@media (max-width:850px)": {
      fontSize: "9px",
    },
  },
  flexSpaceBetweein: {
    justifyContent: "space-evenly",
    display: "flex",
    alignItems: "center",
  },
  current: {
    color: "#82889C",
  },
  setBtn: {
    width: "100%",
    color: "#FF0083 !important",
    padding: 0,
    height: 32,
    backgroundColor: "#FFFFFF !important",
    //borderColor:'#FF0083 !important',
    border: "2px solid #FF0083 !important",
    marginLeft: "0px !important",
  },
  noDataFound: {
    marginLeft: "0px 40px",
    padding: "12px 18px",
    marginRight: 13,
    borderRadius: 4,
  },
  pinkBorderBottom: {
    borderBottom: "4px solid #FF0083",
  },
  toolTip: {
    background: "#FFFFFF",
    boxShadow: "-4px 3px 30px rgba(33, 35, 45, 0.15)",
    width: 130,
    marginTop: 10,
    marginLeft: 0,
    padding: 8,
    borderRadius: 8,
    paddingTop: 2,
  },
  arrow: {
    height: 10,
    "&::before": {
      background: "#FFFFFF",
      boxShadow: "-4px 3px 30px rgba(33, 35, 45, 0.15)",
    },
  },
  toolTipDiv: {
    background: "#FFFFFF",
    //boxShadow: "-4px 3px 30px rgba(33, 35, 45, 0.15)",
    borderRadius: 8,
    // padding: 8,
    marginTop: 7,
  },
  toolTipPosition: { position: "absolute", right: "2%", top: "7%" },
  disableTableCOntainer: {
    opacity: 0.7,
  },
  disableSet: {
    borderColor: "#929AB3 !important",
    color: "#929AB3 !important",
    backgroundColor: "#FFFFFF !important",
  },
});
