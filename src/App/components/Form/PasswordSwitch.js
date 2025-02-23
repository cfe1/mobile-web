import React from "react";
import { Typography } from "@material-ui/core";

import SwtichOnImage from "./assets/password-switch-on.svg";
import SwtichOffImage from "./assets/password-switch-off.svg";

const Switch = ({ isOn = false, label = "", style = {}, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      <img
        src={isOn ? SwtichOnImage : SwtichOffImage}
        style={{ marginRight: 14 }}
      />
      <Typography variant="c2">{label}</Typography>
    </div>
  );
};

export default Switch;
