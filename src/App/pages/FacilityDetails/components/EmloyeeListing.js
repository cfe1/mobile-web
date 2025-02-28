import React, { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { HoverText, Loader, PinkPrimaryButton } from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import defaultProfile from "App/assets/icons/profile_default.svg";
import queryString from "query-string";
import EmployeesModal from "../EmployeesModal";

const EmployeeListing = ({ facilityId, getFacilityDetails }) => {
  //************************All states*****************//
  const [loading, setLoading] = useState(false);
  const [EmployeeList, setEmployeeList] = useState(null);
  const [EmployeeCount, setEmployeeCount] = useState(0);
  const [openEmployeeModal, setOpenEmployeeModal] = useState(false);

  //************************All Use Effetcs*****************//
  useEffect(() => {
    if (facilityId) {
      fetchEmployees();
    }
  }, [facilityId]);
  const classes = useStyles();
  const fetchEmployees = async () => {
    const params = {
      page_size: 17,
    };
    const urlParams = queryString.stringify(params, {
      encode: false,
      arrayFormat: "bracket",
    });
    try {
      setLoading(true);
      const response = await API.get(
        ENDPOINTS.FACILITY_EMPLOYEES(facilityId, urlParams)
      );
      if (response.success) {
        setEmployeeList(response?.data?.results);
        setEmployeeCount(response?.data?.count);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  // =========== Other functions
  const getAbbreviatedPositionName = (name) => {
    return name
      .split(" ")
      .map((s) => {
        return s.substring(0, 1);
      })
      .join("");
  };

  const employeeCard = (employee, index) => {
    return (
      <Grid className={classes.employeeCard}>
        <img
          className={classes.profilePhoto}
          src={
            employee?.profile_photo ? employee?.profile_photo : defaultProfile
          }
        ></img>

        <div className={classes.nameAndJobTitle}>
          <div className={classes.fullName}>{employee?.fullname}</div>
          <div>
            <HoverText
              hovertxt={employee?.job_title}
              fullTxt={getAbbreviatedPositionName(employee?.job_title)}
              fulltxtClass={classes.jobTitleName}
            />
          </div>
        </div>
      </Grid>
    );
  };

  const handleOpenEmployeeeModal = () => {
    setOpenEmployeeModal(true);
  };

  const handleCloseEmployeeeModal = () => {
    setOpenEmployeeModal(false);
  };

  return (
    <>
      {loading && <Loader />}
      <Grid container alignItems="center" className={classes.employeeContainer}>
        <Grid container justify="space-between" alignItems="center">
          <div className={classes.employeeTxt}>{`Employees-${
            EmployeeCount ? EmployeeCount : 0
          }`}</div>
          {EmployeeList?.length > 0 && (
            <PinkPrimaryButton
              className={`${classes.setBtn}    `}
              onClick={handleOpenEmployeeeModal}
            >
              {"View All"}
            </PinkPrimaryButton>
          )}
        </Grid>
        {EmployeeList?.length > 0 ? (
          <Grid container className={classes.employeeCardContainer}>
            {EmployeeList.map((employee, index) => {
              return employeeCard(employee, index);
            })}
            {EmployeeCount > 17 && (
              <Grid className={classes.employeeCard}>
                <div
                  className={`${classes.profilePhoto} ${classes.lastEmployee}`}
                >
                  {`+ ${EmployeeCount - 12}`}
                </div>
                <div
                  className={`${classes.nameAndJobTitle} ${classes.fullName}`}
                >
                  <div className={classes.fullName}>
                    {`+ ${EmployeeCount - 12} More`}
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        ) : (
          <Grid container className={classes.employeeCardContainer}>
            No Employees Found
          </Grid>
        )}
      </Grid>
      {openEmployeeModal && (
        <EmployeesModal
          facility_id={facilityId}
          onClose={handleCloseEmployeeeModal}
        />
      )}
    </>
  );
};

export default EmployeeListing;
const useStyles = makeStyles({
  employeeContainer: {
    padding: "16px",
    borderRadius: 10,
    background: "#FFFFFF",
    marginTop: 24,
  },
  employeeTxt: {
    fontSize: 18,
    fontWeight: 700,
  },
  employeeCardContainer: {
    background: "#F3F4F7",
    padding: 8,
    paddingBottom: 0,
    paddingLeft: 0,
    borderRadius: 4,
    marginTop: 18,
  },
  fullName: {
    fontSize: 16,
    fontWeight: 500,
  },
  jobTitleName: {
    fontSize: 15,
    fontWeight: 500,
    color: "#82889C",
  },
  profilePhoto: {
    height: 32,
    width: 32,
    borderRadius: "100%",
  },
  lastEmployee: {
    background: "#FF0083",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    fontSize: 12,
    fontWeight: 600,
  },
  employeeCard: {
    background: "#FFFFFF",
    padding: 4,
    marginLeft: 8,
    marginBottom: 8,
    width: 200,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
  },
  nameAndJobTitle: {
    marginLeft: "5%",
  },
  setBtn: {
    width: "110px",
    color: "#FF0083 !important",
    padding: 0,
    height: 44,
    backgroundColor: "#FFFFFF !important",
    //borderColor:'#FF0083 !important',
    border: "2px solid #FF0083 !important",
    marginLeft: "0px !important",
  },
});
