import React from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";

import { PrimaryButton, TransparentButton } from "../index";

import ErrorImage from "../../assets/images/popup-error.svg";
import WarnImage from "../../assets/images/popup-warn.svg";

const useStyles = makeStyles({
  root: {
    padding: "35px 40px 20px 20px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 24,
  },
  description: {
    width: 364,
    textAlign: "center",
    marginBottom: 40,
  },
  image: {
    marginTop: 15,
    marginBottom: 20,
    height: 110,
    width: 110,
  },
  footer: {
    backgroundColor: "#F5F6FA",
    padding: "23px 20px",
    display: "flex",
    justifyContent: "center",
  },
});

const ErrorModal = ({
  title,
  description,
  open,
  handleClose,
  handleSubmit,
  isWarning = false,
}) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.root}
      PaperProps={{ style: { borderRadius: 16 } }}
      maxWidth="sm"
    >
      <DialogContent style={{ padding: 0 }}>
        <div className={classes.content}>
          <img
            src={isWarning ? WarnImage : ErrorImage}
            className={classes.image}
            alt=""
          />
          <Typography variant="h4" align="center" style={{ marginBottom: 12 }}>
            {title}
          </Typography>
          <div className={classes.description}>
            <span className="p2 text-muted">{description}</span>
          </div>
        </div>
        <div className={classes.footer}>
          {handleSubmit ? (
            <>
              <TransparentButton
                wide
                onClick={handleClose}
                style={{ marginRight: 20 }}
              >
                Close
              </TransparentButton>
              <PrimaryButton wide onClick={handleSubmit}>
                Confirm
              </PrimaryButton>
            </>
          ) : (
            <PrimaryButton wide onClick={handleClose}>
              Close
            </PrimaryButton>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorModal;
