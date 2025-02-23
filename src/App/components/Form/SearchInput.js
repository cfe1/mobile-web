import React, { useState, useCallback } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchOutlinedIcon from "./assets/search.svg";
import SearchIcon from "./assets/search-line.svg";
import CrossIcon from "./assets/cross-icon.svg";
import { debounce } from "lodash";

const SearchInput = React.forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const { value, onChange, onClose, style } = props;
  const handler = useCallback(debounce(onChange, 500), []);

  const handleChange = (e) => {
    setSearchValue(e.target.value);
    e.persist();
    handler(e);
  };
  return (
    <div style={style}>
      {isOpen ? (
        <div
          className="row-center"
          style={{
            border: "solid 1px #EDECF5",
            borderRadius: 4,
            height: 40,
          }}
        >
          <img
            src={SearchIcon}
            style={{ marginLeft: 10, marginRight: 10 }}
            alt="search"
          />
          <InputBase
            value={searchValue}
            onChange={(e) => handleChange(e)}
            style={{
              fontSize: 13,
              lineHeight: 20 / 13,
              fontWeight: 600,
            }}
          />
          <div
            ref={ref}
            onClick={() => {
              setIsOpen(false);
              setSearchValue("");
              if (onClose) {
                onClose();
              }
            }}
            className="cursor-pointer"
          >
            <img
              src={CrossIcon}
              style={{ marginBottom: -5, marginRight: 10 }}
              alt="search"
            />
          </div>
        </div>
      ) : (
        <div onClick={() => setIsOpen(true)} className="cursor-pointer">
          <img src={SearchOutlinedIcon} />
        </div>
      )}
    </div>
  );
});

export default SearchInput;
