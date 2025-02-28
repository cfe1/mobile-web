import React from "react";
import { Dialog, DialogContent, makeStyles, Grid } from "@material-ui/core";
import CloseCrossButton from "../Button/CloseCrossButton";
import PinkPrimaryButton from "../Button/PrimaryButtonNew";
import { LinearProgressBar, SecondaryButton } from "..";
// import leftArrow from "./assets/icons/leftArrowNew.svg";
import BackButton from "../../assets/icons/newBack.svg";

export const NewDialogModal = ({
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
  extraHeaderBtnClass = false,
  onExtraHeaderBtnClick,
  extraHeaderBTnTxt,
  bigHeader,
  noPinkExtraBtn = false,
  greyEditBtn = false,
  loading,
  isBackBtnNeeded = false,
  onBack,
  closeTextNeeded = true,
  children1,
  closeCrossBtnNeeded = true,
  subTxt,
  children2,
  subHeadeing,
  subHeaderCls,
  footerCls,
  subHeadingDir,
  disableEnforceFocus = false,
  disableAutoFocus = false,
  dialogRoot,
  fullWidth = true,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={true}
      maxWidth="sm"
      fullWidth={fullWidth}
      disableBackdropClick
      classes={{
        paper: dialogCls || classes.dialog,
        root: dialogRoot, // Apply the custom root class here
      }}
      disableEnforceFocus={disableEnforceFocus}
      disableAutoFocus={disableAutoFocus}
    >
      {loading && <LinearProgressBar />}
      <DialogContent className={classes.dialogContent}>
        <Grid
          container
          display="flex"
          justify="space-between"
          alignItems="center"
          className={`${classes.mb24}`}
        >
          <Grid item className={classes.dialogHead} alignItems="center">
            {isBackBtnNeeded && (
              <img
                src={BackButton}
                alt="back-btn"
                className="mr-10 cursor-pointer"
                onClick={onClose}
              />
            )}
            <Grid
              container
              direction={subHeadingDir ? subHeadingDir : "column"}
              alignItems="center"
              className={`${classes.title} ${bigHeader && classes.bigHeader}`}
            >
              {heading}
              {subHeadeing && (
                <div
                  className={`${classes.subTxt} ${
                    subHeaderCls && subHeaderCls
                  }`}
                >
                  {subHeadeing}
                </div>
              )}
            </Grid>
          </Grid>
          <Grid className={classes.flex}>
            {extraHeaderBtn && (
              <span
                className={`
                ${
                  extraHeaderBtnClass
                    ? `${classes.chip} ${classes[extraHeaderBTnTxt]}`
                    : greyEditBtn
                    ? classes.greyEditBtn
                    : `set-btn ${classes.eBtn}`
                }
                ${noPinkExtraBtn && classes.noPinkExtraBtn}
              `}
                onClick={onExtraHeaderBtnClick}
              >
                {extraHeaderBTnTxt}
              </span>
            )}

            {children1}
            {closeCrossBtnNeeded && (
              <CloseCrossButton
                onClick={onClose}
                closeTextNeeded={closeTextNeeded}
              />
            )}
          </Grid>
        </Grid>
        {children}
      </DialogContent>
      {needFooter && (
        <Grid
          container
          justify="center"
          alignItems="center"
          className={`${classes.footer} ${footerCls}`}
        >
          {needSecBtn && (
            <SecondaryButton
              className={`${classes.secBtn} ${classes.bgLtBl}`}
              onClick={handleSecBtn}
            >
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
    color: "#08083D",
    marginLeft: 16,
    fontWeight: "700",
    fontSize: "22px",
    display: "flex",
    "@media (max-width:940px)": {
      fontSize: "17px",
    },
  },
  dialog: {
    maxWidth: "856px !important",
  },
  dialogHead: {
    display: "flex",
  },
  footer: {
    // marginTop: 10,
    // backgroundColor: "#F3F4F7",
    position: "relative",
    bottom: 0,
    minHeight: "84px",
    height: 90,
    display: "flex ",
    color: "white",
    fontWeight: 600,
    borderTop: "1px solid #F3F4F7",
    "@media (max-width:940px)": {
      fontSize: "0.65rem",
    },
  },
  secBtn: {
    minWidth: 160,
    marginRight: 10,
    padding: "18px 38px",
    height: 44,
    marginRight: 15,
  },
  mb24: {
    marginBottom: "24px",
  },
  greyEditBtn: {
    backgroundColor: "#F2F4F7",
    borderRadius: "4px",
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "51px",
    height: "30px",
    fontWeight: "500",
    fontSize: "12px",
    lineHeight: "15px",
    cursor: "pointer",
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
  subTxt: {
    fontSize: 15,
    fontWeight: 500,
  },
  Accepted: {
    backgroundColor: theme.palette.background.ltGreen,
    color: theme.palette.secondary.green,
  },
  Rejected: {
    backgroundColor: theme.palette.background.ltRed,
    color: theme.palette.secondary.red,
  },
  Pending: {
    backgroundColor: theme.palette.background.ltYellow,
    color: theme.palette.secondary.yellowDark,
  },
  ended: {
    background: theme.palette.background.lightBlue,
    color: theme.palette.secondary.grey1,
  },
  chip: {
    width: 80,
    height: 26,
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    fontWeight: 600,
    // padding:"4px 8px",
  },
}));
