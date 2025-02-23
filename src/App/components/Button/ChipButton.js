import React from "react";

const ChipButton = ({ color, textColor = "white", label }) => (
  <div
    style={{
      backgroundColor: color,
      borderRadius: 20,
      padding: "2px 20px",
      textAlign: "center",
      display: "inline",
    }}
    className="c1"
  >
    <span style={{ color: textColor }}>{label}</span>
  </div>
);

export default ChipButton;
