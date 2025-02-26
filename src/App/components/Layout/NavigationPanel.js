import React from "react";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Popover from "@material-ui/core/Popover";
import menuItems from "./menuItems";
import { useHistory, Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import StorageManager from "../../../storage/StorageManager";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Accordion from "@material-ui/core/Accordion";
import { ICONS } from "./Sidebar";
import { connect } from "react-redux";

const ListItem = ({
  item: { id, title, link },
  isActive,
  history,
  index,
  onLinkClick,
  facilities,
  facilityId,
  isUserAdmin,
}) => {
  const [hoverImg, setHoverImg] = React.useState(null);
  return (
    <Link
      style={{
        textDecoration: "none",
        color: "#434966",
        display: "block",
        width: 62,
        padding: 4,
        boxSizing: "border-box",
        background: hoverImg ? "#F3F4F7" : "",
        borderRadius: 4,
      }}
      id={`edit-icon${index}`}
      to={link}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          cursor: "pointer",
          userSelect: "none",
          flexDirection: "column",
        }}
        onMouseOver={() => {
          setHoverImg(ICONS[id].hover);
        }}
        onMouseLeave={() => {
          setHoverImg(null);
        }}
        onClick={() => {
          history.push(link);
        }}
      >
        <img
          src={
            isActive
              ? ICONS[id].active
              : hoverImg
              ? hoverImg
              : ICONS[id].inActive
          }
          style={{
            height: 48,
            width: 48,
          }}
          alt="menu items"
        />
        <div
          //  onClick={() => onLinkClick()}
          className={`${
            isActive
              ? "text-pink p2 p2-content sidebar-text"
              : "text-sidebar-muted p2 p2-content sidebar-text"
          }`}
          style={{
            textAlign: "center",
          }}
        >
          {id === "CODE_DD" ? (
            <div>
              {title.split(" ")[0]}
              <br />
              {title.split(" ").slice(1).join(" ")}
            </div>
          ) : (
            title
          )}
        </div>
      </div>
    </Link>
  );
};

