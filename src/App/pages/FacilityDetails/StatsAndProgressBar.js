import React, { useEffect, useState } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import { StatsCard } from "App/components";
import ProgressBar from "App/components/ProgressBar";
import { Loader } from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import queryString from "query-string";

const StatsAndProgressBar = ({
  weekStartDate,
  weekEndDate,
  date,
  facility_id,
  forceRender,
  job_title_id,
}) => {
  const classes = useStyles();
  const [statsData, setStatsData] = useState(null);
  const [shiftWiseBUdgetedHrs, setShiftWiseBUdgetedHrs] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (date) {
      fetchStats();
    }
  }, [date, forceRender,job_title_id]);
  const fetchStats = async () => {
    const params = {
      job_title: job_title_id,
    };
    const urlParams = queryString.stringify(params);

    try {
      setLoading(true);
      const response = await API.get(
        ENDPOINTS.APPLICANTS_MODAT_STATS(
          facility_id,
          moment(date).format("YYYY-MM-DD"),
          moment(date).format("YYYY-MM-DD"),
          urlParams
        )
      );
      if (response.success) {
        setStatsData(response?.data?.hours);
        setShiftWiseBUdgetedHrs(response?.data?.shift_data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const statsMap = [
    {
      text: "BUDGETED HRS",
      key: "budgeted_hours",
    },
    {
      text: "PENDING HRS",
      key: "pending_hours",
    },
    {
      text: "SCHEDULED HRS",
      key: "confirmed_hours",
    },
    {
      text: "ACTUAL HRS",
      key: "actual_hours",
    },
  ];
  return (
    <>
      {loading && <Loader />}

      <Grid
        container
        className={classes.statsContainer}
        justify="center"
        alignItems="center"
      >
        {statsMap.map((statObj, index) => (
          <Grid
            item
            xs={3}
            key={index + 1}
            className={`${index !== 0 ? classes.cardMargin : ""} ${
              classes.cardContainer
            }`}
          >
            <StatsCard
              title={statObj.text}
              number={
                statsData ? Number(statsData[statObj?.key]).toFixed(2) : 0
              }
            />
          </Grid>
        ))}
      </Grid>
      <Grid container className={classes.barContainer}>
        {shiftWiseBUdgetedHrs?.map((shift, index) => {
          const { shift_name, budgeted_hours, confirmed_hours } = shift;
          return (
            <Grid
              container
              justify="center"
              alignItems="flex-end"
              className={`${index % 3 !== 0 ? classes.cardMargin : ""} ${
                classes.prgressBarContainer
              } ${index > 2 ? classes.marginTopStats : ""}`}
              item
              xs={4}
              key={shift?.shift_id}
            >
              <ProgressBar
                textBeforPercentTxt={`${shift_name} Budgeted Hrs- ${budgeted_hours}`}
                textBeforPercent={true}
                showOnlyProgress={true}
                value={
                  confirmed_hours > 0 && budgeted_hours> 0
                    ? (confirmed_hours / budgeted_hours) * 100
                    : 0
                }
              />{" "}
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default StatsAndProgressBar;
const useStyles = makeStyles({
  title: {
    fontWeight: 800,
    fontSize: 14,
  },
  number: {
    fontSize: 26,
    fontWeight: 700,
    color: "#FF0083",
  },
  statsContainer: {
    backgroundColor: "#F3F4F7",
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  barContainer: {
    backgroundColor: "#F3F4F7",
    padding: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  prgressBarContainer: {
    background: "#FFFFFF",
    height: 45,
    padding: 8,
    maxWidth: "32.86%",
    borderRadius: 4,
  },
  cardMargin: {
    marginLeft: "0.7%",
  },
  cardContainer: {
    maxWidth: "24.47%",
  },
  marginTopStats: {
    marginTop: 8,
  },
});
