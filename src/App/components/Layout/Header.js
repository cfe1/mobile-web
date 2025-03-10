import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Typography, withStyles, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { API, ENDPOINTS } from "../../../api/apiService";
import { updateProfile } from "../../../redux/actions/authActions";
import NotificationIconRead from "../../assets/icons/notificationBell.svg";
import ArrowDownIcon from "../../assets/icons/arrow-down.svg";
import LogoutIcon from "../../assets/icons/logout.svg";
import DefaultProfilePic from "../../assets/images/profile_default.svg";
import { ErrorModal } from "../index";
import ProfileIcon from "../../assets/icons/profile.svg";
import ham2 from "../../assets/icons/heart.png";
import TooltipRef from "@material-ui/core/Tooltip";
import { withRouter, useLocation } from "react-router-dom";
import StorageManager from "../../../storage/StorageManager";
import SIdeBarShortcutActive from "../../assets/icons/sidebar-shrotcuts-active.svg";
import SIdeBarShortcutInactive from "../../assets/icons/sidebar-shortcuts-inactive.svg";
import NavigationPanel from "./NavigationPanel";
const StyledMenu = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#EDECF5",
    },
    fontSize: 14,
    width: "100%",
    whiteSpace: "pre-line",
    background: "#F3F4F7",
    marginTop: 8,
    borderRadius: 8,
    //   height:45
  },
  selected: {
    backgroundColor: "#FFF1F8 !important",
    border: "1px solid #FF0083",
  },
})(MenuItem);
const useStyles = makeStyles({
  root: (props) => ({
    height: 70,
    width: "100%",
    backgroundColor: "white",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  }),
  notification: {
    marginRight: 30,
  },
  userContainer: { marginRight: 40, cursor: "pointer" },
  profilePic: {
    height: 50,
    width: 50,
    borderRadius: 25,
    objectFit: "cover",
    marginRight: 15,
  },
  userName: {
    fontSize: 12,
    lineHeight: 17 / 12,
    marginRight: 10,
    color: "#FFFFFF",
  },
  roleName: {
    fontSize: 11,
    lineHeight: 15 / 11,
    color: "#9EA4BB",
    marginRight: 10,
  },
  container: {
    display: "flex",
  },
  headerContainer: {
    background: "#FF0083",
    padding: 10,
    position: "fixed",
    zIndex: 5,
  },
  containerDiv: {
    display: "flex",
    marginLeft: 10,
    gap: 3,
    height: 48,
    backgroundColor: "#F3F4F7",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "30px",
    boxSizing: 9,
    gap: 5,
    boxSizing: "border-box",
    padding: 10,
  },
  facilityMenue: {
    width: 180,
    boxShadow: "1px 5px 12px 2px rgba(138,131,131,.75)",
    padding: "0px 8px",
  },
  reverse: {
    width: 18,
    height: 18,
    marginRight: 10,
    cursor: "pointer",
  },
  sideBar: {
    cursor: "pointer",
    marginRight: 16,
  },
  heartContainer: {
    marginTop: 5,
  },
  metrics: {
    width: 117,
    height: 40,
    borderRadius: 8,
    border: `1px solid #FFF`,
    marginRight: 16,
    display: "flex",
    color: "#FFF",
  },
});

