import React from "react";

import BackIcon from "../../assets/icons/back.svg";

const BackButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <img src={BackIcon} style={{ marginRight: 14 }} alt="back" />
    </div>
  );
};

export default BackButton;
