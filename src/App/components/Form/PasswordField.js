import React from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "./assets/eye.svg";
import VisibilityOff from "./assets/eye-off.svg";

const InputField = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      // borderRadius: 27,
      padding: "3px 3px",
      paddingRight: 20,
    },
    minHeight: 80,
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
    "& .MuiFormHelperText-root.Mui-error" :{
      fontWeight:"600 !important",
    },
  },
})(FormControl);

const PasswordField = ({
  togglePassword,
  handleChange,
  showPassword = false,
  label,
  error,
  helperText,
  ...rest
}) => (
  <InputField variant="outlined" {...rest}>
    <InputLabel htmlFor={label} error={error}>
      {label}
    </InputLabel>
    <OutlinedInput
      id={label}
      type={showPassword ? "text" : "password"}
      onChange={handleChange}
      label={label}
      error={error}
      helperText="asdasd"
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={togglePassword}
            edge="end"
          >
            {showPassword ? (
              
              <img src={Visibility} style={{ height: 18, width: 18 }} alt="eye on"/>
            ) : (
              <img src={VisibilityOff} style={{ height: 18, width: 18 }} alt="eye off" />
            )}
          </IconButton>
        </InputAdornment>
      }
    />
    <FormHelperText id={label + "helper"} error={error}>
      {helperText}
    </FormHelperText>
  </InputField>
);

export default PasswordField;
