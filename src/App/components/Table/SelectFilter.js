import React, { useState } from "react";
import { makeStyles, Typography, Menu, withStyles } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import reversePyramidFilter_Active from "../../assets/icons/reversePyramidFilter_Active.svg";
import reversePyramidFilter_Inactive from "../../assets/icons/reversePyramidFilter_Inactive.svg";
const StyledMenu = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#EDECF5",
    },
    fontSize: "12px !important",
    width: "100%",
    background: "#F3F4F7",
    marginTop: "8px !important",
    fontWeight: 700,
    textAlign: "center !important",
    padding: 10,
    borderRadius: "8px !important",
    justifyContent: "center",
    whiteSpace: "normal",
  },
  selected: {
    backgroundColor: "white !important",
    color: "#FF0083 !important",
    fontWeight: 700,
    fontSize: "12px !important",
    border: "1px solid #FF0083 !important",
  },
})(MenuItem);

const SelectFilter = ({
  menu,
  selectedIndex,
  setSelectedIndex,
  setSelectedValue,
  activeIcon = reversePyramidFilter_Active,
  inactiveIcon = reversePyramidFilter_Inactive,
  isTextNeeded,
  extraText,
  ellispe
}) => {
  const [anchorEl, setAnchorEl] = useState(null);

  // <============ All Helper Functions

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setSelectedValue(menu[index]);
    setAnchorEl(null);
  };

  const getMenus = () => {
    return (
      <>
        {menu.map((e, index) => {
          return (
            <StyledMenu
              key={index}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {e}
            </StyledMenu>
          );
        })}
      </>
    );
  };

  // <========== Variables

  const open = Boolean(anchorEl);
  const classes = useStyles();
  return (
    <>
      <img
        src={selectedIndex === 0 ? inactiveIcon : activeIcon}
        className={`${classes.pyramid} cursor-pointer`}
        onClick={handleIconClick}
        aria-controls="fade-menu"
        aria-haspopup="true"
      />
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        getContentAnchorEl={null}
        onClose={handleClose}
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        classes={{
          paper: classes.paperMenu,
        }}
        
      >
        {getMenus()}
      </Menu>
      {isTextNeeded && (
        <Typography className={`${ellispe?classes.title:""}`}>{`${
          menu[selectedIndex] || ""
        } ${selectedIndex == 0 && extraText ? extraText : ""}`}</Typography>
      )}
    </>
  );
};

export default SelectFilter;

const useStyles = makeStyles({
  pyramid: {
    marginLeft: 10,
  },
  paperMenu: {
    minWidth: "136px !important",
    maxWidth: "200px !important",
    padding: "7px !important",
    "& .MuiList-padding": {
      paddingTop: 0,
      paddingBottom: 0,
    },
    maxHeight: 300,
  },
  title: {
    fontWeight: "600",
    fontSize: "26px",
    marginLeft: 10,
    color: "#FF0083",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "25ch",
    "@media (max-width:1300px)": {
      maxWidth: "25ch",
    },
    "@media (max-width:1250px)": {
      maxWidth: "25ch",
    },
    "@media (max-width:1180px)": {
      maxWidth: "25ch",
    },
    "@media (max-width:1100px)": {
      maxWidth: "25ch",
    },
    "@media (max-width:1000px)": {
      fontSize: 23,
      maxWidth: "25ch",
    },
    "@media (max-width:800px)": {
      fontSize: 20,
    },
  },
});
