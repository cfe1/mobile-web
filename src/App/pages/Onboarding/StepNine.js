import React, { useState, useEffect, useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  FormHelperText,
  IconButton,
  Box,
  Divider,
  Paper,
  Snackbar,
  SnackbarContent,
} from "@material-ui/core";
import { API, ENDPOINTS } from "api/apiService";
import * as Yup from "yup";
import { useFormik } from "formik";
import GoogleMapReact from "google-map-react";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import MyLocationIcon from "@material-ui/icons/MyLocation";
import SearchIcon from "@material-ui/icons/Search";
import ErrorIcon from "@material-ui/icons/Error";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: theme.spacing(3),
  },
  mapContainer: {
    width: "100%",
    height: "300px",
    marginBottom: theme.spacing(3),
    position: "relative",
    borderRadius: theme.spacing(1),
    overflow: "hidden",
  },
  mapControls: {
    position: "absolute",
    top: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
  },
  mapControlButton: {
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  optionalLabel: {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
    marginTop: -theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  fieldLabel: {
    fontSize: "1rem",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(3),
  },
  backButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "#F83E7D",
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(248, 62, 125, 0.05)",
      boxShadow: "none",
    },
  },
  selectLabel: {
    background: theme.palette.background.paper,
    padding: "0 5px",
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  markerContainer: {
    position: "absolute",
    transform: "translate(-50%, -100%)",
    "&:hover": {
      zIndex: 2,
    },
  },
  markerIcon: {
    color: "#F83E7D",
    fontSize: "2.5rem",
  },
  separatorText: {
    display: "flex",
    alignItems: "center",
    margin: `${theme.spacing(3)}px 0`,
    "&::before, &::after": {
      content: '""',
      flex: 1,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    "&::before": {
      marginRight: theme.spacing(2),
    },
    "&::after": {
      marginLeft: theme.spacing(2),
    },
  },
  mapInfoMessage: {
    position: "absolute",
    bottom: theme.spacing(2),
    left: "50%",
    transform: "translateX(-50%)",
    padding: theme.spacing(1, 2),
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: theme.spacing(1),
    boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
    zIndex: 2,
  },
  errorSnackbar: {
    backgroundColor: theme.palette.error.dark,
  },
  errorIcon: {
    marginRight: theme.spacing(1),
  },
}));

// Marker component for Google Map
const Marker = ({ lat, lng, className, children }) => (
  <div className={className} lat={lat} lng={lng}>
    {children}
  </div>
);

// Validation schema
const validationSchema = Yup.object({
  address_line1: Yup.string().required("Street Line 1 is required."),
  city: Yup.string().required("City is required."),
  state: Yup.object().shape({
    name: Yup.string().required("State is required"),
  }),
  country: Yup.object().shape({
    name: Yup.string().required("Country is required"),
  }),
  zipcode: Yup.string()
    .required("Zipcode is required")
    .test("is_valid_zipcode", "Please enter valid zip code", (val) => {
      if (val !== undefined) {
        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val);
        if (!isValidZip) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }),
  address_line2: Yup.string(),
});

