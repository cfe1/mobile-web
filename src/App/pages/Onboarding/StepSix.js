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

export const StepSix = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [jobTitles, setJobTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [fetchingTitles, setFetchingTitles] = useState(false);

  // Fetch job titles when component mounts or labor_category changes
  useEffect(() => {
    if (profileData?.labor_category) {
      fetchJobTitles(profileData.labor_category);
    }
  }, [profileData]);

  // Pre-fill if data exists
  useEffect(() => {
    if (profileData?.job_title && jobTitles.length > 0) {
      setSelectedTitle(profileData.job_title);
    }
  }, [profileData, jobTitles]);

  const fetchJobTitles = async (categoryId) => {
    try {
      setFetchingTitles(true);
      const response = await API.get(ENDPOINTS.LABOUR_CATEGORIES(categoryId));
      if (response?.success) {
        // API returns a flat array of job titles
        setJobTitles(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching job titles:", error);
    } finally {
      setFetchingTitles(false);
    }
  };

  const handleTitleChange = (event) => {
    setSelectedTitle(event.target.value);
  };

  const handleContinue = async () => {
    if (selectedTitle) {
      await updateProfile({
        job_title: selectedTitle,
      });
    }
  };

  if (fetchingTitles) {
    return (
      <div className={classes.loader}>
        <CircularProgress color="secondary" />
      </div>
    );
  }

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>Job title</Typography>
      <Typography className={classes.subtitle}>
        Please select your job title
      </Typography>

      <FormControl variant="outlined" className={classes.formControl} fullWidth>
        <InputLabel id="title-label" className={classes.selectLabel}>
          Select job title
        </InputLabel>
        <Select
          labelId="title-label"
          id="title-select"
          value={selectedTitle}
          onChange={handleTitleChange}
          label="Select job title"
          disabled={loading || jobTitles.length === 0}
        >
          <MenuItem value="">
            <em>Select job title</em>
          </MenuItem>
          {jobTitles.map((title) => (
            <MenuItem key={title.id} value={title.id}>
              {title.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        className={classes.continueButton}
        disabled={!selectedTitle || loading}
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
