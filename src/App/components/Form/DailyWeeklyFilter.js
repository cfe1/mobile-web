import React, { useState, useEffect } from "react";
import moment from "moment";
import { Select, WeekPicker } from "App/components";
import Daily from "./Daily";
import Weekly from "./Weekly";
import { makeStyles } from "@material-ui/core";
import rightArrow from "App/assets/icons/right-caret-arrow.svg";
const useStyles = makeStyles({
  formRoot: {
    fontSize: "10px",
    background: "white",
    width: "107px !important",
    marginRight: 10,
    borderRadius: 4,
    "& .MuiInputBase-root": {
      height: "44px !important",
      "& .MuiSelect-root": {
        fontSize: "14px !important",
        fontWeight: "700 !important",
        minHeight: "0px !important",
      },
    },
    "& .MuiOutlinedInput-root": {
      borderColor: "#FF0083",
      "&.Mui-focused fieldset": {
        borderColor: "#FF0083 !important",
      },
    },
  },
  flex: {
    display: "flex",
  },
});

const DailyWeeklyFilter = ({
  dailyDate,
  setDate,
  setWeekStartDate,
  setWeeEndDate,
  setSelectedType,
  selectedType,
  startDate,
  hideSelect,
}) => {
  // const [selectedType, setSelectedType] = useState("Daily");

  const handleTypeChange = (value) => {
    setSelectedType(value);
  };

  const classes = useStyles();
  return (
    <>
      <div className={classes.flex}>
        {!hideSelect && (
          <Select
            id="Daily-Weekly"
            // label="Daily"
            items={[
              {
                label: "Weekly",
                value: "Weekly",
              },
              {
                label: "Daily",
                value: "Daily",
              },
            ]}
            value={selectedType}
            onChange={handleTypeChange}
            formControlClasses={{ root: classes.formRoot }}
          />
        )}
        {selectedType === "Daily" && (
          <Daily dailyDate={dailyDate} setDate={setDate} />
        )}
        {selectedType === "Weekly" && (
          <WeekPicker
            setWeekStartDate={setWeekStartDate}
            setWeeEndDate={setWeeEndDate}
            weekStartDate={startDate}
          />
        )}
      </div>
    </>
  );
};

export default DailyWeeklyFilter;
