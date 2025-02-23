import React from "react";

import CheckboxOnImage from "./assets/checkbox-filled.svg";
import RadioOffImage from "./assets/radio-unfilled.svg";

const Checkbox = ({ isOn = false, style = {}, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        ...style,
      }}
      className="cursor-pointer"
    >
      <img
        src={isOn ? CheckboxOnImage : RadioOffImage}
        style={{ marginRight: 14, height: 20, width: 20 }}
        alt=""
      />
    </div>
  );
};

export default Checkbox;
