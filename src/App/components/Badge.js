import React from "react";

const Badge = ({ count, children, style, innerDivStyle = {} }) => {
  return (
    <div style={{ display: "flex", ...style }}>
      <div>{children}</div>
      <div
        style={{
          alignSelf: "flex-start",
          marginLeft: 6,
          backgroundColor: "#E7E8ED",
          padding: "5px 10px",
          borderRadius: 9.5,
          display: "flex",
          alignItems: "center",
          ...innerDivStyle,
        }}
      >
        <span className="label" style={{ paddingBottom: 0 }}>
          {count}
        </span>
      </div>
    </div>
  );
};

export default Badge;
