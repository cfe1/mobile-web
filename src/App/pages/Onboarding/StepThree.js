import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { addYears, isAfter, format, isValid as dateIsValid } from "date-fns"; // Renamed to dateIsValid

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
  datePicker: {
    marginBottom: theme.spacing(4),
    "& .MuiOutlinedInput-root": {
      borderRadius: theme.spacing(1),
    },
    "& .MuiInputBase-input": {
      padding: theme.spacing(2),
    },
    "& .MuiIconButton-root": {
      color: theme.palette.grey[400],
    },
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "white",
  },
  backButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "#F83E7D", // Pink color for text only button
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(248, 62, 125, 0.05)",
      boxShadow: "none",
    },
  },
}));

export const StepThree = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [birthday, setBirthday] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");

  // Calculate the date 18 years ago from today for age validation
  const eighteenYearsAgo = addYears(new Date(), -18);

  useEffect(() => {
    // Pre-fill if data exists
    if (profileData?.dob) {
      try {
        // Parse the date from format YYYY-MM-DD
        const parts = profileData.dob.split("-");
        const dateObj = new Date(parts[0], parts[1] - 1, parts[2]); // Month is 0-indexed

        if (dateIsValid(dateObj)) {
          // Changed from isValid to dateIsValid
          setBirthday(dateObj);
        }
      } catch (e) {
        console.error("Error parsing date:", e);
      }
    }
  }, [profileData]);

  useEffect(() => {
    // Validate birthday - must be at least 18 years old
    if (birthday && dateIsValid(birthday)) {
      // Changed from isValid to dateIsValid
      if (isAfter(birthday, eighteenYearsAgo)) {
        setError("You must be at least 18 years old to continue.");
        setIsValid(false);
      } else {
        setError("");
        setIsValid(true);
      }
    } else {
      setError("");
      setIsValid(false);
    }
  }, [birthday, eighteenYearsAgo]);

  const handleContinue = async () => {
    if (isValid && birthday) {
      // Format date as YYYY-MM-DD for API
      const formattedDate = format(birthday, "yyyy-MM-dd");
      await updateProfile({ dob: formattedDate });
    }
  };

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>What is your birthday?</Typography>
      <Typography className={classes.subtitle}>
        Please enter your legal birthday.
      </Typography>

      <Typography className={classes.inputLabel}>Birthday</Typography>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          fullWidth
          variant="inline"
          inputVariant="outlined"
          placeholder="MM/DD/YYYY"
          format="MMMM d, yyyy"
          value={birthday}
          onChange={setBirthday}
          disableFuture
          className={classes.datePicker}
          KeyboardButtonProps={{
            "aria-label": "change date",
          }}
          maxDate={eighteenYearsAgo}
          error={!!error}
          helperText={error}
        />
      </MuiPickersUtilsProvider>

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
