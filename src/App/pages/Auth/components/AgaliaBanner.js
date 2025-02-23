import React from "react";
import { Typography, Grid } from "@material-ui/core";

import styles from "../auth.module.scss";

import AgaliaLogo from "../../../assets/images/auth/logo-small.png";

const AgaliaBanner = () => {
  return (
    <div className={styles.imageContainer}>
      <div className={styles.imageContent}>
        <Grid container direction="row" alignItems="center">
          <img src={AgaliaLogo} alt="" style={{ marginRight: 10 }} />
          <Typography variant="h2" style={{ color: "white" }}>
            Agalia
          </Typography>
        </Grid>

        <Typography
          variant="h1"
          style={{ color: "white", marginTop: 20, marginRight: 20 }}
        >
          Nursing management reimagined
        </Typography>
        <br />
        <span
          className="p1"
          style={{ marginTop: 20, width: 350, color: "#DDDFE6" }}
        >
          Select and manage skilled nursing workforce that best suits your
          patients’ needs.
        </span>
      </div>
    </div>
  );
};

export default AgaliaBanner;