const NavigationPanel = (props) => {
  const { anchorEl, handleClose, change, facility, profile } = props || {};
  const classes = useStyles();
  const history = useHistory();
  const adminArray = [
    "CODE_BOARD",
    "settings",
    "CODE_EMP_ADD",
    "CODE_HPPD_TRACKER",
  ];
  const isAdmin = profile?.is_admin;

  const open = Boolean(anchorEl);
  const facilityId = StorageManager.get();

  let getRoleInfo = {};
  const role = JSON.parse(StorageManager.get("ROLE"));
  if (role) {
    if (role.acls.length > 0) {
      role.acls.forEach((element) => {
        element.acl.forEach((ele) => {
          if (ele.key === "is_view" && ele.value === true) {
            //below if condition is for payments accordian
            //we need to push expandable item CODE_PAYROLLMGMT in case of any one of its children get view permission
            if (
              element.feature.code === "CODE_COMMISSION_FEE" ||
              element.feature.code === "CODE_PLATFORM_FEE" ||
              element.feature.code === "CODE_REIM" ||
              element.feature.code === "CODE_PAY" ||
              element.feature.code === "CODE_VAULT"
            ) {
              adminArray.push("CODE_PAYROLLMGMT");
            }
            if (
              element.feature.code === "CODE_SCHED" ||
              element.feature.code === "CODE_WEEKLY_SCHEDULE" ||
              element.feature.code === "CODE_DAILY_SCHEDULE" ||
              element.feature.code === "CODE_EMPLOYEE_SCHEDULE" ||
              element.feature.code === "CODE_APPLICANT_VIEW"
            ) {
              adminArray.push("CODE_SCHEDULE");
            }
            if (ele.key === "is_view" && ele.value === true) {
              //below if condition is for payments accordian
              //we need to push expandable item CODE_PAYROLLMGMT in case of any one of its children get view permission
              if (
                element.feature.code === "CODE_COMMISSION_FEE" ||
                element.feature.code === "CODE_PLATFORM_FEE"
              ) {
                adminArray.push("CODE_COMMISSION_PLATFORM");
              }
            }
            adminArray.push(element.feature.code);
          }
        });
        getRoleInfo[element.feature.code] = element.acl;
      });
    }
    if (role.acls.length === 0 && profile?.is_admin) {
      getRoleInfo["CODE_FULL"] = [
        { key: "is_create", title: "Create", value: true },
        { key: "is_update", title: "Update", value: true },
        { key: "is_delete", title: "Delete", value: true },
        { key: "is_view", title: "View", value: true },
        { key: "is_export", title: "Export", value: true },
        { key: "is_process", title: "Process", value: true },
        { key: "is_hire", title: "Hire", value: true },
        { key: "is_assign_employee", title: "Assign Nurses", value: true },
        {
          key: "is_post_budget_positions",
          title: "Post Position",
          value: true,
        },
      ];
      adminArray.push("CODE_FULL");
    }
  } else {
    //if facility panel opens through Owner Panel then it has all rights
    if (profile?.is_admin) {
      getRoleInfo["CODE_FULL"] = [
        { key: "is_create", title: "Create", value: true },
        { key: "is_update", title: "Update", value: true },
        { key: "is_delete", title: "Delete", value: true },
        { key: "is_view", title: "View", value: true },
        { key: "is_export", title: "Export", value: true },
        { key: "is_process", title: "Process", value: true },
        { key: "is_hire", title: "Hire", value: true },
        { key: "is_assign_employee", title: "Assign Nurses", value: true },
        {
          key: "is_post_budget_positions",
          title: "Post Position",
          value: true,
        },
      ];
      adminArray.push("CODE_FULL");
    }
  }

  const ListItemInternal = ({
    item: { id, title, link },
    isActive,
    history,
    index,
    onLinkClick,
    activeFacilityIds,
    facilityId,
    isUserAdmin,
  }) => (
    <Link
      style={{
        textDecoration: "none",
        color: "#FFFFFF",
        width: "100%",
      }}
      id={`edit-icon${index}`}
    >
      <div className={`${classes.linkDiv} ${isActive && classes.whitebg}`}>
        <img
          src={isActive ? ICONS[id]?.active : ICONS[id]?.inActive}
          style={{
            marginRight: 10,
            height: 24,
            width: 24,
          }}
          alt="menu items"
        />
        <Typography
          //onClick={() => onLinkClick()}
          className={
            isActive
              ? "text-accordian-list p2 p2-content sidebar-text"
              : "text-muted p2 p2-content sidebar-text"
          }
        >
          <> {title}</>
        </Typography>
      </div>
    </Link>
  );
  const expansionPanel = (
    adminArray,
    item,
    index,
    history,
    activeFacilityIds,
    facilityId,
    isAdmin,
    props
  ) => {
    let isAccordianExpand = false;
    let defaultExpanion = false;
    item.views &&
      item.views.forEach((row) => {
        if (history.location.pathname.includes(row.link)) {
          defaultExpanion = true;
        }
      });
    const { id, title, link } = item;

    return (
      <div key={index} className={`sidebar-accordion`}>
        {!item.views ? (
          <Link
            container
            style={{
              textDecoration: "none",
              color: "#434966",
              display: "block",
              width: "100%",
              padding: 4,
              boxSizing: "border-box",
              display: "flex",
            }}
            className={classes.iconContainer}
          >
            <img
              src={
                defaultExpanion
                  ? ICONS[item.id].active
                  : ICONS[item.id].inActive
              }
              style={{
                marginRight: 10,
                height: 32,
                width: 32,
              }}
              alt="menu items"
            />
            <span
              className={`${
                history.location.pathname.includes(link)
                  ? "text-pink sidebar-text"
                  : "text-sidebar-muted sidebar-text"
              }`}
            >
              {item.title}
            </span>
          </Link>
        ) : (
          <Accordion
            style={{
              backgroundColor: "white",
              //     marginBottom: 20,
              color: "#17174A",
            }}
            defaultExpanded={defaultExpanion}
            onChange={() => {
              if (item.views) {
                isAccordianExpand = !isAccordianExpand;
              }
            }}
          >
            <AccordionSummary
              expandIcon={
                <ExpandMoreIcon
                  style={
                    !item.views
                      ? { display: "none" }
                      : {
                          color: "#020826",
                        }
                  }
                />
              }
              style={{
                minHeight: "unset",
                padding: 8,
              }}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <img
                src={
                  defaultExpanion
                    ? ICONS[item.id].active
                    : ICONS[item.id].inActive
                }
                style={{
                  marginRight: 10,
                  height: 32,
                  width: 32,
                }}
                alt="menu items"
              />
              <Typography
                className={`${
                  defaultExpanion
                    ? "text-pink sidebar-text"
                    : "p2-content sidebar-text"
                }`}
              >
                {item.title}
              </Typography>
            </AccordionSummary>

            {item.views &&
              item.views
                .filter((item) => {
                  if (adminArray.includes("CODE_FULL")) {
                    //if user is admin we need not to add any filter
                    return true;
                  } else {
                    return adminArray.includes(item.id);
                  }
                })
                .map((row, index2) => (
                  <AccordionDetails
                    key={row.id}
                    style={
                      history.location.pathname.includes(row.link)
                        ? {
                            background: "#FFFFFF",
                          }
                        : {}
                    }
                    className={classes.whitebg}
                  >
                    <ListItemInternal
                      item={row}
                      index={index + index2}
                      onLinkClick={() => {}}
                      key={row.id}
                      isActive={history.location.pathname.includes(row.link)}
                      history={history}
                      facilityId={facilityId}
                      isUserAdmin={isAdmin}
                    />
                  </AccordionDetails>
                ))}
          </Accordion>
        )}

        <div className="hr1"></div>
      </div>
    );
  };
  let links1 = [];
  let listView = [];
  menuItems
    .filter((item) => {
      if (adminArray.includes("CODE_FULL")) {
        //if user is admin we need not to add any filter
        return true;
      } else {
        return adminArray.includes(item.id);
      }
    })
    .map((item, index) => {
      if (item.isListView) {
        listView.push(
          expansionPanel(
            adminArray,
            item,
            index,
            history,
            facilityId,
            isAdmin,
            props
          )
        );
      } else {
        links1.push(
          <ListItem
            item={item}
            index={index}
            onLinkClick={() => {}}
            key={item.id}
            isActive={history.location.pathname.includes(item.link)}
            history={history}
            facilityId={facilityId}
            isUserAdmin={profile?.is_admin}
          />
        );
      }
    });

  return (
    <Popover
      //id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Grid container className={classes.panel} onMouseLeave={handleClose}>
        {links1}
        <div className="hr"></div>
        {listView}
      </Grid>
    </Popover>
  );
};

