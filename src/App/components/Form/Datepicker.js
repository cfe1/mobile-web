import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core";

import CalendarIcon from "./assets/calendar.svg";

const StyledPicker = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      borderColor: "#EDECF5",
      padding: "3px 3px",
      backgroundColor: "white",
      position: "relative",
    },
    "& .MuiInputBase-root .MuiInputBase-input": {
      minWidth: "100px !important",
      width: "100%",
    },
    "& .MuiInputBase-root .MuiInputAdornment-root": {
      position: "absolute",
      right: 0,
    },
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
    minWidth: 160,
  },
})(KeyboardDatePicker);

const Datepicker = ({
  label,
  className,
  value,
  minDate,
  maxDate = new Date(),
  onChange,
  fullWidth = true,
  error,
  helperText,
  onBlur,
  format = "MMM dd, yyyy",
  disablePast = true,
  disableFuture,
  isDisabled,
  placeholder,
  readOnly,
}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StyledPicker
        inputVariant="outlined"
        variant="dialog"
        label={label}
        format={format}
        className={className}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        placeholder={placeholder}
        InputProps={{ readOnly: readOnly }}
        autoOk
        minDate={minDate}
        maxDate={maxDate}
        minDateMessage="Please select a future date"
        fullWidth={fullWidth}
        keyboardIcon={<img src={CalendarIcon} />}
        disabled={isDisabled}
        disableFuture={disableFuture}
      />
    </MuiPickersUtilsProvider>
  );
};

export default Datepicker;
