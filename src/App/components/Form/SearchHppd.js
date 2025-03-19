import React, { useState, useCallback, useEffect, useRef } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "./assets/search.svg";
import CrossIcon from "./assets/cross-icon.svg";
import { debounce } from "lodash";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  rowCenter: {
    border: "solid 1px #DDDFE6",
    backgroundColor: "#F3F4F7",
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
  noAutofill: {
    "&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active": {
      WebkitBoxShadow: "0 0 0 1000px #F3F4F7 inset !important",
      WebkitTextFillColor: "#82889C !important",
      transition: "background-color 5000s ease-in-out 0s",
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
}) => {
  const classes = useStyles();
  const inputRef = useRef(null);
  const [searchValue, setSearchValue] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(true); // Start with readonly
  const handler = useCallback(debounce(onChange, 500), [onChange]);

  // Apply readonly until input is focused
  useEffect(() => {
    const handleFocus = () => {
      setIsReadOnly(false);
    };

    const handleBlur = () => {
      // Short delay to allow clicking in the input again
      setTimeout(() => {
        if (document.activeElement !== inputRef.current?.querySelector('input')) {
          setIsReadOnly(true);
        }
      }, 100);
    };

    const input = inputRef.current?.querySelector('input');
    if (input) {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
      
      // Initial setup - make it readonly
      input.setAttribute('readonly', 'readonly');
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  // Update the readonly state of the input
  useEffect(() => {
    const input = inputRef.current?.querySelector('input');
    if (input) {
      if (isReadOnly) {
        input.setAttribute('readonly', 'readonly');
      } else {
        input.removeAttribute('readonly');
      }
    }
  }, [isReadOnly]);

  // Handle input changes
  const handleChange = (e) => {
    if (!isReadOnly) {
      const newValue = e.target.value;
      setSearchValue(newValue);
      e.persist();
      handler(e);
    }
  };

  // Handle cross button click
  const onCrossClick = () => {
    setSearchValue("");
    if (setSearch) {
      setSearch("");
    }
    if (onCrossClickParent) {
      onCrossClickParent();
    }

    // Force input to clear
    if (inputRef.current) {
      const input = inputRef.current.querySelector("input");
      if (input) {
        input.value = "";
      }
    }
  };

  // Delayed rendering approach to avoid autofill
  const [readyToRender, setReadyToRender] = useState(false);
  
  useEffect(() => {
    // Delay rendering the actual input field
    const timer = setTimeout(() => {
      setReadyToRender(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (!readyToRender) {
    // Show a placeholder while the real input is not yet rendered
    return (
      <div style={style} className={styelClass}>
        <div className={`row-center ${classes.rowCenter} ${widthClass}`} style={{ backgroundColor: "#F3F4F7" }}>
          {/* Placeholder */}
        </div>
      </div>
    );
  }

  return (
    <div style={style} className={styelClass}>
      <div className={`row-center ${classes.rowCenter} ${widthClass}`}>
        <div ref={inputRef}>
          <InputBase
            classes={{
              root: classes.customTextField,
              input: classes.noAutofill,
            }}
            value={searchValue}
            placeholder={label}
            onChange={handleChange}
            className={classes.InputBase}
            // Different form context
            form="search-form-only"
            // Use type="search" instead of "text"
            type="search"
            // Important autofill prevention attributes
            autoComplete="off"
            // Random name and id on each render
            name={`search_${Math.random().toString(36).substring(2, 15)}`}
            id={`id_${Math.random().toString(36).substring(2, 15)}`}
            // Prevent detection as a login field
            inputProps={{
              autoCapitalize: "off",
              autoCorrect: "off",
              spellCheck: "false",
              "aria-autocomplete": "none",
              "data-form-type": "other",
              "data-lpignore": "true",
              "data-com.bitwarden.browser.user-edited": "no",
            }}
          />
        </div>

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