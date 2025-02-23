import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  makeStyles,
  Grid,
  Typography,
} from "@material-ui/core";
import {
  Loader,
  WeekPicker,
  PinkPrimaryButton,
  CloseCrossButton,
} from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import { hasDayPassed } from "../../../utils/dateUtils";
import { API_TOKEN } from "../../../storage/StorageKeys";
import StorageManager from "../../../storage/StorageManager";
import $ from "jquery";

const useStyles = makeStyles({
  title: {
    fontWeight: "600",
    fontSize: "30px",
  },
  // paper: {
  //   width: 1100,
  //   height: "84vh",
  // },
  tableCell: {
    border: "8px solid #F3F4F7",
    width: "50%",
    padding: 10,
  },
  number: {
    color: "#FF0083",
    textAlign: "center",
    fontSize: 18,
  },
  marginBtm: {
    marginBottom: 15,
  },
  scroll: {
    overflowY: "auto",
    height: "61vh",
  },
  dialogContent: {
    overflowY: "none",
  },
  dialogContent: {
    padding: "40px 30px 30px 24px !important",
  },
  flex: {
    display: "flex",
  },
  paddingBottom: {
    paddingBottom: 10,
    backgroundColor: "unset !important",
  },
  whiteBg: {
    backgroundColor: "#FFFFFF",
  },
  grayBg: {
    backgroundColor: "#F3F4F7   ",
  },
  tableDiv: {
    // padding: 16,
  },
  shiftOpeningsTxt: {
    color: "#FF0083",
    fontSize: "1.6em",
    fontWeight: 700,
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
  },
  tableCell: {
    height: 76,
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginRight: "0.5%",
    boxSizing: "border-box",
    borderRadius: 4,
    marginTop: 8,
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
    padding:'4px 8px',
    fontSize: 17,
    fontWeight: "800 !important",
    color: "#020826",
    "@media (max-width:1100px)": {
      fontSize: 16,
    },
    "@media (max-width:1060px)": {
      fontSize: 15,
    },
    "@media (max-width:1000px)": {
      fontSize: 13,
    },
    "@media (max-width:890px)": {
      fontSize: 11,
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
  disableSet: {
    borderColor: "#929AB3 !important",
    color: "#929AB3 !important",
    backgroundColor: "#FFFFFF !important",
  },
});
const WeekDataModal = ({
  facility_id,
  onClose,
  startDate,
  endDate,
  facilityName,
}) => {
  // <================= All Use State =================>
  const [loading, setLoading] = useState(false);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [tableData, setTableData] = useState([]);
  // <====================== All Use Effects ============================>

  useEffect(() => {
    if (weekStartDate !== null) handleWeekData();
  }, [weekStartDate]);

  // <=============== API call ======================>

  const handleWeekData = async () => {
    try {
      setLoading(true);
      const startDate = moment(weekStartDate).format("YYYY-MM-DD");
      const endDate = moment(weekEndDate).format("YYYY-MM-DD");

      const response = await API.get(
        ENDPOINTS.Week_Budget_Data(facility_id, startDate, endDate)
      );
      if (response?.success) {
        setTableData(response?.data);
      }
    } catch (error) {
      // setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // <==================== All Helper Function =================>

  const numberAndTxt = (number, text, setBtn = false, date) => (
    <div className={`${classes.flexCenter} ${classes.coloumnFlex}`}>
      {!setBtn ? (
        <span className={number ? "" : classes.current}>
          {number ? number : "-"}
        </span>
      ) : (
        <>
          {number !== 0 && (
            <span className={number ? "" : classes.current}>
              {number ? number : "-"}
            </span>
          )}
          {!number && (
            <PinkPrimaryButton
              className={`${classes.setBtn}  ${
                hasDayPassed(date) ? classes.disableSet : ""
              }`}
              onClick={handleViewBudget.bind(null, date)}
              disabled={hasDayPassed(date)}
            >
              {"Set"}
            </PinkPrimaryButton>
          )}
        </>
      )}
      <span className={classes.footerTxt}>{text}</span>
    </div>
  );
  const handleViewBudget = (date) => {
    //Add authentication headers as params
    var params = {
      access_token: StorageManager.get(API_TOKEN),
      facility_id: facility_id,
      route_to: "Budget",
      date: moment(date).format("YYYY-MM-DD"),
      fromOwner: true,
    };

    //Add authentication headers in URL
    //  var url = ["http://localhost:3001/", $.param(params)].join("?");
    var url = [process.env.REACT_APP_URL, $.param(params)].join("?");
    var win = window.open(url);
  };

  const classes = useStyles();
  return (
    <>
      <Dialog
        open={true}
        maxWidth="lg"
        // fullWidth
        disableBackdropClick
        classes={{
          paper: classes.paper,
        }}
        // scroll={"paper"}
      >
        <DialogContent className={classes.dialogContent}>
          {loading && <Loader />}
          <Grid
            container
            justify="space-between"
            className={`${classes.marginBtm}`}
          >
            <Typography className={`${classes.title}`}>
              {facilityName}
            </Typography>
            <div className={classes.flex}>
              <WeekPicker
                setWeekStartDate={setWeekStartDate}
                setWeeEndDate={setWeeEndDate}
                weekStartDate={startDate}
              />
              <CloseCrossButton onClick={onClose} />
            </div>
          </Grid>
          <Grid container className={`${classes.whiteBg} ${classes.tableDiv}`}>
            <Grid
              container
              className={`${classes.grayBg} ${classes.tableContainer}`}
            >
              <Grid className={classes.tableRow} container>
                <div
                  className={`${classes.facilityName} ${classes.TableHead} ${classes.flexCenter} `}
                >
                  Date
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
                  className={`${classes.spend} ${classes.budgetedHrs} ${classes.TableHead} ${classes.flexCenter} `}
                >
                  Spend
                </div>
                <div
                  className={`${classes.openingsFilled} ${classes.TableHead} ${classes.flexCenter} `}
                >
                  Openings Filled
                </div>
              </Grid>
              {tableData.map((facility) => {
                return (
                  <Grid className={classes.tableRow} container>
                    <div
                      className={`${classes.facilityName} ${classes.tableCell} ${classes.flexCenter} ${classes.facilityNameTxt} `}
                    >
                      {`${moment(facility?.date).format("DD MMM")}, ${
                        facility?.day
                      }`}
                    </div>
                    <div
                      className={`${classes.budgetedHrs} ${classes.tableCell} ${classes.flexSpaceBetweein}`}
                    >
                      {numberAndTxt(
                        facility?.hours?.budgeted_hours,
                        "Budgeted",
                        true,
                        facility?.date
                      )}
                      {numberAndTxt(
                        facility?.hours?.confirmed_hours,
                        "Confirmed"
                      )}
                      {numberAndTxt(facility?.hours?.actual_hours, "Actual")}
                    </div>
                    <div
                      className={`${classes.budgetedHrs} ${classes.tableCell} ${classes.flexSpaceBetweein} `}
                    >
                      {numberAndTxt(
                        facility?.hppd?.budgeted_hppd_hours,
                        "Budgeted"
                      )}
                      {numberAndTxt(
                        facility?.hppd?.confirmed_hppd_hours,
                        "Confirmed"
                      )}
                      {numberAndTxt(
                        facility?.hppd?.actual_hppd_hours,
                        "Actual"
                      )}
                    </div>
                    <div
                      className={`${classes.spend} ${classes.budgetedHrs} ${classes.tableCell} ${classes.flexSpaceBetweein} `}
                    >
                      {numberAndTxt(
                        facility?.spend?.confirmed_spend,
                        "Confirmed"
                      )}
                      {numberAndTxt(facility?.spend?.actual_spend, "Actual")}
                    </div>
                    <div
                      className={`${classes.openingsFilled} ${classes.tableCell} ${classes.flexCenter} `}
                    >
                      {facility?.opening_filled ? (
                        `${facility?.opening_filled} %`
                      ) : (
                        <Typography className={classes.current}>
                          {"-"}
                        </Typography>
                      )}
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WeekDataModal;
