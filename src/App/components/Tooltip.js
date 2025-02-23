import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";

import TooltipWarningIcon from "../assets/icons/tooltip-warning-icon.svg";
import TooltipInfoIcon from "../assets/icons/tooltip-info-icon.svg";

const LightTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow:
      "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    fontSize: 14,
    width: 200,
    borderRadius: 10,
    padding: "20px 25px",
  },
}))(Tooltip);

const CustomTooltip = ({ title, info, warning, position, showMore }) => (
  <LightTooltip
    title={title}
    placement={position}
    trigger={"click focus hover"}
  >
    {showMore === true ? (
      <div>...Show More</div>
    ) : (
      <img
        src={warning ? TooltipWarningIcon : info && TooltipInfoIcon}
        alt="tooltip"
      />
    )}
  </LightTooltip>
);

export default CustomTooltip;
