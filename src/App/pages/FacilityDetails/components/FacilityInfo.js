import React, { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import { Loader, BackButton } from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import emailIcon from "App/assets/icons/emialPinkLogo.svg";
import phoneIcon from "App/assets/icons/phonePinkLogo.svg";
import locationIcon from "App/assets/icons/locationPinkLogo.svg";
import { getAddress } from "../../../../utils/locationUtils";

import facilityPlaceholder from "App/assets/icons/facilityPlaceholder.svg";

const FacilityInfo = ({ FACILITY_ID }) => {
  //************************All states*****************//
  const [loading, setLoading] = useState(false);
  const [facilityProfile, setFacilityProfile] = useState(null);

  //************************All Use Effetcs*****************//
  useEffect(() => {
    if (FACILITY_ID) {
      fetchProfile();
    }
  }, [FACILITY_ID]);
  const classes = useStyles();
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get(ENDPOINTS.FETCH_PROFILE(FACILITY_ID));
      if (response.success) {
        setFacilityProfile(response?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  // =========== Other functions

  const mobileNUmber = (mobile) => {
    let USNumber;

    USNumber = mobile?.match(/(\d{3})(\d{3})(\d{4})/);
    if (USNumber) {
      //if profile.mobile has 10 digits
      USNumber = "(" + USNumber[1] + ") " + USNumber[2] + "-" + USNumber[3];
    } else {
      //if mobile number not in correct format
      USNumber = mobile;
    }

    return USNumber;
  };

  return (
    <>
      {loading && <Loader />}
      <Grid
        container
        alignItems="center"
        justify="space-between"
        className={classes.paddingBottom}
      >
        <Grid item container xs={6} alignItems="center">
          {facilityProfile?.image.type !== null ? (
            <div className={classes.facilityImageContainer}>
              <img
                className={classes.img}
                src={facilityProfile?.image.image}
              ></img>
            </div>
          ) : (
            <img className={classes.img} src={facilityPlaceholder}></img>
          )}
          <div className={classes.facilityName}>
            {facilityProfile?.name.toString()}
          </div>
        </Grid>
        <Grid xs={6} className={classes.detailsContainer} item>
          <Grid className={classes.infoContainer}>
            <Grid container className={classes.noFlexWrap} alignItems="center">
              <img src={emailIcon}></img>
              <div className={classes.details}>{facilityProfile?.email}</div>
            </Grid>
            <Grid container className={classes.noFlexWrap} alignItems="center">
              <img src={phoneIcon}></img>
              <div className={classes.details}>
                {`${facilityProfile?.country_code}${mobileNUmber(
                  facilityProfile?.phone
                )}`}
              </div>
            </Grid>
            <Grid container className={classes.noFlexWrap} alignItems="center">
              <img src={locationIcon}></img>
              <div className={classes.details}>
                {getAddress(facilityProfile?.address)}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default FacilityInfo;
const useStyles = makeStyles({
  paddingBottom: {
    padding: "8px 10px",
    marginTop: -20,
    borderRadius: 8,
    background: "#FFFFFF",
  },
  facilityImageContainer: {
    width: 133,
    height: 133,
    borderRadius: "100%",
    backgroundColor: "#F3F4F7",
    padding: 4,
    "@media (max-width:1150px)": {
      width: 100,
      height: 100,
    },
    "@media (max-width:950px)": {
      width: 90,
      height: 90,
    },
  },
  img: {
    width: 133,
    height: 133,

    borderRadius: "100%",
    "@media (max-width:1150px)": {
      width: 100,
      height: 100,
    },
    "@media (max-width:950px)": {
      width: 90,
      height: 90,
    },
  },
  facilityName: {
    width: "69%",
    fontSize: 32,
    fontWeight: 700,
    paddingLeft: "3%",
    "@media (max-width:1150px)": {
      fontSize: 26,
    },
    "@media (max-width:950px)": {
      fontSize: 22,
    },
  },
  detailsContainer: {
    height: 100,
    display: "flex",
    //   flexDirection: "column",
    justifyContent: "flex-end",
    minWidth: "20%",
  },
  details: {
    fontSize: 14,
    fontWeight: 600,
    paddingLeft: "3%",
    //width: "89%",
    "@media (max-width:1150px)": {
      fontSize: 13,
    },
    "@media (max-width:950px)": {
      fontSize: 12,
    },
  },
  infoContainer: {
    height: "100%",
    width: "fit-content",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
    marginRight: 8,
  },
  noFlexWrap: {
    flexWrap: "unset",
  },
});
