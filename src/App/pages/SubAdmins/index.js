import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Switch,
  TextField,
  Chip,
  Tooltip,
  Typography,
} from "@material-ui/core";
import SearchHppd from "App/components/Form/SearchHppd";
import {
  Badge,
  LinearProgressBar,
  SwitchButton,
  TablePagination,
  Toast,
} from "App/components";
import {
  FilterConts,
  PARAM_NAME,
  ITEMS,
} from "App/components/Filter/filterConts";
import AddIcon from "@material-ui/icons/Add";
import { makeStyles } from "@material-ui/core/styles";
import { apiErrorHandler } from "utils/apiUtil";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import CustomMultiSelect from "App/components/CustomMultiSelect";
import AddSubadminModal from "./AddSubadminModal";
import Filters from "App/components/Filter/Filters";
import { transformJobTitles } from "../NewDashboard/utills/common";
import FacilityService from "../NewDashboard/utills/FacilityService";

const STATUS = {
  ACITVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(3),
  },
  filters: {
    display: "flex",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
    justifyContent: "space-between",
  },
  chip: {
    height: 26,
    background: "#F3F4F7",
    fontWeight: 700,
    fontSize: 14,
    borderRadius: 4,
  },
  addButton: {
    height: 44,
    marginRight: 12,
    backgroundColor: "#FF0083", // Deep teal alternative
    color: "white",
    "&:hover": {
      backgroundColor: "#FF0083", // Slightly transparent on hover
    },
  },

  searchField: {
    marginLeft: "auto",
    background: "#F3F4F7",
    borderRadius: 4,
  },
  tableContainer: {
    marginTop: theme.spacing(2),
    "& .MuiTableCell-body": {
      color: "#020826 !important",
      fontSize: "14px !important",
      cursor: "pointer",
    },
    "& .MuiTableCell-head": {
      color: "#565674 !important",
      fontSize: "12px !important",
    },
  },
  facilityTooltip: {
    maxWidth: 300,
    fontSize: 14,
    wordBreak: "break-word",
  },
  searchWidth: {
    width: 200,
  },
  flex: {
    display: "flex",
  },
}));

const renderTooltip = (items, classes, facilityTooltip = true) => (
  <Tooltip
    title={
      <Typography className={classes.facilityTooltip}>
        {items
          .map((item) =>
            facilityTooltip
              ? item?.facility_details?.name
              : item?.facility_details?.role?.role_name
          )
          .join(", ")}
      </Typography>
    }
    interactive
  >
    <Chip
      label={`+${items.length}`}
      size="small"
      style={{ marginLeft: 8 }}
      className={classes.chip}
    />
  </Tooltip>
);

const SubAdminPage = () => {
  const classes = useStyles();
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [listingData, setListingData] = useState({});
  const [isOpenNew, setisOpenNew] = useState(false);
  const [subAdminData, setSubAdminData] = useState({});
  const [facilityList, setFacilityList] = useState([]);
  const [selectedFacilityIds, setSelectedFacilityIds] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([
    {
      value: "CLEAR_ALL",
      label: "Clear All",
      index: -1,
    },
  ]);
  useEffect(() => {
    fetchSubAdminData();
  }, [search, pageSize, currentPage, selectedFacilityIds]);
  useEffect(() => {
    getFacilityList();
  }, []);
  const fetchSubAdminData = async () => {
    try {
      setLoading(true);

      let params = {
        search,
        page: currentPage,
        page_size: pageSize,
        facility: selectedFacilityIds,
      };

      const urlParams = queryString.stringify(params);

      const resp = await API.get(ENDPOINTS.SUBADMINS_LISTING(urlParams));

      if (resp.success) {
        setListingData(resp.data);
      }
    } catch (e) {
      apiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };
  const getFacilityList = async () => {
    // setLoading(true);
    const data = await FacilityService.fetchFacilityList();
    const facilityList = transformJobTitles(data);
    setFacilityList(facilityList);
    // setLoading(false);
  };

  const getPayload = (data = {}) => {
    return {
      is_active: !(data.subadmin_status === STATUS.ACITVE),
      email: data.email,
      facility_ids: data.facilities.map((facility) => facility.facility_id),
    };
  };

  const handleChangeStatus = async (row, e) => {
    // e.stopPropagation();
    const payload = getPayload(row);
    try {
      setLoading(true);

      const resp = await API.patch(
        ENDPOINTS.CHANGE_SUBADMIN_STATUS(row.id),
        payload
      );

      if (resp.success) {
        Toast.showInfoToast(resp.data.detail);
        fetchSubAdminData();
      }
    } catch (e) {
      apiErrorHandler(e);
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
  const handleNewButton = async (row) => {
    setisOpenNew(true);
    setSubAdminData(row); // getSelectJobTitileModalData(facilityRowId);
  };

  const handleCloseAddSubADmin = () => {
    setSubAdminData({});
    setisOpenNew(false);
    fetchSubAdminData();
  };
  const filtersObj = [
    {
      paramName: PARAM_NAME.FACILITY,
      items: facilityList,
      key: "facility", // type: FilterConts.MULTIPLE_SELECT,
      setFunction: (value) => {
        setSelectedFacilityIds(value);
      },
      value: selectedFacilityIds,
      initialValue: [],
    },
  ];

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <Badge count={listingData.count || 0} innerDivStyle={{ marginTop: 24 }}>
          <h2>Sub Admins</h2>
        </Badge>
        {/* <div className={classes.flex}> */}
        {/* <span>{`(${listingData.count || 0})`}</span> */}
        {/* </div> */}
      </div>
      {loading && <LinearProgressBar belowHeader={true} />}
      <div className={classes.filters}>
        <Filters
          gridSize={8}
          filterObject={filtersObj}
          onFilterSelected={(data) => setSelectedFilters(data)}
          selectedFiltersPopulate={selectedFilters}
        />
        <div className={classes.flex}>
          <Button
            variant="contained"
            onClick={handleNewButton}
            className={classes.addButton}
          >
            Add New Sub Admin
          </Button>
          <SearchHppd
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            setSearch={setSearch}
            label="Search Sub-Admin"
            widthClass={classes.searchWidth}
            onCrossClick={handleSearchClose}
          />
        </div>
      </div>
      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Admin</TableCell> <TableCell>Facility Name</TableCell>
              <TableCell>Role</TableCell>{" "}
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {listingData?.results?.length > 0 ? (
              listingData?.results?.map((row) => {
                const { facilities = [] } = row;
                const firstFacility = facilities[0] || {};
                const remainingFacilities = facilities.slice(1);
                return (
                  <TableRow key={row.id} onClick={() => handleNewButton(row)}>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {firstFacility.facility_details?.name}
                      {remainingFacilities.length > 0 &&
                        renderTooltip(remainingFacilities, classes)}
                    </TableCell>
                    <TableCell>
                      {firstFacility?.facility_details?.role?.role_name}
                      {remainingFacilities.length > 0 &&
                        renderTooltip(remainingFacilities, classes, false)}
                    </TableCell>
                    <TableCell
                      align="right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <SwitchButton
                        value={row.subadmin_status === STATUS.ACITVE}
                        onChange={(e) => handleChangeStatus(row, e)}
                        color="#FF0083"
                        width={28}
                        height={16}
                        handleDiameter={14}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No data found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        count={listingData?.count || 0}
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
      {isOpenNew && (
        <AddSubadminModal
          setisOpenNew={setisOpenNew}
          subAdminData={subAdminData}
          handleCloseAddSubADmin={handleCloseAddSubADmin}
        />
      )}
    </div>
  );
};

export default SubAdminPage;
