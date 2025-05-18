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
    marginBottom: theme.spacing(4),
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(1),
    },
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
  },
}));

export const StepOne = ({ profileData, updateProfile, loading }) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState("");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Pre-fill if data exists
    if (profileData?.first_name) {
      setFirstName(profileData.first_name);
    }
  }, [profileData]);

  useEffect(() => {
    // Validate first name
    setIsValid(firstName.trim().length > 0);
  }, [firstName]);

  const handleContinue = async () => {
    if (isValid) {
      await updateProfile({ first_name: firstName });
    }
  };

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>
        What is your first name?
      </Typography>
      <Typography className={classes.subtitle}>
        Please enter your legal first name.
      </Typography>

      <Typography className={classes.inputLabel}>First name</Typography>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter your first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className={classes.inputField}
      />

      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.continueButton}
        disabled={!isValid || loading}
        onClick={handleContinue}
      >
        Continue
      </Button>
    </div>
  );
};
