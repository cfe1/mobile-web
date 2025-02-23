import React from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import { Select, withStyles } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { ellipsizeText } from "../../../utils/textUtils";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const useStyles = makeStyles((theme) => ({
  menuPaper: {
    maxHeight: 280,
    maxWidth: 200,
    "@media (max-width:860px) and (min-width:720px)": {
      width: "200px !important",
    },
    whiteSpace: "pre-line",
    // top: "338px !important",
    // minWidth: "260px !important",
    //  background:'red'
    paddingLeft: 8,
    paddingRight: 8,
    boxSizing: "border-box",
    paddingBottom:8
  },
  listRoot: {
    padding: "0px !important",
    width: "initial !important",
  },
  label: {
    color: "#17174A",
    fontSize: 18,
    fontWeight: 700,
  },
  item: {
    // textOverflow: "ellipsis",
    // "@media (max-width:860px) and (min-width:720px)": {
    //   whiteSpace: "pre",
    // },
  },
  unselected: {
    display: "none",
  },
  shiftName: {
    fontSize: 14,
    fontWeight: 800,
    display: "block",
    width: "17ch",
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
}));

const MenuProps = (fullWidth) => ({
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      minWidth: fullWidth ? "100%" : 200,
      borderRadius: 14,
      marginTop: ITEM_HEIGHT + 10,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
  },
});

const StyledSelect = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderColor: "#FF0083 !important",
    },
    "& .MuiFormHelperText-root": {
      color: "red",
    },
    // "@media (min-width: 720px)": {
    //   width: "70% !important",
    // },
  },
})(Select);

const StyledMenu = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#EDECF5",
    },
    fontSize: 14,
    width: "100%",
    whiteSpace: "pre-line",
    background: "#F3F4F7",
    marginTop: 8,
    borderRadius: 8,
  },
  selected: {
    backgroundColor: "#FFF1F8 !important",
    border: "1px solid #FF0083",
  },
})(MenuItem);

const CustomSelect = ({
  id,
  label,
  items = [],
  value,
  onChange,
  fullWidth,
  className,
  style,
  error,
  onBlur,
  helperText,
  padding,
  isDisabled,
  fontWeight,
  color,
  hideValue,
  ellipse,
  // border,
  hideSelected = false,
  regularHelperTxt = false,
  formControlClasses,
}) => {
  const classes = useStyles();
  return (
    <FormControl
      variant="outlined"
      fullWidth
      style={{ width: fullWidth ? "100%" : 177, ...style }}
      className={className}
      // style={item.value=="Accept" ? {color : "green"} : (item.value == "Reject"? {color : "red"}  : {})}
      disabled={isDisabled}
      classes={formControlClasses}
    >
      <InputLabel id={id} className={`${fontWeight ? classes.label : ""}`}>
        {label}
      </InputLabel>
      <StyledSelect
        labelId={id}
        label={label}
        fullWidth
        error={error && error}
        style={{
          width: fullWidth ? "100%" : "unset",
          ...style,
          padding: padding,
          height:45
        }}
        value={!hideValue && value}
        onBlur={(e) => onBlur && onBlur(e)}
        onChange={(e) => onChange && onChange(e.target.value)}
        // MenuProps={() => MenuProps(fullWidth)}
        MenuProps={{
          classes: { paper: classes.menuPaper },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,

          MenuListProps: {
            classes: {
              root: classes.listRoot,
            },
          },
        }}
      >
        {items.map((item, index) => (
          <StyledMenu
            value={item.value}
            key={index.toString()}
            classes={hideSelected ? { selected: classes.unselected } : {}}
          >
            <div className={classes.item}>
              <span className={classes.shiftName}>
                {ellipse ? ellipsizeText(item?.label, 17) : item?.label}
              </span>
            </div>
          </StyledMenu>
        ))}
        {items.length === 0 && (
          <StyledMenu disabled>No options available</StyledMenu>
        )}
      </StyledSelect>
      {helperText && (
        <FormHelperText
          style={{ color: `${regularHelperTxt ? "gray" : "red"}` }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default CustomSelect;
