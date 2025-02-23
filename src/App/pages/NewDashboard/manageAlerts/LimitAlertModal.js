import React, { useState, useEffect } from "react";
import { API, ENDPOINTS } from "api/apiService";
import {
  Modal,
  Grid,
  Button,
  TextField,
  Tabs,
  Tab,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Toast } from "App/components";
import CloseIcon from "../../../assets/icons/close-gray.svg";

const useStyles = makeStyles({
  modalContent: {
    position: "absolute",
    width: 600,
    backgroundColor: "#fff",
    padding: "16px 32px 24px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "4px",
    outline: 0,
    maxHeight: "90vh",
    overflowY: "auto",
  },
  heading: {
    width: "60%",
  },
  topContainer: {
    display: "flex",
    flexDirection: "column",
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formControl: {
    margin: "24px 0",
  },
  confirmButton: {
    marginTop: "24px",
    backgroundColor: "#FF007F",
    color: "#FFF",
    "&:hover": {
      backgroundColor: "#E60073",
    },
  },
  tabContent: {
    marginTop: "16px",
  },
  errorText: {
    color: "red",
    fontSize: "12px",
    marginTop: "8px",
  },
  activeButton: {
    backgroundColor: "#434966",
    border: "none",
    color: "white",
    padding: "4px 8px",
    borderRadius: "4px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    width: "100px",
  },
  inactiveButton: {
    border: "none",
    color: "#929AB3",
    padding: "4px 8px 4px 8px",
    borderRadius: "4px",
    textAlign: "center",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "16px",
    margin: "4px 2px",
    cursor: "pointer",
    width: "100px",
  },
  buttonContainer: {
    display: "flex",
    width: "337px",
    height: "44px",
    marginTop: "15px",
  },
  confirmButtonContainer: {
    display: "flex",
    justifyContent: "center",
  },
  closeButton: {
    cursor: "pointer",
  },
});

const fields = [
  "posted_hours",
  "scheduled_hours",
  "actual_hours",
  "overtime_hours",
  "confirmed_spend",
  "actual_spend",
];

const initialState = {
  posted_hours_min: null,
  posted_hours_max: null,
  scheduled_hours_min: null,
  scheduled_hours_max: null,
  actual_hours_min: null,
  actual_hours_max: null,
  overtime_hours_min: null,
  overtime_hours_max: null,
  confirmed_spend_min: null,
  confirmed_spend_max: null,
  actual_spend_min: null,
  actual_spend_max: null,
};

export const LimitAlertModal = ({ open, handleClose, facility }) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [dailyData, setDailyData] = useState(initialState);
  const [weeklyData, setWeeklyData] = useState(initialState);
  const [facilityLimitData, setFacilityLimitData] = useState([]);
  const [errors, setErrors] = useState({ daily: {}, weekly: {} });

  const fetchFacilityLimitData = async () => {
    const res = await API.get(ENDPOINTS.FACILITY_LIMIT(facility.id));
    if (res && res.data.length) {
      setFacilityLimitData(res.data);
    }
  };

  useEffect(() => {
    if (facility && open && facility.has_threshold_limit) {
      fetchFacilityLimitData();
    }
  }, [facility.id, open]);

  useEffect(() => {
    if (facilityLimitData && facilityLimitData.length) {
      const dailyLimits = facilityLimitData.find(
        (item) => item.frequency === "DAILY"
      );
      const weeklyLimits = facilityLimitData.find(
        (item) => item.frequency === "WEEKLY"
      );

      if (dailyLimits) {
        delete dailyLimits["frequency"];
        setDailyData(dailyLimits);
      }
      if (weeklyLimits) {
        delete weeklyLimits["frequency"];
        setWeeklyData(weeklyLimits);
      }
    }
  }, [facilityLimitData]);

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  const assignInitialState = () => {
    setSelectedTab(0);
    setDailyData(initialState);
    setWeeklyData(initialState);
    setFacilityLimitData([]);
    setErrors({ daily: {}, weekly: {} });
  };

  const handleChange = (frequency, field, limit, value) => {
    value = parseFloat(value).toFixed(2);
    const parsedValue = value === "" ? null : parseFloat(value);
    if (frequency === "DAILY") {
      setDailyData((prevData) => ({
        ...prevData,
        [`${field}_${limit}`]: parsedValue,
      }));
    } else {
      setWeeklyData((prevData) => ({
        ...prevData,
        [`${field}_${limit}`]: parsedValue,
      }));
    }
  };

  const handleBlur = (field) => {
    const minField = `${field}_min`;
    const maxField = `${field}_max`;
    const newErrors = {};

    const data = selectedTab === 0 ? dailyData : weeklyData;

    if (data[minField] !== null && data[maxField] !== null) {
      if (data[minField] >= data[maxField]) {
        newErrors[minField] =
          "Minimum value cannot be greater or equal than maximum value";
        newErrors[maxField] =
          "Maximum value cannot be less or equal than minimum value";
      } else {
        newErrors[minField] = "";
        newErrors[maxField] = "";
      }
    }

    const errorField = selectedTab === 0 ? "daily" : "weekly";

    setErrors((prev) => ({
      ...prev,
      [errorField]: { ...prev[errorField], ...newErrors },
    }));
  };

  const validateFields = (data) => {
    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
      const minField = `${field}_min`;
      const maxField = `${field}_max`;

      if (data[minField] !== null && data[maxField] !== null) {
        if (data[minField] >= data[maxField]) {
          newErrors[minField] =
            "Minimum value cannot be greater or equal than maximum value";
          isValid = false;
        }
        if (data[maxField] <= data[minField]) {
          newErrors[maxField] =
            "Maximum value cannot be less or equal than minimum value";
          isValid = false;
        }
      }
    });

    return { isValid, newErrors };
  };

  const handleCloseModal = (isRefreshPage = false) => {
    assignInitialState();
    handleClose(isRefreshPage);
  };

  const handleSubmit = async () => {
    const dailyValidation = validateFields(dailyData);
    const weeklyValidation = validateFields(weeklyData);

    if (dailyValidation.isValid && weeklyValidation.isValid) {
      const data = {
        daily: dailyData,
        weekly: weeklyData,
      };
      try {
        const resp = await API.patch(
          ENDPOINTS.FACILITY_LIMIT(facility.id),
          data
        );
        if (resp?.success) {
          Toast.showInfoToast(resp?.data?.message);
        } else {
          Toast.showErrorToast("Something went wrong");
        }
      } catch (err) {
        Toast.showErrorToast("Something went wrong");
      }
      handleCloseModal(true);
    } else {
      setErrors({
        daily: dailyValidation.newErrors,
        weekly: weeklyValidation.newErrors,
      });
    }
  };

  const getLabel = (field) => {
    field = field == "confirmed_spend" ? "scheduled_spend" : field;
    return field
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const renderFields = (frequency, data, errorData) => (
    <Grid container spacing={3}>
      {fields.map((field) => (
        <Grid item xs={12} key={field}>
          <label>{getLabel(field)}</label>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Enter Minimum Limit`}
                placeholder="Enter Minimum Limit"
                variant="outlined"
                margin="normal"
                value={
                  data[`${field}_min`] !== null ? data[`${field}_min`] : ""
                }
                onChange={(e) =>
                  handleChange(frequency, field, "min", e.target.value)
                }
                type="number"
                error={Boolean(errorData[`${field}_min`])}
                onBlur={() => handleBlur(field)}
              />
              {errorData[`${field}_min`] && (
                <Typography className={classes.errorText}>
                  {errorData[`${field}_min`]}
                </Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Enter Maximum Limit`}
                placeholder="Enter Maximum Limit"
                variant="outlined"
                margin="normal"
                value={
                  data[`${field}_max`] !== null ? data[`${field}_max`] : ""
                }
                onChange={(e) =>
                  handleChange(frequency, field, "max", e.target.value)
                }
                type="number"
                error={Boolean(errorData[`${field}_max`])}
                onBlur={() => handleBlur(field)}
              />
              {errorData[`${field}_max`] && (
                <Typography className={classes.errorText}>
                  {errorData[`${field}_max`]}
                </Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Modal open={open} onClose={() => handleCloseModal()}>
      <div className={classes.modalContent}>
        <div className={classes.topContainer}>
          <div className={classes.subContainer}>
            <div className={classes.heading}>
              <h2>{facility?.name}</h2>
            </div>
            <div className={classes.buttonContainer}>
              <Typography
                className={
                  selectedTab == 0
                    ? classes.activeButton
                    : classes.inactiveButton
                }
                onClick={() => handleTabChange(0)}
              >
                Daily
              </Typography>
              <Typography
                className={
                  selectedTab == 1
                    ? classes.activeButton
                    : classes.inactiveButton
                }
                onClick={() => handleTabChange(1)}
              >
                Weekly
              </Typography>
            </div>
            <img
              src={CloseIcon}
              className={classes.closeButton}
              onClick={() => handleCloseModal()}
              alt=""
            />
          </div>
          <Typography
            style={{
              fontFamily: "Manrope",
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "21.86px",
              textAlign: "left",
              color: "#82889C",
            }}
          >
            The metrics that you set here will be shown in the daily pdf.
          </Typography>
        </div>
        <div className={classes.tabContent}>
          {selectedTab === 0
            ? renderFields("DAILY", dailyData, errors.daily)
            : renderFields("WEEKLY", weeklyData, errors.weekly)}
        </div>
        <div className={classes.confirmButtonContainer}>
          <Button
            className={classes.confirmButton}
            variant="contained"
            onClick={handleSubmit}
          >
            Confirm
          </Button>
        </div>
      </div>
    </Modal>
  );
};
