import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  makeStyles,
  Grid,
  Typography,
  Menu,
  withStyles,
} from "@material-ui/core";
import {
  Loader,
  PinkPrimaryButton,
  SearchInput,
  DailyWeeklyFilter,
  TablePagination,
  PositionMultiSelect,
  HoverText,
} from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import moment from "moment";
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
const StyledMenu = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#EDECF5",
    },
    fontSize: "12px !important",
    width: "100%",
    background: "#F3F4F7",
    marginTop: "8px !important",
    fontWeight: 700,
    textAlign: "center !important",
    padding: 10,
    borderRadius: "8px !important",
    justifyContent: "center",
    // marginBottom: "8px !important",
  },
  selected: {
    backgroundColor: "white !important",
    color: "#FF0083 !important",
    fontWeight: 700,
    fontSize: "12px !important",
    border: "1px solid #FF0083 !important",
  },
})(MenuItem);
const AllNursesModal = ({
  dailyDate,
  facility_id,
  onClose,
  startDate,
  endDate,
  selectedTypeFromParent,
}) => {
  const arr = [
    "All Nurses",
    "Internal Nurses",
    "External Nurses",
    "Agency Nurses",
  ];
  const nurseTypeArr = ["", "IN", "EN", "AN"];
  // <================= All Use State =================>
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [date, setDate] = useState(null);
  const [weekStartDate, setWeekStartDate] = useState(null);
  const [weekEndDate, setWeeEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState(
    selectedTypeFromParent ? selectedTypeFromParent : "Daily"
  );
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [count, setCount] = useState(0);
  // <====================== All Use Effects ============================>
  useEffect(() => {
    if (
      (date && selectedType === "Daily") ||
      (weekStartDate && selectedType === "Weekly")
    ) {
      getNurseData();
    }
  }, [
    date,
    weekStartDate,
    selectedIndex,
    selectedPositions,
    pageSize,
    currentPage,
    search,
  ]);

  // <=============== API call ======================>

  const getNurseData = async () => {
    setLoading(true);
    const startDate = moment(
      selectedType === "Daily" ? date : weekStartDate
    ).format("YYYY-MM-DD");
    const endDate = moment(
      selectedType === "Daily" ? date : weekEndDate
    ).format("YYYY-MM-DD");
    let jobTitles = selectedPositions.map((position) => {
      return position.value;
    });

    const params = {
      page: currentPage,
      page_size: pageSize,
      search: search,
      nurse_type: nurseTypeArr[selectedIndex],
      job_title: jobTitles,
      //   position_view :true
    };

    const urlParams = queryString.stringify(params);
    try {
      const response = await API.get(
        ENDPOINTS.NURSE_TYPE_LISTING(facility_id, startDate, endDate, urlParams)
      );
      if (response?.success) {
        setTableData(response?.data?.results);
        setCount(response?.data?.count);
      }
    } catch (error) {
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // <==================== All Helper Function =================>
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handlePyramidClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const getMenus = () => {
    return (
      <>
        {arr.map((e, index) => {
          return (
            <StyledMenu
              key={index}
              selected={index === selectedIndex}
              onClick={(event) => handleMenuItemClick(event, index)}
            >
              {e}
            </StyledMenu>
          );
        })}
      </>
    );
  };

  const getAbbreviatedPositionName = (name) => {
    return name
      .split(" ")
      .map((s) => {
        return s.substring(0, 1);
      })
      .join("");
  };
  const classes = useStyles();
  const open = Boolean(anchorEl);

  return (
    <>
      <Dialog
        open={true}
        maxWidth="lg"
        // fullWidth
        disableBackdropClick
        classes={{
          paper: classes.paper,
        }}
        // scroll={"paper"}
      >
        <DialogContent className={classes.dialogContent}>
          {loading && <Loader />}
          <Grid
            container
            justify="space-between"
            className={`${classes.marginBtm}`}
          >
            <Grid item xs={12} md={3} container>
              <>
                {selectedIndex === 0 ? (
                  <ArrowDownIcon
                    onClick={handlePyramidClick}
                    className={classes.arrow}
                  />
                ) : (
                  <ArrowUpIcon
                    onClick={handlePyramidClick}
                    className={classes.arrow}
                  />
                )}
                <Menu
                  id="fade-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={open}
                  getContentAnchorEl={null}
                  onClose={handleClose}
                  TransitionComponent={Fade}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  classes={{
                    paper: classes.paperMenu,
                  }}
                >
                  {getMenus()}
                </Menu>
              </>
              <Typography
                className={`${classes.title}`}
              >{`${arr[selectedIndex]}`}</Typography>
            </Grid>
            <Grid
              justify="flex-end"
              className={classes.flexStart}
              container
              item
              xs={12}
              md={9}
            >
              <SearchInput
                style={{ height: 40 }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onClose={(e) => {
                  setSearch("");
                }}
              />
              {/* <Select /> */}
              <PositionMultiSelect
                id="Position"
                label="Positions"
                selectedPositions={selectedPositions}
                setSelectedPositions={setSelectedPositions}
              />
              <div>
                <DailyWeeklyFilter
                  dailyDate={dailyDate}
                  setDate={setDate}
                  setWeekStartDate={setWeekStartDate}
                  setWeeEndDate={setWeeEndDate}
                  setSelectedType={setSelectedType}
                  selectedType={selectedType}
                  startDate={startDate}
                  endDate={endDate}
                />
              </div>
            </Grid>
          </Grid>
          <div className={classes.container}>
            <Grid container className={classes.headingContainer}>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} ${classes.txt} `}
              >
                ID
              </Grid>
              <Grid
                item
                xs={2}
                className={`${classes.center} ${classes.mgnRt} ${classes.txt} `}
              >
                Employee
              </Grid>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} ${classes.txt}`}
              >
                Position
              </Grid>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} ${classes.txt}`}
              >
                Nurse Type
              </Grid>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} ${classes.txt}`}
              >
                Scheduled Hrs
              </Grid>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} ${classes.txt}`}
              >
                Actual Hrs
              </Grid>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} ${classes.txt}`}
              >
                Scheduled Spend
              </Grid>
              <Grid
                item
                xs={1}
                className={`${classes.center} ${classes.noMarginRight}  ${classes.cellWidth} ${classes.txt} `}
              >
                Actual Spend
              </Grid>
            </Grid>
            <div>
              {tableData.length > 0 ? (
                tableData?.map((nurseData) => {
                  return (
                    <Grid container className={classes.contentContainer}>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentHeading} ${classes.contentCell} ${classes.cellWidth}  ${classes.txt}`}
                      >
                        {nurseData?.emp_id}
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.txt}`}
                      >
                        {nurseData?.fullname}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth} ${classes.txt}`}
                      >
                        <HoverText
                          hovertxt={nurseData?.job_title}
                          fullTxt={getAbbreviatedPositionName(
                            nurseData?.job_title
                          )}
                          fulltxtClass={classes.txt}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth} ${classes.txt}`}
                      >
                        {nurseData?.user_type}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth} ${classes.txt}`}
                      >
                        {nurseData?.hours?.confirmed_hours}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly}  ${classes.cellWidth} ${classes.txt}`}
                      >
                        {nurseData?.hours?.actual_hours}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth} ${classes.txt}`}
                      >
                        $ {nurseData?.spend?.confirmed_spend?.toLocaleString()}
                      </Grid>
                      <Grid
                        item
                        xs={1}
                        className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth} ${classes.txt} ${classes.noMarginRight}`}
                      >
                        $ {nurseData?.spend?.actual_spend?.toLocaleString()}
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <Grid container className={classes.noEmployee}>
                  {!loading && "No Employee Found"}
                </Grid>
              )}
            </div>
          </div>
          {tableData?.length > 0 && (
            <TablePagination
              count={count}
              page={currentPage}
              rowsPerPage={pageSize}
              setRowsPerPage={(size) => {
                setPageSize(size);
                setCurrentPage(currentPage);
              }}
              onChangePage={(e, page) => {
                setCurrentPage(page);
              }}
            />
          )}
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
export default AllNursesModal;

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "600",
    fontSize: "26px",
    marginLeft: 10,
    color: "#FF0083",
    "@media (max-width:1000px)": {
      fontSize: 23,
    },
    "@media (max-width:800px)": {
      fontSize: 20,
    },
  },
  paper: {
    width: 1162,
    // height: "84vh",
  },
  tableCell: {
    border: "8px solid #F3F4F7",
    width: "50%",
    padding: 10,
  },

  marginBtm: {
    marginBottom: 15,
  },
  scroll: {
    overflowY: "auto",
    height: "61vh",
  },
  dialogContent: {
    overflowY: "none",
  },
  dialogContent: {
    padding: "24px 24px 0px 24px !important",
  },
  flex: {
    display: "flex",
  },
  paddingBottom: {
    paddingBottom: 10,
    backgroundColor: "unset !important",
  },

  tableCell: {
    height: 76,
    backgroundColor: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginRight: "0.5%",
    boxSizing: "border-box",
    borderRadius: 4,
    marginTop: 8,
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

  coloumnFlex: {
    flexDirection: "column",
  },
  footerTxt: {
    fontSize: 12,
    fontWeight: 600,
    color: "#82889C",
    "@media (max-width:1000px)": {
      fontSize: "10px",
    },
    "@media (max-width:850px)": {
      fontSize: "9px",
    },
  },

  //<================ New Classes ===================>
  container: {
    background: "#F3F4F7",
    borderRadius: "4px",
    padding: "8px",
    marginTop: 20,
  },
  headingContainer: {
    background: "#FFFFFF",
    color: "#929AB3",
    fontWeight: "700",
    fontSize: "16px",
    height: 40,
    marginBottom: 8,
    borderRadius: 4,
  },
  coloumnFlex: {
    flexDirection: "column",
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
  alignCenter: {
    display: "flex",
    alignItems: "center",
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  justifySpaceEvenly: {
    justifyContent: "space-evenly !important",
  },
  contentContainer: {
    height: 54,
    marginTop: 8,
  },
  contentHeading: {
    // fontWeight: "700",
    // fontSize: "18px !important",
    // color: "#020826",
  },
  contentCell: {
    marginRight: ".7%",
    background: "white",
    borderRadius: 4,
    fontSize: 20,
    fontWeight: 700,
  },
  noMarginRight: {
    marginRight: "0px !important",
  },
  mgnRt: {
    marginRight: ".7% !important",
  },
  cellWidth: {
    maxWidth: "11.2% !important",
    flexBasis: "11.2% !important",
  },

  txt: {
    fontSize: 14,
    fontWeight: 600,
    "@media (max-width:1000px)": {
      fontSize: 12,
    },
    "@media (max-width:800px)": {
      fontSize: 11,
    },
  },

  footer: {
    marginTop: 10,
    backgroundColor: "#F3F4F7",
    position: "relative",
    bottom: 0,
    // marginTop: "340px",
    height: 106,
    minHeight: 104,
    display: "flex ",
    color: "white",
    fontWeight: 600,
    "@media (max-width:940px)": {
      fontSize: "0.65rem",
    },
  },

  paperMenu: {
    width: "136px !important",
    padding: "7px !important",
    "& .MuiList-padding": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  arrow: {
    marginTop: 8,
  },
  noEmployee: {
    height: 50,
    background: "#FFFFFF",
    alignItems: "center",
    paddingLeft: 10,
  },
  flexStart: {
    "@media (max-width:960px)": {
      justifyContent: "flex-start !important",
      marginTop: 10,
    },
  },
}));
