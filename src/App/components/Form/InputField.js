import { TextField, withStyles } from "@material-ui/core";

const InputField = withStyles({
  root:(props)=> ({
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      // borderRadius: 27,
      borderColor: "#EDECF5",
      padding: "3px 3px",
    },
    "& .MuiFormHelperText-root": {
      textAlign: props.heleperTextRight ? "right" : "left",
    },
    minHeight: 80,
    fontSize: 13,
    fontWeight:600,
    lineHeight: 20 / 13,
    "& .MuiFormHelperText-root.Mui-error" :{
      fontWeight:"400 !important",
      color:"#ff0040"
    },
    "& .MuiFormLabel-root.Mui-error": {
      color:"#ff0040"
  }
  }),
})(TextField);
export default InputField;
