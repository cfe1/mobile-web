import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ArrowUpward from "../../assets/icons/arrowUpPink.svg";
import ArrowDownward from "../../assets/icons/arrowDownGreen.svg";
import CustomSelect from "App/components/Form/Select";
import {
  LinearProgressBar,
  Loader,
  TablePagination,
  Toast,
} from "App/components";
import HppdTableRow from "./HppdTableRow";
import SearchHppd from "App/components/Form/SearchHppd";
import SelectFilterHppd from "App/components/Form/SelectFilterHppd";
import { ENDPOINTS } from "api/apiRoutes";
import { API } from "api/apiService";
import queryString from "query-string";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    overflowX: "auto",
  },
  title: {
    fontWeight: 700,
    fontSize: 18,
    color: theme.palette.secondary.DkBlue,
  },
  filterMain: {
    marginTop: 10,
    display: "flex",
    justifyContent: "space-between",
  },
  tableHeader: {
    fontWeight: 500,
    fontSize: 12,
    color: theme.palette.secondary.darkGray,
    marginBottom: "16px",
    marginTop: "24px",
  },

  table: {
    minWidth: 650,
    borderCollapse: "collapse",
    overflowY: "auto",
    minWidth: "1300px",
  },
  tableContainer: {
    border: `1px solid ${theme.palette.secondary.gray300}`,
    borderBottom: "none",
    borderRadius: 4,
  },
  headerCell: {
    fontWeight: "bold",
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    backgroundColor: theme.palette.background.lightBlue,
    color: `${theme.palette.secondary.darkGray} !important`,
    fontWeight: 500,
    fontSize: "12px !important",
    "@media (max-width:1400px)": {
      fontSize: "10px !important",
    },
  },
  headerCellMain: {
    fontWeight: 500,
    fontSize: "12px !important",
    textAlign: "center",
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    backgroundColor: theme.palette.background.lightBlue,
    color: `${theme.palette.secondary.darkGray} !important`,
    "@media (max-width:1400px)": {
      fontSize: "10px !important",
    },
  },
  headerCellToday: {
    fontWeight: 600,
    fontSize: "12px !important",
    textAlign: "center",
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    backgroundColor: theme.palette.secondary.ltPurple,
    color: `${theme.palette.secondary.darkGray} !important`,
    "@media (max-width:1400px)": {
      fontSize: "10px !important",
    },
  },
  headerCell15Days: {
    fontWeight: 600,
    fontSize: "12px !important",
    textAlign: "center",
    borderRight: `1px solid ${theme.palette.secondary.gray300}`,
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    backgroundColor: theme.palette.background.extraLtPink,
    color: `${theme.palette.secondary.darkGray} !important`,
    "@media (max-width:1400px)": {
      fontSize: "10px !important",
    },
  },
  headerCell30Days: {
    fontWeight: 600,
    fontSize: "12px !important",
    textAlign: "center",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
    backgroundColor: theme.palette.background.ltGreen,
    color: `${theme.palette.secondary.darkGray} !important`,
    "@media (max-width:1400px)": {
      fontSize: "10px !important",
    },
  },
  cell: {
    color: `${theme.palette.secondary.extradarkBlue} !important`,
    fontWeight: "600 !important",
    height: "30px",
    borderBottom: `1px solid ${theme.palette.secondary.gray300} !important`,
  },
  noDataFound: {
    marginLeft: "0px 40px",
    marginRight: 13,
    borderRadius: 4,
  },
}));

