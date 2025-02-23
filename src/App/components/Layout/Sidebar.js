import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AgaliaLogo from "../../assets/images/auth/logo-small.png";
import menuItems from "./menuItems";
import { SIDEBAR_WIDTH } from "../../constants/uiConstants";
import { updateRole } from "../../../redux/actions/adminActions";
import { connect } from "react-redux";
import StorageManager from "../../../storage/StorageManager";
import icon1 from "../../assets/icons/ham.svg";
import ham1 from "../../assets/icons/ham1.svg";
import ham2 from "../../assets/icons/ham2.svg";

export const ICONS = {
  CODE_BOARD: {
    active: require("../../assets/icons/sidebar/dashboard.svg"),
    inActive: require("../../assets/icons/sidebar/dashboard-inactive.svg"),
    hover: require("../../assets/icons/sidebar/hover_schedule_builder.svg"),
  },
  CODE_HPPD_TRACKER: {
    active: require("../../assets/icons/sidebar/hppdTrackerPink.svg"),
    inActive: require("../../assets/icons/sidebar/hppdTracker.svg"),
    hover: require("../../assets/icons/sidebar/hppdTrackerWtBg.svg"),
  },
  CODE_FAC: {
    active: require("../../assets/icons/sidebar/facility.svg"),
    inActive: require("../../assets/icons/sidebar/facility-inactive.svg"),
  },
  CODE_NURSE: {
    active: require("../../assets/icons/sidebar/nurses.svg"),
    inActive: require("../../assets/icons/sidebar/nurses-inactive.svg"),
  },
  CODE_CL: {
    active: require("../../assets/icons/sidebar/loan.svg"),
    inActive: require("../../assets/icons/sidebar/loan-inactive.svg"),
  },
  CODE_MAR: {
    active: require("../../assets/icons/sidebar/release.svg"),
    inActive: require("../../assets/icons/sidebar/release-inactive.svg"),
  },
  CODE_SUBAD: {
    active: require("../../assets/icons/sidebar/subadmin.svg"),
    inActive: require("../../assets/icons/sidebar/subadmin-inactive.svg"),
  },
  CODE_ROLES: {
    active: require("../../assets/icons/sidebar/roles.svg"),
    inActive: require("../../assets/icons/sidebar/roles-inactive.svg"),
  },
  CODE_CRED: {
    active: require("../../assets/icons/sidebar/credential.svg"),
    inActive: require("../../assets/icons/sidebar/credential-inactive.svg"),
  },
  CODE_CMS: {
    active: require("../../assets/icons/sidebar/cms.svg"),
    inActive: require("../../assets/icons/sidebar/cms-inactive.svg"),
  },
  settings: {
    active: require("../../assets/icons/sidebar/setting.svg"),
    inActive: require("../../assets/icons/sidebar/setting-inactive.svg"),
  },
  CODE_TAX: {
    active: require("../../assets/icons/sidebar/taxes-active.svg"),
    inActive: require("../../assets/icons/sidebar/taxes-inactive.svg"),
  },
  CODE_REIMBURSEMENT: {
    active: require("../../assets/icons/sidebar/reimbursement-active.svg"),
    inActive: require("../../assets/icons/sidebar/reimbursement-inactive.svg"),
  },
};

const useSidebarStyles = makeStyles({
  root: ({ backgroundColor }) => ({
    maxWidth: SIDEBAR_WIDTH,
    padding: "10px",
    backgroundColor,
    color: "white",
  }),
  logoImage: {
    height: 16,
    width: 16,
  },
  menuContainer: {
    marginTop: 33,
  },
  title: {
    marginBottom: 10,
  },
});

const ListItem = ({
  item: { id, title, link },
  isActive,
  history,
  index,
  onLinkClick,
}) => (
  <Link
    id={`edit-icon${index}`}
    to={link}
    style={{ textDecoration: "none", color: "white" }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        cursor: "pointer",
        userSelect: "none",
      }}
      onClick={() => {
        history.push(link);
        onLinkClick();
      }}
    >
      <img
        src={isActive ? ICONS[id].active : ICONS[id].inActive}
        style={{
          marginRight: 27,
          height: 48,
          width: 48,
        }}
        alt="menu icons"
      />
      <Typography className={isActive ? "text-white p2" : "text-muted p2"}>
        {title}
      </Typography>
    </div>
  </Link>
);