const useStyles = makeStyles({
  root: {
    padding: "35px 40px 20px 20px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    padding: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    textAlign: "center",
  },
  gridItem: {
    padding: "24px 10px",
    "& .MuiFormHelperText-contained": {
      margin: "5px!important",
    },
    ["@media (min-width:1025px)"]: {
      minWidth: 145,
    },
  },
  row: {
    marginBottom: 5,
  },
  select: {
    minWidth: 110,
    padding: "24px 10px",
    "& .MuiFormHelperText-contained": {
      margin: "5px!important",
    },
    "& .MuiSelect-root": {
      width: "78% !important",
    },
    textAlign: "left",
    ["@media (min-width:1025px)"]: {
      width: 240,
    },
  },
  width: {
    minWidth: 130,
    textAlign: "left",
    minHeight: 40,
  },
  subtitle: {
    marginBottom: 24,
  },
  subtitleSetting: {
    marginBottom: 8,
  },
  note: {
    marginBottom: 16,
    marginTop: 8,
    color: "#888fa0",
  },
  description: {
    width: 364,
    textAlign: "center",
    marginBottom: 64,
  },
  header: {
    marginBottom: 32,
  },
  footer: {
    backgroundColor: "#F5F6FA",
    width: "100%",
    padding: "23px 0px",
    display: "flex",
    justifyContent: "center",
  },
  btn: {
    fontSize: 18,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    "& img": {
      width: 25,
      height: 24,
    },
  },
  dateItem: {
    minWidth: 240,
    ["@media (max-width:992px)"]: {
      minWidth: 180,
    },
  },
  panel: {
    padding: 20,
    flexWrap: "wrap",
    width: 340,
    gap: 16,
  },
  iconContainer: {
    minHeight: 48,
    display: "flex",
    alignItems: "center",
  },
  whitebg: {
    background: "#FFFFFF",
  },
  linkDiv: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 20,
    cursor: "pointer",
    userSelect: "none",
  },
});

function mapStateToProps(state) {
  return {
    profile: state.auth.profile,
  };
}

export default connect(mapStateToProps, null)(withRouter(NavigationPanel));
