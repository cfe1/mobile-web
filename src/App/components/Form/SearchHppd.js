import React, { useState, useCallback, useEffect } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "./assets/search.svg";
import CrossIcon from "./assets/cross-icon.svg";
import { debounce } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles({
  rowCenter: {
    border: "solid 1px #DDDFE6",
    backgroundColor: '#F3F4F7',
    height: 42,
    width: 387,
    borderRadius: 4,
    position: "relative",
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
    fontSize: "14px",
    fontWeight: "400",
    color: "#82889C !important",
  
  
  },
  crossStyle: {
    cursor: "pointer",
  },
});
const SearchHppd = ({
  value,
  onChange,
  onClose,
  label,
  style,
  setSearch,
  widthClass,
  styelClass,
  onCrossClick: onCrossClickParent,

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
    onCrossClickParent();
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
        />
        {searchValue.length > 0 ? (
          <img
            src={CrossIcon}
            onClick={onCrossClick}
            className={`${classes.crossStyle} ${classes.imgStyle}`}
            alt="search"
          />
        ) : (
        //   <img src={SearchIcon} className={classes.imgStyle} alt="search" />
        <></>
        )}
      </div>
    </div>
  );
};

export default SearchHppd;
