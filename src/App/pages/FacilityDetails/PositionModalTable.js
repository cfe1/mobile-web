import React, { useState, useEffect } from "react";
import { makeStyles, Grid } from "@material-ui/core";
import {
  Loader,
  TablePagination,
  SelectFilter,
  Toast,
  AcceptedAdditionalOpeningsModal,
  HoverText,
} from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import queryString from "query-string";
import DefaultPhoto from "App/assets/icons/DefaultPhoto.svg";

export const PositionModalTable = ({
  facility_id,
  startDate,
  endDate,
  job_title_id,
  search,
  handleForceRender,
  forceRender,
}) => {
  // <============== All Use States ============>
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [nurseSelectedIndex, setNurseSelectedIndex] = useState(0);
  const [nurseSelectedValue, setNurseSelectedValue] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [scheduleSelectedIndex, setScheduleSelectedIndex] = useState(0);
  const [scheduleSelectedValue, setScheduleSelectedValue] = useState(null);
  const [openAdditionalModal, setOpenAdditionalModal] = useState(false);
  const [additionalApplicantId, setAdditionalApplicantId] = useState("");
  const [additionalApplicantStatus, setAdditionalApplicantStatus] =
    useState("");
  const [additionalPositionId, setAdditionalPositionId] = useState(null);
  const [additionalShiftInfo, setadditionalShiftInfo] = useState();

  // <============ All Use Effects ===========>

  useEffect(() => {
    if (startDate) handleGetEmployeeData();
  }, [
    search,
    pageSize,
    currentPage,
    job_title_id,
    scheduleSelectedIndex,
    nurseSelectedIndex,
    startDate,
    forceRender,
  ]);

  useEffect(() => {
    if (startDate) getScheduleListing();
  }, [startDate]);

  // <============ All API calls ==============>

  const handleGetEmployeeData = async () => {
    const params = {
      page: currentPage,
      page_size: pageSize,
      search: search,
      position_view: true,
      schedule_id: schedules[scheduleSelectedIndex]?.id || "",
      job_title: [job_title_id],
      nurse_type: getNurseType(),
    };

    const urlParams = queryString.stringify(params);
    try {
      setLoading(true);
      const response = await API.get(
        ENDPOINTS.NURSE_TYPE_LISTING(facility_id, startDate, endDate, urlParams)
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

  const handleApplicantStatus = async (nurse_id, action) => {
    const payload = {
      status: action,
    };

    try {
      setLoading(true);
      const resp = await API.patch(
        ENDPOINTS.NURSE_ACTION(facility_id, nurse_id),
        payload
      );
      if (resp?.success) Toast.showInfoToast(resp?.data?.message);
    } catch (e) {
      Toast.showErrorToast(e?.data?.error?.message[0]);
    } finally {
      handleGetEmployeeData();
      handleForceRender();
    }
  };

  const getScheduleListing = async () => {
    try {
      const resp = await API.get(
        ENDPOINTS.SCHEDULE_LISTING(facility_id, startDate, endDate)
      );
      if (resp.success) {
        setSchedules([
          { title: "All", id: null },
          ...resp.data.map((shift) => {
            return { title: shift?.title, id: shift?.id };
          }),
        ]);
      }
    } catch (e) {
    } finally {
    }
  };

  // <============ All Helper Functions =============>
  const getMaxWidth = (gridSize, column = 7) => {
    // .007 is the margin right given to every block. Since we don't need it for last block, therefore have multiplied it by length - 1.
    // (100/15) is the grid size since we have divided it into 15 blocks
    // Hence at last the formula  derived is 100- (100*.007* (length - 1)) * width / 15 ;
    // Simplified version is used below.
    return `${gridSize * (100 / 15) * (1 - 0.007 * (column - 1))}%`;
  };

  const getDynamicStyle = (gridSize) => {
    const width = getMaxWidth(gridSize);
    return {
      maxWidth: width,
      flexBasis: width,
      flexGrow: 0,
    };
  };

  const numberAndTxt = (number, text, prefix = "") => (
    <div className={`${classes.flexCenter} ${classes.coloumnFlex}`}>
      <span
        className={`${number ? "" : classes.current} ${classes.statsNumber}`}
      >
        {number ? `${prefix && prefix} ${number.toLocaleString()}` : "-"}
      </span>
      <span className={classes.footerTxt}>{text}</span>
    </div>
  );

  const getNurseTypeText = (type) => {
    return type === "IN" ? "Internal" : type === "EN" ? "External" : "Agency";
  };

  const getNurseType = () => {
    return nurseSelectedValue === "Internal"
      ? "IN"
      : nurseSelectedValue === "External"
      ? "EN"
      : nurseSelectedValue === "Agency"
      ? "AN"
      : "";
  };

  const nurseFilter = () => {
    const menu = ["All", "Internal", "External", "Agency"];
    return (
      <SelectFilter
        menu={menu}
        selectedIndex={nurseSelectedIndex}
        setSelectedIndex={setNurseSelectedIndex}
        setSelectedValue={setNurseSelectedValue}
      />
    );
  };

  const scheduleFilter = () => {
    const menu = schedules.map((schedule) => schedule.title);
    return (
      <SelectFilter
        menu={menu}
        selectedIndex={scheduleSelectedIndex}
        setSelectedIndex={setScheduleSelectedIndex}
        setSelectedValue={setScheduleSelectedValue}
        ellispe={true}
      />
    );
  };

  const getActionButtons = (
    type,
    status,
    nurse_id,
    has_clocked_in,
    shift_status,
    accepted_employees,
    assigned_employees,
    total_position,
    position_id,
    shift_start_date,
    shift_title
  ) => {
    return (
      <>
        {!has_clocked_in &&
          shift_status !== "COMPLETED" &&
          newApplicantStatus[type][status]?.map((action, index) => {
            const { label, value } = action || {};
            return (
              <>
                <div
                  className={`${classes.actionButton} ${classes.flexCenter} ${
                    index > 0 && classes.extraBtn
                  } cursor-pointer`}
                  //  onClick={handleApplicantStatus.bind(null, nurse_id, value)}
                  onClick={handleAdditionalStatus.bind(
                    null,
                    nurse_id,
                    value,
                    accepted_employees,
                    assigned_employees,
                    total_position,
                    position_id,
                    shift_start_date,
                    shift_title
                  )}
                >
                  {label}
                </div>
              </>
            );
          })}
      </>
    );
  };

  const getStatusBlock = (status, confirmed_hours, actual_hours) => {
    let value = "";
    if (status === "ACCEPTED")
      value = (
        <>
          {numberAndTxt(confirmed_hours, "Scheduled Hrs")}
          {numberAndTxt(actual_hours, "Actual Hrs")}
        </>
      );
    else if (status === "CANCELLED" || status === "EXPIRED")
      value = status === "CANCELLED" ? "Cancelled" : "Expired";
    else if (status === "REJECTED") value = "Declined";
    else if (status === "ASSIGNED") value = "Pending";
    else if (status === "PENDING") value = "Applicant";

    return value;
  };

  const getStatusClass = (status) => {
    let statusClass = {};
    if (status === "PENDING" || status === "ASSIGNED")
      statusClass = classes.pending;
    else if (status === "CANCELLED" || status === "EXPIRED")
      statusClass = classes.cancelled;
    else if (status == "REJECTED") statusClass = classes.declined;

    return statusClass;
  };

  const handleAdditionalStatus = (
    id1,
    value,
    accepted_employees,
    assigned_employees,
    total_position,
    position_id,
    shift_start_date,
    shift_title
  ) => {
    if (
      (value === "ACCEPTED" || value === "ASSIGNED") &&
      accepted_employees + assigned_employees === total_position
    ) {
      handleOpenAdditionalModal();

      setAdditionalApplicantId(id1);
      setAdditionalApplicantStatus(value);
      setAdditionalPositionId(position_id);
      setadditionalShiftInfo({ shift_start_date, shift_title });
    } else handleApplicantStatus(id1, value);
  };

  const handleAddAdditionalOpenings = async () => {
    let payload = {
      is_weekly_schedule_v2: true,
      position_id: additionalPositionId,
      additional_opening_count: 1,
    };

    try {
      setLoading(true);
      const resp = await API.patch(
        `/facilities/shifts/additional-opening`,
        payload
      );
      if (resp.success) {
        handleApplicantStatus(additionalApplicantId, additionalApplicantStatus);
        handleCloseAdditionalModal();
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const handleOpenAdditionalModal = () => {
    setOpenAdditionalModal(true);
  };

  const handleCloseAdditionalModal = () => {
    setOpenAdditionalModal(false);
  };
  // <============= All constants ====================>

  const classes = useStyles();
  const newApplicantStatus = {
    IN: {
      //internal Nurse
      ASSIGNED: [
        {
          label: "Unassign",
          value: "UNASSIGNED",
        },
      ],
      ACCEPTED: [
        {
          label: "Decline",
          value: "REJECTED",
        },
      ],
      REJECTED: [
        {
          label: "Accept",
          value: "ACCEPTED",
        },
        // {
        //   label: "Assign",
        //   value: "ASSIGNED",
        // },
      ],
      CANCELLED: [
        {
          label: "Assign",
          value: "ASSIGNED",
        },
      ],
      PENDING: [
        {
          label: "Accept",
          value: "ACCEPTED",
        },
        {
          label: "Decline",
          value: "REJECTED",
        },
      ],
    },
    EN: {
      //external Nurse
      PENDING: [
        {
          label: "Accept",
          value: "ACCEPTED",
        },
        {
          label: "Decline",
          value: "REJECTED",
        },
      ],
      ACCEPTED: [
        {
          label: "Decline",
          value: "REJECTED",
        },
      ],
      REJECTED: [
        {
          label: "Accept",
          value: "ACCEPTED",
        },
      ],
      CANCELLED: [],
    },
    AN: {
      //Agency Nurse
      PENDING: [
        {
          label: "Accept",
          value: "ACCEPTED",
        },
        {
          label: "Decline",
          value: "REJECTED",
        },
      ],
      ACCEPTED: [
        {
          label: "Decline",
          value: "REJECTED",
        },
      ],
      REJECTED: [
        {
          label: "Accept",
          value: "ACCEPTED",
        },
      ],
      ASSIGNED: [],
    },
  };
  return (
    <>
      {loading && <Loader />}
      <div className={classes.container}>
        <Grid container className={classes.headingContainer}>
          <Grid
            item
            className={`${classes.headingBlock}`}
            style={getDynamicStyle(1.2)}
          >
            ID
          </Grid>
          <Grid
            item
            className={`${classes.headingBlock}`}
            style={getDynamicStyle(2.8)}
          >
            Employee {nurseFilter()}
          </Grid>
          <Grid
            item
            className={`${classes.headingBlock}`}
            style={getDynamicStyle(1)}
          >
            Position
          </Grid>
          <Grid
            item
            className={`${classes.headingBlock}`}
            style={getDynamicStyle(2)}
          >
            Shift {scheduleFilter()}
          </Grid>
          <Grid
            item
            className={`${classes.headingBlock}`}
            style={getDynamicStyle(3)}
          >
            Shift Hrs
          </Grid>
          <Grid
            item
            className={`${classes.headingBlock}`}
            style={getDynamicStyle(3)}
          >
            Spend Info
          </Grid>
          <Grid
            item
            className={`${classes.headingBlock} ${classes.noMgnRight}`}
            style={getDynamicStyle(2)}
          >
            Action
          </Grid>
        </Grid>
        {tableData?.results?.length > 0 ? (
          <>
            {tableData?.results?.map((employee, index) => {
              const {
                id,
                emp_id,
                applicant_id,
                fullname,
                profile_photo,
                user_type,
                status,
                shift_id,
                job_title_abbr,
                job_title,
                shift_title,
                shift_start_date,
                has_clocked_in,
                hours,
                spend,
                shift_status,
                accepted_employees,
                assigned_employees,
                total_position,
                position_id,
              } = employee || {};
              const { confirmed_hours, actual_hours } = hours || {};
              const { confirmed_spend, actual_spend } = spend || {};
              return (
                <>
                  <Grid
                    container
                    className={`${classes.contentContainer} ${
                      index + 1 === tableData?.results?.length &&
                      classes.noMgnBtm
                    }`}
                  >
                    <Grid
                      item
                      className={`${classes.contentBlock}`}
                      style={getDynamicStyle(1.2)}
                    >
                      {emp_id || "N/A"}
                    </Grid>
                    <Grid
                      item
                      className={`${classes.contentBlock} ${classes.fsJustify}`}
                      style={getDynamicStyle(2.8)}
                    >
                      <img
                        className={classes.photo}
                        src={profile_photo || DefaultPhoto}
                      />
                      <div className={`${classes.nameContainer}`}>
                        <span>{fullname || "N/A"}</span>
                        <span className={classes.grey}>
                          {getNurseTypeText(user_type)}
                        </span>
                      </div>
                    </Grid>
                    <Grid
                      item
                      className={`${classes.contentBlock}`}
                      style={getDynamicStyle(1)}
                    >
                      <HoverText
                        hovertxt={job_title}
                        fullTxt={job_title_abbr || "N/A"}
                      />
                    </Grid>
                    <Grid
                      item
                      className={`${classes.contentBlock} ${classes.coloumnFlex}`}
                      style={getDynamicStyle(2)}
                    >
                      <span>{shift_title || "N/A"}</span>
                      <span className={classes.grey}>
                        {moment(shift_start_date).format("MMM D, YYYY")}
                      </span>
                    </Grid>
                    <Grid
                      item
                      className={`${classes.contentBlock} ${
                        classes.seJustify
                      } ${getStatusClass(status)}`}
                      style={getDynamicStyle(3)}
                    >
                      {getStatusBlock(status, confirmed_hours, actual_hours)}
                    </Grid>
                    <Grid
                      item
                      className={`${classes.contentBlock} ${classes.seJustify}`}
                      style={getDynamicStyle(3)}
                    >
                      {numberAndTxt(confirmed_spend, "Scheduled Spend", "$")}
                      {numberAndTxt(actual_spend, "Actual Spend", "$")}
                    </Grid>
                    <Grid
                      item
                      className={`${classes.contentBlock} ${classes.actionContainer} ${classes.noMgnRight} ${classes.coloumnFlex}`}
                      style={getDynamicStyle(2)}
                    >
                      {getActionButtons(
                        user_type,
                        status,
                        applicant_id,
                        has_clocked_in,
                        shift_status,
                        accepted_employees,
                        assigned_employees,
                        total_position,
                        position_id,
                        shift_start_date,
                        shift_title
                      )}
                    </Grid>
                  </Grid>
                </>
              );
            })}
          </>
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
      {openAdditionalModal && (
        <AcceptedAdditionalOpeningsModal
          onClose={handleCloseAdditionalModal}
          onConfirm={handleAddAdditionalOpenings}
          loading={loading}
          shiftInfo={additionalShiftInfo}
        />
      )}
    </>
  );
};

const useStyles = makeStyles({
  container: {
    background: "#F3F4F7",
    borderRadius: "4px",
    padding: "8px",
    marginTop: 20,
  },
  headingContainer: {
    color: "#82889C",
    background: "white",
    fontWeight: "700",
    fontSize: "14px",
    height: 36,
    marginBottom: 8,
    borderRadius: 4,
    "@media (max-width:940px)": {
      fontSize: "12px",
    },
  },
  headingBlock: {
    marginRight: ".7%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  noMgnRight: {
    marginRight: "0px !important",
  },
  contentContainer: {
    height: 76,
    marginBottom: 6,
    color: "#020826",
    fontWeight: "700",
    fontSize: "14px",
    "@media (max-width:940px)": {
      fontSize: "11px",
      height: 70,
    },
  },
  contentBlock: {
    marginRight: ".7%",
    background: "white",
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    alignItems: "center",
  },
  noMgnBtm: {
    marginBottom: "0px !important",
  },
  flex: {
    display: "flex",
  },
  photo: {
    height: 34,
    marginRight: 10,
    marginLeft: "5%",
    width: 34,
    borderRadius: "50%",
  },
  nameContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    textAlign: "left",
  },
  grey: {
    color: "#82889C",
  },
  footerTxt: {
    fontSize: 12,
    fontWeight: 600,
    color: "#82889C",
    "@media (max-width:1000px)": {
      fontSize: "10px",
    },
    "@media (max-width:850px)": {
      fontSize: "8px",
    },
  },
  fsJustify: {
    justifyContent: "flex-start !important",
  },
  flexCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  coloumnFlex: {
    flexDirection: "column",
  },
  statsNumber: {
    fontSize: 20,
    fontWeight: 700,
    "@media (max-width:1000px)": {
      fontSize: "17px",
      fontWeight: "600",
    },
    "@media (max-width:850px)": {
      fontSize: "15px",
      fontWeight: "600",
    },
  },
  seJustify: {
    justifyContent: "space-evenly !important",
  },
  pending: {
    color: "#8B7424 !important",
    background: "#FCEFC1 !important",
  },
  cancelled: {
    color: "#FF0040 !important",
    background: "#FFDBDB !important",
  },
  declined: {
    color: "#08083D !important",
    background: "#DDDFE6 !important",
  },
  actionContainer: {
    padding: 4,
  },
  actionButton: {
    color: "#17174A",
    textAlign: "center",
    fontWeight: 800,
    fontSize: 14,
    background: "#F3F4F7",
    borderRadius: 4,
    height: 32,
    width: "100%",
    "@media (max-width:940px)": {
      fontSize: "12px",
      height: 28,
    },
  },
  extraBtn: {
    marginTop: 4,
  },
  noEmployee: {
    background: "#FFFFFF",
    alignItems: "center",
    paddingLeft: 10,
  },
});