const Sidebar = (props) => {
  const theme = useTheme();

  const history = useHistory();
  const ref = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(false);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  const classes = useSidebarStyles({
    backgroundColor: theme.palette.background.default,
  });
  // const adminArray = ["dashboard", "schedule","CODE_SHIFTS","CODE_EMP","CODE_PAY","CODE_MPBJ", "CODE_BENEF", "CODE_SUBAD", "CODE_ROLES", "CODE_DD","settings"]
  const adminArray = ["CODE_BOARD", "settings"];
  let getRoleInfo = {};
  const role = JSON.parse(StorageManager.get("ROLE"));
  //const rClick = document.

  if (role) {
    if (role.acls.length > 0) {
      role.acls.forEach((element) => {
        element.acl.forEach((ele) => {
          if (ele.key === "is_view" && ele.value === true) {
            adminArray.push(element.feature.code);
          }
        });
        getRoleInfo[element.feature.code] = element.acl;
      });
    }
  }

  const updateDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  React.useEffect(() => {
    props.updateRole(getRoleInfo);
    window.addEventListener("resize", updateDimensions);
  }, []);

  // const handleClickOutside = (event) => {
  //   if (ref.current && !ref.current.contains(event.target)) {
  //     setAnchorEl(false);
  //   }
  // };
  // React.useEffect(() => {
  //   document.addEventListener("click", handleClickOutside, true);
  //   return () => {
  //     document.removeEventListener("click", handleClickOutside, true);
  //   };
  // });

  function toggleSidebar(bool) {
    //only work for desktop version
    if (windowWidth > 1025) {
      setAnchorEl(bool);
    }
  }

  return (
    <div
      ref={ref}
      className={anchorEl ? "sidenav side1" : "sidenav side"}
      // onMouseEnter={() => setAnchorEl(true)}
      // onMouseLeave={() => setAnchorEl(false)}
      onMouseEnter={() => toggleSidebar(true)}
      onMouseLeave={() => toggleSidebar(false)}
    >
      <div className={classes.root}>
        <div style={{ height: 60 }}>
          {anchorEl || windowWidth < 1025 ? (
            <div style={{ display: "flex", height: 65 }}>
              <div style={{ marginRight: 20 }}>
                <img src={ham2}></img>
              </div>
              <div style={{ transition: "0.5s" }}>
                {/* <Typography variant="h5" className={classes.title}>
                  {facilityInfo?.name ?? ""}
                </Typography> */}
                <div className="row-center" style={{ marginTop: 12 }}>
                  <Typography
                    className="text-muted"
                    style={{ marginRight: 5, fontSize: 10 }}
                  >
                    powered by
                  </Typography>
                  <img
                    src={AgaliaLogo}
                    className={classes.logoImage}
                    style={{ marginRight: 5 }}
                  />
                  <Typography className="p1">Agalia</Typography>
                </div>
              </div>
            </div>
          ) : (
            <img src={ham1}></img>
          )}
        </div>
        {/* <div style={{ height: 60 }}>
          {anchorEl || windowWidth < 1025 ? (
            <div style={{ display: "flex", alignItems: "center", height: 65 }}>
              <div>
                <img
                  src={AgaliaLogo}
                  className={classes.logoImage}
                  style={{ marginRight: 5 }}
                  alt="logo"
                />
              </div>
              <div style={{ transition: "0.5s" }}>
                <div className="row-center">
                  <Typography
                    variant="p1Light2"
                    style={{ fontSize: "25.26px" }}
                  >
                    Agalia
                  </Typography>
                </div>
              </div>
            </div>
          ) : (
            <img src={icon1} alt="Agalia" style={{ marginTop: "20px" }} />
          )}
        </div> */}
        <div
          className="rect-separator"
          style={{ width: anchorEl || windowWidth < 1025 ? 214 : 50 }}
        ></div>

        <div className={classes.menuContainer}>
          {menuItems
            .filter((item) => {
              if (adminArray.includes("CODE_FULL")) {
                //if user is admin we need not to add any filter
                return true;
              } else {
                return adminArray.includes(item.id);
              }
            })
            .map((item) => (
              <ListItem
                item={item}
                onLinkClick={props.change}
                key={item.id}
                isActive={history.location.pathname.includes(item.link)}
                history={history}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    roleInfo: state.admin.roleInfo,
  };
}

const mapDispatchToProps = (dispatch) => ({
  updateRole: (data) => dispatch(updateRole(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
