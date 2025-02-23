import React from "react";

const TaxCard = (props) => {
  return (
    <div
      className="fd-card-tax"
      style={{
        width: props.size === "small" ? "18%" : "30%",
        cursor: "pointer",
      }}
      onClick={props.onClick}
    >
      <div className="fd-card-tax-icon">
        <img src={props.icon} alt="facility icon" />
      </div>
      <div className="fd-card-tax-title">{props.title}</div>
      <div className="fd-card-tax-count">{props.count}</div>
    </div>
  );
};

export default TaxCard;
