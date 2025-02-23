import React from "react";
import Typography from "@material-ui/core/Typography";

import SuccessIcon from "../assets/icons/success.svg";

const Step = ({ isSuccessful, isActive, step, title, description }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: 40,
        marginRight: 40,
        cursor: "pointer",
      }}
    >
      {isSuccessful ? (
        <img
          src={SuccessIcon}
          style={{ height: 40, width: 40, marginRight: 14, marginLeft: -20 }}
        />
      ) : (
        <div
          style={{
            background: isActive
              ? "linear-gradient(to right,#D831B4, #6241E9)"
              : "#9494AD",
            height: 40,
            width: 60,
            borderRadius: 20,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 14,
            marginLeft: -20,
          }}
        >
          <span style={{ fontSize: 16 }}>{step}</span>
        </div>
      )}
      <div>
        <Typography >{title}</Typography>
        <Typography
          style={{ fontSize: 12, lineHeight: 18 / 12, marginTop: 4 }}
          className="text-muted"
        >
          {description}
        </Typography>
      </div>
    </div>
  );
};
export default Step;
