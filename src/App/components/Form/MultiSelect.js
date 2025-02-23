import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from "@material-ui/core";
import { DropdownMenu } from "../index";
import { ellipsizeText } from "../../../utils/textUtils";

const ITEM_HEIGHT = 41;
const ITEM_PADDING_TOP = 8;

const MultiSelect = ({
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
  setSelectedItems = () => {},
  isPink,
  onResetClickFunction,
  onBlur,
  onAddToggle = () => {},
  onRemoveToggle = () => {},
  handleReset = () => {},
}) => {
  const [focus, setFocus] = useState(false);
  const onFocusBlur = () => {
    setFocus(false);
  };
  const onSelectClick = () => {
    setFocus(true);
  };
  const onResetClick = () => {
    if (onResetClickFunction && selectedItems.length > 0) {
      onResetClickFunction([]);
    } else if (selectedItems.length > 0) {
      handleReset(selectedItems);
      setSelectedItems([]);
    }
  };
  return (
    <FormControl
      variant="outlined"
      style={style}
      disabled={disabled}
      className={className}
      // focused={focus}
      // onBlur={onFocusBlur}
      // onFocus={onSelectClick}
      // onClick={onFocusBlur}
      fullWidth
      classes={formControlClasses}
    >
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        label={label}
        multiple
        value={selectedItems}
        input={<OutlinedInput label={label} />}
        onBlur={(e) => onBlur && onBlur(e)}
        renderValue={(selected) => {
          if (selected.length > 0) {
            if (selected.length === 1) {
              return ellipsizeText(selected[0]?.label, 17);
            } else {
              return (
                <span>
                  {ellipsizeText(selected[0]?.label, 10)}{" "}
                  <span>(+ {selected?.length - 1} more)</span>
                </span>
              );
            }
          }
        }}
        // onBlur={onFocusBlur}
        // onFocus={onSelectClick}
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
              //   maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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
          onSelectClick={onSelectClick}
          reset={reset}
          setSelectedItems={setSelectedItems}
          isPink={isPink}
          onAddToggle={onAddToggle}
          onRemoveToggle={onRemoveToggle}
        />
        {true && (
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

export default MultiSelect;
