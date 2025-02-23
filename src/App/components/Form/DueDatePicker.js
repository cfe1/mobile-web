import React, { useState, useEffect } from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core";
import CalendarIcon from "./assets/calendar.svg";
import moment from "moment";

const StyledPicker = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      border: "none",
      // borderRadius: 27,
      borderColor: "#EDECF5",
      padding: "5px 10px",
    },
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
    display: "none",
  },
})(KeyboardDatePicker);
const Datepicker = ({
  label,
  value,
  minDate,

  onChange,
  fullWidth = true,
  error,
  helperText,
  onBlur,
  format = "MMM dd, yyyy",
  disablePast = true,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <span
        style={{
          padding: "5px 10px",
          background: "#f3f4f7",
          display: "inline-block",
        }}
        onClick={() => setOpen(!open)}
      >
        {value
          ? `${moment(value).format("DD MMM YYYY")}
                            `
          : "Update Date"}
      </span>
      <StyledPicker
        open={open}
        inputVariant="outlined"
        variant="dialog"
        format={format}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={error}
        helperText={helperText}
        InputProps={{ readOnly: true }}
        onClose={() => {
          setOpen(false);
        }}
        // disablePast={disablePast}
        minDate={minDate}
        minDateMessage="Please select a future date"
        fullWidth={fullWidth}
        keyboardIcon={<img src={CalendarIcon} />}
      />
    </MuiPickersUtilsProvider>
  );
};
export default Datepicker;
