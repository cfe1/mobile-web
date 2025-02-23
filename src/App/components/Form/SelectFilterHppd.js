import React from "react";
import { Select, MenuItem, makeStyles } from "@material-ui/core";
import ArrowDropDownIcon from "../../assets/icons/pinkArrowDown.svg"; // Placeholder for custom arrow

const useStyles = makeStyles((theme) => ({
  select: {
    width: '253px',
    height: '42px',
    paddingTop: '0',
    paddingBottom: '0',
    paddingLeft: '16px',
    fontSize: "14px",
    borderRadius: 8,
    fontWeight: '800 !important',
    border: '1px solid #F3F4F7',
    color: theme.palette.secondary.greyBlue, // Adjust text color as per design
    "&:focus": {
      backgroundColor: "transparent", // Remove default Material-UI focus color
    },
  },
  selectRoot: {
    display: "flex",
    alignItems: "center",
    paddingRight: "28px", // Adjust for custom arrow
  },
  icon: {
    backgroundImage: `url(${ArrowDropDownIcon})`, // Replace with your image path
    backgroundRepeat: "no-repeat",
    backgroundSize: "12px", // Adjust based on arrow size
    backgroundPosition: "center",
    height: "100%",
    width: "20px", // Adjust for custom arrow width
    right: 16, // Ensure it aligns properly
    position: "absolute",
    pointerEvents: "none", // Prevent interaction with the icon
    color: 'transparent',
    top: 1
  },
  menuItem: {
    fontSize: "14px",
    fontWeight: '800 !important',
    color: theme.palette.secondary.greyBlue // Match dropdown text style with the design
  }
}));

const SelectFilterHppd = ({ id, items, value, onChange, height }) => {
  const classes = useStyles();

  return (
    <Select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disableUnderline // Removes the underline
      classes={{
        root: classes.selectRoot,
        select: classes.select,
        icon: classes.icon,
      }}
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        getContentAnchorEl: null,
      }}
    >
      {items.map((item) => (
        <MenuItem
          key={item.value}
          value={item.value}
          className={classes.menuItem}
        >
          {item.label}
        </MenuItem>
      ))}
    </Select>
  );
};

export default SelectFilterHppd;
