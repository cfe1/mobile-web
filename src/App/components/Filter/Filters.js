import React, { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import filterIcon from "../../assets/icons/filterIcon.svg";
import rightArrow from "../../assets/icons/right-arrow1.svg";
import orangeCross from "../../assets/icons/orangeX.svg";
import greenX from "../../assets/icons/greenX.svg";
import blueX from "../../assets/icons/blueX.svg";
import Popover from "@material-ui/core/Popover";
import GreenSelectRow from "../Table/GreenSelectRow";
import { FilterConts } from "./filterConts";

const CROSS_IMG = {
  0: orangeCross,
  1: greenX,
  2: blueX,
};
const Filters = ({
  filterObject,
  widthStyle,
  gridSize,
  onFilterSelected = null,
  selectedFiltersPopulate = [],
}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilterIndex, setselectedFilterIndex] = useState(0);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [selectedFilters, setSelectedFilters] = useState([
    {
      value: "CLEAR_ALL",
      label: "Clear All",
      index: -1,
    },
  ]);

  useEffect(() => {
    setSelectedFilters([...selectedFiltersPopulate]);
    if (!filterObject[selectedFilterIndex]) {
      setselectedFilterIndex(0);
    }
  }, [selectedFiltersPopulate]);

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);

  const toggle = (index) => {
    setselectedFilterIndex(index);
  };
  const singleItemSelect = (index, value, label) => {
    //If we have signle select filter then we are checking if element in selected or not
    const { setFunction, value: selectedValue } = filterObject[index] || {};
    if (selectedValue === value) {
      setFunction(null);
      setSelectedFilters(
        selectedFilters.filter((existedVal) => {
          return existedVal?.value !== value;
        })
      );
    } else {
      setFunction(value);
      const filterPresent = selectedFilters?.find(
        (filter, index) => filter?.index === selectedFilterIndex
      );
      let filteredSingleArray = [];
      if (filterPresent) {
        filteredSingleArray = [
          { value, index: selectedFilterIndex, label },

          ...selectedFilters?.filter(
            (filter) => filter?.index !== selectedFilterIndex
          ),
        ];
      } else {
        filteredSingleArray = [
          { value, index: selectedFilterIndex, label },
          ...selectedFilters,
        ];
      }
      setSelectedFilters([...filteredSingleArray]);
    }
  };

  const passSelectedValuesToParent = (selectedFilters) => {
    if (onFilterSelected) {
      onFilterSelected(selectedFilters);
    }
  };

  const multipleItemSelect = (value, label, index) => {
    //If we have multiple select filter then we are checking if element in selected or not
    const key =
      index != undefined || index != null ? index : selectedFilterIndex;
    const { setFunction, value: selectedValue } = filterObject[key] || {};
    if (selectedValue?.includes(value)) {
      setFunction(
        selectedValue?.filter((selectedVal) => selectedVal !== value)
      );
      const updatedSelectedFilters = selectedFilters.filter((existedVal) => {
        return existedVal?.value !== value;
      });
      setSelectedFilters(
        selectedFilters.filter((existedVal) => {
          return existedVal?.value !== value;
        })
      );
      passSelectedValuesToParent(updatedSelectedFilters);
    } else {
      setFunction([...selectedValue, value]);
      const updatedSelectedFilters = [
        { value, index: selectedFilterIndex, label },
        ...selectedFilters,
      ];
      passSelectedValuesToParent(updatedSelectedFilters);
      setSelectedFilters(updatedSelectedFilters);
    }
  };
  const getFilterName = (obj, index) => {
    // Left panel of filter
    const { paramName, icon, value } = obj || {};
    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={`${classes.paramContainer} ${
          selectedFilterIndex !== index && classes.notSelected
        }`}
        onClick={() => {
          toggle(index);
        }}
      >
        <Grid item xs={10} container justify="flex-start" alignItems="center">
          <img src={icon} className={classes.icon}></img>
          <Grid className={classes.paramName}>{paramName}</Grid>
        </Grid>
        <Grid
          item
          xs={2}
          container
          className={classes.number}
          justify="center"
          alignItems="center"
        >
          {selectedFilterIndex === index ? (
            <img src={rightArrow}></img>
          ) : obj?.type === FilterConts.SINGLE_SELECT ? (
            value === "All" || !value ? (
              0
            ) : (
              1
            )
          ) : (
            value?.length
          )}
        </Grid>
      </Grid>
    );
  };
  const singleCheck = (value, index) => {
    //If filter is single select then we are using this function to single select
    const { value: selectedValue } = filterObject[index] || {};
    if (value === selectedValue) {
      return true;
    } else {
      return false;
    }
  };
  const multipleCheck = (value) => {
    //If filter is multiple select then we are using this function to single select

    const { value: selectedValue } = filterObject[selectedFilterIndex] || {};
    if (selectedValue.includes(value)) {
      return true;
    } else {
      return false;
    }
  };
  const getItem = (item, index) => {
    const { value, label } = item || {};
    return (
      <Grid
        container
        justify="space-between"
        alignItems="center"
        className={`${classes.paramContainer} ${
          selectedFilterIndex !== index && classes.notSelected
        }`}
      >
        <Grid item xs={10} container justify="flex-start" alignItems="center">
          <Grid className={classes.lableName}>{label}</Grid>
        </Grid>
        <Grid item xs={2} container justify="flex-end">
          <GreenSelectRow
            selected={
              filterObject[selectedFilterIndex].type ===
              FilterConts.SINGLE_SELECT
                ? singleCheck(value, selectedFilterIndex)
                : multipleCheck(value)
            }
            onClick={
              filterObject[selectedFilterIndex].type ===
              FilterConts.SINGLE_SELECT
                ? () => {
                    singleItemSelect(selectedFilterIndex, value, label);
                  }
                : () => {
                    multipleItemSelect(value, label);
                  }
            }
          />
        </Grid>
      </Grid>
    );
  };

  const noFilters = filterObject?.find((obj) => {
    if (obj.type === FilterConts.SINGLE_SELECT && obj.value !== "All") {
      if (obj.value) {
        return true;
      }
      return false;
    } else {
      if (!obj.type && obj.value?.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  });
  const getChip = (filter) => {
    const { label, index, value } = filter;
    return (
      <Grid
        className={`${classes.filterChip} ${
          index === -1 ? classes.blackBorder : classes[index % 3]
        }`}
        justify="center"
        alignItems="center"
        onClick={index === -1 ? () => clearAll() : () => {}} //-1 for clear all
      >
        {label}
        {index !== -1 && (
          <img
            src={CROSS_IMG[index % 3]}
            className={classes.img}
            onClick={
              filterObject[index]?.type === FilterConts.SINGLE_SELECT
                ? () => singleItemSelect(index, value, label)
                : () => multipleItemSelect(value, label, index)
            }
          />
        )}
      </Grid>
    );
  };
  const clearAll = () => {
    filterObject.forEach((element) => {
      const { setFunction, initialValue } = element;
      setFunction(initialValue);
      setSelectedFilters([
        {
          value: "CLEAR_ALL",
          label: "Clear All",
          index: -1,
        },
      ]);
      if (onFilterSelected) {
        onFilterSelected([
          {
            value: "CLEAR_ALL",
            label: "Clear All",
            index: -1,
          },
        ]);
      }
    });
  };
  return (
    <>
      <Grid
        className={classes.filterContainer}
        style={widthStyle}
        xs={gridSize || 8}
        md={7}
        item
      >
        <Grid item className={classes.filter} onClick={(e) => handleClick(e)}>
          <img className={classes.filterIcon} src={filterIcon}></img>Add Filter
        </Grid>
        {!noFilters && (
          <div className={classes.noFilters}>No filters applied</div>
        )}
        {noFilters && (
          <Grid className={classes.mgLeft}>
            {selectedFilters.map((filter, index) => {
              return getChip(filter, index);
            })}
          </Grid>
        )}
      </Grid>

      <Popover
        //id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Grid container className={classes.metricsContainer}>
          <Grid item xs={4} className={classes.filterParams}>
            {filterObject?.map((obj, index) => {
              return getFilterName(obj, index);
            })}
          </Grid>
          <Grid
            item
            xs={8}
            className={classes.itemsContainer}
            container
            direction="column"
            justify="space-between"
          >
            <Grid className={classes.items}>
              {filterObject[selectedFilterIndex]?.items?.map((item, index) => {
                return getItem(item, index);
              })}
            </Grid>
            <Grid
              container
              className={classes.filterApplied}
              justify="space-between"
              alignItems="center"
            >
              <div>Filter Applied</div>
              {
                <Grid
                  item
                  container
                  className={`${classes.number} ${classes.pinkBg}`}
                  justify="center"
                  alignItems="center"
                >
                  {filterObject[selectedFilterIndex]?.type ===
                  FilterConts.SINGLE_SELECT
                    ? filterObject[selectedFilterIndex].value === "All" ||
                      !filterObject[selectedFilterIndex].value
                      ? 0
                      : 1
                    : filterObject[selectedFilterIndex]?.value?.length}
                </Grid>
              }
            </Grid>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
};
export default Filters;

const useStyles = makeStyles((theme) => ({
  filter: {
    height: 32,
    width: 124,
    borderRadius: 60,
    background: "#F3F4F7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 600,
    color: "#71718E",
    padding: "4px 8px",
    cursor: "pointer",
    boxSizing: "border-box",
  },
  filterIcon: {
    marginRight: 6,
  },
  metricsContainer: {
    borderRadius: 16,
    minHeight: 470,
    width: 670,
    overflow: "overlay",
  },
  filterParams: {
    padding: 16,
    background: "#F3F4F7",
  },
  itemsContainer: {
    padding: 16,
  },
  paramName: {
    fontWeight: 700,
    fontSize: 16,
    marginLeft: 6,
    cursor: "pointer",
  },
  icon: {
    width: 14,
    height: 14,
  },
  paramContainer: {
    background: "#FFF",
    height: 36,
    borderRadius: 8,
    padding: 8,
  },
  notSelected: {
    background: "unset",
  },
  lableName: {
    fontSize: 16,
    fontWeight: 500,
  },
  number: {
    height: 24,
    width: 24,
    borderRadius: 50,
    background: "#FFF",
  },
  filterApplied: {
    height: 50,
    borderRadius: "0px 0px 16px 0px",
    borderTop: "1px solid #EDECF5",
    fontSize: 12,
    fontWeight: 500,
  },
  items: {
    overflow: "overlay",
    height: 450,
  },
  pinkBg: {
    background: theme.palette.primary.main,
    color: "#FFFFFF",
    height: 24,
    width: 24,
  },
  noFilters: {
    fontSize: 14,
    fontWeight: 600,
    color: "#71718E",
    marginLeft: 8,
  },
  filterContainer: {
    display: "flex",
    alignItems: "center",
  },
  filterChip: {
    display: "flex",
    padding: "4px 8px",
    lineHeight: "24px",
    borderRadius: 60,
    marginLeft: 8,
    height: 32,
    boxSizing: "border-box",
    fontSize: 14,
    fontWeight: 600,
  },
  blackBorder: {
    border: `1px solid black`,
    background: theme.palette.background.white,
    color: "black",
    cursor: "pointer",
  },
  0: {
    border: `1px solid ${theme.palette.secondary.orange}`,
    background: theme.palette.background.ltOrange,
    color: theme.palette.secondary.orange,
  },
  1: {
    border: `1px solid ${theme.palette.secondary.darkGreen}`,
    background: theme.palette.background.ltgreen,
    color: theme.palette.secondary.darkGreen,
  },
  2: {
    border: `1px solid ${theme.palette.secondary.darkBlue}`,
    background: theme.palette.background.skyBlue,
    color: theme.palette.secondary.darkBlue,
  },
  mgLeft: {
    marginLeft: 16,
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 5,
  },
  img: {
    height: 16,
    width: 16,
    marginLeft: 4,
    cursor: "pointer",
  },
}));