const HppdTracker = () => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [hppdData, setHppdData] = useState([]);
  const [hppdDataPagination, setHppdDataPagination] = useState([]);
  const [search, setSearch] = useState("");
  const [hppdOptions, setHppdOptions] = useState([]);
  const [hppdSelection, setHppdSelection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    getDepartmentList();
  }, []);

  useEffect(() => {
    if (hppdSelection) {
      getHddpData();
    }
  }, [hppdSelection, search, pageSize, currentPage]);

  const getDepartmentList = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.FETCH_ALL_DEPARTMENTS_NEW);
      if (resp.success && resp.data) {
        // Map the response to extract label and value
        const options = resp.data?.map((item) => ({
          label: item.central_department.name,
          value: item.central_department.id,
        }));
        setHppdOptions(options);
        const nursingOption = options.find(option => option.label === 'Nursing');

        const selectedOption = nursingOption ? nursingOption.value : options[0]?.value;
      
        if (selectedOption) {
          setHppdSelection(selectedOption);
          handleHppdSelectionChange(selectedOption);
        }
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleHppdSelectionChange = async (value) => {
    setHppdSelection(value);
  };

  const getHddpData = async () => {
    try {
      setLoading(true);
      let params = {
        department_id: hppdSelection,
        name: search,
        page: currentPage,
        page_size: pageSize,
      };

      const urlParams = queryString.stringify(params);

      const endpoint = ENDPOINTS.HPPD_TRACKER_DETAILS(urlParams);
      const resp = await API.get(endpoint);

      if (resp.success) {
        setHppdData(resp.data?.results);
        setHppdDataPagination(resp?.data);
      } else {
        Toast.showErrorToast(
          resp.message || "Failed to fetch tracker details."
        );
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0] || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const updateRowData = async (facilityId) => {
    try {
      setLoading(true);
      let params = {
        department_id: hppdSelection,
      };

      const urlParams = queryString.stringify(params);

      const endpoint = ENDPOINTS.FETCH_HDDP_FACILITY(facilityId, urlParams);
      const resp = await API.get(endpoint);

      if (resp.success) {
        setHppdData((prevData) =>
          prevData.map((row) => (row.id === facilityId ? resp.data[0] : row))
        );
      } else {
        Toast.showErrorToast(
          resp.message || "Failed to fetch tracker details."
        );
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0] || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  const handleSearchChange = (value) => {
    setSearch(value);
  };

  const handleSearchClose = () => {
    setSearch("");
  };

  return (
    <>
      {loading && <LinearProgressBar belowHeader />}
      <div>
        <div>
          <div>
            <div className={classes.title}>HPPD Tracker</div>
          </div>
          <div className={classes.filterMain}>
            <div>
              <SelectFilterHppd
                id="hppd-select"
                items={hppdOptions}
                value={hppdSelection}
                onChange={handleHppdSelectionChange}
                height={42}
              />
            </div>
            <div>
              <SearchHppd
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                setSearch={setSearch}
                label="Search Facility"
                widthClass={classes.searchWidth}
                onCrossClick={handleSearchClose}
              />
            </div>
          </div>
          <div>
            <div>
              <p className={classes.tableHeader}>
                Showing HPPD Results for{" "}
                {hppdOptions.find((opt) => opt.value === hppdSelection)?.label || "Department"}
              </p>
            </div>

            <TableContainer
              component={Paper}
              className={classes.tableContainer}
            >
              <Table className={classes.table} aria-label="HPPD Table">
                <TableHead>
                  <TableRow>
                    <TableCell className={classes.headerCellMain} rowSpan={2}>
                      Facility
                    </TableCell>
                    <TableCell className={classes.headerCellToday} colSpan={5}>
                      Today
                    </TableCell>
                    <TableCell className={classes.headerCell15Days} colSpan={5}>
                      15 Days - Daily Average
                    </TableCell>
                    <TableCell className={classes.headerCell30Days} colSpan={5}>
                      30 Days - Daily Average
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    {[
                      "Census",
                      "Avg Scheduled HPPD",
                      "Avg Actual HPPD",
                      "Target",
                      "Variance",
                    ]
                      .concat([
                        "Avg Census",
                        "Avg Scheduled HPPD",
                        "Avg Actual HPPD",
                        "Target",
                        "Variance",
                      ])
                      .concat([
                        "Avg Census",
                        "Avg Scheduled HPPD",
                        "Avg Actual HPPD",
                        "Target",
                        "Variance",
                      ])
                      .map((heading, index) => (
                        <TableCell key={index} className={classes.headerCell}>
                          {heading}
                        </TableCell>
                      ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hppdData?.length > 0 &&
                    hppdData?.map((row, index) => {
                      return (
                        <HppdTableRow
                          row={row}
                          updateRowData={updateRowData}
                          department={hppdSelection}
                        />
                      );
                    })}
                  {hppdData?.length === 0 && (
                    <TableRow>
                      <TableCell className={classes.cell} colSpan={20}>
                        <>
                          {
                            <div className={classes.noDataFound}>
                              No data found.
                            </div>
                          }{" "}
                        </>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {hppdData?.length > 0 && (
              <TablePagination
                count={hppdDataPagination.count}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default HppdTracker;
