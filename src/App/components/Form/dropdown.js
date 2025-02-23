import { Select, withStyles } from "@material-ui/core";

const Dropdown = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      //borderRadius: 27 ,
      borderColor: "#EDECF5",
    },
    "& .MuiSelect-selectMenu": {
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
  },
})(Select);
export default Dropdown;
