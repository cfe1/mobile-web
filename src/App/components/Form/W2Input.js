import { TextField, withStyles } from "@material-ui/core";

const W2Input = withStyles({
  root: (props) => ({
    "& .MuiOutlinedInput-root": {
      // borderRadius: 27,
      borderColor: "#EDECF5",
      padding: "3px 3px",
    },
    "& .MuiFormHelperText-root": {
      textAlign: props.helpertextright ? "right" : "left",
    },
    minHeight: 0,
    fontSize: 11,
    lineHeight: 20 / 13,
    fontWeight: 500,
  }),
})(TextField);
export default W2Input;
