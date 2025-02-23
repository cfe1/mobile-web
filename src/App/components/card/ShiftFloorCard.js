import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Toast, SelectRow, Select } from "App/components";
import Morning from "App/assets/icons/morningEps.svg";
import Evening from "App/assets/icons/eveningEps.svg";
import Night from "App/assets/icons/nightEps.svg";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
const useStyles = makeStyles({
  shiftDate: {
    fontSize: 10,
    fontWeight: 600,
    color: "#82889C",
    marginBottom: 10,
  },
  cardContainer: {
    border: "2px solid #DDDFE6",
    borderRadius: 4,
    padding: 6,
    width: 202,
    boxSizing: "border-box",
  },
  selectRowContainer: {
    display: "flex",
    marginBottom: 10,
    background: "white",
    borderRadius: 35,
    padding: "5px 8px 0px 10px",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shiftName: {
    marginLeft: 20,
    marginRight: 10,
    marginTop: -4,
    fontSize: 12,
    fontWeight: 600,
  },
  disableCss: {
    pointerEvents: "none",
    background: "lightgray",
  },
  pinkBorder: {
    border: "2px solid #FF0083 !important",
  },
});

const ShiftFloorCard = ({
  units,
  start_time,
  end_time,
  start_date,
  end_date,
  map,
  title,
  id,
  setMap,
  value,
  status,
  timezone,
}) => {
  const classes = useStyles();
  const handleReturnCardIcon = (startTime) => {
    const t = moment(startTime, "HH:mm:ss");
    const morningShiftStartTiming = moment("04:00:00", "HH:mm:ss");
    const eveningShiftStartTiming = moment("12:00:00", "HH:mm:ss");
    const eveningShiftendTiming = moment("18:59:00", "HH:mm:ss");
    const nightShiftStartTiming = moment("19:00:00", "HH:mm:ss");

    let icon;

    if (
      t.isBefore(morningShiftStartTiming) ||
      t.isAfter(nightShiftStartTiming)
    ) {
      icon = Night;
    } else if (
      t.isAfter(eveningShiftStartTiming) &&
      t.isBefore(eveningShiftendTiming)
    ) {
      icon = Evening;
    } else {
      icon = Morning;
    }

    return icon;
  };

  const handleUnitChange = (value) => {
    const newMap = new Map(map);
    if (newMap.has(id)) {
      newMap.set(id, value);
      setMap(newMap);
    } else {
      Toast.showInfoToast("Please select the shift first");
    }
  };

  const handleCardSelect = () => {
    const newMap = new Map(map);
    if (newMap.has(id)) {
      newMap.delete(id);
    } else newMap.set(id, "unAssigned");
    setMap(newMap);
  };

  const getFormattedTime = (time) => {
    return moment(time, "HH:mm").format("hh:mm A");
  };

  return (
    <>
      <Grid item>
        <div
          className={`${classes.cardContainer} ${
            status === "COMPLETED" ? classes.disableCss : ""
          } ${map.has(id) ? classes.pinkBorder : ""}`}
        >
          <div className={classes.selectRowContainer}>
            <SelectRow
              isPink={true}
              selected={map.has(id)}
              onClick={handleCardSelect}
            />
            <span className={classes.shiftName}>{title}</span>
            <img src={handleReturnCardIcon(start_time)}></img>
          </div>
          <div className={classes.shiftDate}>{`Shift Time: ${getFormattedTime(
            start_time
          )} - ${getFormattedTime(end_time)} (${timezone})`}</div>

          <Select
            id="Units"
            label="Units"
            items={[{ label: "unassigned", value: "unAssigned" }, ...units]}
            value={map.has(id) ? map.get(id) : ""}
            onChange={handleUnitChange}
            isDisabled={value === "assigned" || status === "COMPLETED"}
          />
        </div>
      </Grid>
    </>
  );
};

export default ShiftFloorCard;
