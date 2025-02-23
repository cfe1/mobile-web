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
    height: 20,
    width: 20,
  },
  checkboxWrapperClass: {
    marginRight: 10,
  },
  zIn: {
    zIndex: 100,
  },
  scrollClass: {
    maxHeight: 220,
    overflowY:'scroll'
  },
  searchContainer: {
    height: 42,
    zIndex: 100,
    border: "1px solid #F3F4F7",
    borderRadius: 4,
  },
  searchIcon: { marginLeft: 20, marginRight: 10, height: 20, width: 20 },
  inputBase: {
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
  },
  CrossIcon: {
    marginBottom: -5,
    marginRight: 10,
  },
  selectAllContainer: {
    padding: 10,
    borderTop: "solid 1px #F2F2F7",
    width: 210,
    background: "#F3F4F7",
    marginTop: 8,
    borderRadius: 8,
  },
  boxClass: {
    padding: 10,
    borderTop: "solid 1px #F2F2F7",
    zIndex: 100,
  },
  filteredItemsContainer: {
    borderTop: "solid 1px #F2F2F7",
    // width: 210,
    background: "#F3F4F7",
    marginTop: 8,
    borderRadius: 4,
    boxSizing: "border-box",
    //height: 32,
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    fontSize: 10,
    fontWeight: 600,
  },

  dropDownItemTxt: {
    marginTop: -4,
    fontSize: 13,
    fontWeight: 700,
    color: "black",
  },
});

const FacilityFilterDropdownMenu = ({
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
  menuClass = "",
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
        <span className="c1" value={`${value}`}  className={classes.dropDownItemTxt}>
          {valueText}
        </span>
      </>
    );
  };



  const classes = useStyles();
  return (
    <div
      onClick={(e) => e.preventDefault()}
      id="staffings"
     // className={classes.scrollClass}
    >
      {searchEnabled && (
        <div
          className={`row-center ${classes.searchContainer}`}
          onClick={(e) => e.preventDefault()}
        >
          <img src={SearchIcon} alt="" className={classes.searchIcon} />
          <InputBase
            onClick={(e) => e.preventDefault()}
            value={query}
            placeholder={searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            className={classes.inputBase}
          />
          {query !== "" && (
            <div
              onClick={() => {
                setQuery("");
              }}
              className="cursor-pointer"
            >
              <img src={CrossIcon} className={classes.CrossIcon} alt="" />
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
            className={classes.selectAllContainer}
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
            } row-center cursor-pointer ${classes.boxClass}`}
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
      <div className={classes.scrollClass}>
        {filteredItems.map((item) => (
          <div
            id="items"
            key={item.value}
            className={`row-center cursor-pointer ${classes.filteredItemsContainer}`}
            onClick={() => onToggle(item.value)}
          >
            {handleGetCheckBox(
              selectedItems.map((item) => item?.value).includes(item?.value),
              "",
              item.label
            )}
          </div>
        ))}
      </div>

    </div>
  );
};

export default FacilityFilterDropdownMenu;
