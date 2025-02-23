import React from "react";
import { Typography } from "@material-ui/core";

import RadioOnImage from "./assets/radio-filled.svg";
import RadioOffImage from "./assets/radio-unfilled.svg";

const Radio = ({ isOn = false, label = "", style = {}, onToggle }) => {
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
        src={isOn ? RadioOnImage : RadioOffImage}
        style={{ marginRight: 14 }}
      />
      <Typography style={{fontWeight:600, fontSize:13}}>{label}</Typography>
    </div>
  );
};

export default Radio;
