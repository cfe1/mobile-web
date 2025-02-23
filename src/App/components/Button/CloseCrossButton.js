import React from "react";
import CrossIcon from "../../assets/icons/cross_icon.svg";
import SecondaryButton from "./secondaryButton";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  closeBtn: {
    width: "110px",
    height: "44px",
    padding: "0",
    fontWeight: "700",
    border: "1px solid #DDDFE6",
    borderRadius: "4px",
    "@media (max-width:940px)": {
      width: "80px",
      height: "38px",
    },
  },
  cross: {
    marginLeft: 15,
  },
  onlyCross: {
    marginLeft: "0px !important",
  },
  wFit: {
    width: "fit-content !important",
    borderRadius: "8px",
    height: 40,
    minWidth: "45px",
  },
});
const CloseCrossButton = ({ onClick, btnClass, closeTextNeeded = true }) => {
  const classes = useStyles();
  return (
    <SecondaryButton
      onClick={onClick}
      className={`${classes.closeBtn} ${classes.cross} ${btnClass} ${
        !closeTextNeeded && classes.wFit
      }`}
    >
      {closeTextNeeded && "Close"}
      <img
        src={CrossIcon}
        className={`classes.cross ${!closeTextNeeded && classes.onlyCross}`}
        alt="."
      />
    </SecondaryButton>
  );
};

export default CloseCrossButton;
