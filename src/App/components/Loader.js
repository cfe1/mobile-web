import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme) => ({
  bottom: {
    color: "linear-gradient(to right,#D831B4, #6241E9)",
  },
  circle: {
    strokeLinecap: "round",
  },
}));


const Loader = () => {
  const classes = useStyles();

  return (
    <div
      style={{
        position: "fixed",
        zIndex: 100,
        top: 0,
        left: 0,
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "rgba(0,0,0,0.2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 10,
          borderRadius: 8,
          width: 50,
          height: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress
          variant="indeterminate"
          disableShrink
          classes={{
            circle: classes.circle,
          }}
          size={40}
          thickness={4}
        />
      </div>
    </div>
  );
};

export default Loader;

