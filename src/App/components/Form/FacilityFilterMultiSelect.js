import React, { useState, useEffect, useRef } from "react";
import FacilityFilterDropdownMenu from "./FacilityFilterDropDown";
import reversePyramidFilter_Active from "App/assets/icons/reversePyramidFilter_Active.svg";
import reversePyramidFilter_Inactive from "App/assets/icons/reversePyramidFilter_Inactive.svg";
import { API, ENDPOINTS } from "api/apiService";
import { Toast, Loader } from "../../components";
import { makeStyles } from "@material-ui/core";

const useOutsideAlerter = (ref, setOpen) => {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
};

const FacilityFilterMultiSelect = ({
  searchEnabled = true,
  searchPlaceholder = "Search",
  selectedItems,
  onSelect,
  setSelectedItems,
}) => {
  //****************************All states *********************/
  const [loading, setLoading] = useState(false);
  const [facilityList, setFacilityList] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, setOpen);
  //****************************All Useeffects *********************/
  useEffect(() => {
    getFacilityList();
  }, []);

  //**********************API CALLS**************/

  const getFacilityList = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.OWNER_FACILITY_LISTING);
      if (resp.success) {
        let facilitynames = resp.data.map((data) => {
          return {
            value: data.id,
            label: data.name,
          };
        });
        setFacilityList(facilitynames);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const onResetClick = () => {
    if (selectedItems.length > 0) setSelectedItems([]);
  };
  const classes = useStyles();
  return (
    <div className={classes.filterContainer}>
      {loading && <Loader />}

      <div className={classes.iconsContainer}>
        <img
          className={classes.filterIcon}
          onClick={handleOpen}
          src={
            selectedItems?.length
              ? reversePyramidFilter_Active
              : reversePyramidFilter_Inactive
          }
        />
        {selectedItems?.length > 0 && (
          <div
            className={classes.selected}
          >{`${selectedItems.length} Selected`}</div>
        )}
      </div>

      {open && (
        <div
          className={classes.dropDownWidth}
          // tabindex="0"
          // onBlur={() => {
          //   setOpen(false);
          // }}
          ref={wrapperRef}
        >
          <FacilityFilterDropdownMenu
            items={facilityList}
            selectedItems={selectedItems}
            onSelect={onSelect}
            searchEnabled={searchEnabled}
            searchPlaceholder={searchPlaceholder}
            menuClass={classes.menuClass}
            setOpen={setOpen}
            setSelectedItems={setSelectedItems}
          />
          {true && (
            <div
              id="reset"
              key={"reset"}
              className={`row-center cursor-pointer ${classes.resetBtn}`}
              onClick={onResetClick}
            >
              {"Reset"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacilityFilterMultiSelect;

const useStyles = makeStyles({
  filterIcon: { height: 20, width: 17, cursor: "pointer" },
  filterContainer: {
    width: 120,
    maxHeight: 270,
    // overflowY:'scroll'
  },
  displayFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  menuClass: {
    position: "absolute",
    left: 100,
  },
  iconsContainer: {
    marginLeft: 10,
    display: "flex",
    height: 20,
  },
  dropDownWidth: {
    width: 256,
    //  pointerEvents:'none'
    boxShadow: "-4px 3px 30px rgba(33, 35, 45, 0.15)",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "white",
    position: "absolute",
    zIndex: 1000,
    // height: 300,
  },
  selected: {
    marginLeft: 10,
    width: 77,
    fontSize: 14,
    background: "#FFFFFF",
    color: "#929AB3",
    width: 75,
    borderRadius: 4,
    padding: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  resetBtn: {
    height: 40,
    displayL: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 7,
    fontSize: 16,
    fontWeight: 700,
    color: "#FF0083",
    boxSizing: "border-box",
    //marginTop: "-17px",
    backgroundColor: "#FFFFFF",
  },
});
