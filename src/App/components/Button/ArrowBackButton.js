import React from "react";

import BackIcon from "../../assets/icons/arrow-back.svg";

const ArrowBackButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <img src={BackIcon} style={{ marginRight: 14 }} alt="back" />
    </div>
  );
};

export default ArrowBackButton;
