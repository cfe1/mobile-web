import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const PrimaryButton = withStyles((theme) => ({
  root: ({ isDisabled, wide = false, style }) => ({
    color: isDisabled ? "#050D33" : "white",
    fontFamily: "inherit",
    fontWeight: 600,
    boxShadow: "none",
    background: isDisabled
      ? "#EFEFF4"
      : "linear-gradient(to right,#D831B4, #6241E9)",
    // borderRadius: 27,
    padding: "18px 30px"  ,
    width: wide ? 200 : 169,
    ...style,
    "@media (min-width: 725px) and (max-width:1030px)": {
      width: 130,
      padding: 0,
      height: 48,
      fontSize: 11,
    },
  }),
}))(Button);

export default PrimaryButton;
