import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { API, ENDPOINTS } from "api/apiService";
import moment from "moment";
import {
  Toast,
  Loader,
  TransparentButton,
  PinkPrimaryButton,
  ShiftFloorCard,
  CloseCrossButton,
} from "App/components";
import { makeStyles } from "@material-ui/core/styles";
import DefaultProfilePic from "App/assets/icons/profile_default.svg";
import blueTick from "App/assets/images/blueTick.svg";
import { getAbbreviatedPositionName } from "utils/textUtils";

import IncreasePositionsDialog from "./IncreasePositionsDialog";

const SelectShift = (props) => {
  const {
    asShifts,
    date,
    job_title_name,
    emp_name,
    emp_id,
    closeModal,
    handleClose,
    prevDayShiftsData,
    facility_id,
    handleForceRender,
  } = props;
  const [todaysShift, setTodaysShift] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignedMap, setAssignedMap] = useState(new Map());
  const [openConflictModal, setOpenConflictModal] = useState(false);
  const [conflictShifts, setConflictShifts] = useState([]);
  const [stats, setStats] = useState({});
  const [totalWorkedHrs, setTotalWorkedHrs] = useState(0);
  const [unitSet, setunitSet] = useState(false);
  const [jobTitleId, setJobTitleId] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  useState(null);
  useEffect(() => {
    getUnits();
  }, []);
  useEffect(() => {
    if (unitSet) {
      getShiftsData();
    }
  }, [unitSet]);
  useEffect(() => {
    if (todaysShift.length) {
      getEmpStats();
    }
  }, [todaysShift]);
  const closeCmodal = () => {
    setOpenConflictModal(false);
  };
  const getUnits = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`facilities/unit-list`);
      if (resp.success) {
        let newUnit = resp.data.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setUnits([...newUnit]);
        setunitSet(true);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const getEmpStats = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`facilities/employees/${emp_id}`);
      if (resp.success) {
        setJobTitleId(resp?.data?.job_title?.id);
        setProfilePic(resp?.data?.profile_photo);
        setStats(resp?.data?.scheduled_working_hour);
        let sum = 0;
        let vvv = resp?.data?.scheduled_working_hour?.total_hour_worked.map(
          (hw) => {
            sum = sum + hw.total_hours_worked;
          }
        );
        setTotalWorkedHrs(sum);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const getShiftsData = async () => {
    const currDate = moment(date).format("YYYY-MM-DD");

    try {
      setLoading(true);
      const formatDate = `${moment(new Date(date)).format().substring(0, 10)}`;
      const response = await API.get(
        ENDPOINTS.FACILITY_SHIFTS(facility_id, currDate, currDate)
      );
      if (response?.success) {
        const asMap = new Map();
        asShifts.forEach((assignedShift) => {
          const { unit_id } = assignedShift; // Have to destructure the id, to be added from backend
          const { schedule_id: id } = assignedShift.shift_info;

          asMap.set(id, unit_id === null ? "unAssigned" : unit_id); // need the unit id
        });
        setTodaysShift(response?.data);
        setAssignedMap(asMap);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignedShifts = async () => {
    const unassingnedShifts = [];

    asShifts.forEach((shift) => {
      if (!assignedMap.has(shift?.shift_info?.schedule_id))
        unassingnedShifts.push(shift?.id);
    });

    if (unassingnedShifts.length === 0) return;
    const packet = {
      ids: unassingnedShifts,
    };
    try {
      setLoading(true);
      const resp = await API.deleteResource(
        `facilities/employees/${emp_id}/withdraw-shift`,
        packet
      );
      if (resp.success) {
        Toast.showInfoToast(resp.data.message);
        closeModal();
      }
    } catch (e) {
    } finally {
      setLoading(false);
      handleForceRender();
    }
  };
  const handlePostShifts = async (noShifts = new Map()) => {
    // Post api similar response
    if (assignedMap.size === 0) {
      handleUnassignedShifts();
      //  prevDayShiftsData();
      return;
    }
    const formatDate = `${moment(new Date(date)).format().substring(0, 10)}`;
    const payload = {
      schedules: [...assignedMap.entries()]
        .filter((schedule) => !noShifts.has(schedule[0]))
        .map((schedule) => {
          return {
            id: schedule[0],
            unit: schedule[1] === "unAssigned" ? null : schedule[1], // not necessary to have id, can be empty
          };
        }),
      start_date: formatDate,
      end_date: formatDate,
      job_title: jobTitleId,
    };

    if (payload?.schedules?.length === 0) {
      closeModal();
      return;
    }

    try {
      setLoading(true);
      const resp = await API.post(
        ENDPOINTS.ASSIGN_SHIFTS(facility_id, emp_id),
        payload
      );
      if (resp.success) {
        Toast.showInfoToast("Nurse Shifts Updated");
        handleUnassignedShifts();
        //  prevDayShiftsData();
        closeModal();
      }
    } catch (e) {
    } finally {
      setLoading(false);
      handleForceRender();
    }
  };
  const handleConfirm = () => {
    let findConflictShifts = todaysShift.filter((shift) => {
      return shift?.positions?.filter((position) => {
        if (assignedMap.has(shift.id)) {
          let findAlreadyAssignShift = asShifts.find((assignedShift) => {
            if (assignedShift.shift_info.schedule_id === shift.id) {
            }
            return assignedShift.shift_info.schedule_id === shift.id;
          });
          if (!findAlreadyAssignShift) {
            if (jobTitleId === position.job_title_id) {
              return (
                position?.applicants_list?.accepted_applicants_count +
                  position?.applicants_list?.applicants.filter(
                    (nurse) => nurse.status === "ASSIGNED"
                  ).length >=
                position.total_positions
              );
            }
          }
        }
      })[0];
    });
    if (findConflictShifts.length > 0) {
      setConflictShifts(findConflictShifts);
      setOpenConflictModal(true);
    } else {
      handlePostShifts();
    }
  };
  const postPositionWithConflicts = async (arr, noShifts) => {
    if (arr?.length === 0) {
      handlePostShifts(noShifts);
      return;
    }
    let payload = {
      shifts: arr,
      is_dashboard: true,
    };
    try {
      setLoading(true);
      const resp = await API.patch(
        `/facilities/shifts/additional-opening`,
        payload
      );
      if (resp.success) {
        handlePostShifts(noShifts);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  let sum = 0;

  const classes = useStyles();
  return (
    <div className={classes.content}>
      {loading && <Loader />}
      <div className={classes.header}>
        <span className={classes.assignText}>Assign</span>
        <Grid className={classes.header}>
          <div className={`${classes.flex} ${classes.empDiv}`}>
            <img src={blueTick} alt="" className={classes.marginRight} />
            <img
              src={profilePic || DefaultProfilePic}
              alt=""
              className={classes.pic}
            />
            <div className={classes.empName}>{emp_name}</div>
            <div className={classes.empName}>
              {getAbbreviatedPositionName(job_title_name)}
            </div>

            <div className={classes.empName}>
              {moment(date).format("DD MMM YYYY")}
            </div>
          </div>
          <CloseCrossButton onClick={handleClose} />
        </Grid>
      </div>
      <div className={classes.wasContainer}>
        <div className={classes.asiAvaShifts}>
          {todaysShift.length > 0 && (
            <div className={classes.assigned}>
              <Grid container spacing={2} className={classes.sfcContainer}>
                {todaysShift.map((shift) => {
                  const {
                    id,
                    start_time,
                    end_time,
                    start_date,
                    end_date,
                    title,
                    status,
                    timezone,
                  } = shift;
                  return (
                    <>
                      <ShiftFloorCard
                        start_date={start_date}
                        end_date={end_date}
                        start_time={start_time}
                        end_time={end_time}
                        id={id}
                        units={units}
                        map={assignedMap}
                        setMap={setAssignedMap}
                        title={title}
                        status={status}
                        timezone={timezone}
                      />
                    </>
                  );
                })}
              </Grid>
            </div>
          )}
        </div>
        <div className={classes.flex}>
          <div className={classes.greenDiv}>
            {`Scheduled Hrs/ week-${Number(
              stats.total_hour_scheduled ? stats.total_hour_scheduled : 0
            ).toFixed(2)}`}
          </div>
          <div className={`${classes.greenDiv} ${classes.marginLeft}`}>
            {`Actual Worked Hrs-${totalWorkedHrs}`}
          </div>
        </div>
      </div>
      <div className={classes.footer}>
        <PinkPrimaryButton
          className={`${classes.btns} matrix-btn ${
            !assignedMap.size ? classes.disabledColor : ""
          }`}
          wide="wide"
          onClick={handleConfirm}
          disabled={!assignedMap.size}
        >
          Confirm
        </PinkPrimaryButton>
      </div>
      {openConflictModal && (
        <IncreasePositionsDialog
          onClose={closeCmodal}
          job_title_name={job_title_name}
          conflictShifts={conflictShifts}
          job_title_id={jobTitleId}
          postPositionWithConflicts={postPositionWithConflicts}
          date={date}
        />
      )}
    </div>
  );
};

export default SelectShift;
const useStyles = makeStyles({
  root: {
    padding: "35px 40px 20px 20px",
  },
  footer: {
    backgroundColor: "#F5F6FA",
    width: "100%",
    padding: "23px 0px",
    display: "flex",
    justifyContent: "center",
    marginTop: 10,
  },
  flex: {
    display: "flex",
  },
  header: {
    //padding: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignText: {
    fontSize: 22,
    fontWeight: 700,
  },
  empDiv: {
    background: "#EDECF5",
    width: "fit-content",
    padding: "0 10px",
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    borderRadius: 8,
  },
  marginRight: {
    marginRight: 10,
  },
  empName: {
    background: "#fff",
    padding: 10,
    color: "black",
    fontWeight: 600,
    marginLeft: 10,
    borderRadius: 4,
    height: 22,
  },
  daysSelect: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    padding: 10,
  },
  weekQText: {
    fontSize: 24,
    color: "#82889C",
  },
  asIcon: {
    height: 30,
    cursor: "pointer",
  },
  weekText: {
    fontSize: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  wcContainer: {
    border: "1px solid #FF0083",
    padding: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
    marginTop: 10,
  },
  assigned: {
    background: "#fff",
    marginBottom: 20,
  },
  assignedShiftText: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 20,
  },
  wasContainer: {
    marginTop: 18,
  },
  sfcContainer: {
    display: "flex",
    flexWrap: "wrap",
  },
  pic: {
    width: 45,
    marginRight: 10,
  },
  btns: {
    height: 54,
    width: 140,
  },
  greenDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px",
    width: "192px",
    height: "47px",
    background: "#E5F8F2",
    borderRadius: "4px",
    color: "#00D498",
    fontSize: 13,
    fontWeight: 600,
    boxSizing: "border-box",
  },
  marginLeft: {
    marginLeft: 15,
  },
  disabledColor: {
    background: "lightgray !important",
  },
});
