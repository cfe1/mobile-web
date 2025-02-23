import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const TransparentButton = withStyles((theme) => ({
  root: ({ wide, style }) => ({
    color: "black",
    background: "white",
    // borderRadius: 27,
    border: "solid 1px #EFEFF4",
    padding: wide ? "18px 40px" : "9px 18px",
    minWidth: wide ? 200 : "unset",
    ...style,
  }),
}))(Button);

export default TransparentButton;
