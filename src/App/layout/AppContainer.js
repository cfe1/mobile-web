import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

import Sidebar from "../components/Layout/Sidebar";
import Header from "../components/Layout/Header";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: "100vh",
    background: "#FFFFFF",
  },
  contentHeader: {
    width: "100%",
    background: "#FFFFFF",
  },
});

const Content = (props) => (
  <div
    style={{
      padding: "10px 20px 32px 20px",
      overflow: "hidden",
      marginTop: 70,
    }}
  >
    {props.children}
  </div>
);

const AppContainer = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [width, setWidth] = React.useState(window.innerWidth);
  const ref = React.useRef(null);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("resize", updateDimensions);
  }, []);

  //for updating the current window width
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };

  //to handle the open or close of hamburger menu
  const changeNav = () => {
    setOpen(!open);
  };

  const onLinkClick = (val) => {
    setOpen(false);
  };

  // //to handle the outside click on slider
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  var containerClasses = [];
  if (open) {
    containerClasses.push("open");
  }

  return (
    <div>
      <div className={classes.root} key={window.location.pathname}>
        <div className={classes.contentHeader}>
          <Header isOpen={open} change={changeNav} />
          <Content>{props.children}</Content>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({
  user,
});

export default connect(mapStateToProps)(withRouter(AppContainer));
