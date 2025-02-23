import React, { useEffect, useState } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";
import { TransparentButton, PrimaryButton, Loader } from "App/components";
import Morning from "App/assets/icons/morningEps.svg";
import Evening from "App/assets/icons/eveningEps.svg";
import Night from "App/assets/icons/nightEps.svg";
import PinkTickActive from "App/assets/icons/PinkTick.svg";
import PinkTickInActive from "App/assets/icons/tick-active.svg";
import cross from "App/assets/icons/CrossIconNew.svg";
import pinkCross from "App/assets/icons/pinkCross.svg";
import excalam from "App/assets/icons/exclaimationBig.svg";
import moment from "moment";

const BulkInviteCSVModal = ({
  onClose,
  conflictShifts,
  job_title_name,
  job_title_id,
  postPositionWithConflicts,
  date,
  assignToPosition,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [increasePosition, setIncreasePosition] = useState(new Map());
  const [increaseBudget, setIncreaseBudget] = useState(new Map());
  const [noShifts, setNoShifts] = useState(new Map());

  useEffect(() => {
    const noMap = new Map(noShifts);
    conflictShifts.forEach((shift) => {
      noMap.set(shift?.id, shift?.id);
    });
    setNoShifts(noMap);
  }, []);

  const handleReturnCardIcon = (startTime) => {
    const t = moment(startTime, "HH:mm:ss");
    const morningShiftStartTiming = moment("04:00:00", "HH:mm:ss");
    const eveningShiftStartTiming = moment("12:00:00", "HH:mm:ss");
    const eveningShiftendTiming = moment("18:59:00", "HH:mm:ss");
    const nightShiftStartTiming = moment("19:00:00", "HH:mm:ss");

    let icon;

    if (
      t.isBefore(morningShiftStartTiming) ||
      t.isAfter(nightShiftStartTiming)
    ) {
      icon = Night;
    } else if (
      t.isAfter(eveningShiftStartTiming) &&
      t.isBefore(eveningShiftendTiming)
    ) {
      icon = Evening;
    } else {
      icon = Morning;
    }

    return icon;
  };
  const getAbbreviatedPositionName = (name) => {
    return name
      .split(" ")
      .map((s) => {
        return s.substring(0, 1);
      })
      .join("");
  };
  const tickYes = (sid, shiftData, action) => {
    let map = new Map(increasePosition);
    let noMap = new Map(noShifts);
    if (assignToPosition) {
      if (map.has(sid) && action === "no") {
        map.delete(sid);
      } else if (action === "yes") {
        map.set(sid, shiftData);
      }
    } else if (map.has(sid) && action === "no") {
      noMap.set(sid, shiftData);
      map.delete(sid);
    } else if (action === "yes") {
      map.set(sid, shiftData);
      noMap.delete(sid);
    }
    setIncreasePosition(map);
    setNoShifts(noMap);
  };

  const createPayload = () => {
    let array = [];
    if (assignToPosition) {
      conflictShifts.forEach((position) => {
        if (increasePosition.has(position.id)) {
          let obj = {};
          obj.job_title = {
            id: position.jobTitleId,
            position_id: position.id,
            nurses: new Array(position.totalIncrease),
          };
          array.push(obj);
        }
      });
    } else {
      [...increasePosition.entries()].forEach((shift) => {
        let posId;
        conflictShifts.forEach((cShift) => {
          if (cShift?.id === shift[0]) {
            let newObj = cShift.positions.find(
              (position) => position.job_title_id === job_title_id
            );
            posId = newObj.id;
          }
        });
        let obj = {
          id: posId,
          shift: shift[0],
          is_additional_opening: true,
          is_budget_opening: increaseBudget.has(shift[0]) ? true : false,
        };
        return array.push(obj);
      });
    }
    postPositionWithConflicts(array, noShifts);
  };
  return (
    <>
      <Modal
        className="modal-container"
        open={true}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        backdrop="static"
        // onClick={(e) => onOverlayClick(e)}
      >
        <div className={`modal-content ${classes.modalContent}`}>
          {loading && <Loader />}
          <div className="uplod-container">
            <div className={classes.flexCenter}>
              <img src={excalam}></img>
            </div>
            <Grid container>
              <Grid item xs={12}>
                {assignToPosition ? (
                  <Typography className={classes.modalHeading}>
                    All openings are filled in the selected shift
                  </Typography>
                ) : (
                  <Typography className={classes.modalHeading}>
                    All openings are filled in the mentioned positions
                  </Typography>
                )}
              </Grid>
              <div className={classes.additionalOpening}>
                Create additional opening
              </div>
              <div className={classes.shiftDataContainer}>
                {conflictShifts.map((shift) => {
                  return (
                    <div>
                      <div className={classes.shiftData}>
                        <div className={classes.shiftNameButtonContainer}>
                          {!assignToPosition && (
                            <div className={classes.shiftNamecontainer}>
                              <div>
                                <span className={classes.shiftName}>
                                  {`${shift.title} Shift`}
                                </span>
                                <img
                                  className={classes.shiftIcon}
                                  src={handleReturnCardIcon(shift.start_time)}
                                ></img>
                              </div>
                            </div>
                          )}

                          <div
                            className={`${classes.shiftNamecontainer} ${
                              assignToPosition
                                ? classes.shiftNamecontainerLength
                                : ""
                            }${classes.positionNameTxt} ${classes.marginLeft}`}
                          >
                            {assignToPosition ? (
                              <span className={classes.shiftName}>
                                {shift.positionName}
                              </span>
                            ) : (
                              <span className={classes.shiftName}>
                                {getAbbreviatedPositionName(job_title_name)}
                              </span>
                            )}
                          </div>
                          <div
                            className={`${classes.shiftNamecontainer} ${classes.datewidth} ${classes.marginLeft}`}
                          >
                            {assignToPosition ? (
                              <span className={classes.shiftName}>
                                {moment(date).format("MMM DD, yyyy")}
                              </span>
                            ) : (
                              <span className={classes.shiftName}>
                                {moment(shift.start_date).format(
                                  "MMM DD, yyyy"
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={classes.buttonContainer}>
                          <div
                            className={`${classes.btns} ${
                              increasePosition.has(shift.id)
                                ? ""
                                : classes.blackBorderTxt
                            }`}
                            onClick={() => {
                              tickYes(shift.id, shift, "yes");
                            }}
                          >
                            <img
                              src={
                                increasePosition.has(shift.id)
                                  ? PinkTickActive
                                  : PinkTickInActive
                              }
                            ></img>
                            <span className={classes.yesNoTxt}>Yes</span>
                          </div>
                          <div
                            className={`${classes.btns} ${classes.marginLeft} ${
                              increasePosition.has(shift.id)
                                ? classes.blackBorderTxt
                                : ""
                            }`}
                            onClick={() => {
                              tickYes(shift.id, shift, "no");
                            }}
                          >
                            <img
                              src={
                                !increasePosition.has(shift.id, shift)
                                  ? pinkCross
                                  : cross
                              }
                            ></img>
                            <span className={classes.yesNoTxt}>No</span>
                          </div>
                        </div>
                      </div>
                      {/* {allocationMatrix.find((data) => {
                        return data.job_title_id === job_title_id;
                      }) && (
                        <div>
                          <div className={classes.selectRowcontainer}>
                            <SelectRow
                              selected={increaseBudget.has(shift?.id)}
                              onClick={() => {
                                increaseBudgetAdd(shift.id, shift);
                              }}
                            />
                            <span className={classes.bgtTxt}>
                              Change Budget according to opening
                            </span>
                          </div>
                        </div>
                      )} */}
                    </div>
                  );
                })}
              </div>
            </Grid>
          </div>

          <Grid container>
            <div className={classes.footer}>
              <TransparentButton
                wide
                className={`${classes.tButton} ${classes.fButtons}`}
                onClick={onClose}
              >
                Cancel
              </TransparentButton>
              <PrimaryButton
                onClick={createPayload}
                className={`${classes.fButtons} ${classes.pinkBg} matrix-btn`}
                wide
                type="submit"
              >
                Confirm
              </PrimaryButton>
            </div>
          </Grid>
        </div>
      </Modal>
    </>
  );
};

export default BulkInviteCSVModal;

const useStyles = makeStyles({
  modalContent: {
    // width: "50%",
    width: 947,
    // height: 385,
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
    marginTop: 34,
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
  shiftNameButtonContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "8px 16px",

    width: "440px",
    height: 60,

    background: "#F3F4F7",
    borderRadius: 8,
    "@media (max-width:950px)": {
      width: "370px",
    },
  },
  shiftNamecontainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    gap: 16,
    justifyContent: "center",
    width: 179,
    height: 44,

    background: "#FFFFFF",
    borderRadius: 10,
  },
  shiftNamecontainerLength: {
    width: "266px !important",
  },
  datewidth: {
    width: `135px !important`,
  },
  positionNameTxt: {
    width: "80px !important",
  },
  shiftName: {
    fontSize: 20,
    fontWeight: 500,
    "@media (max-width:950px)": {
      fontSize: 16,
    },
  },
  shiftIcon: {
    marginLeft: 12,
  },
  marginLeft: {
    marginLeft: 16,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 13,
  },
  btns: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: "16px",
    width: "125px",
    height: "35px",
    background: "#FFFFFF",
    border: "2px solid #FF0083",
    borderRadius: "8px",
    fontWeight: 500,
    fontSize: 20,
    justifyContent: "flex-start",
    cursor: "pointer",
    "@media (max-width:950px)": {
      width: "80px",
      padding: "15px",
    },
  },
  shiftData: {
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    "@media (max-width:950px)": {
      fontSize: 25,
    },
  },
  yesTxt: {
    fontWeight: 500,
    fontSize: 20,
  },
  pinkColor: {
    color: "#FF0083",
  },
  blackBorderTxt: {
    borderColor: "#17174A !important",
    color: "black !important",
  },
  shiftDataContainer: {
    width: "100%",
    marginLeft: "2%",
    marginTop: 6,
    marginRight: "2%",
  },
  fButtons: {
    width: 208,
    height: 54,
    borderRadius: 4,
  },
  pinkBg: {
    background: "#FF0083",
  },
  selectRowcontainer: {
    display: "flex",
    marginTop: 8,
  },
  bgtTxt: {
    color: "#17174A",
    fontSize: 16,
    fontWeight: 600,
    marginLeft: 10,
  },
  additionalOpening: {
    width: "97%",
    display: "flex",
    justifyContent: "flex-end",
    fontSize: 20,
    fontWeight: 700,
  },
  yesNoTxt: {
    marginLeft: 10,
  },
});
