import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const secondaryButton = withStyles((theme) => ({
  root: ({ isDisabled, wide = false, style }) => ({
    color: isDisabled ? "#050D33" : "black",
    background: isDisabled ? "#EFEFF4" : "white",
    // borderRadius: 27,
    fontFamily: "inherit",
    fontWeight: 600,
    padding: "18px 40px",
    width: wide ? 200 : 169,
    boxShadow: "none",
    "&:hover,, &:focus": {
      background: isDisabled ? "#EFEFF4" : "white",
    },
    ...style,
    "@media (min-width: 725px) and (max-width:1024px)": {
      width: 130,
      padding: 0,
      height: 48,
      fontSize: 11,
    },
  }),
}))(Button);

export default secondaryButton;
