import React, { useState, useCallback } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchOutlinedIcon from "./assets/search.svg";
import SearchIcon from "./assets/search-line.svg";
import CrossIcon from "./assets/cross-icon.svg";
import { debounce } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  rowCenter: {
    border: "solid 1px #DDDFE6",
    height: 42,
    borderRadius: 8,
    position: "relative",
    background: "#F3F4F7",
  },
  InputBase: {
    fontWeight: 200,
    paddingLeft: 10,
    width: "90%",
  },
  imgStyle: {
    // marginRight: 10,
    position: "absolute",
    right: 5,
  },
  customTextField: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#222B45",
  },
  crossStyle: {
    cursor: "pointer",
  },
});
const DrawerSearchInput = ({
  value,
  onChange,
  onClose,
  label,
  style,
  setSearch = () => {},
  widthClass,
  styelClass,
  disabled = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const handler = useCallback(debounce(onChange, 500), []);
  const handleChange = (e) => {
    setSearchValue(e.target.value);
    e.persist();
    handler(e);
  };
  const onCrossClick = () => {
    setSearchValue("");
    setSearch("");
  };
  const classes = useStyles();
  return (
    <div style={style} className={styelClass}>
      <div className={`row-center ${classes.rowCenter} ${widthClass}`}>
        <InputBase
          classes={{ root: classes.customTextField }}
          value={searchValue}
          placeholder={label}
          onChange={(e) => handleChange(e)}
          className={classes.InputBase}
          disabled={disabled}
        />
        {searchValue.length > 1 ? (
          <img
            src={CrossIcon}
            onClick={!disabled ? onCrossClick : () => {}}
            className={`${classes.crossStyle} ${classes.imgStyle}`}
            alt="search"
          />
        ) : (
          <img src={SearchIcon} className={classes.imgStyle} alt="search" />
        )}
      </div>
    </div>
  );
};

export default DrawerSearchInput;
