import React, { useState } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { PinkPrimaryButton, HoverText } from "App/components";
import { hasDayPassed } from "utils/dateUtils";
import StorageManager from "storage/StorageManager";
import moment from "moment";
import { API_TOKEN } from "storage/StorageKeys";
import $ from "jquery";
import { getAbbreviatedPositionName } from "utils/textUtils";
import WeekDataModal from "App/pages/Dashboard/WeekDataModal";
import { PositionModal } from "./PositionModal";

const FacilityBudget = ({
  date,
  facility,
  positionData,
  selectedType,
  facility_id,
  weekStartDate,
  weekEndDate,
  handleOpenAssignEmployee,
  getFacilityDetails,
}) => {
  // <============== All States =================>
  const [openWeekModal, setOpenWeekModal] = useState(false);
  const [openPositionModal, setOpenPositionModal] = useState(false);
  // <============== All Use Effects =================>

  // <=============== All API calls ==================>

  // <=============== All Helper Functions ===============>

  const handleViewBudget = () => {
    //Add authentication headers as params
    var params = {
      access_token: StorageManager.get(API_TOKEN),
      facility_id: facility_id,
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

  const numberAndTxt = (number, text, setBtn = false, prefix = "") => (
    <div className={`${classes.flexCenter} ${classes.coloumnFlex}`}>
      {!setBtn ? (
        <span className={number ? "" : classes.current}>
          {number ? `${prefix && prefix}${number.toLocaleString()}` : "-"}
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
              className={`${classes.setBtn}
                 ${hasDayPassed(date) ? classes.disableSet : ""}
              `}
              onClick={(e) => {
                e.stopPropagation();
                handleViewBudget();
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

  const handleOpenWeekModal = () => {
    if (selectedType === "Weekly") {
      setOpenWeekModal(true);
    }
  };
  const handleCloseWeekModal = () => {
    setOpenWeekModal(false);
  };

  const handleOpenPositionModal = () => {
    if (selectedType === "Daily") setOpenPositionModal(true);
  };

  const handleClosePositionModal = () => {
    setOpenPositionModal(false);
    getFacilityDetails();
  };
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <Grid container className={classes.headingContainer}>
          <Grid
            item
            xs={1}
            className={`${classes.center} ${classes.mgnRt} ${classes.budget} `}
          ></Grid>
          <Grid
            item
            xs={3}
            className={`${classes.center} ${classes.mgnRt} ${classes.budgetHrs}`}
          >
            Budget Hrs
          </Grid>
          <Grid
            item
            xs={3}
            className={`${classes.center} ${classes.mgnRt} ${classes.budgetHrs}`}
          >
            HPPD
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.spend}`}
          >
            Spend ($)
          </Grid>
          <Grid item xs={1} className={`${classes.center} ${classes.filled}`}>
            Filled
          </Grid>
        </Grid>
        <Grid
          container
          className={`${classes.contentContainer} ${classes.noMgnBtm}`}
        >
          <Grid
            item
            xs={1}
            className={`${classes.center} ${classes.contentHeading} ${classes.contentCell} ${classes.budget}`}
          >
            Budget
          </Grid>
          <Grid
            item
            xs={3}
            onClick={handleOpenWeekModal}
            className={`${classes.center} ${classes.contentCell} ${
              classes.justifySpaceEvenly
            } ${classes.budgetHrs} ${
              !facility?.is_budget_complete &&
              facility?.budget_hours?.budgeted_hours &&
              selectedType === "Weekly"
                ? classes.pinkBorderBottom
                : ""
            } ${selectedType === "Weekly" ? "cursor-pointer" : ""}`}
          >
            {numberAndTxt(
              facility?.budget_hours?.budgeted_hours,
              "Budgeted",
              true
              // facility?.id
            )}
            {numberAndTxt(facility?.budget_hours?.confirmed_hours, "Scheduled")}
            {numberAndTxt(facility?.budget_hours?.actual_hours, "Actual")}
          </Grid>
          <Grid
            item
            xs={3}
            className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.budgetHrs}`}
          >
            {numberAndTxt(facility?.hppd?.budgeted_hppd_hours, "Budgeted")}
            {numberAndTxt(facility?.hppd?.confirmed_hppd_hours, "Scheduled")}
            {numberAndTxt(facility?.hppd?.actual_hppd_hours, "Actual")}
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.spend}`}
          >
            {numberAndTxt(
              facility?.spend?.confirmed_spend,
              "Scheduled",
              false,
              "$"
            )}
            {numberAndTxt(facility?.spend?.actual_spend, "Actual", false, "$")}
          </Grid>
          <Grid
            item
            xs={1}
            className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.noMarginRight} ${classes.filled}`}
          >
            {facility?.openings?.total_accepted_applicants ? (
              `${(
                Number(
                  facility?.openings?.total_accepted_applicants /
                    facility?.openings?.total_open_positions
                ) * 100
              ).toFixed(2)} %`
            ) : (
              <Typography className={classes.current}>{"-"}</Typography>
            )}
          </Grid>
        </Grid>
      </div>
      <div className={classes.container}>
        <Grid container className={classes.headingContainer}>
          <Grid
            item
            xs={1}
            className={`${classes.center} ${classes.mgnRt} ${classes.budget} `}
          >
            Position
          </Grid>
          <Grid
            item
            xs={3}
            className={`${classes.center} ${classes.mgnRt} ${classes.budgetHrs}`}
          >
            Budget Hrs
          </Grid>
          <Grid
            item
            xs={3}
            className={`${classes.center} ${classes.mgnRt} ${classes.budgetHrs}`}
          >
            HPPD
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.spend}`}
          >
            Spend ($)
          </Grid>
          <Grid item xs={1} className={`${classes.center} ${classes.filled}`}>
            Filled
          </Grid>
        </Grid>
        {positionData?.length > 0 ? (
          positionData?.map((position, index) => {
            return (
              <>
                <Grid
                  container
                  className={`${classes.contentContainer} ${
                    index + 1 === positionData?.length && classes.noMgnBtm
                  } ${selectedType === "Daily" && "cursor-pointer"}`}
                  onClick={handleOpenPositionModal}
                >
                  <Grid
                    item
                    xs={1}
                    className={`${classes.center} ${classes.contentHeading} ${classes.contentCell} ${classes.budget}`}
                  >
                    <HoverText
                      hovertxt={position?.job_title_name}
                      fullTxt={getAbbreviatedPositionName(
                        position?.job_title_name
                      )}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.budgetHrs}`}
                  >
                    {numberAndTxt(
                      position?.budget_hours?.budgeted_hours,
                      "Budgeted",
                      false
                      // facility?.id
                    )}
                    {numberAndTxt(
                      position?.budget_hours?.confirmed_hours,
                      "Scheduled"
                    )}
                    {numberAndTxt(
                      position?.budget_hours?.actual_hours,
                      "Actual"
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.budgetHrs}`}
                  >
                    {numberAndTxt(
                      position?.hppd?.budgeted_hppd_hours,
                      "Budgeted"
                    )}
                    {numberAndTxt(
                      position?.hppd?.confirmed_hppd_hours,
                      "Scheduled"
                    )}
                    {numberAndTxt(position?.hppd?.actual_hppd_hours, "Actual")}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.spend}`}
                  >
                    {numberAndTxt(
                      position?.spend?.confirmed_spend,
                      "Scheduled",
                      false,
                      "$"
                    )}
                    {numberAndTxt(
                      position?.spend?.actual_spend,
                      "Actual",
                      false,
                      "$"
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.noMarginRight} ${classes.filled}`}
                  >
                    {position?.openings?.total_accepted_applicants ? (
                      `${(
                        Number(
                          position?.openings?.total_accepted_applicants /
                            position?.openings?.total_open_positions
                        ) * 100
                      ).toFixed(2)} %`
                    ) : (
                      <Typography className={classes.current}>{"-"}</Typography>
                    )}
                  </Grid>
                </Grid>
              </>
            );
          })
        ) : (
          <>
            <Grid
              container
              className={`${classes.headingContainer} ${classes.noMgnBtm} ${classes.noPosition}`}
            >
              No Position Found.
            </Grid>
          </>
        )}
      </div>
      {openWeekModal && (
        <WeekDataModal
          onClose={handleCloseWeekModal}
          facility_id={facility_id}
          startDate={weekStartDate}
          endDate={weekEndDate}
          facilityName={facility?.name}
        />
      )}
      {openPositionModal && (
        <PositionModal
          handleOpenAssignEmployee={handleOpenAssignEmployee}
          onClose={handleClosePositionModal}
          facility_id={facility_id}
          startDate={date}
        />
      )}
    </>
  );
};

export default FacilityBudget;
const useStyles = makeStyles({
  container: {
    background: "#F3F4F7",
    borderRadius: "4px",
    padding: "8px",
    marginTop: 20,
  },
  headingContainer: {
    background: "#FFFFFF",
    color: "#929AB3",
    fontWeight: "700",
    fontSize: "16px",
    height: 40,
    marginBottom: 8,
    borderRadius: 4,
    "@media (max-width:1100px)": {
      fontSize: "15px !important",
      fontWeight: "600",
    },
    "@media (max-width:925px)": {
      fontSize: "14px !important",
      fontWeight: "600",
    },
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
  coloumnFlex: {
    flexDirection: "column",
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
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
    disableSet: {
      borderColor: "#929AB3 !important",
      color: "#929AB3 !important",
      backgroundColor: "#FFFFFF !important",
    },
  },
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  justifySpaceEvenly: {
    justifyContent: "space-evenly !important",
  },
  contentContainer: {
    height: 76,
    marginBottom: 7,
  },
  contentHeading: {
    fontWeight: "700",
    fontSize: "20px",
    color: "#020826",
  },
  contentCell: {
    marginRight: ".7%",
    background: "white",
    borderRadius: 4,
    fontSize: 20,
    fontWeight: 700,
    "@media (max-width:1000px)": {
      fontSize: "17px",
      fontWeight: "600",
    },
    "@media (max-width:850px)": {
      fontSize: "15px",
      fontWeight: "600",
    },
  },
  noMarginRight: {
    marginRight: "0px !important",
  },
  mgnRt: {
    marginRight: ".7%",
  },
  budget: {
    maxWidth: "10.333333%",
    flexBasis: "10.333333%",
  },
  budgetHrs: {
    maxWidth: "27%",
    flexBasis: "27%",
  },
  spend: {
    maxWidth: "19.666667%",
    flexBasis: "19.666667%",
  },
  filled: {
    maxWidth: "13%",
    flexBasis: "13%",
  },
  noMgnBtm: {
    marginBottom: "0px !important",
  },
  pinkBorderBottom: {
    borderBottom: "4px solid #FF0083",
  },
  noPosition: {
    paddingLeft: 10,
    alignItems: "center",
  },
});
