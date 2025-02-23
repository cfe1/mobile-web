import React, { useState, useEffect } from "react";
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
      // borderRadius: 27,
      borderColor: "#EDECF5",
      padding: "3px 3px",
      backgroundColor: "white",
    },
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
  },
})(KeyboardDatePicker);
const Datepicker = ({
  label,
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
}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StyledPicker
        inputVariant="outlined"
        variant="dialog"
        label={label}
        format={format}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        InputProps={{ readOnly: true }}
        autoOk
        // disablePast={disablePast}
        minDate={minDate}
        maxDate={maxDate}
        minDateMessage="Please select a future date"
        fullWidth={fullWidth}
        keyboardIcon={<img src={CalendarIcon} />}
      />
    </MuiPickersUtilsProvider>
  );
};
export default Datepicker;
