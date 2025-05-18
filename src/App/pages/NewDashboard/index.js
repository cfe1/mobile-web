import React, { useEffect, useState } from "react";
import { API, ENDPOINTS } from "api/apiService";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Paper, Button, Grid, Chip } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { useHistory } from "react-router-dom";
import StorageManager from "storage/StorageManager";
import { FACILITY_API_TOKEN } from "storage/StorageKeys";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    maxWidth: 900,
    margin: "0 auto",
    borderRadius: 20,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
  },
  header: {
    fontWeight: 700,
    fontSize: "24px",
    marginBottom: theme.spacing(3),
  },
  facilityItem: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    backgroundColor: "#FFF0F5",
    borderRadius: "50%",
    width: 50,
    height: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(2),
    "& svg": {
      color: "#E75480",
    },
  },
  facilityInfo: {
    flexGrow: 1,
  },
  facilityName: {
    fontWeight: 600,
    fontSize: "16px",
  },
  nurseLabel: {
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: "4px 12px",
    fontSize: "12px",
  },
  notificationIcon: {
    marginRight: theme.spacing(2),
    color: "#E75480",
  },
  statusActive: {
    color: "#4CAF50",
    fontSize: "14px",
    marginRight: theme.spacing(2),
  },
  statusInvited: {
    color: "#E75480",
    fontSize: "14px",
    marginRight: theme.spacing(2),
  },
  selectButton: {
    borderRadius: 20,
    textTransform: "none",
    padding: "6px 24px",
    fontWeight: 500,
    border: "1px solid #E75480",
    color: "#E75480",
    "&:hover": {
      backgroundColor: "rgba(231, 84, 128, 0.08)",
    },
  },
  selectButtonInvited: {
    borderRadius: 20,
    textTransform: "none",
    padding: "6px 24px",
    fontWeight: 500,
    color: "#fff",
    backgroundColor: "#E75480",
    border: "1px solid #E75480",
    "&:hover": {
      backgroundColor: "#D64D77",
    },
  },
}));

const FacilityList = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState([]);
  const [selectLoading, setSelectLoading] = useState(false);

  const handleGetFacilityData = async () => {
    try {
      setLoading(true);
      const response = await API.get(ENDPOINTS.GET_FACILITY_LISTS);
      if (response?.success) {
        setListingData(response?.data);
      }
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetFacilityData();
  }, []);

  // The API response only has one item, so let's create some mock data
  // for demonstration that matches the screenshot
  const facilities = [
    {
      id: "1",
      facility_name: "Landmark of Louisville",
      status: "ACTIVE",
      user_type: "IN",
    },
    {
      id: "2",
      facility_name: "The Waters of Union City",
      status: "ACTIVE",
      user_type: "IN",
    },
    {
      id: "3",
      facility_name: "Waters of Bristol",
      status: "ACTIVE",
      user_type: "IN",
    },
    {
      id: "4",
      facility_name: "Waters of Tipton",
      status: "INVITED",
      user_type: "IN",
    },
    {
      id: "5",
      facility_name: "Corporate",
      status: "ACTIVE",
      user_type: "IN",
    },
    ...(listingData || []),
  ];

  const getNurseTypeLabel = (userType) => {
    return userType === "IN" ? "Internal Nurse" : "External Nurse";
  };

  const handleSelect = async (profileId) => {
    try {
      setSelectLoading(true);

      const payload = {
        device_type: "IOS",
        device_token: "fasf2",
        profile_id: profileId,
      };

      const response = await API.post(
        "/auth/onboarding/profile-token/",
        payload
      );

      if (response?.success) {
        // Extract token and onboarding information from response
        const { token, is_onboarding_completed, onboarding_step } =
          response.data;

        // Store token in local storage
        StorageManager.put(FACILITY_API_TOKEN, token);

        // Handle routing based on onboarding status
        if (!is_onboarding_completed && onboarding_step !== "9") {
          // Route to onboarding page with specific step
          history.push({
            pathname: `/onboarding`,
            state: {
              data: response.data,
            },
          });
        } else {
          // If onboarding is complete or step is 9, route to main dashboard or home
          history.push("/dashboard");
        }
      } else {
        // Handle unsuccessful selection
        console.error("Failed to select profile:", response);
      }
    } catch (error) {
      console.error("Error selecting profile:", error);
      // Handle error - perhaps show an error message
    } finally {
      setSelectLoading(false);
    }
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h5" className={classes.header}>
        Select Location
      </Typography>

      {loading ? (
        <Typography>Loading facilities...</Typography>
      ) : (
        facilities.map((facility) => (
          <Paper key={facility.id} className={classes.facilityItem}>
            <Box display="flex" alignItems="center">
              <Box className={classes.iconContainer}>
                <LocationCityIcon />
              </Box>
              <Box className={classes.facilityInfo}>
                <Typography className={classes.facilityName}>
                  {facility.facility_name}
                </Typography>
                <Box mt={0.5}>
                  <span className={classes.nurseLabel}>
                    {getNurseTypeLabel(facility.user_type)}
                  </span>
                </Box>
              </Box>
            </Box>

            <Box display="flex" alignItems="center">
              <NotificationsIcon className={classes.notificationIcon} />
              <Typography
                className={
                  facility.status === "ACTIVE"
                    ? classes.statusActive
                    : classes.statusInvited
                }
              >
                {facility.status === "ACTIVE" ? "Active" : "Invited"}
              </Typography>
              <Button
                variant={
                  facility.status === "INVITED" ? "contained" : "outlined"
                }
                className={
                  facility.status === "INVITED"
                    ? classes.selectButtonInvited
                    : classes.selectButton
                }
                onClick={() => handleSelect(facility.id)}
                disabled={selectLoading}
              >
                Select
              </Button>
            </Box>
          </Paper>
        ))
      )}
    </Paper>
  );
};

export default FacilityList;
