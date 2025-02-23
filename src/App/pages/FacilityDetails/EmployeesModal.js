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
import MenuItem from "@material-ui/core/MenuItem";
import Fade from "@material-ui/core/Fade";
import {
  Loader,
  PinkPrimaryButton,
  SearchInput,
  TablePagination,
  TableSort,
  PositionMultiSelect,
  Toast,
  HoverText,
} from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import reversePyramidFilter_Active from "App/assets/icons/reversePyramidFilter_Active.svg";
import reversePyramidFilter_Inactive from "App/assets/icons/reversePyramidFilter_Inactive.svg";
import PinkTick from "App/assets/icons/PinkTick.svg";
import GreyExclamation from "App/assets/icons/GreyExclamation.svg";
import DefaultPhoto from "App/assets/icons/DefaultPhoto.svg";

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
  },
  selected: {
    backgroundColor: "white !important",
    color: "#FF0083 !important",
    fontWeight: 700,
    fontSize: "12px !important",
    border: "1px solid #FF0083 !important",
  },
})(MenuItem);

const EmployeesModal = ({
  facility_id = "f5b84edd-e9a9-49d9-9522-d52872731d37",
  onClose,
}) => {
  // <================= All Use State =================>
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [search, setSearch] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({
    key: "",
    dir: "",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPositions, setSelectedPositions] = useState([]);

  // <====================== All Use Effects ============================>

  useEffect(() => {
    handleGetEmployeeData();
  }, [sort, search, pageSize, currentPage, selectedIndex, selectedPositions]);

  // <=============== API call ======================>

  const handleGetEmployeeData = async () => {
    let jobTitles = selectedPositions.map((position) => {
      return position.value;
    });
    const params = {
      page: currentPage,
      page_size: pageSize,
      search: search,
      credential_status: getCredentialApiStatus(selectedIndex),
      job_title: jobTitles,
    };

    let ordering = "";

    if (sort.key !== "") {
      if (sort.dir === "asc") {
        ordering = sort.key;
      } else {
        ordering = `-${sort.key}`;
      }
    }
    params.ordering = ordering;

    const urlParams = queryString.stringify(params);
    try {
      setLoading(true);
      const response = await API.get(
        ENDPOINTS.FACILITY_EMPLOYEES(facility_id, urlParams)
      );
      if (response?.success) {
        setTableData(response?.data);
      }
    } catch (error) {
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  // <==================== All Helper Function =================>

  const getCredentialApiStatus = (index) => {
    const statusMap = new Map([
      [0, "CREDENTIAL_ALL"],
      [1, "CREDENTIAL_VERIFIED"],
      [2, "CREDENTIAL_PENDING"],
      [3, "CREDENTIAL_REJECTED"],
      [4, "CREDENTIAL_EXPIRED"],
    ]);

    return statusMap.get(index);
  };

  const getAbbreviatedPositionName = (name) => {
    if (!name) {
      return;
    }
    return name
      .split(" ")
      .map((s) => {
        return s.substring(0, 1);
      })
      .join("");
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

  const getStatusIcon = (status) => {
    return status === "CREDENTIAL_VERIFIED" ? PinkTick : GreyExclamation;
  };

  // <===========type Menu functions =========

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
    const arr = [
      "All",
      "Credential Verified",
      "Credential Pending",
      "Credential Rejected",
      "Credential Expired",
    ];
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
            <Typography className={`${classes.title}`}>Employees</Typography>
            <div className={classes.flex}>
              <SearchInput
                style={{ marginRight: 20, height: 40 }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                onClose={(e) => {
                  setCurrentPage(1);
                  setSearch("");
                }}
              />
              <PositionMultiSelect
                id="Position"
                label="Positions"
                selectedPositions={selectedPositions}
                setSelectedPositions={setSelectedPositions}
              />
            </div>
          </Grid>
          <div className={classes.container}>
            <Grid container className={classes.headingContainer}>
              <Grid
                item
                xs={2}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth} `}
              >
                ID
              </Grid>
              <Grid
                item
                xs={3}
                className={`${classes.center} ${classes.mgnRt}`}
              >
                Employee
              </Grid>
              <Grid
                item
                xs={2}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
              >
                Position
              </Grid>
              <Grid
                item
                xs={2}
                className={`${classes.center} ${classes.mgnRt} ${classes.cellWidth}`}
                onClick={handleSortClick.bind(null, "hours_worked")}
              >
                Hours Worked
                <TableSort
                  active={sort.key === "hours_worked"}
                  direction={sort.dir}
                />
              </Grid>
              <Grid item xs={3} className={`${classes.center} `}>
                Credential Status
                <>
                  <img
                    src={
                      selectedIndex === 0
                        ? reversePyramidFilter_Inactive
                        : reversePyramidFilter_Active
                    }
                    className={`${classes.pyramid} cursor-pointer`}
                    onClick={handlePyramidClick}
                    aria-controls="fade-menu"
                    aria-haspopup="true"
                  />
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
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    classes={{
                      paper: classes.paperMenu,
                    }}
                  >
                    {getMenus()}
                  </Menu>
                </>
              </Grid>
            </Grid>
            {tableData?.results?.length > 0 ? (
              tableData?.results?.map((employee, index) => {
                return (
                  <Grid
                    container
                    className={`${classes.contentContainer} ${
                      index + 1 === tableData?.results?.length &&
                      classes.noMgnBtm
                    }`}
                  >
                    <Grid
                      item
                      xs={2}
                      className={`${classes.center} ${classes.contentHeading} ${classes.contentCell} ${classes.cellWidth}`}
                    >
                      {employee?.emp_id}
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      className={`${classes.center} ${classes.contentCell} ${classes.justifyFs}`}
                    >
                      <img
                        className={classes.photo}
                        src={employee?.profile_photo ?? DefaultPhoto}
                      />
                      {employee?.fullname}
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                    >
                      <HoverText
                        hovertxt={employee?.job_title}
                        fullTxt={getAbbreviatedPositionName(
                          employee?.job_title
                        )}
                        fulltxtClass={classes.contentCell}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={2}
                      className={`${classes.center} ${classes.contentCell} ${classes.justifySpaceEvenly} ${classes.cellWidth}`}
                    >
                      {Number(employee?.hours_worked).toFixed(2)}
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      className={`${classes.center} ${classes.contentCell} ${classes.noMarginRight} ${classes.capitalize}`}
                    >
                      <img
                        className={classes.statusIcon}
                        src={getStatusIcon(employee?.credential_status)}
                      />
                      {employee?.credential_status
                        ? employee?.credential_status
                            .replace("_", " ")
                            .toLowerCase()
                        : "N/A"}
                    </Grid>
                  </Grid>
                );
              })
            ) : (
              <Grid
                container
                className={`${classes.contentContainer} ${classes.noEmployee} ${classes.noMgnBtm}`}
              >
                {!loading && "No Employees Found"}
              </Grid>
            )}
          </div>
          {tableData?.results?.length > 0 && (
            <TablePagination
              count={tableData?.count}
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
export default EmployeesModal;

const useStyles = makeStyles((theme) => ({
  title: {
    fontWeight: "600",
    fontSize: "26px",
  },
  paper: {
    width: 1162,
    // height: "84vh",
  },
  marginBtm: {
    marginBottom: 15,
  },
  scroll: {
    overflowY: "auto",
    height: "61vh",
  },
  dialogContent: {
    padding: "24px 24px 0px 24px !important",
    // overflowY: "none",
  },
  flex: {
    display: "flex",
  },
  paddingBottom: {
    paddingBottom: 10,
    backgroundColor: "unset !important",
  },
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
    fontSize: "14px",
    height: 34,
    marginBottom: 8,
    borderRadius: 4,
    "@media (max-width:940px)": {
      fontSize: "12px",
    },
  },
  current: {
    color: "#17174A",
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
    marginBottom: 6,
  },
  contentHeading: {
    fontWeight: "700",
    // fontSize: "18px !important",
    color: "#020826",
  },
  contentCell: {
    marginRight: ".7%",
    background: "white",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 700,
    "@media (max-width:940px)": {
      fontSize: "12px",
    },
  },
  noMarginRight: {
    marginRight: "0px !important",
  },
  mgnRt: {
    marginRight: ".7%",
  },
  cellWidth: {
    maxWidth: "15.666667%",
    flexBasis: "16.666667%",
  },
  noMgnBtm: {
    marginBottom: "0px !important",
  },
  pyramid: {
    marginLeft: 10,
  },
  paperMenu: {
    width: "136px !important",
    padding: "7px !important",
    "& .MuiList-padding": {
      paddingTop: 0,
      paddingBottom: 0,
    },
  },
  capitalize: {
    textTransform: "capitalize",
  },
  statusIcon: {
    height: 22,
    marginRight: 10,
  },
  photo: {
    height: 34,
    marginRight: 10,
    marginLeft: "5%",
    width: 34,
    borderRadius: "50%",
  },
  justifyFs: {
    justifyContent: "flex-start !important",
  },
  noEmployee: {
    background: "#FFFFFF",
    alignItems: "center",
    paddingLeft: 10,
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
}));
