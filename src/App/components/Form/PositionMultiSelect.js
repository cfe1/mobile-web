import React, { useEffect, useState } from "react";
import { API, ENDPOINTS } from "api/apiService";
import {
  Loader,
  WeekPicker,
  PinkPrimaryButton,
  CloseCrossButton,
  SearchInput,
  Select,
  DailyWeeklyFilter,
  MultiSelect,
  TablePagination,
  Toast,
} from "App/components";
import { makeStyles, Grid, withStyles } from "@material-ui/core";
const PositionMultiSelect = ({ setSelectedPositions, selectedPositions }) => {
  const [loading, setLoading] = useState(false);
  const [allJobTitles, setAllJobTitles] = useState([]);
  useEffect(() => {
    getJobTitles();
  }, []);
  const getJobTitles = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.FETCH_JOB_TITLES);
      if (resp.success) {
        let facilitynames = resp.data.map((data) => {
          return {
            value: data.id,
            label: data.name,
          };
        });
        setAllJobTitles(facilitynames);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      // setLoading(false);
    }
  };
  const classes = useStyles();

  return (
    <div>
      <MultiSelect
        id="Position"
        label="Positions"
        items={allJobTitles}
        className={classes.multiSelect}
        selectedItems={selectedPositions}
        searchPlaceholder="Position"
        onSelect={(items) => {
          setSelectedPositions(items);
        }}
        isPink={true}
        popoverPaper={classes.popoverPaper}
        listRoot={classes.listRoot}
        formControlClasses={{ root: classes.formRoot }}
        setSelectedItems={setSelectedPositions}
        reset={true}
      />
    </div>
  );
};
export default PositionMultiSelect;
const useStyles = makeStyles((theme) => ({
  popoverPaper: {
    padding: "10px !important",
    // paddingBottom: "4px !important",
    minWidth: "175px !important",
    height: "262px !important",
    overflowY: "hidden",
  },
  listRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    "& #staffings #items": {
      border: "none !important",
      background: "#F3F4F7",
      borderRadius: "4px",
      marginBottom: "8px",
      padding: "4px 10px !important",
      //height: "32px",
      "& .c1": {
        fontSize: "11px",
        fontWeight: "700",
        marginTop: "0px !important",
      },
      "& #checkbox": {
        marginTop: "5px",
      },
    },
    "& #staffings #reset": {
      display: "flex",
      justifyContent: "center",
      "& .c1": {
        color: "#FF0083",
        fontWeight: "700",
        fontSize: 16,
      },
    },
  },
  formRoot: {
    "& .MuiFormLabel-root ": {
      marginTop: "-4px !important",
    },
    "& .MuiInputBase-root": {
      width: "100% !important",
      height: "100% !important",
      "& .MuiSelect-root": {
        fontSize: "14px !important",
        fontWeight: "700 !important",
        marginTop: "6px !important",
      },
    },
    width: "200px !important",
    "& .MuiOutlinedInput-root": {
      borderColor: "#FF0083",
      "&.Mui-focused fieldset": {
        borderColor: "#FF0083 !important",
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#FF0083 !important",
    },
  },
  multiSelect: {
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    width: 130,
    marginRight: 10,
    marginLeft: 10,
    height: "44px !important",
  },
}));
