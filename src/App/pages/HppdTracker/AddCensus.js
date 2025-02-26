import React, { useEffect, useState } from "react";
import { Grid, InputBase, makeStyles, TextField } from "@material-ui/core";
import { NewDialogModal } from "App/components/modal/NewDialogModal"; // Ensure this is the correct path
import { ENDPOINTS } from "api/apiRoutes";
import { API } from "api/apiService";
import { LinearProgressBar, Loader, Toast } from "App/components";
import queryString from "query-string";

const useStyles = makeStyles((theme) => ({
  dialog: {
    maxWidth: "544px",
  },
  title: {
    fontWeight: 400,
    fontSize: 16,
    color: theme.palette.secondary.greyBlue,
    paddingBottom: "4px",
  },
  dateMain: {
    alignItems: "center",
    justifyContent: "space-between",
    fontWeight: 500,
    fontSize: "16px",
    marginBottom: "16px",
    color: theme.palette.secondary.greyBlue,
  },
  input: {
    width: "89px",
    "& .MuiInputBase-input": {
      fontSize: "14px !important",
      padding: "8px !important",
    },
  },
}));

const AddCensus = ({
  onClose,
  censusType,
  censusFacilityId,
  updateRowData,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [leftDates, setLeftDates] = useState([]);
  const [rightDates, setRightDates] = useState([]);
  const [leftData, setLeftData] = useState({});
  const [rightData, setRightData] = useState({});
  const isDayType = censusType === "day";
  const [initialLeftData, setInitialLeftData] = useState({});
  const [initialRightData, setInitialRightData] = useState({});
  useEffect(() => {
    // getCensusList()
  }, []);

  const getCensusList = async (leftDatesGenerated, rightDatesGenerated) => {
    try {
      setLoading(true);
      const today = new Date();
      const daysCount = censusType === "week" ? 30 : 60;

      const end_date = today.toISOString().split("T")[0]; // Today's date
      const start_date = new Date(
        today.setDate(today.getDate() - (daysCount - 1))
      )
        .toISOString()
        .split("T")[0];
      const params = {
        start_date,
        end_date,
        facility_id: censusFacilityId,
      };

      const urlParams = queryString.stringify(params);

      const resp = await API.get(ENDPOINTS.HPPD_CENSUS_LISTING(urlParams));
      if (resp.success) {
        const censusData = resp.data;

        // Convert census data to a lookup object for quick access
        const censusLookup = censusData.reduce((acc, item) => {
          acc[item.date] = item.patient_count;
          return acc;
        }, {});

        // Map the census data to leftData and rightData
        const leftDataMapped = leftDatesGenerated.reduce((acc, date) => {
          acc[date] = censusLookup[date] || "";
          return acc;
        }, {});

        const rightDataMapped = rightDatesGenerated.reduce((acc, date) => {
          acc[date] = censusLookup[date] || "";
          return acc;
        }, {});
        setInitialLeftData(leftDataMapped);
        setInitialRightData(rightDataMapped);
        setLeftData(leftDataMapped);
        setRightData(rightDataMapped);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const today = new Date();
    const daysCount = censusType === "week" ? 15 : 30;

    const formatDate = (date) => date.toISOString().split("T")[0]; // Ensure dates are in YYYY-MM-DD format

    const leftDatesGenerated = Array.from({ length: daysCount }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return formatDate(date); // Format date as YYYY-MM-DD
    });

    const rightDatesGenerated = Array.from({ length: daysCount }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i - daysCount);
      return formatDate(date); // Format date as YYYY-MM-DD
    });
    setLeftDates(leftDatesGenerated);
    setRightDates(rightDatesGenerated);
    getCensusList(leftDatesGenerated, rightDatesGenerated);
  }, [censusType]);

  // removable end
  const handleLeftInputChange = (date, value) => {
    if (/^\d*$/.test(value)) {
      // Allow only numeric input
      setLeftData((prevData) => ({
        ...prevData,
        [date]: value === "" ? 0 : value,
      }));
    }
  };

  const handleRightInputChange = (date, value) => {
    if (/^\d*$/.test(value)) {
      // Allow only numeric input
      setRightData((prevData) => ({
        ...prevData,
        [date]: value === "" ? 0 : value,
      }));
    }
  };

  const handleConfirm = async () => {
    const changedData = [];
    leftDates.forEach((date) => {
      if (leftData[date] !== initialLeftData[date]) {
        changedData.push({
          date: date,
          patient_count: leftData[date],
        });
      }
    });

    rightDates.forEach((date) => {
      if (rightData[date] !== initialRightData[date]) {
        changedData.push({
          date: date,
          patient_count: rightData[date],
        });
      }
    });
    const finalData = {
      census_data: changedData,
      facility_id: censusFacilityId,
      census_type: "FACILITY",
    };

    await getCensusUpdate(finalData);
  };

  const getCensusUpdate = async (finalData) => {
    try {
      setLoading(true);
      const resp = await API.patch(ENDPOINTS.HPPD_CENSUS_UPDATE, finalData);
      if (resp.success && resp.data) {
        updateRowData(censusFacilityId);
        onClose();
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-GB", options); // "12 Feb 2025"

    // Add ordinal suffix (st, nd, rd, th)
    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    return `${day}${suffix} ${formattedDate.split(" ")[1]}, ${
      formattedDate.split(" ")[2]
    }`;
  };
  return (
    <>
      <NewDialogModal
        dialogCls={classes.dialog}
        heading={
          isDayType
            ? "Census"
            : censusType == "week"
            ? "Weekly Census"
            : "Monthly Census"
        }
        isBackBtnNeeded={true}
        onBack={onClose}
        closeCrossBtnNeeded={false}
        onClose={onClose}
        handleConfirm={handleConfirm}
        loading={loading}
        isConfirmDisable={loading}
      >
        {!isDayType && (
          <h3 className={classes.title}>
            Add census for last {censusType == "week" ? 15 : 30} Days
          </h3>
        )}
        {isDayType && <h3 className={classes.title}>Census </h3>}
        {/* <Grid container spacing={4}>
        <Grid item xs={6}>
          {leftDates.map((date) => (
            <Grid
              container
              key={date}
              className={classes.dateMain}
            >
              <span>{date}</span>
              <TextField
                placeholder="Enter Here"
                variant="outlined"
                size="small"
                type="Number"
                value={leftData[date] || ""}
                onChange={(e) => handleLeftInputChange(date, e.target.value)}
                className={classes.input}
              />
            </Grid>
          ))}
        </Grid>
        <Grid item xs={6}>
          {rightDates.map((date) => (
            <Grid
              container
              key={date}
              className={classes.dateMain}

            >
              <span>{date}</span>
              <TextField
                placeholder="Enter Here"
                variant="outlined"
                size="small"
                value={rightData[date] || ""}
                onChange={(e) => handleRightInputChange(date, e.target.value)}
                className={classes.input}
              />
            </Grid>
          ))}
        </Grid>
      </Grid> */}
        <Grid container spacing={4}>
          <Grid item xs={6}>
            {leftDates.map((date) => (
              <Grid container key={date} className={classes.dateMain}>
                <span>{formatDate(date)}</span>
                <TextField
                  placeholder="Enter Here"
                  variant="outlined"
                  size="small"
                  type="Number"
                  value={leftData[date] || ""}
                  onChange={(e) => handleLeftInputChange(date, e.target.value)}
                  className={classes.input}
                />
              </Grid>
            ))}
          </Grid>
          <Grid item xs={6}>
            {rightDates.map((date) => (
              <Grid container key={date} className={classes.dateMain}>
                <span>{formatDate(date)}</span>
                <TextField
                  placeholder="Enter Here"
                  variant="outlined"
                  size="small"
                  type="Number"
                  value={rightData[date] || ""}
                  onChange={(e) => handleRightInputChange(date, e.target.value)}
                  className={classes.input}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </NewDialogModal>
    </>
  );
};

export default AddCensus;
