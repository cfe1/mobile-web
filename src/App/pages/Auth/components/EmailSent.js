import React from "react";
import { Typography } from "@material-ui/core";
import { PrimaryButton } from "../../../components";

import EmailIcon from "../../../assets/icons/email.svg";

import styles from "../auth.module.scss";

const EmailSent = ({ onResend, onLoginClick }) => {
  return (
    <div className={styles.emailSentContainer}>
      <img src={EmailIcon} alt="" className={styles.authImg} />
      <Typography variant="h3" style={{ marginTop: 20 }}>
        Email sent!
      </Typography>
      <br />
      <span className="text-muted p2" style={{ marginTop: 23 }}>
        Please check your email inbox. You will receive an email with
        instructions on how to reset your password soon.
      </span>
      <div className="center-row" style={{ marginTop: 60 }}>
        <PrimaryButton
          isDisabled
          style={{ marginRight: 12 }}
          onClick={onResend}
        >
          Resend
        </PrimaryButton>
        <PrimaryButton onClick={onLoginClick}>Back to login</PrimaryButton>
      </div>
    </div>
  );
};

export default EmailSent;
