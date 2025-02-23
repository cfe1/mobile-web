import React from "react";
import { makeStyles, Grid } from "@material-ui/core";

const StatsCard = ({ title, number }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={classes.card}
      justify="center"
      alignItems="center"
    >
      <Grid>
        <Grid
          container
          className={classes.title}
          justify="center"
          alignItems="center"
        >
          {title}
        </Grid>
        <Grid
          container
          className={classes.number}
          justify="center"
          alignItems="center"
        >
          {number}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StatsCard;
const useStyles = makeStyles({
  title: {
    fontWeight: 800,
    fontSize: 14,
  },
  number: {
    fontSize: 26,
    fontWeight: 700,
    color: "#FF0083",
    "@media (max-width:1050px)": {
      fontSize: "24px",
    },
    "@media (max-width:800px)": {
      fontSize: "22px",
    },
  },
  card: {
    minHeight: 85,
    backgroundColor: "#FFFFFF",
    "@media (max-width:1050px)": {
      minHeight: 75,
    },
    "@media (max-width:800px)": {
      minHeight: 65,
    },
  },
});
