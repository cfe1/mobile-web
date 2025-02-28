import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import { Link as Route } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { withStyles } from "@material-ui/core/styles";
import "../pages.scss";
import moment from "moment";
import New from "../../assets/icons/new.svg";
import Clock from "../../assets/icons/clock.svg";

import {
  Badge,
  TablePagination,
  SelectRow,
  Loader,
  CapsuleButton,
  Toast,
} from "../../components";
import { Axios, LAxios } from "../../../api/apiConsts";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { setupToken, DeleteFirebaseToken } from "../../../firebase";
import { handlePermission } from "../../../APN";
import { updateNotification } from "../../../redux/actions/adminActions";
import { connect } from "react-redux";

const styles = {
  title: {
    marginBottom: 9,
  },
  breadcrumbs: {
    marginBottom: 23,
  },

  paper: {
    padding: 20,
  },
  subtitle: {
    marginBottom: 24,
  },
  subtitleSetting: {
    marginBottom: 8,
  },
  gridItem: {
    marginBottom: 23,
  },
  label: {
    marginBottom: 11,
  },
  table: {
    width: "100%",
  },
  base1: {
    color: "#9C00BA",
  },
  base2: {
    marginLeft: 5,
    marginRight: 5,
  },
  base3: {
    width: 30,
  },
  base4: {
    width: "70%",
  },
  base5: {
    width: "30%",
  },
  base6: {
    marginLeft: 10,
  },
  base7: {
    marginRight: 10,
  },
};

export class Notifications extends Component {
  state = {
    pageSize: 10,
    currentNotificationsPage: 1,
    loading: false,
    sortValue: 1,
    notifications: [],
    sortStatus: "-created_at",
    totalNotifications: 0,
    selectedNotificationsID: new Set(),
    selectedNotifications: [],
    showSubscribe: false,
    showDisabled: false,
  };

  componentDidMount = () => {
    this.getNotfications();
    this.notifyMe();
  };

  notifyMe = () => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else if (window.safari) {
      let data = window.safari.pushNotification.permission(
        "web.com.admin.goagalia"
      );
      // Otherwise, we need to ask the user for permission
      if (data.permission === "default") {
        this.setState({ showSubscribe: true });
      } else if (data.permission === "denied") {
        this.setState({ showDisabled: true });
      }
    } else {
      // Otherwise, we need to ask the user for permission
      if (Notification.permission === "default") {
        this.setState({ showSubscribe: true });
      } else if (Notification.permission === "denied") {
        this.setState({ showDisabled: true });
      }
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  };

