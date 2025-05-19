import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Paper,
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
  radioGroup: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
  },
  radioOption: {
    margin: 0,
    width: "100%",
    "& .MuiFormControlLabel-label": {
      fontSize: "1.1rem",
    },
  },
  optionPaper: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    border: "1px solid #E0E0E0",
    "&:hover": {
      borderColor: "#BDBDBD",
    },
  },
  selectedPaper: {
    borderColor: "#F83E7D",
    borderWidth: 2,
    "& .MuiSvgIcon-root": {
      color: "#F83E7D",
    },
  },
  radioButton: {
    color: "#BDBDBD",
    padding: theme.spacing(1),
    "&.Mui-checked": {
      color: "#F83E7D",
    },
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(4),
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

// Gender options as specified
const genderOptions = [
  { value: "M", label: "Male" },
  { value: "F", label: "Female" },
  { value: "O", label: "Other" },
  { value: "NOT_KNOWN", label: "Prefer not to say" },
];

export const StepFour = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [gender, setGender] = useState("");

  useEffect(() => {
    // Pre-fill if data exists
    if (profileData?.gender) {
      setGender(profileData.gender);
    }
  }, [profileData]);

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  const handleContinue = async () => {
    if (gender) {
      await updateProfile({ gender });
    }
  };

  // Custom radio control with styled Paper
  const RadioOption = ({ value, label }) => {
    const isSelected = gender === value;

    return (
      <Paper
        className={`${classes.optionPaper} ${
          isSelected ? classes.selectedPaper : ""
        }`}
        elevation={0}
      >
        <FormControlLabel
          value={value}
          control={<Radio className={classes.radioButton} />}
          label={label}
          className={classes.radioOption}
        />
      </Paper>
    );
  };

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>What is your gender?</Typography>
      <Typography className={classes.subtitle}>
        Please select an option below.
      </Typography>

      <RadioGroup
        value={gender}
        onChange={handleGenderChange}
        className={classes.radioGroup}
      >
        {genderOptions.map((option) => (
          <RadioOption
            key={option.value}
            value={option.value}
            label={option.label}
          />
        ))}
      </RadioGroup>

      <Button
        fullWidth
        variant="contained"
        className={classes.continueButton}
        disabled={!gender || loading}
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
