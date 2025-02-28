import {
  Divider,
  InputLabel,
  MenuItem,
  Select,
  withStyles,
} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import { default as React, useState } from "react";
import Edit from "../assets/icons/edit.svg";

const RoundedCheckbox = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
})((props) => (
  <Checkbox
    icon={<RadioButtonUncheckedIcon />}
    checkedIcon={<CheckCircleIcon />}
    {...props}
  />
));

const useStyles = makeStyles((theme) => ({
  menuPaper: {
    maxHeight: 280,
    whiteSpace: "pre-line",
    boxSizing: "border-box",
    paddingBottom: 0,
    marginTop: 8,
    "& li": {
      color: "#434966",
      "&:hover": {
        fontWeight: "600 !important",
      },
    },
  },
  popOver: {
    zIndex: "1305 !important",
  },
  listRoot: {
    padding: "0px !important",
    width: "max-c !important",
  },
  menuItem: {
    fontSize: ({ fontSize }) => `${fontSize}px !important`,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 16px",
    "& .MuiCheckbox-root": {
      padding: "1px 4px !important",
    },
    "& .edit-icon": {
      color: "#086375",
      padding: 4,
    },
  },
  select: {
    height: ({ height }) => height,
    fontSize: "14px !important",
    fontWeight: "400 !important",
    "& .MuiOutlinedInput-input": {
      fontSize: "14px !important",
      fontWeight: "400 !important",
    },
    "& .MuiSvgIcon-root": {
      marginRight: 8,
    },
  },
  pipe: {
    color: theme.palette.background.grey2,
    marginRight: 10,
    marginLeft: 10,
  },
  cursor: {
    cursor: "pointer",
  },
  divider: {
    padding: "0 16px",
  },
  createRoleBtn: {
    width: "100%",
    padding: "12px 16px",
    background: "white",
    border: "none",
    borderTop: "1px solid rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    position: "sticky",
    bottom: 0,
    "&:hover": {
      backgroundColor: "rgba(255, 0, 131, 0.04)",
    }, // padding: 0, // cursor: "pointer", // marginTop: 8, // position: "sticky", // bottom: 0,
  },
  plusIcon: {
    color: "#086375",
    fontSize: "20px",
    marginRight: "8px",
  },
  createRoleText: {
    fontSize: "14px",
    fontWeight: 500,
  },
  iconContainer: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "4px 0",
    pointerEvents: ({ disabled }) => (!disabled ? "all" : "none"),
  },
  container: {
    "& .MuiInputLabel-shrink": {
      display: "none !important",
    },
    "& .MuiFormLabel-root:not(.MuiInputLabel-shrink)": {
      marginTop: "18px !important",
    },
  },
  itemContent: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  btnItem: {
    padding: 0,
    cursor: "pointer",
    marginTop: 8,
    position: "sticky",
    bottom: 0,
  },
}));

const CustomMultiSelect = (props = {}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    id = "",
    multiple = true,
    variant = "outlined",
    value = [],
    onChange = () => {},
    labelId = "",
    renderValue = null,
    options = [],
    labelField = "",
    valueField = "",
    fullWidth = true,
    renderCheckbox = false,
    disabled = false,
    fontSize = 12,
    isdropDownIconClickable = true,
    infoIcon = false,
    showEditIcon = false,
    handleEditClick = () => {},
    onCreateRole = () => {},
    needCreateRole = false,
    fullSelectDisable = false,
    height = 48,
    ...rest
  } = props;

  const classes = useStyles({
    fontSize,
    disabled,
    height,
  });

  const arrowIconClickHanlder = () => {
    if (isdropDownIconClickable) {
      setMenuOpen(true);
    }
  };

  console.log({ value });

  return (
    <div className={classes.container}>
           {" "}
      {/* <InputLabel id={`${id}-placeholder-label`}>Select Here</InputLabel> */}
           {" "}
      <Select
        id={id} // labelId={`${id}-placeholder-label`}
        multiple={multiple}
        variant={variant}
        value={value}
        fullWidth={fullWidth}
        onChange={onChange} //   placeholder="Select Here"
        open={menuOpen}
        onOpen={() => setMenuOpen(true)}
        onClose={() => setMenuOpen(false)}
        className={classes.select}
        renderValue={(selected) => {
          if (!Array.isArray(selected)) {
            const option = options.find((opt) => opt[valueField] === selected);
            return option ? option[labelField] : "";
          }

          console.log({ selected });
          return selected
            .map((value) => {
              const option = options.find((opt) => opt[valueField] === value);
              return option ? option[labelField] : "";
            })
            .join(", ");
        }}
        disabled={fullSelectDisable}
        IconComponent={() => (
          <div className={classes.iconContainer}>
                        <span className={classes.pipe}>|</span>           {" "}
            {menuOpen ? (
              <ExpandLess
                className={`${isdropDownIconClickable && classes.cursor}`}
                onClick={arrowIconClickHanlder}
              />
            ) : (
              <ExpandMore
                className={`${isdropDownIconClickable && classes.cursor}`}
                onClick={arrowIconClickHanlder}
              />
            )}
                     {" "}
          </div>
        )}
        MenuProps={{
          classes: {
            paper: classes.menuPaper,
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "left",
          },
          getContentAnchorEl: null,
          PopoverClasses: {
            root: classes.popOver,
          },
          MenuListProps: {
            classes: {
              root: classes.listRoot,
            },
          },
          autoFocus: false,
        }}
        {...rest}
      >
               {" "}
        {options.map((item, itemIndex) =>
          item?.type === "divider" ? (
            <div key={item.id} className={classes.divider}>
                            <Divider />           {" "}
            </div>
          ) : (
            <MenuItem
              key={item[labelField]}
              value={item[valueField]}
              className={classes.menuItem}
              disabled={!item?._all_ && disabled}
            >
                           {" "}
              <div className={classes.itemContent}>
                               {" "}
                {renderCheckbox ? (
                  <RoundedCheckbox
                    checked={value?.includes(item[valueField])}
                  />
                ) : null}
                               {" "}
                {infoIcon ? (
                  <AccessTimeIcon
                    color="primary"
                    style={{ marginRight: 4, opacity: 0.9 }}
                  />
                ) : null}
                                {item[labelField]}             {" "}
              </div>
                           {" "}
              {showEditIcon && (
                <img
                  src={Edit}
                  onClick={(e) => {
                    handleEditClick(e, itemIndex);
                    setMenuOpen(false);
                  }}
                />
              )}
                         {" "}
            </MenuItem>
          )
        )}
               {" "}
        {typeof onCreateRole === "function" && needCreateRole && (
          <MenuItem className={classes.btnItem}>
                       {" "}
            <button
              className={classes.createRoleBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCreateRole(e); // setTimeout(() => setMenuOpen(false), 0);
                setMenuOpen(false);
              }}
            >
                            <span className={classes.plusIcon}>+</span>         
                  <span className={classes.createRoleText}>Create Role</span>   
                     {" "}
            </button>
                     {" "}
          </MenuItem>
        )}
             {" "}
      </Select>
         {" "}
    </div>
  );
};

export default CustomMultiSelect;
