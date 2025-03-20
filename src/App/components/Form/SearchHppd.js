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
  // Hide the autofill background
  noAutofill: {
    "&:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #F3F4F7 inset",
      WebkitTextFillColor: "#82889C",
    },
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
  isPasswordModalOpen = false, // New prop for readonly check
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [key, setKey] = useState(Date.now()); // Used to force re-render with new key
  const handler = useCallback(debounce(onChange, 500), []);

  const handleChange = (e) => {
    // Only process changes if not in readonly mode
    if (!isPasswordModalOpen) {
      setSearchValue(e.target.value);
      e.persist();
      handler(e);
    }
  };
  
  const onCrossClick = () => {
    // Only clear if not in readonly mode
    if (!isPasswordModalOpen) {
      setSearchValue("");
      setSearch("");
      if (onCrossClickParent) {
        onCrossClickParent();
      }
      // Force re-render with new key to clear autofill
      setKey(Date.now());
    }
  };

  // Reset search field and clear autofill when component mounts
  useEffect(() => {
    // Reset the field when component mounts to avoid autofill
    setKey(Date.now());
  }, []);

  const classes = useStyles();
  
  return (
    <div style={style} className={styelClass}>
      <div className={`row-center ${classes.rowCenter} ${widthClass}`}>
        {/* Hidden elements to trick browser autofill */}
        <div style={{ display: 'none' }}>
          <input type="text" name="username" autoComplete="username" />
          <input type="text" name="search-decoy" autoComplete="off" />
        </div>
        
        <InputBase
          key={key}
          classes={{ 
            root: classes.customTextField,
            input: classes.noAutofill
          }}
          value={searchValue}
          placeholder={label}
          onChange={(e) => handleChange(e)}
          className={classes.InputBase}
          autoComplete="off"
          // Use a random name to prevent consistent autofill
          name={`search-${Math.random().toString(36).substring(2, 9)}`}
          // Additional attributes to prevent autofill
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          aria-autocomplete="none"
          inputProps={{
            "data-form-type": "other",
            "data-lpignore": "true", // Ignores LastPass autofill
            readOnly: isPasswordModalOpen // Add readonly attribute when password modal is open
          }}
        />
        
        {searchValue.length > 0 ? (
          <img
            src={CrossIcon}
            onClick={onCrossClick}
            className={`${classes.crossStyle} ${classes.imgStyle}`}
            alt="search"
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default SearchHppd;