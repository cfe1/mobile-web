import React, { useState, useEffect } from "react";
import RowUnselectedIcon from "../../assets/icons/greenUnchecked.svg";
import RowSelectedIcon from "../../assets/icons/greenChecked.svg";
import PinkTick from "../../assets/icons/PinkTick.svg";
import { makeStyles } from "@material-ui/core/styles";

const GreenSelectRow = ({
  selected,
  onClick,
  style,
  isNotNeeded,
  isPink,
  className,
}) => {
  const onSelectClick = (e) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };
  const classes = useStyles();

  return (
    <div
      style={style}
      className={`${!isNotNeeded ? "cursor-pointer" : ""} ${className}`}
      onClick={
        !isNotNeeded
          ? onSelectClick
          : (e) => {
              e.stopPropagation();
            }
      }
    >
      <img
        src={
          selected ? (!isPink ? RowSelectedIcon : PinkTick) : RowUnselectedIcon
        }
        className={classes.img}
      />
    </div>
  );
};

export default GreenSelectRow;

const useStyles = makeStyles((theme) => ({
  img: {
    height: 24,
    width: 24,
    "@media (min-width: 1100px) and (max-width:1360px)": {
      height: 22,
      width: 22,
    },
    "@media (min-width: 760px) and (max-width:1100px)": {
      height: 20,
      width: 20,
    },
  },
}));
