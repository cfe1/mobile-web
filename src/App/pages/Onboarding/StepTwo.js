import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { TextField, Button, Typography, Box } from "@material-ui/core";

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
  inputLabel: {
    color: theme.palette.primary.main,
    fontSize: "1.1rem",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  inputField: {
    marginBottom: theme.spacing(1),
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(1),
    },
  },
  helpText: {
    fontSize: "0.9rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    backgroundColor: "#FFC0CB", // Light pink color as shown in the screenshot
    color: "white",
    "&:hover": {
      backgroundColor: "#FF9CAB", // Slightly darker pink on hover
    },
    "&:disabled": {
      backgroundColor: "#FFC0CB",
      opacity: 0.7,
      color: "white",
    },
  },
  backButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "#FF1493", // Hot pink color for text only button
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(255, 20, 147, 0.05)",
      boxShadow: "none",
    },
  },
}));

export const StepTwo = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [lastName, setLastName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Pre-fill if data exists
    if (profileData?.last_name) {
      setLastName(profileData.last_name);
    }
  }, [profileData]);

  useEffect(() => {
    // Validate last name - no special characters allowed
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(
      lastName
    );

    if (hasSpecialChars) {
      setError("Please enter your last name without using special characters.");
      setIsValid(false);
    } else if (lastName.trim().length === 0) {
      setError("");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
    }
  }, [lastName]);

  const handleContinue = async () => {
    if (isValid) {
      await updateProfile({ last_name: lastName });
    }
  };

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>What is your last name?</Typography>
      <Typography className={classes.subtitle}>
        Please enter your legal last name.
      </Typography>

      <Typography className={classes.inputLabel}>Last name</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className={classes.inputField}
        error={!!error}
      />

      <Typography className={classes.helpText}>
        {error ||
          "Please enter your last name without using special characters."}
      </Typography>

      <Button
        fullWidth
        variant="contained"
        className={classes.continueButton}
        disabled={!isValid || loading}
        onClick={handleContinue}
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
