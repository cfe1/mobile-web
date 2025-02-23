import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, makeStyles, Grid } from "@material-ui/core";
import {
  Loader,
  DailyWeeklyFilter,
  TableSort,
  PinkPrimaryButton,
  FacilityfilterMultiSelecte,
} from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import queryString from "query-string";

const StatsDetailsModal = ({
  dynamicData,
  onClose,
  selectedTypeFromParent,
  dailyDate,
  startDate,
}) => {
  // <================= All Use State =================>
  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState(
    selectedTypeFromParent ? selectedTypeFromParent : "Daily"
  );
  const [loading, setLoading] = useState(false);
  const [statsData, setStatsData] = useState([]);
  const [sort, setSort] = useState({ key: "", dir: "" });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  // <====================== All Use Effects ============================>
  useEffect(() => {
    if (date || weekStartDate) {
      fetchSatDetails();
    }
  }, [date, sort, weekStartDate, selectedFacilities]);
  // <=============== API call ======================>
  const fetchSatDetails = async () => {
    const params = {
      facility_id: selectedFacilities?.map((facility) => facility.value),
    };

    let ordering = "";

    if (sort.key !== "") {
      if (sort.dir === "asc") {
        ordering = `${sort.key}`;
      } else {
        ordering = `-${sort.key}`;
      }
      params.ordering = ordering;
    }
    const urlParams = queryString.stringify(params);
    const startDate = moment(
      selectedType === "Daily" ? date : weekStartDate
    ).format("YYYY-MM-DD");
    const endDate = moment(
      selectedType === "Daily" ? date : weekEndDate
    ).format("YYYY-MM-DD");
    try {
      setLoading(true);
      const response = await API.get(
        ENDPOINTS.STAT_DETAILS(
          startDate,
          endDate,
          dynamicData?.apiEndPointKey,
          urlParams
        )
      );
      if (response.success) {
        setStatsData(response?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const handleSortClick = (key) => {
    const newSort = {};
    if (sort.key === "" || sort.key !== key) {
      newSort.key = key;
      newSort.dir = "asc";
    } else {
      newSort.key = key;
      if (sort.dir === "asc") {
        newSort.dir = "desc";
      } else {
        newSort.key = "";
      }
    }
    setSort(newSort);
  };
  const classes = useStyles();
  return (
    <>
      <Dialog
        open={true}
        maxWidth="lg"
        //   fullWidth
        disableBackdropClick

        // scroll={"paper"}
      >
        <DialogContent className={classes.dialogContent}>
          {loading && <Loader />}

          <Grid container justify="space-between" alignItems="center">
            <Grid item className={classes.title}>
              {dynamicData?.title}
            </Grid>
            <Grid item>
              {" "}
              <DailyWeeklyFilter
                setDate={setDate}
                setWeekStartDate={setWeekStartDate}
                setWeeEndDate={setWeeEndDate}
                setSelectedType={setSelectedType}
                selectedType={selectedType}
                dailyDate={dailyDate}
                startDate={startDate}
              />
            </Grid>
          </Grid>
          <Grid container className={`${classes.whiteBg} ${classes.tableDiv}`}>
            <Grid
              container
              className={`${classes.grayBg} ${classes.tableContainer}`}
            >
              <Grid container>
                {dynamicData.bindingKeys.map((key, index) => {
                  return (
                    <Grid
                      onClick={
                        dynamicData?.sortActiveIndex.has(index) &&
                        handleSortClick.bind(null, dynamicData.apiKeys[index])
                      }
                      item
                      style={
                        index === 0
                          ? {
                              maxWidth: `${
                                dynamicData.coloumnWidth[index] * 8.33 -
                                (dynamicData.bindingKeys.length - 1) * 0.6
                              }%`,
                            }
                          : {}
                      }
                      className={`${classes.flexCenter}  ${classes.TableHead} ${
                        index === dynamicData.bindingKeys.length - 1
                          ? classes.noMarginRight
                          : ""
                      }`}
                      xs={dynamicData.coloumnWidth[index]}
                    >
                      {key?.length > 18 ? (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                        >
                          <span>{key.split(" ")[0]}</span>
                          <span>{key.split(" ").slice(1).join("  ")}</span>
                        </div>
                      ) : (
                        <span>{key}</span>
                      )}
                      {dynamicData?.sortActiveIndex.has(index) && (
                        <TableSort
                          active={sort.key === dynamicData.apiKeys[index]}
                          direction={sort.dir}
                        />
                      )}
                      {index === 0 && (
                        <FacilityfilterMultiSelecte
                          selectedItems={selectedFacilities}
                          onSelect={(items) => setSelectedFacilities(items)}
                          setSelectedItems={setSelectedFacilities}
                        ></FacilityfilterMultiSelecte>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
              <Grid container className={classes.scrollClass}>
                {statsData?.length > 0 ? (
                  statsData?.map((facility, index) => (
                    <Grid className={classes.tableRow} container>
                      {dynamicData.apiKeys.map((apiKey, index) => (
                        <Grid
                          item
                          xs={dynamicData.coloumnWidth[index]}
                          style={
                            index === 0
                              ? {
                                  maxWidth: `${
                                    dynamicData.coloumnWidth[index] * 8.33 -
                                    (dynamicData.bindingKeys.length - 1) * 0.6
                                  }%`,
                                }
                              : {}
                          }
                          className={` ${classes.tableCell} ${
                            classes.flexCenter
                          } ${classes.facilityNameTxt}  ${
                            index === dynamicData.bindingKeys.length - 1
                              ? classes.noMarginRight
                              : ""
                          } ${index === 0 ? classes.flexDisplay : ""}`}
                        >
                          <span>{`${
                            apiKey.includes("spend") ? "$" : ""
                          } ${facility[apiKey]?.toLocaleString()}${
                            apiKey === "openings_filled" ? "%" : ""
                          }`}</span>
                        </Grid>
                      ))}
                    </Grid>
                  ))
                ) : (
                  <Grid className={classes.tableRow} container>
                    {!loading && (
                      <Grid
                        item
                        xs={12}
                        className={` ${classes.tableCell}${classes.facilityNameTxt} ${classes.whiteBg}  `}
                      >
                        No data found
                      </Grid>
                    )}
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <Grid
          container
          justify="center"
          alignItems="center"
          className={`${classes.footer}  `}
        >
          <PinkPrimaryButton
            className={`${classes.setBtn}   `}
            onClick={onClose}
          >
            {"Close"}
          </PinkPrimaryButton>
        </Grid>
      </Dialog>
    </>
  );
};

export default StatsDetailsModal;

const useStyles = makeStyles({
  whiteBg: {
    backgroundColor: "#FFFFFF",
  },
  grayBg: {
    backgroundColor: "#F3F4F7   ",
  },
  tableContainer: {
    padding: 8,
    width: "100%",
    marginTop: 16,
    borderRadius: 4,
  },
  tableRow: {
    width: "100%",
  },
  TableHead: {
    height: 40,
    fontSize: 14,
    fontWeight: 600,
    color: "#929AB3",
    boxSizing: "border-box",
    marginRight: "0.6%",
    "@media (max-width:1000px)": {
      fontSize: "11px",
      fontWeight: "700",
      height: 50,
    },
  },
  tableCell: {
    textAlign: "center",
    height: 76,
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    boxSizing: "border-box",
    borderRadius: 4,
    marginTop: 8,
    marginRight: "0.6%",
    "@media (max-width:1000px)": {
      fontSize: "17px",
      fontWeight: "600",
      height: 63,
    },
    "@media (max-width:850px)": {
      fontSize: "15px",
      fontWeight: "600",
      height: 56,
    },
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  flexDisplay: {
    display: "flex",
    alignItems: "center",
    justifyContent: "unset",
  },
  facilityNameTxt: {
    padding: "4px 12px",
    fontSize: 17,
    fontWeight: "800 !important",
    color: "#020826",
    "@media (max-width:1100px)": {
      fontSize: 16,
    },
    "@media (max-width:1060px)": {
      fontSize: 15,
    },
    "@media (max-width:1000px)": {
      fontSize: 13,
    },
    "@media (max-width:890px)": {
      fontSize: 11,
    },
  },
  flexSpaceBetweein: {
    justifyContent: "space-evenly",
    display: "flex",
    alignItems: "center",
  },
  noMarginRight: {
    marginRight: "0px !important",
  },
  adjustedWidth: {
    maxWidth: "30.93% !important",
  },
  footer: {
    marginTop: 10,
    backgroundColor: "#F3F4F7",
    position: "relative",
    bottom: 0,
    // marginTop: "340px",
    minHeight: "104px",
    height: 106,
    display: "flex ",
    color: "white",
    fontWeight: 600,
    "@media (max-width:940px)": {
      fontSize: "0.65rem",
    },
  },
  setBtn: {
    backgroundColor: "#ff0083 !important",
    width: 200,
    color: "#FFFFFF",
    padding: 0,
    height: 50,
    //borderColor:'#FF0083 !important',
    marginLeft: "0px !important",
    disableSet: {
      borderColor: "#929AB3 !important",
      color: "#929AB3 !important",
      backgroundColor: "#FFFFFF !important",
    },
  },
  dialogContent: {
    boxSizing: "border-box",
    width: 805,
    minHeight: 400,
    "@media (max-width:1000px)": {
      width: 675,
      minHeight: 400,
      paddingLeft: 10,
      paddingRight: 10,
    },
  },
  title: { fontSize: 30, fontWeight: 600 },
  scrollClass: {
    overflowY: "scroll",
    maxHeight: 340,
  },
});
