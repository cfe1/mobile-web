import React, { useEffect, useState } from "react";
import { API, ENDPOINTS } from "api/apiService";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Box, Paper, Button, Grid } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import LocationCityIcon from "@material-ui/icons/LocationCity";
import { useHistory } from "react-router-dom";
import StorageManager from "storage/StorageManager";
import { FACILITY_API_TOKEN } from "storage/StorageKeys";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    maxWidth: 800,
    margin: "0 auto",
    borderRadius: 16,
    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
    width: "71vw",
  },
  header: {
    fontWeight: 700,
    fontSize: "28px",
    marginBottom: theme.spacing(4),
  },
  facilityItem: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.03)",
    border: "1px solid #EDECF5",
  },
  iconContainer: {
    backgroundColor: "#FFF0F5",
    borderRadius: "50%",
    width: 60,
    height: 60,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing(3),
    "& svg": {
      color: "#E75480",
      fontSize: 30,
    },
  },
  facilityInfo: {
    flexGrow: 1,
  },
  facilityName: {
    fontWeight: 600,
    fontSize: "20px",
    marginBottom: theme.spacing(1),
  },
  nurseLabel: {
    backgroundColor: "#F5F5F5",
    borderRadius: 50,
    padding: "6px 16px",
    fontSize: "14px",
    fontWeight: 500,
  },
  notificationIcon: {
    marginRight: theme.spacing(2),
    color: "#FF0083",
    fontSize: 28,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: -4,
    right: 12,
    backgroundColor: "#FF0083",
    color: "#FFFFFF",
    borderRadius: "50%",
    width: 15,
    height: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: "bold",
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF0000",
    borderRadius: "50%",
    width: 10,
    height: 10,
  },
  statusActive: {
    color: "#4CAF50",
    fontSize: "18px",
    fontWeight: 500,
    marginRight: theme.spacing(3),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingTop: theme.spacing(0.75),
    paddingBottom: theme.spacing(0.75),
    backgroundColor: "#F0F9F0",
    borderRadius: 50,
  },
  statusInvited: {
    color: "#E75480",
    fontSize: "18px",
    fontWeight: 500,
    marginRight: theme.spacing(3),
  },
  selectButton: {
    borderRadius: 50,
    textTransform: "none",
    padding: "10px 32px",
    fontWeight: 600,
    border: "1px solid #FF0083",
    color: "#FF0083",
    fontSize: "16px",
    "&:hover": {
      backgroundColor: "rgba(231, 84, 128, 0.08)",
    },
  },
  selectButtonInvited: {
    borderRadius: 50,
    textTransform: "none",
    padding: "10px 32px",
    fontWeight: 600,
    color: "#fff",
    backgroundColor: "#E75480",
    border: "1px solid #FF0083",
    fontSize: "16px",
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

  // The API response only has one item, so let's use the data provided
  const facilities =
    listingData.length > 0
      ? listingData
      : [
          {
            id: "e2ea4ca0-babf-4e38-83ed-72f6f274d9d3",
            user_type: "EN",
            emp_id: "QK-037992",
            status: "ACTIVE",
            country_code: "+1",
            mobile: "2244195222",
            is_notification_enable: true,
            joining_date: "2025-05-20",
            onboarding_step: 0,
            is_onboarding_completed: false,
            notification_count: 2, // Added this for demo
            facility_name: "Landmark of Louisville",
          },
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
    <Paper className={classes.root} elevation={0}>
      <Typography variant="h5" className={classes.header}>
        Select Location
      </Typography>

      {loading ? (
        <Typography>Loading facilities...</Typography>
      ) : (
        facilities.map((facility) => (
          <Paper
            key={facility.id}
            className={classes.facilityItem}
            elevation={0}
          >
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
              <Box position="relative">
                <NotificationsIcon className={classes.notificationIcon} />
                {facility.notification_count > 0 && (
                  <Box className={classes.notificationBadge}>
                    {facility.notification_count < 10
                      ? facility.notification_count
                      : "9+"}
                  </Box>
                )}
              </Box>
              {facility.status === "ACTIVE" ? (
                <Typography className={classes.statusActive}>Active</Typography>
              ) : (
                <Typography className={classes.statusInvited}>
                  Invited
                </Typography>
              )}
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
