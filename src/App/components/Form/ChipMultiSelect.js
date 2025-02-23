import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  makeStyles,
} from "@material-ui/core";
import { DropdownMenu } from "../index";
import { ellipsizeText } from "../../../utils/textUtils";
import CrossIcon from "../../../App/assets/icons/cross_icon.svg";
const ITEM_HEIGHT = 41;
const ITEM_PADDING_TOP = 8;
const useStyles = makeStyles((theme) => ({
  chip: {
    padding: 2,
    display: "flex",
    alignItems: "center",
    background: theme.palette.background.grey4,
    width: "fit-content",
    borderRadius: 4,
    marginLeft: 2,
    marginBottom: 3,
  },
  icon: {
    marginLeft: 2,
  },
  select: {
    display: "flex",
  },
  flex: {
    display: "flex",
    flexWrap: "wrap",
    flexGrow: 1,
    gap: 10,
  },
}));
const ChipMultiSelect = ({
  id,
  label,
  items,
  searchEnabled,
  searchPlaceholder,
  selectedItems,
  onSelect,
  style,
  disabled,
  selectAll,
  favourites,
  className,
  popoverPaper,
  listRoot,
  formControlClasses,
  reset,
  setSelectedItems,
  isPink,
  onBlur,
}) => {
  const onResetClick = () => {
    if (selectedItems.length > 0) setSelectedItems([]);
  };
  const onCrossClick = (value) => {
    const newSelectedItems = selectedItems.filter(
      (item) => item.value !== value
    );
    onSelect(newSelectedItems);
  };
  const classes = useStyles();
  return (
    <FormControl
      variant="outlined"
      style={style}
      disabled={disabled}
      className={className}
      fullWidth
      classes={formControlClasses}
    >
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        label={label}
        multiple
        className={classes.select}
        value={selectedItems}
        input={<OutlinedInput label={label} />}
        onBlur={(e) => onBlur && onBlur(e)}
        renderValue={(selected) => {
          return (
            <div className={classes.flex}>
              {selected.map((item, index) => {
                return (
                  <div className={classes.chip}>
                    <span>{item.label}</span>
                    <img
                      className={classes.icon}
                      src={CrossIcon}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={() => onCrossClick(item.value)}
                    />
                  </div>
                );
              })}
            </div>
          );
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
          PaperProps: {
            style: {
              width: 159,
              borderRadius: "5px !important",
              marginTop: 5,
              boxShadow:
                "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
            },
          },
          PopoverClasses: {
            paper: popoverPaper,
          },
          MenuListProps: {
            classes: {
              root: listRoot,
            },
          },
        }}
      >
        <DropdownMenu
          items={items}
          selectedItems={selectedItems}
          onSelect={onSelect}
          searchEnabled={searchEnabled}
          searchPlaceholder={searchPlaceholder}
          selectAll={selectAll}
          favourites={favourites}
          reset={reset}
          setSelectedItems={setSelectedItems}
          isPink={isPink}
        />
        {reset && (
          <div
            id="reset"
            key={"reset"}
            style={{
              height: 40,
              displayL: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 7,
              fontSize: 16,
              fontWeight: 700,
              color: "#FF0083",
              boxSizing: "border-box",
              // marginTop:'-8px',
              backgroundColor: "#FFFFFF",
            }}
            className={`row-center cursor-pointer `}
            onClick={onResetClick}
          >
            {"Reset"}
          </div>
        )}
      </Select>
    </FormControl>
  );
};
export default ChipMultiSelect;
