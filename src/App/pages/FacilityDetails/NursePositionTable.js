import React, { useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { getAbbreviatedPositionName } from "utils/textUtils";
import AllNursesModal from "./components/AllNursesModal";
import { HoverText } from "App/components";

const NursePositionTable = ({
  date,
  nurseData = {},
  positionData = [],
  facility_id,
  startDate,
  endDate,
  selectedType,
  allJobTitles,
}) => {
  // <============== All States =================>
  const [openAllNursesModal, setOpenAllNursesModal] = useState(false);

  // <============== All Use Effects =================>

  // <=============== All API calls ==================>

  // <=============== All Helper Functions ===============>
  const openNurseModal = () => {
    setOpenAllNursesModal(true);
  };
  const closeNurseModal = () => {
    setOpenAllNursesModal(false);
  };
  const numberAndTxt = (number, prefix = "") => (
    <span className={number ? "" : classes.current}>
      {number ? `${prefix && prefix} ${number.toLocaleString()}` : "-"}
    </span>
  );

  const getFormattedName = (name) => {
    const nsArray = name.split("_");
    return nsArray[0] + " " + nsArray[1] + " Hrs";
  };
  const classes = useStyles();
  return (
    <>
      <div className={classes.container}>
        <Grid container className={classes.headingContainer}>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} `}
          >
            Nurse Type
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Scheduled Hrs
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Actual Hrs
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Scheduled Spend
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.cellWidth}`}
          >
            Actual Spend
          </Grid>
        </Grid>
        {Object.entries(nurseData).map(([key, value], index) => {
          return (
            <>
              <Grid
                container
                className={`${classes.contentContainer} ${
                  index + 1 === 3 && classes.noMgnBtm
                }`}
              >
                <Grid
                  item
                  xs={2}
                  onClick={openNurseModal}
                  className={`cursor-pointer ${classes.center} ${classes.contentHeading} ${classes.contentCell} ${classes.cellWidth} ${classes.subHeading} ${classes.capitalize}`}
                >
                  {getFormattedName(key)}
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                >
                  {numberAndTxt(value?.confirmed_hours)}
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                >
                  {numberAndTxt(value?.actual_hours)}
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                >
                  {numberAndTxt(value?.confirmed_spend, "$")}
                </Grid>
                <Grid
                  item
                  xs={2}
                  className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.noMarginRight} ${classes.cellWidth}`}
                >
                  {numberAndTxt(value?.actual_spend, "$")}
                </Grid>
              </Grid>
            </>
          );
        })}
      </div>
      <div className={classes.container}>
        <Grid container className={classes.headingContainer}>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Position Overtime
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Scheduled Overtime Hrs
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Actual Overtime Hrs
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
          >
            Scheduled Overtime Spend
          </Grid>
          <Grid
            item
            xs={2}
            className={`${classes.center} ${classes.cellWidth}`}
          >
            Actual Overtime Spend
          </Grid>
        </Grid>
        {positionData?.length > 0 ? (
          positionData.map((position, index) => {
            return (
              <>
                <Grid
                  container
                  className={`${classes.contentContainer} ${
                    index + 1 === positionData?.length && classes.noMgnBtm
                  }`}
                >
                  <Grid
                    item
                    xs={2}
                    className={`${classes.center} ${classes.contentHeading} ${classes.contentCell} ${classes.cellWidth}`}
                  >
                    <HoverText
                      hovertxt={position?.job_title_name}
                      fullTxt={getAbbreviatedPositionName(position?.job_title_name)}
                      fulltxtClass={classes.contentHeading}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                  >
                    {numberAndTxt(
                      position?.overtime_hours?.confirmed_overtime_hours
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                  >
                    {numberAndTxt(
                      position?.overtime_hours?.actual_overtime_hours
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                  >
                    {numberAndTxt(
                      position?.overtime_hours?.confirmed_overtime_spend,
                      "$"
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.noMarginRight} ${classes.cellWidth}`}
                  >
                    {numberAndTxt(
                      position?.overtime_hours?.actual_overtime_spend,
                      "$"
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
      {openAllNursesModal && (
        <AllNursesModal
          dailyDate={date}
          facility_id={facility_id}
          startDate={startDate}
          endDate={endDate}
          selectedTypeFromParent={selectedType}
          onClose={closeNurseModal}
          allJobTitles={allJobTitles}
        />
      )}
    </>
  );
};
const useStyles = makeStyles((theme) => ({
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
  current: {
    color: "#17174A",
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
    height: 60,
    marginBottom: 7,
  },
  contentHeading: {
    fontWeight: "700",
    fontSize: "18px !important",
    color: "#020826",
    "@media (max-width:1100px)": {
      fontSize: "17px !important",
      fontWeight: "600",
    },
    "@media (max-width:925px)": {
      fontSize: "15px !important",
      fontWeight: "600",
    },
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
  cellWidth: {
    maxWidth: "19.4%",
    flexBasis: "19.4%",
  },
  subHeading: {
    color: theme.palette.primary.main,
  },
  noMgnBtm: {
    marginBottom: "0px !important",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  noPosition: {
    paddingLeft: 10,
    alignItems: "center",
  },
}));
export default NursePositionTable;
