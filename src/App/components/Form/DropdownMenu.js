import React, { useState, useEffect } from "react";
import InputBase from "@material-ui/core/InputBase";
import Checkbox from "./Checkbox";
import SearchIcon from "./assets/search-line.svg";
import CrossIcon from "./assets/cross-icon.svg";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  disabled: {
    display: "flex",
    pointerEvents: "none",
    color: "rgb(0 0 0 / 38%) !important",
    fontWeight: "400 !important",
  },
  checkbox: {
    marginRight: 0,
  },
  checkboxWrapperClass: {
    marginRight: 10,
  },
  zIn: {
    zIndex: 100,
  },
  scrollClass: {
    maxHeight: 230,
    overflowX: "overlay",
  },
});

const DropdownMenu = ({
  items = [],
  searchEnabled,
  searchPlaceholder = "",
  selectedItems = [],
  onSelect,
  selectAll,
  favourites,
  reset,
  setSelectedItems,
  isPink,
}) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item?.label?.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [query]);

  const onToggle = (value) => {
    let newSelectedItems = [];
    if (selectedItems.some((item) => item.value === value)) {
      // remove case
      newSelectedItems = selectedItems.filter((item) => item.value !== value);
    } else {
      //add case
      newSelectedItems = [...selectedItems].concat(
        items.filter((item) => item.value === value)
      );
    }
    if (onSelect) {
      onSelect(newSelectedItems);
    }
  };

  const handleToggleAll = () => {
    if (onSelect) {
      //Select all items
      onSelect(items);
    }
    if (selectedItems.length === items.length) {
      //Unselect all items
      onSelect([]);
    }
  };
  const handleFavourites = () => {
    let newfavourites = [];
    if (
      selectedItems.length ===
        items.filter((item) => item.is_favorite === true).length &&
      selectedItems.every((item) => item.is_favorite === true)
    ) {
      //Unselect Favourite Items
      newfavourites = [];
    } else {
      //Select Favourite Items
      newfavourites = items.filter((item) => item.is_favorite === true);
    }
    if (onSelect) {
      onSelect(newfavourites);
    }
  };

  const handleGetCheckBox = (isOn, value, valueText) => {
    return (
      <>
        <Checkbox
          isOn={isOn}
          checkboxClass={classes.checkbox}
          checkboxWrapperClass={classes.checkboxWrapperClass}
          isPink={isPink}
        />
        <span className="c1" value={`${value}`} style={{ marginTop: -4 }}>
          {valueText}
        </span>
      </>
    );
  };

  const onResetClick = () => {
    if (selectedItems.length > 0) setSelectedItems([]);
  };

  const classes = useStyles();
  return (
    <div id="staffings" className={classes.scrollClass}>
      {searchEnabled && (
        <div
          className="row-center"
          style={{
            height: 42,
            zIndex: 100,
          }}
        >
          <img
            src={SearchIcon}
            alt=""
            style={{ marginLeft: 20, marginRight: 10 }}
          />
          <InputBase
            value={query}
            placeholder={searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            style={{
              fontSize: 13,
              lineHeight: 20 / 13,
              fontWeight: 500,
            }}
          />
          {query !== "" && (
            <div
              onClick={() => {
                setQuery("");
              }}
              className="cursor-pointer"
            >
              <img
                src={CrossIcon}
                style={{ marginBottom: -5, marginRight: 10 }}
                alt=""
              />
            </div>
          )}
        </div>
      )}
      {selectAll && (
        <>
          <div
            key="selectAll"
            value="selectAll"
            className="row-center cursor-pointer"
            style={{ padding: 10, borderTop: "solid 1px #F2F2F7", zIndex: 100 }}
            onClick={handleToggleAll}
          >
            {handleGetCheckBox(
              items?.length !== 0 && selectedItems?.length === items?.length,
              "selectAll",
              "Select All"
            )}
          </div>
        </>
      )}
      {favourites && (
        <>
          <div
            key="favourites"
            value="favourites"
            className={`${
              items.filter((item) => item?.is_favorite === true)?.length !== 0
                ? ""
                : classes.disabled
            } row-center cursor-pointer`}
            style={{ padding: 10, borderTop: "solid 1px #F2F2F7", zIndex: 100 }}
            onClick={handleFavourites}
          >
            {handleGetCheckBox(
              selectedItems.length !== 0 &&
                selectedItems.every((item) => item?.is_favorite === true) &&
                selectedItems.filter((item) => item?.is_favorite === true)
                  .length ===
                  items.filter((item) => item?.is_favorite === true)?.length,
              "favourites",
              "Favourites"
            )}
          </div>
        </>
      )}
      <>
        {filteredItems.map((item) => (
          <div
            id="items"
            key={item.value}
            className="row-center cursor-pointer"
            onClick={() => onToggle(item.value)}
            style={{ padding: 10, borderTop: "solid 1px #F2F2F7" }}
          >
            {handleGetCheckBox(
              selectedItems.map((item) => item?.value).includes(item?.value),
              "",
              item.label
            )}
          </div>
        ))}
      </>
    </div>
  );
};

export default DropdownMenu;
