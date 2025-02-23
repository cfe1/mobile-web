import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const PinkPrimaryButton = withStyles((theme) => ({
  root: ({ isDisabled, wide, style }) => ({
    color: isDisabled ? "#050D33" : "white",
    background: isDisabled ? "#9FA7D1" : "#FF0083",
    // borderRadius: 27,
    padding: "18px 40px",
    minWidth: wide ? 200 : "unset",
    ...style,
    "@media (min-width: 768px) and (max-width:1024px)": {
      width: 140,
      height: 48,
      padding: 0,
      marginLeft: "10px !important",
    },
    "&:hover": {
      backgroundColor: "#D4006D",
      boxShadow: "none",
    },
  }),
}))(Button);

export default PinkPrimaryButton;