  handleNotificationSubscription = () => {
    if (window.safari) {
      handlePermission(this.updateNotificationToken);
    } else {
      Notification.requestPermission((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          this.updateNotificationToken();
        }
      });
    }
  };

  updateNotificationToken = async (token) => {
    let packet;
    if (window.safari) {
      packet = {
        device_token: token,
        is_safari: true,
        is_safari_permit: true,
      };
    } else {
      packet = {
        device_token: await setupToken(),
      };
    }

    LAxios.patch(`auth/user/update-device-token`, packet)
      .then((response) => {
        if (response.data.statusCode === 200) {
          Toast.showInfoToast("Notfication Enabled Successfully!");
        }
      })
      .catch((error) => {
        if (error.response.status !== 500) {
          if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
            Toast.showErrorToast(error.response.data.error.message[0]);
          }
        }
      })
      .finally(() => {
        window.location.reload();
      });
  };

  toggleEmployee = (id, employee) => {
    const newSet = new Set(this.state.selectedNotificationsID);
    let newNotifications = [...this.state.selectedNotifications];

    if (this.state.selectedNotificationsID.has(id)) {
      newSet.delete(id);
      newNotifications = newNotifications.filter((item) => item.id !== id);
    } else {
      newSet.add(id);
      newNotifications.push(employee);
    }
    this.setState({
      selectedNotificationsID: newSet,
      selectedNotifications: newNotifications,
    });
  };

  handleAllSelection = () => {
    let newSet = new Set(this.state.selectedNotificationsID);
    if (
      this.state.selectedNotificationsID.size < this.state.notifications.length
    ) {
      // add all employees
      this.state.notifications.forEach((item) => newSet.add(item.id));
      this.setState({ selectedNotifications: this.state.notifications });
    } else {
      // remove all selection
      newSet = new Set();
      this.setState({ selectedNotifications: [] });
    }
    this.setState({ selectedNotificationsID: newSet }, () => {});
  };

  getNotfications = () => {
    this.setState({ loading: true });
    Axios.get(
      `/notifications?ordering=${this.state.sortStatus}&page_size=${this.state.pageSize}&page=${this.state.currentNotificationsPage}`
    )
      .then((response) => {
        this.setState({ loading: false });

        if (response.data.statusCode === 200) {
          this.setState({
            notifications: response.data.data.results,
            totalNotifications: response.data.data.count,
            selectedNotificationsID: new Set(),
            selectedNotifications: [],
          });
          this.props.updateNotification(response.data.data);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleMarkAsRead = (ids) => {
    this.setState({ loading: true });

    const packet = {
      notification_ids: Array.from(ids),
    };
    Axios.patch(`/notifications`, packet)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          this.getNotfications();
          // Toast.showInfoToast("Notifications marked as read.");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response.status !== 500) {
          if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
            Toast.showErrorToast(error.response.data.error.message[0]);
          }
        }
      });
  };

  handleDeleteAll = () => {
    this.setState({ loading: true });
    Axios.delete(`/notifications`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          this.getNotfications();
          Toast.showInfoToast("All Notifications Deleted");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response.status !== 500) {
          if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
            Toast.showErrorToast(error.response.data.error.message[0]);
          }
        }
      });
  };

  handleChangePageSize = (pageSize) => {
    this.setState({ pageSize }, () => {
      this.getNotfications();
    });
  };

  tableClickHandler = (row) => {
    if (row.payload.type === "CREDENTIAL") {
      this.handleMarkAsRead([row.id]);
      this.props.history.push({
        pathname: "/nurses/nurse-detail/credentials",
        state: {
          content: {
            id: row.payload.nurse_id,
            cred_id: row.payload.type_id,
            type: "cred",
          },
        },
      });
    } else if (row.payload.type === "PTO") {
      this.handleMarkAsRead([row.id]);
      this.props.history.push({
        pathname: "/nurses/nurse-detail",
        state: {
          content: {
            id: row.payload.nurse_id,
            cred_id: row.payload.type_id,
            type: "pto",
          },
        },
      });
    } else if (row.payload.type === "TAX-BANK") {
      this.handleMarkAsRead([row.id]);
      this.props.history.push({
        pathname: "/settings",
        state: {
          content: {
            type: "bank",
          },
        },
      });
    } else if (row.payload.type === "CREDIT-LOAN") {
      this.handleMarkAsRead([row.id]);
      this.props.history.push({
        pathname: "/loans",
        state: {
          content: {
            type: "credit",
          },
        },
      });
    }
  };

  render() {
    const {
      currentNotificationsPage,
      totalNotifications,
      loading,
      pageSize,
      notifications,
      showSubscribe,
      showDisabled,
    } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <div className="module-nav">
          <div className="mls">
            <Badge count={totalNotifications}>
              <div className="module-title">Notifications</div>
            </Badge>

            <div className="module-breadcrumb">
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" component={Route} to={"/"}>
                  Agalia
                </Link>
                <Typography className={classes.base1}>Notifications</Typography>
              </Breadcrumbs>
            </div>
          </div>
          <div className="mrs"></div>
        </div>
        {showSubscribe && (
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="small"
                variant="outlined"
                onClick={this.handleNotificationSubscription}
              >
                Subscribe
              </Button>
            }
          >
            Notifications are not active! Please Subscribe.
          </Alert>
        )}
        {showDisabled && (
          <Alert severity="info">
            Notifications are disabled. Please manually allow from browser
            settings.
          </Alert>
        )}
        {loading && <Loader />}
        <Paper>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.paper}
          >
            <div className="btn-grp-prime"></div>

            <div className="row-center">
              {this.state.selectedNotificationsID.size > 0 && (
                <CapsuleButton
                  label="Mark as read"
                  onClick={() => {
                    this.handleMarkAsRead(this.state.selectedNotificationsID);
                  }}
                ></CapsuleButton>
              )}
              <span className={classes.base2}> &nbsp;</span>
              <CapsuleButton
                label="Delete all"
                onClick={this.handleDeleteAll}
              ></CapsuleButton>
            </div>
          </Grid>

          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell className={classes.base3}>
                    <SelectRow
                      onClick={this.handleAllSelection}
                      selected={
                        notifications.length > 0 &&
                        this.state.selectedNotificationsID.size ===
                          notifications.length
                      }
                    />
                  </TableCell>
                  <TableCell className={classes.base4}>
                    Notification Message
                  </TableCell>
                  <TableCell className={classes.base5}>
                    Notification Time
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <SelectRow
                        selected={this.state.selectedNotificationsID.has(
                          row.id
                        )}
                        onClick={() => {
                          this.toggleEmployee(row.id, row);
                        }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        this.tableClickHandler(row);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="notification-message">
                        <p>
                          {row.title}
                          {row.is_read === false && (
                            <span>
                              <img src={New} alt="" className={classes.base6} />
                            </span>
                          )}
                        </p>
                        <p>{row.body}</p>
                      </div>
                    </TableCell>
                    <TableCell
                      onClick={() => {
                        this.tableClickHandler(row);
                      }}
                      className="cursor-pointer"
                    >
                      <div className="notification-time">
                        <img src={Clock} alt="" className={classes.base7} />
                        {moment(row.created_at).format(
                          "DD MMM YYYY [at] h:mm A z"
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && notifications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="3">No data found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <TablePagination
              count={totalNotifications}
              page={currentNotificationsPage}
              rowsPerPage={pageSize}
              setRowsPerPage={this.handleChangePageSize}
              onChangePage={(e, page) => {
                this.setState({ currentNotificationsPage: page }, () => {
                  this.getNotfications();
                });
              }}
            />
          </TableContainer>
        </Paper>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateNotification: (data) => dispatch(updateNotification(data)),
});

export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(Notifications));
