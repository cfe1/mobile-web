import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  TextField,
  CircularProgress,
} from "@material-ui/core";

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
  inputField: {
    marginBottom: theme.spacing(4),
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(1),
    },
  },
  inputLabel: {
    fontSize: "1.1rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(1),
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
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
}));

export const StepEight = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill if data exists
  useEffect(() => {
    if (profileData?.email) {
      setEmail(profileData.email);
      validateEmail(profileData.email);
    }
  }, [profileData]);

  // Email validation function
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setError("");
      setIsValid(false);
      return;
    }

    if (!emailRegex.test(value)) {
      setError("Please enter a valid email address");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleContinue = () => {
    if (isValid) {
      updateProfile({ email });
    }
  };

  const handleSkip = () => {
    // Move to next step without updating email
    updateProfile({});
  };

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>Email Address</Typography>
      <Typography className={classes.subtitle}>
        What is your email address?
      </Typography>

      <Typography className={classes.inputLabel}>Email address</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your email address"
        value={email}
        onChange={handleEmailChange}
        className={classes.inputField}
        error={!!error}
        helperText={error}
      />

      <Button
        fullWidth
        variant="contained"
        className={classes.continueButton}
        disabled={!isValid || loading}
        onClick={handleContinue}
        color="primary"
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Continue"}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        className={classes.skipButton}
        disabled={loading}
        onClick={handleSkip}
      >
        Skip
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