export const StepNine = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [fetchingCountries, setFetchingCountries] = useState(false);
  const [fetchingStates, setFetchingStates] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [center, setCenter] = useState({ lat: 40.7128, lng: -74.006 }); // Default to NYC
  const [markerPosition, setMarkerPosition] = useState(null);
  const [zoom, setZoom] = useState(14);
  const [infoMessage, setInfoMessage] = useState(
    "Click on the map to set your address"
  );
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // Refs for Google Maps API
  const mapRef = useRef(null);
  const mapsRef = useRef(null);
  const geocoderRef = useRef(null);

  // Initialize form with Formik
  const formik = useFormik({
    initialValues: {
      address_line1: profileData?.address?.address_line1 || "",
      address_line2: profileData?.address?.address_line2 || "",
      city: profileData?.address?.city || "",
      state: profileData?.address?.state || { id: "", name: "" },
      country: profileData?.address?.country || { id: "", name: "" },
      zipcode: profileData?.address?.zipcode || "",
      latitude: profileData?.address?.latitude || null,
      longitude: profileData?.address?.longitude || null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      // Set local submitting state to true
      setSubmitting(true);

      try {
        // Create FormData
        const formData = new FormData();

        // Create the address object as per the specified format
        const addressData = {
          address_line1: values.address_line1,
          address_line2: values.address_line2 || "",
          city: values.city,
          state: values.state.name, // Need the name
          country: values.country.name, // Need the name
          zipcode: values.zipcode,
        };

        // Add coordinates if available
        if (values.latitude && values.longitude) {
          addressData.latitude = values.latitude;
          addressData.longitude = values.longitude;
        }

        // Convert the address object to a JSON string and append to FormData
        formData.append("address", JSON.stringify(addressData));

        // Call the updateProfile function with FormData
        await updateProfile(formData);
        // The parent component will handle success cases
      } catch (error) {
        // Handle the error here
        console.error("Error updating address:", error);
        setErrorMessage(
          error?.data?.error?.message ||
            "Failed to update address. Please try again."
        );
        setShowError(true);
      } finally {
        // Set submitting state to false regardless of success or failure
        setSubmitting(false);
      }
    },
  });

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formik.values.country && formik.values.country.id) {
      fetchStates(formik.values.country.id);
    } else {
      setStates([]);
    }
  }, [formik.values.country]);

  // Set marker position when form values with coordinates change
  useEffect(() => {
    if (formik.values.latitude && formik.values.longitude) {
      setMarkerPosition({
        lat: parseFloat(formik.values.latitude),
        lng: parseFloat(formik.values.longitude),
      });
      setCenter({
        lat: parseFloat(formik.values.latitude),
        lng: parseFloat(formik.values.longitude),
      });
    }
  }, [formik.values.latitude, formik.values.longitude]);

  // Pre-fill address if it exists in profile data
  useEffect(() => {
    if (profileData?.address) {
      // We need to ensure we have the full country and state objects
      const address = profileData.address;

      // Find matching country from fetched countries
      if (address.country && countries.length > 0) {
        const countryObj = countries.find((c) => c.id === address.country);
        if (countryObj) {
          formik.setFieldValue("country", countryObj);

          // Fetch states for this country
          fetchStates(countryObj.id);
        }
      }

      // Set other address fields
      formik.setFieldValue("address_line1", address.address_line1 || "");
      formik.setFieldValue("address_line2", address.address_line2 || "");
      formik.setFieldValue("city", address.city || "");
      formik.setFieldValue("zipcode", address.zipcode || "");

      // Set coordinates
      if (address.latitude && address.longitude) {
        formik.setFieldValue("latitude", address.latitude);
        formik.setFieldValue("longitude", address.longitude);
        setMarkerPosition({
          lat: parseFloat(address.latitude),
          lng: parseFloat(address.longitude),
        });
        setCenter({
          lat: parseFloat(address.latitude),
          lng: parseFloat(address.longitude),
        });
      }
    }
  }, [profileData, countries]);

  // Update state field once states are fetched
  useEffect(() => {
    if (profileData?.address?.state && states.length > 0) {
      const stateObj = states.find((s) => s.id === profileData.address.state);
      if (stateObj) {
        formik.setFieldValue("state", stateObj);
      }
    }
  }, [profileData, states]);

  const fetchCountries = async () => {
    try {
      setFetchingCountries(true);
      const response = await API.get(ENDPOINTS.FETCH_COUNTRY);
      if (response?.success) {
        setCountries(response.data);

        // If there's only one country (like US), select it by default
        if (response.data.length === 1 && !formik.values.country.id) {
          formik.setFieldValue("country", response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
      setErrorMessage(
        "Failed to fetch countries. Please try reloading the page."
      );
      setShowError(true);
    } finally {
      setFetchingCountries(false);
    }
  };

  const fetchStates = async (countryId) => {
    try {
      setFetchingStates(true);
      const response = await API.get(ENDPOINTS.FETCH_STATES(countryId));
      if (response?.success) {
        setStates(response.data);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setErrorMessage(
        "Failed to fetch states. Please try selecting the country again."
      );
      setShowError(true);
    } finally {
      setFetchingStates(false);
    }
  };

  const handleCountryChange = (event) => {
    const countryId = event.target.value;
    const country = countries.find((c) => c.id === countryId);
    if (country) {
      formik.setFieldValue("country", country);
      // Reset state when country changes
      formik.setFieldValue("state", { id: "", name: "" });
    }
  };

  const handleStateChange = (event) => {
    const stateId = event.target.value;
    const state = states.find((s) => s.id === stateId);
    if (state) {
      formik.setFieldValue("state", state);
    }
  };

  // Map initialization callback
  const handleApiLoaded = ({ map, maps }) => {
    mapRef.current = map;
    mapsRef.current = maps;
    geocoderRef.current = new maps.Geocoder();
    setMapLoaded(true);
  };

  // Handle map click to set marker and get address
  const handleMapClick = (event) => {
    if (!mapLoaded || !geocoderRef.current) return;

    const newPosition = {
      lat: event.lat,
      lng: event.lng,
    };

    setMarkerPosition(newPosition);
    formik.setFieldValue("latitude", newPosition.lat);
    formik.setFieldValue("longitude", newPosition.lng);

    // Reverse geocode to get address
    geocoderRef.current.geocode(
      { location: newPosition },
      (results, status) => {
        if (status === "OK" && results[0]) {
          fillAddressFromGeocode(results[0]);
        } else {
          setErrorMessage(
            "Could not find address for this location. You can enter it manually."
          );
          setShowError(true);
        }
      }
    );
  };

  // Get current location from browser
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setFetchingLocation(true);
      setInfoMessage("Getting your current location...");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setCenter(pos);
          setMarkerPosition(pos);
          formik.setFieldValue("latitude", pos.lat);
          formik.setFieldValue("longitude", pos.lng);

          // Reverse geocode to get address
          if (geocoderRef.current) {
            geocoderRef.current.geocode(
              { location: pos },
              (results, status) => {
                if (status === "OK" && results[0]) {
                  fillAddressFromGeocode(results[0]);
                } else {
                  setErrorMessage(
                    "Could not find address for your location. Please enter it manually."
                  );
                  setShowError(true);
                }
                setFetchingLocation(false);
                setInfoMessage("Click on the map to adjust your location");
              }
            );
          } else {
            setFetchingLocation(false);
            setInfoMessage("Map not loaded properly. Please try again.");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setFetchingLocation(false);
          setInfoMessage(
            "Unable to get your location. Please select manually."
          );
          setErrorMessage(
            "Could not get your location. Please allow location access or enter the address manually."
          );
          setShowError(true);
        }
      );
    } else {
      setInfoMessage("Geolocation is not supported by your browser.");
      setErrorMessage(
        "Your browser doesn't support geolocation. Please enter your address manually."
      );
      setShowError(true);
    }
  };

  // Fill address fields from geocode result
  const fillAddressFromGeocode = (result) => {
    if (!result) return;

    let address1 = "";
    let city = "";
    let state = "";
    let zipcode = "";

    // Loop through address components to extract relevant data
    result.address_components.forEach((component) => {
      const types = component.types;

      if (types.includes("street_number")) {
        address1 = component.long_name;
      } else if (types.includes("route")) {
        address1 = address1
          ? `${address1} ${component.long_name}`
          : component.long_name;
      } else if (types.includes("locality")) {
        city = component.long_name;
      } else if (types.includes("administrative_area_level_1")) {
        state = component.long_name;
      } else if (types.includes("postal_code")) {
        zipcode = component.long_name;
      }
    });

    // Update form values
    formik.setFieldValue("address_line1", address1);
    formik.setFieldValue("city", city);

    // Find matching state in our states array
    if (state && states.length > 0) {
      const stateObj = states.find(
        (s) => s.name.toLowerCase() === state.toLowerCase()
      );
      if (stateObj) {
        formik.setFieldValue("state", stateObj);
      }
    }

    formik.setFieldValue("zipcode", zipcode);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  // Override the parent's loading prop with our local submitting state
  // This ensures we can re-enable the button even if the parent's loading state is stuck
  const isSubmitting = loading || submitting;

  if (fetchingCountries) {
    return (
      <div className={classes.loader}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>Address</Typography>

      <div className={classes.mapContainer}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          defaultCenter={center}
          center={center}
          defaultZoom={zoom}
          zoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={handleApiLoaded}
          onClick={handleMapClick}
        >
          {markerPosition && (
            <Marker
              lat={markerPosition.lat}
              lng={markerPosition.lng}
              className={classes.markerContainer}
            >
              <LocationOnIcon className={classes.markerIcon} />
            </Marker>
          )}
        </GoogleMapReact>

        <div className={classes.mapControls}>
          <IconButton
            className={classes.mapControlButton}
            onClick={getCurrentLocation}
            disabled={fetchingLocation || isSubmitting}
          >
            {fetchingLocation ? (
              <CircularProgress size={24} />
            ) : (
              <MyLocationIcon style={{ color: "#F83E7D" }} />
            )}
          </IconButton>
        </div>

        <Paper className={classes.mapInfoMessage}>
          <Typography variant="body2">{infoMessage}</Typography>
        </Paper>
      </div>

      <Typography className={classes.separatorText}>
        OR ENTER MANUALLY
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        {/* Country */}
        <Typography className={classes.fieldLabel}>Country</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.formField}
          error={formik.touched.country && Boolean(formik.errors.country)}
        >
          <Select
            id="country"
            name="country"
            value={formik.values.country.id || ""}
            onChange={handleCountryChange}
            disabled={isSubmitting || fetchingCountries}
          >
            <MenuItem value="">
              <em>Select Country</em>
            </MenuItem>
            {countries.map((country) => (
              <MenuItem key={country.id} value={country.id}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.country && formik.errors.country && (
            <FormHelperText>{formik.errors.country.name}</FormHelperText>
          )}
        </FormControl>

        {/* Address Line 1 */}
        <Typography className={classes.fieldLabel}>Address 1</Typography>
        <TextField
          id="address_line1"
          name="address_line1"
          variant="outlined"
          fullWidth
          className={classes.formField}
          value={formik.values.address_line1}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.address_line1 && Boolean(formik.errors.address_line1)
          }
          helperText={
            formik.touched.address_line1 && formik.errors.address_line1
          }
          disabled={isSubmitting}
        />

        {/* Address Line 2 */}
        <Typography className={classes.fieldLabel}>Address 2</Typography>
        <TextField
          id="address_line2"
          name="address_line2"
          variant="outlined"
          fullWidth
          className={classes.formField}
          value={formik.values.address_line2}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isSubmitting}
        />
        <Typography className={classes.optionalLabel}>Optional</Typography>

        {/* City */}
        <Typography className={classes.fieldLabel}>City</Typography>
        <TextField
          id="city"
          name="city"
          variant="outlined"
          fullWidth
          className={classes.formField}
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.city && Boolean(formik.errors.city)}
          helperText={formik.touched.city && formik.errors.city}
          disabled={isSubmitting}
        />

        {/* State */}
        <Typography className={classes.fieldLabel}>State</Typography>
        <FormControl
          variant="outlined"
          fullWidth
          className={classes.formField}
          error={formik.touched.state && Boolean(formik.errors.state)}
        >
          <Select
            id="state"
            name="state"
            value={formik.values.state.id || ""}
            onChange={handleStateChange}
            disabled={
              isSubmitting || fetchingStates || !formik.values.country.id
            }
          >
            <MenuItem value="">
              <em>Select State</em>
            </MenuItem>
            {states.map((state) => (
              <MenuItem key={state.id} value={state.id}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.state && formik.errors.state && (
            <FormHelperText>{formik.errors.state.name}</FormHelperText>
          )}
        </FormControl>

        {/* Zip Code */}
        <Typography className={classes.fieldLabel}>Zip code</Typography>
        <TextField
          id="zipcode"
          name="zipcode"
          variant="outlined"
          fullWidth
          className={classes.formField}
          value={formik.values.zipcode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
          helperText={formik.touched.zipcode && formik.errors.zipcode}
          disabled={isSubmitting}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          className={classes.continueButton}
          disabled={isSubmitting || !formik.isValid}
        >
          {isSubmitting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Continue"
          )}
        </Button>
      </form>

      <Button
        fullWidth
        className={classes.backButton}
        onClick={onBack}
        disabled={isSubmitting}
      >
        Back
      </Button>

      {/* Error Snackbar */}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
      >
        <SnackbarContent
          className={classes.errorSnackbar}
          message={
            <Box display="flex" alignItems="center">
              <ErrorIcon className={classes.errorIcon} />
              <span>{errorMessage}</span>
            </Box>
          }
        />
      </Snackbar>
    </div>
  );
};
