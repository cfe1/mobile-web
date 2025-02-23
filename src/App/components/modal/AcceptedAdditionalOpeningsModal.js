import React from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { TransparentButton, PrimaryButton, Loader } from "../../components";
import moment from "moment";
import excalam from "App/assets/icons/exclaimationBig.svg";
import AlertCircle from "App/assets/icons/AlertCircle.svg";

export const AcceptedAdditionalOpeningsModal = ({
  onClose,
  onConfirm,
  loading,
  shiftInfo,
}) => {
  const getDayDate = () => {
    return `${moment(shiftInfo?.shift_start_date).format("dddd")} | ${moment(
      shiftInfo?.shift_start_date
    ).format("DD MMM YYYY")}`;
  };

  const getAMPM = (time, date) => {
    return date?.concat("T", time);
  };

  const getShiftNameTime = () => {
    return `${shiftInfo?.shift_title}`;

    // | ${moment(
    //   getAMPM(shiftInfo?.start_time, shiftInfo?.start_date)
    // ).format("hh:mm a")} - ${moment(
    //   getAMPM(shiftInfo?.end_time, shiftInfo?.start_date)
    // ).format("hh:mm a")}`;
  };
  const classes = useStyles();

  return (
    <>
      <Modal
        className="modal-container"
        open={true}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        backdrop="static"
      >
        <div className={`modal-content ${classes.modalContent}`}>
          {loading && <Loader />}
          <div className="uplod-container">
            <div className={classes.flexCenter}>
              <img src={excalam} alt="error-icon"></img>
            </div>
            <Grid container>
              <Grid item xs={12}>
                <Typography className={classes.modalHeading}>
                  {`Openings are filled in the selected shift. Create additional opening for the shift?`}
                </Typography>
              </Grid>
            </Grid>
          </div>

          <div className={classes.flex}>
            <div className={classes.container}>
              <span className={classes.subContainer}>{getDayDate()}</span>
            </div>
            <div className={`${classes.container} ${classes.mgTwtLeft}`}>
              <span className={classes.subContainer}>{getShiftNameTime()}</span>
            </div>
          </div>

          <div className={`${classes.flex} ${classes.mgTwtTop}`}>
            <img className={classes.alertCircle} src={AlertCircle} />
            <span className={classes.disclaimer}>
              If you select no, the employee will not be added to shift.
            </span>
          </div>

          <Grid container>
            <div className={classes.footer}>
              <TransparentButton
                wide
                className={`${classes.tButton} ${classes.fButtons}`}
                onClick={onClose}
              >
                No
              </TransparentButton>
              <PrimaryButton
                className={`${classes.fButtons} ${classes.pinkBg} matrix-btn`}
                wide
                onClick={onConfirm}
              >
                Yes
              </PrimaryButton>
            </div>
          </Grid>
        </div>
      </Modal>
    </>
  );
};

const useStyles = makeStyles({
  modalContent: {
    width: 947,
    minHeight: 0,
    "@media (max-width:950px)": {
      fonSize: 18,
      width: 680,
    },
  },
  modalHeading: {
    fontSize: 30,
    fontWeight: 600,
    textAlign: "center",
    marginBottom: 25,
    marginTop: 25,
    marginLeft: 90,
    marginRight: 90,
    "@media (max-width:950px)": {
      fontSize: 25,
    },
  },
  footer: {
    backgroundColor: "#F5F6FA",
    width: "100%",
    padding: "23px 0px",
    display: "flex",
    justifyContent: "center",
    borderRadius: 16,
    marginTop: 20,
  },

  tButton: {
    marginRight: 20,
  },

  flexCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },

  fButtons: {
    // width: 265,
    height: 54,
    borderRadius: 4,
  },
  pinkBg: {
    background: "#FF0083",
  },
  flex: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    height: "50px",
    padding: "8px",
    background: "#F3F4F7",
    boxSizing: "border-box",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
  },
  subContainer: {
    color: "#17174A",
    padding: "4px",
    fontSize: "20px",
    background: "white",
    fontWeight: "600",
    borderRadius: "4px",
    paddingLeft: "15px",
    paddingRight: "15px",
  },
  mgTwtLeft: {
    marginLeft: 20,
  },
  alertCircle: {
    width: 20,
    height: 20,
  },
  disclaimer: {
    color: "#FF0083",
    fontSize: 16,
    marginLeft: 10,
  },
  mgTwtTop: {
    marginTop: 20,
  },
});
