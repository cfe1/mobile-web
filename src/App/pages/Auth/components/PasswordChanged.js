import React from "react";
import { Typography } from "@material-ui/core";
import { PrimaryButton } from "../../../components";

import SuccessIcon from "../../../assets/icons/success.svg";

import styles from "../auth.module.scss";

const PasswordChanged = ({ onLoginClick }) => {
  return (
    <div className={styles.emailSentContainer}>
      <img src={SuccessIcon} alt="" className={styles.authImg}/>
      <Typography variant="h3" style={{ marginTop: 20 }}>
        Password changed
      </Typography> <br />
      <span className="text-muted p2" style={{ marginTop: 20 }}>
        Your password was succesfully changed. <br />
        You may now login to your account.
      </span>

      <div style={{ marginTop: 60 }}>
        <PrimaryButton onClick={onLoginClick} wide>
          Back to login
        </PrimaryButton>
      </div>
    </div>
  );
};

export default PasswordChanged;
