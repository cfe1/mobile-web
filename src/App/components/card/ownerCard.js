import React from "react";

const OwnerCard = (props) => {
  return (
    <div className="fd-card" style={{width:props.size==="small"?"18%":"28.5%", cursor:"pointer",marginRight:10,marginBottom:10}} onClick={props.onClick}>
      <div className="fd-card-icon">
        <img src={props.icon} alt="facility icon" />
      </div>
      <div className="fd-card-title">{props.title}</div>
      <div className="fd-card-count">{props.count}</div>
    </div>
  );
};

export default OwnerCard;
