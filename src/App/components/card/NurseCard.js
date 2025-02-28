import { Typography, makeStyles } from "@material-ui/core";
import React from "react";
import user from "../../assets/icons/User@1x.svg";
import overTime from "../../assets/icons/overTime.svg";
import rateNotSet from "../../assets/icons/rateNotSet.svg";
import credIncomplete from "../../assets/icons/credIncomplete.svg";
// import overTime from "../../../assets/icons/overTime.svg";
import { useHistory } from "react-router";
import { getAbbreviatedPositionName } from "utils/textUtils";
import { API_TOKEN, AGALIA_ID } from "storage/StorageKeys";
import $ from "jquery";
import StorageManager from "storage/StorageManager";

const NurseCard = (props) => {
  const { details, onClick, selected, fromDashBoard, facility_id } = props;
  const history = useHistory();
  const classes = useStyles();
  const handleCredentials = (route_to = "credentials") => {
    //Add authentication headers as params
    var params = {
      access_token: StorageManager.get(API_TOKEN),
      facility_id: facility_id,
      route_to: `employees/employee-detail/${route_to}`,
      nurse_id: details?.id,
      fromOwner: true,
    };

    //Add authentication headers in URL
    //var url = ["http://localhost:3001/", $.param(params)].join("?");
    var url = [process.env.REACT_APP_URL, $.param(params)].join("?");
    var win = window.open(url);
  };
  return (
    <div
      onClick={
        details?.is_credential_complete &&
        details?.is_monthly_rate_set &&
        onClick
      }
      className={`${classes.card} ${classes.flexDisplay} ${
        selected === details.id ? classes.activeNurse : classes.inActiveNurse
      } ${classes.alignCenter} ${classes.justifyCenter} cursor-pointer ${
        (!details?.is_credential_complete || !details?.is_monthly_rate_set) &&
        classes.disableCard
      }`}
    >
      <div className={classes.columnFlex}>
        <img
          src={details?.profile_photo ? details?.profile_photo : user}
          alt=""
          className={classes.profilePic}
        />
        <div className={`${classes.detailsDiv} ${classes.nurseTypeBack}`}>
          <Typography className={classes.nurseType}>
            {getAbbreviatedPositionName(details.job_title)}
          </Typography>
        </div>
      </div>
      <div className={classes.detailsText}>
        <div className={`${classes.flexDisplay} ${classes.justifySpaceBtw}`}>
          <Typography
            className={classes.nameText}
          >{`${details?.fullname}`}</Typography>
          <div className={`${classes.detailsDiv} ${classes.priceBack}`}>
            <Typography className={classes.prices}>
              ${details.hourly_rate}/Hr
            </Typography>
          </div>
        </div>
        {!details?.is_credential_complete || !details?.is_monthly_rate_set ? (
          <div className={classes.incompleteDiv}>
            {!details?.is_credential_complete && (
              <div className={classes.flexDisplay}>
                <img className={classes.icon} src={credIncomplete} />
                <Typography className={classes.credText}>
                  <div className={classes.textC} onClick={handleCredentials}>
                    Credentials Incomplete
                  </div>
                </Typography>
              </div>
            )}
            {!details?.is_monthly_rate_set && (
              <div className={classes.flexDisplay}>
                <img className={classes.icon} src={rateNotSet} />
                <Typography className={classes.credText}>
                  <div
                    className={classes.textC}
                    onClick={() => handleCredentials("payment")}
                  >
                    Monthly rate not set.
                  </div>
                </Typography>
              </div>
            )}
          </div>
        ) : (
          <div>
            <Typography className={classes.credText}>
              Credentials Complete
            </Typography>
          </div>
        )}
        {details?.is_credential_expired ? (
          <div>
            <Typography className={classes.credText}>
              Credentials Expired
            </Typography>
          </div>
        ) : null}
        {details?.overtime_status ? (
          <div className={classes.flexDisplay}>
            <img className={classes.icon} src={overTime} alt="" />
            <Typography className={classes.credText}>Overtime Nurse</Typography>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NurseCard;
const useStyles = makeStyles({
  flexDisplay: {
    display: "flex",
  },
  aliignCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifySpaceBtw: {
    justifyContent: "space-between",
  },
  card: {
    //width: 290,
    height: 78,
    // padding: "15px 15px 12px",
    padding: 18,
    display: "flex",
    alignItems: "center",
    background: "white",
    boxSizing: "border-box",
  },
  detailsText: {
    width: "100%",
  },
  nameText: {
    color: "#17174A",
    fontWeight: 600,
    fontSize: 15,
    paddingLeft: 6,
  },
  overTimeText: {
    color: " #929AB3",
    fontWeight: 600,
    fontSize: 10,
    marginLeft: 10,
  },
  credText: {
    color: " #82889C",
    fontWeight: 600,
    fontSize: 13,
    marginLeft: 6,
  },
  inActiveNurse: {
    border: "1px solid #F3F4F7",
    borderRadius: 8,
  },
  activeNurse: {
    border: "2px solid #FF0083",
    borderRadius: 8,
  },
  profilePic: {
    height: 40,
    width: 40,
    marginBottom: 3,
  },
  nurseType: {
    color: "white",
    fontSize: 12,
    fontWeight: 600,
  },
  nurseTypeBack: {
    background: "#434966 !important",
  },
  prices: {
    color: "#FF0083",
    fontSize: 11,
    fontWeight: 700,
    // padding: 3,
  },
  priceBack: {
    background: "#FFE3F2 !important",
  },
  detailsDiv: {
    width: 35,
    height: 16,
    backgroundColor: "#F3F4F7",
    borderRadius: 4,
    padding: "2px 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  incompleteDiv: {
    display: "flex",
    flexDirection: "column",
    // width: 148,
  },
  columnFlex: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  textC: {
    color: "#929AB3",
    textDecoration: "underline !important",
  },
  disableCard: {
    opacity: ".6",
  },
  icon: {
    marginLeft: 5,
  },
});
