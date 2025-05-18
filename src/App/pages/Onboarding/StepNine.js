import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";
import { API, ENDPOINTS } from "api/apiService";
import * as Yup from "yup";
import { useFormik } from "formik";

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
    backgroundColor: "#F83E7D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E52D6A",
    },
    "&:disabled": {
      backgroundColor: "#F83E7D",
      opacity: 0.7,
      color: "white",
    },
  },
  skipButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "#F83E7D",
    border: "1px solid #F83E7D",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "rgba(248, 62, 125, 0.05)",
    },
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
}));

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

  // Initialize form with Formik
  const formik = useFormik({
    initialValues: {
      address_line1: profileData?.address?.address_line1 || "",
      address_line2: profileData?.address?.address_line2 || "",
      city: profileData?.address?.city || "",
      state: profileData?.address?.state || { id: "", name: "" },
      country: profileData?.address?.country || { id: "", name: "" },
      zipcode: profileData?.address?.zipcode || "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // Format the data for API submission
      const addressData = {
        address: {
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state.id,
          country: values.country.id,
          zipcode: values.zipcode,
        },
      };

      updateProfile(addressData);
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
            disabled={loading || fetchingCountries}
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
          disabled={loading}
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
          disabled={loading}
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
          disabled={loading}
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
            disabled={loading || fetchingStates || !formik.values.country.id}
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
          disabled={loading}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className={classes.continueButton}
          disabled={loading || !formik.isValid || formik.isSubmitting}
        >
          {loading ? (
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
        disabled={loading}
      >
        Back
      </Button>
    </div>
  );
};
