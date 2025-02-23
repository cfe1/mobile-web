import React from "react";
import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  withStyles,
} from "@material-ui/core";
import MaskedInput from "react-text-mask";

function TextMaskCustom(props) {
  const { inputRef, ...other } = props;

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        "-",
        /\d/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={"\u2000"}
    />
  );
}

const InputField = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      // borderRadius: 27,
      padding: "3px 3px",
      paddingRight: 20,
    },
    minHeight: 80,
    marginBottom: 10,
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
    "& .MuiFormHelperText-root.Mui-error" :{
      fontWeight:"400 !important",
      color:"#ff0040"
    },
    "& .MuiFormLabel-root.Mui-error": {
      color:"#ff0040"
  }
  },
})(FormControl);

const SsnInputField = ({ label, error, onChange, helperText, ...props }) => (
  <InputField variant="outlined" {...props}>
    <InputLabel htmlFor={label} error={error}>
      {label}
    </InputLabel>
    <OutlinedInput
      id={label}
      onChange={onChange}
      label={label}
      error={error}
      inputComponent={TextMaskCustom}
      {...props}
    />
    <FormHelperText id={label + "helper"} error={error}>
      {helperText}
    </FormHelperText>
  </InputField>
);

export default SsnInputField;
