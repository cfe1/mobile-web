import React, { useState } from "react";
import { makeStyles, Grid, Typography } from "@material-ui/core";
import NewFacilityCard from "../card/newFacilityCard";
import StatsDetailsModal from "App/components/Views/StatsDetailsModal";

const CardGrid = (props) => {
  const { cardData ,selectedTypeFromParent,dailyDate,startDate} = props;
  const apiObject = cardData;
  const [openStatsDetails, setOpenStatsDetails] = useState(false);
  const [statsTitle, setStatsTitle] = useState("false");

  const handleOpenStatsDetails = (title) => {
    setOpenStatsDetails(true);
    setStatsTitle(title);
  };
  const handleCloseStatsDetails = () => {
    setOpenStatsDetails(false);
    setStatsTitle("");
  };
  const classes = useStyles();
  return (
    <div
      className={`${classes.flexDisplay} ${classes.padding} ${classes.margin}`}
    >
      <NewFacilityCard
        title="HPPD"
        current={apiObject?.hppd?.confirmed_hppd_hours}
        required={apiObject?.hppd?.budgeted_hppd_hours}
        //  subTitle="BUDGETED"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      <NewFacilityCard
        title="OPEN POSITIONS"
        current={apiObject?.open_positions?.total_accepted_applicants}
        required={apiObject?.open_positions?.total_open_positions}
        subTitle="FILLED"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      <NewFacilityCard
        title="OVERTIME"
        current={apiObject?.overtime_hours?.actual_overtime_hours}
        required={apiObject?.overtime_hours?.confirmed_overtime_hours}
        subTitle="HRS"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      <NewFacilityCard
        title="EXTERNAL HOURS"
        current={apiObject?.external_hours?.actual_external_nurse_hours}
        required={apiObject?.external_hours?.confirmed_external_nurse_hours}
        // subTitle="K"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      <NewFacilityCard
        title="AGENCY HOURS"
        current={apiObject?.agency_hours?.actual_agency_nurse_hours}
        required={apiObject?.agency_hours?.confirmed_agency_nurse_hours}
        // subTitle="K"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      <NewFacilityCard
        title="INTERNAL HOURS"
        current={apiObject?.internal_hours?.actual_internal_nurse_hours}
        required={apiObject?.internal_hours?.confirmed_internal_nurse_hours}
        // subTitle="K"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      <NewFacilityCard
        title="TOTAL SPENT"
        current={apiObject?.spend?.actual_spend}
        required={apiObject?.spend?.confirmed_spend}
        // subTitle="K PROJECTED"
        handleOpenStatsDetails={handleOpenStatsDetails}
      />
      {openStatsDetails && (
        <StatsDetailsModal
          dynamicData={bindingObject[statsTitle]}
          onClose={handleCloseStatsDetails}
          selectedTypeFromParent={selectedTypeFromParent}
          dailyDate={dailyDate}
          startDate={startDate}
        />
      )}
    </div>
  );
};

export default CardGrid;
const useStyles = makeStyles({
  flexDisplay: {
    display: "flex",
    justifyContent: "space-between",
    "@media (max-width:1350px)": {
      justifyContent: "unset",
      flexWrap: "wrap",
    },
  },
  padding: {
    padding: "10px 0px",
  },
  margin: {
    margin: "10px 0px 25px 0 ",
  },
});
const bindingObject = {
  HPPD: {
    title: "HPPD",
    bindingKeys: [
      "Facility Name",
      "Budgeted HPPD",
      "Scheduled HPPD",
      "Actual HPPD",
    ],
    coloumnWidth: [6, 2, 2, 2],
    apiEndPointKey: "hppd-detail",
    apiKeys: [
      "name",
      "budgeted_hppd_hours",
      "confirmed_hppd_hours",
      "actual_hppd_hours",
    ],
    sortActiveIndex: new Set([1,2, 3]),
  },
  "EXTERNAL HOURS": {
    title: "External Hours",
    bindingKeys: ["Facility Name", "Scheduled Hours", "Actul Hours"],
    coloumnWidth: [4, 4, 4],
    apiEndPointKey: "external-hours",
    apiKeys: [
      "name",
      "confirmed_external_nurse_hours",
      "actual_external_nurse_hours",
    ],
    sortActiveIndex: new Set([1, 2]),
  },
  "OPEN POSITIONS": {
    title: "Open Positions",
    bindingKeys: [
      "Facility Name",
      "Filled %",
      "Openings",
      "Scheduled",
      "Pending",
    ],
    coloumnWidth: [4, 2, 2, 2, 2],
    apiEndPointKey: "open-position",
    apiKeys: [
      "name",
      "openings_filled",
      "total_open_positions",
      "total_accepted_applicants",
      "total_pending_applicant",
    ],
    sortActiveIndex: new Set([1, 2, 3, 4]),
  },
  OVERTIME: {
    title: "Overtime",
    bindingKeys: [
      "Facility Name",
      "Scheduled Overtime Hrs",
      "Actual Overtime Hrs",
      "Scheduled Overtime Spend",
      "Actual Overtime Spend",
    ],
    coloumnWidth: [4, 2, 2, 2, 2],
    apiEndPointKey: "overtime-spend-detail",
    apiKeys: [
      "name",
      "confirmed_overtime_hours",
      "actual_overtime_hours",
      "confirmed_overtime_spend",
      "actual_overtime_spend",
    ],
    sortActiveIndex: new Set([1, 2, 3, 4]),
  },
  "INTERNAL HOURS": {
    title: "Internal Hours",
    bindingKeys: ["Facility Name", "Scheduled Hrs", "Actual Hrs", "Assigned"],
    coloumnWidth: [6, 2, 2, 2],
    apiEndPointKey: "internal-hours",
    apiKeys: [
      "name",
      "internal_confirmed_hours",
      "internal_actual_hours",
      "internal_assigned_hours",
    ],
    sortActiveIndex: new Set([1, 2, 3]),
  },
  "AGENCY HOURS": {
    title: "Agency Hours",
    bindingKeys: ["Facility Name", "Scheduled Hrs", "Actual Hrs"],
    coloumnWidth: [4, 4, 4],
    apiEndPointKey: "agency-hours",
    apiKeys: [
      "name",
      "confirmed_agency_nurse_hours",
      "actual_agency_nurse_hours",
    ],
    sortActiveIndex: new Set([1, 2]),
  },
  "TOTAL SPENT": {
    title: "TOTAL SPENT",
    bindingKeys: ["Facility Name", "Scheduled Spend", "Actual Spend"],
    coloumnWidth: [6, 3, 3],
    apiEndPointKey: "overtime-spend-detail",
    apiKeys: ["name", "confirmed_spend", "actual_spend"],
    sortActiveIndex: new Set([1, 2]),
  },
};
