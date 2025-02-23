import React from "react";

export const Divider = (props) => {
  return (
    <div
      className={props.className}
      style={{
        backgroundColor: "#E4E4ED",
        height: 1,
        width: "100%",
        marginBottom: 20,
        ...props.style,
      }}
    />
  );
};

export default Divider;