const Header = React.memo((props) => {
  const { profile, facilityInfo } = props;
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [width, setWidth] = React.useState(window.innerWidth);
  const [facility, setFacility] = useState();
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [navPanelanchor, setNavPanelanchor] = React.useState(null);

  let count = 0;
  const location = useLocation();
  const facilityId = 123123;

  React.useEffect(() => {
    let count = 0;
    if (props.notification) {
      getNotfications();
    }
  }, [props.notification]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    window.addEventListener("resize", updateDimensions);
    getNotfications();
    getFacilityList();
  }, []);

  React.useEffect(() => {
    if (!profile) {
      imageError();
    }
  }, [profile && profile.first_name]);

  const getFacilityList = (url) => {
    API.get(`owner/facility/list`)
      .then((response) => {
        if (response.statusCode === 200) {
          setFacility(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getNotfications = (url) => {
    API.get("owner/notifications/unread-count")
      .then((response) => {
        if (response.statusCode === 200) {
          setUnreadCount(response.data.count);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //for updating the current window width
  const updateDimensions = () => {
    setWidth(window.innerWidth);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const resp = await API.deleteResource(ENDPOINTS.LOGOUT);
    } catch (e) {
      console.log(e);
    } finally {
      await localStorage.clear();
      // if isAuthenicated false then Authwrapper redirect its to login page
      //clears the auth reducer to its initial state in redux store
      //clears the chat session and client

      history.push("/auth/login");
      handleClose();
    }
  };

  const imageError = async () => {
    const resp = await API.get(ENDPOINTS.FETCH_PROFILE);
    if (resp.success) {
      props.updateProfile(resp.data);
    }
  };

  var containerClasses = [];
  if (props.isOpen) {
    containerClasses.push("open");
  }

  const handleClickFacility = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleCloseFacility = () => {
    setAnchorEl2(null);
  };

  // const handleListItemClick = (facilityId) => {
  //   StorageManager.put(FACILITY_ID, facilityId);
  //   props.clearFacilty();
  //   handleClose();
  //   if (location.pathname === "/dashboard") {
  //     window.location.reload(true);
  //   } else {
  //     history.push("/dashboard");
  //   }
  // };

  const openNavPanel = (event) => {
    setNavPanelanchor(event.currentTarget);
  };

  const closeNavPanel = () => {
    setNavPanelanchor(null);
  };

  const classes = useStyles();
  const open = Boolean(anchorEl2);

  return (
    <Grid
      container
      justify="space-between"
      alignItems="center"
      className={classes.headerContainer}
    >
      <Grid item container justify={"flex-end"} alignItems="center">
        <img
          onMouseEnter={openNavPanel}
          src={navPanelanchor ? SIdeBarShortcutActive : SIdeBarShortcutInactive}
          className={classes.sideBar}
          onClick={openNavPanel}
        />

        <div
          onClick={() => {
            history.push("/notifications");
          }}
          style={{ cursor: "pointer" }}
        >
          {unreadCount > 0 ? (
            <div style={{ display: "flex" }}>
              <div>
                <img
                  src={NotificationIconRead}
                  className={classes.notification}
                  alt="notification icon"
                />
              </div>
              <div
                style={{
                  alignSelf: "flex-start",
                  marginLeft: "-40px",
                  marginTop: "-10px",
                  marginRight: 15,
                  backgroundColor: "#ffffff",
                  padding: "0px 5px",
                  borderRadius: 50,
                  color: "black",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span className="label">{unreadCount}</span>
              </div>
            </div>
          ) : (
            <img
              src={NotificationIconRead}
              className={classes.notification}
              alt="notification icon"
            />
          )}
        </div>
        <img
          src={profile?.profile_photo ?? DefaultProfilePic}
          className={classes.profilePic}
          onError={imageError}
        />
        <div className={classes.userContainer}>
          <div className="row-center" onClick={handleClick}>
            <Typography className={classes.userName}>
              {profile && profile.first_name} {profile && profile.last_name}
            </Typography>
            <img src={ArrowDownIcon} alt="dropdown icon" />
          </div>
        </div>
      </Grid>

      <Menu
        className={classes.menu}
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        autoFocus={false}
        disableAutoFocusItem={true}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MenuItem
          onClick={() => {
            history.push("/profile");
            handleClose();
          }}
        >
          <img
            src={ProfileIcon}
            alt="profile icon"
            style={{ marginRight: "10px" }}
          />
          My Profile
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowLogout(true);
          }}
        >
          <img
            src={LogoutIcon}
            alt="profile icon"
            style={{ marginRight: "10px" }}
          />
          Logout
        </MenuItem>
      </Menu>

      <ErrorModal
        isWarning={true}
        open={showLogout}
        title="Logout"
        description="Are you sure you want to logout?"
        handleClose={() => setShowLogout(false)}
        handleSubmit={handleLogout}
      />
      <NavigationPanel
        anchorEl={navPanelanchor}
        handleClose={closeNavPanel}
        facility={props.facility}
      />
    </Grid>
  );
});

const mapStateToProps = ({ auth: { profile } }) => ({
  profile,
});

const mapDispatchToProps = (dispatch) => ({
  updateProfile: (data) => dispatch(updateProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
