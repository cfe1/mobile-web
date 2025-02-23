import React from "react";
import { Dialog, DialogContent, makeStyles, Grid } from "@material-ui/core";
import CloseCrossButton from "../Button/CloseCrossButton";
import PinkPrimaryButton from "../Button/PrimaryButtonNew";
import { BackButton, LinearProgressBar, SecondaryButton } from "..";
// import leftArrow from "../../assets/icons/leftArrowNew.svg";
export const DialogModal = ({
  heading,
  onClose,
  handleConfirm = () => {},
  children,
  dialogCls,
  handleSecBtn,
  needSecBtn = false,
  form_id,
  needFooter = true,
  btntxt = false,
  secBtnTxt = false,
  needConfirmBtn = true,
  isConfirmDisable = false,
  extraHeaderBtn = false,
  onExtraHeaderBtnClick,
  extraHeaderBTnTxt,
  bigHeader,
  noPinkExtraBtn = false,
  loading,
  isBackBtnNeeded = false,
  onBack,
  closeTextNeeded = true,
  children1,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth
      disableBackdropClick
      classes={{
        paper: dialogCls || classes.dialog,
      }}
    >
      {loading && <LinearProgressBar />}{" "}
      <DialogContent className={classes.dialogContent}>
        <Grid container justify="space-between" alignItems="center">
          <Grid
            item
            alignItems="center"
            className={`${classes.title} ${bigHeader && classes.bigHeader}`}
          >
            {/* {isBackBtnNeeded && (
              <div className={`${classes.bBtn}`} onClick={onBack}>
                <img className={classes.backImg} src={leftArrow}></img>
              </div>
            )} */}
            {heading}
          </Grid>
          <Grid className={classes.flex}>
            {extraHeaderBtn && (
              <span
                className={`set-btn ${classes.eBtn} ${
                  noPinkExtraBtn && classes.noPinkExtraBtn
                }`}
                onClick={onExtraHeaderBtnClick}
              >
                {extraHeaderBTnTxt}
              </span>
            )}

            {children1}
            <CloseCrossButton
              onClick={onClose}
              closeTextNeeded={closeTextNeeded}
            />
          </Grid>
        </Grid>
        {children}
      </DialogContent>
      {needFooter && (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={`${classes.footer}`}
        >
          {needSecBtn && (
            <SecondaryButton className={classes.secBtn} onClick={handleSecBtn}>
              {secBtnTxt || "Back"}
            </SecondaryButton>
          )}
          {needConfirmBtn && (
            <PinkPrimaryButton
              type="submit"
              form={form_id}
              onClick={handleConfirm}
              className={classes.secBtn}
              disabled={isConfirmDisable}
            >
              {btntxt || "Confirm"}
            </PinkPrimaryButton>
          )}
        </Grid>
      )}
    </Dialog>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogContent: {
    boxSizing: "border-box",
    padding: 24,
  },
  title: {
    color: "#17174A",
    fontWeight: "700",
    fontSize: "20px",
    display: "flex",
    "@media (max-width:940px)": {
      fontSize: "17px",
    },
  },
  dialog: {
    maxWidth: "856px !important",
  },
  footer: {
    marginTop: 10,
    backgroundColor: "#F3F4F7",
    position: "relative",
    bottom: 0,
    minHeight: "84px",
    height: 90,
    display: "flex ",
    color: "white",
    fontWeight: 600,
    "@media (max-width:940px)": {
      fontSize: "0.65rem",
    },
  },
  secBtn: {
    minWidth: 160,
    marginRight: 10,
    padding: "18px 38px",
  },
  eBtn: {
    minWidth: "85px !important",
    padding: "8px 8px !important",
    marginRight: 6,
    display: "inline-block",
    height: 42,
    boxSizing: "border-box",
  },
  bigHeader: {
    fontSize: "30px !important",
  },
  noPinkExtraBtn: {
    color: "#17174A !important",
    border: "1px solid #DDDFE6 !important",
    cursor: "unser !important",
  },
  bBtn: {
    height: 40,
    width: 40,
    borderRadius: 4,
    border: "2px solid #F3F4F7",
    boxSizing: "border-box",
    marginRight: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  },
  backImg: {
    height: 11,
  },
  flex: {
    display: "flex",
  },
}));
