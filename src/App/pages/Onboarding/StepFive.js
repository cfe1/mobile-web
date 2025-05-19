import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@material-ui/core";
import { API, ENDPOINTS } from "api/apiService";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: "1.2rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  formControl: {
    marginBottom: theme.spacing(3),
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(1),
    },
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  selectLabel: {
    background: theme.palette.background.paper,
    padding: "0 5px",
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
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
}));

export const StepFive = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fetchingCategories, setFetchingCategories] = useState(false);

  // Fetch job categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Pre-fill if data exists
  useEffect(() => {
    if (profileData?.labor_category && categories.length > 0) {
      setSelectedCategory(profileData.labor_category);
    }
  }, [profileData, categories]);

  const fetchCategories = async () => {
    try {
      setFetchingCategories(true);
      const response = await API.get(ENDPOINTS.JOB_CATEGORIES);
      if (response?.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching job categories:", error);
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleContinue = async () => {
    if (selectedCategory) {
      await updateProfile({
        labor_category: selectedCategory,
      });
    }
  };

  if (fetchingCategories) {
    return (
      <div className={classes.loader}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>Job category</Typography>
      <Typography className={classes.subtitle}>
        Please select your job category
      </Typography>

      <FormControl variant="outlined" className={classes.formControl} fullWidth>
        <InputLabel id="category-label" className={classes.selectLabel}>
          Select job category
        </InputLabel>
        <Select
          labelId="category-label"
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Select job category"
          disabled={loading}
        >
          <MenuItem value="">
            <em>Select job category</em>
          </MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        className={classes.continueButton}
        disabled={!selectedCategory || loading}
        onClick={handleContinue}
        color="primary"
      >
        Continue
      </Button>

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
