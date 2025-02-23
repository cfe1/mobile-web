import React, { useState, useEffect } from "react";

import RowUnselectedIcon from "../../assets/icons/row-unselected.svg";
import RowSelectedIcon from "../../assets/icons/row-selected.svg";
import PinkTick from "../../assets/icons/PinkTick.svg";

const SelectRow = ({ selected, onClick, style,isPink }) => {
  const [isSelected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(selected);
  }, [selected]);
  return (
    <div
      style={style}
      className="cursor-pointer"
      onClick={() => {
        setSelected(!isSelected);

        if (onClick) {
          onClick();
        }
      }}
    >
      <img
        src={
          isSelected
            ? !isPink
              ? RowSelectedIcon
              : PinkTick
            : RowUnselectedIcon
        }        style={{ height: 24, width: 24 }}
      />
    </div>
  );
};

export default SelectRow;
