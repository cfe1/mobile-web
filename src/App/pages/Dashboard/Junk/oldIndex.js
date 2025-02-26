import React, { Component } from "react";
import ManagerInformationDialog from "./components/ManagerInformationDialog";
import { connect } from "react-redux";
import { updateInfo, updateProfile } from "../../../redux/actions/authActions";
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
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";
import { Hidden } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import Nurse from "../../assets/icons/nurse-dashboard.svg";
import Job from "../../assets/icons/job-dashboard.svg";
import Role from "../../assets/icons/roles-dashboard.svg";
import Subadmin from "../../assets/icons/subadmins-dashboard.svg";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import queryString from "query-string";
import facilityImage from "../../assets/images/dashboard/facilityImage.svg";
import dashboardMountain from "../../assets/images/dashboard/dashboardMountain.svg";
import StorageManager from "../../../storage/StorageManager";
import { API_TOKEN, AGALIA_ID } from "../../../storage/StorageKeys";
import $ from "jquery";

import API from "../../../api/apiService";
import {
  PrimaryButton,
  Loader,
  SelectRow,
  SearchInput,
  TablePagination,
  FeedbackInput,
  modal,
  SuccessModal,
  FacilityImage,
  BankAccounts,
  DeleteModal,
  DeleteBankAccount,
  AccountAdded,
  FacilityfilterMultiSelecte,
} from "../../components";

import "../pages.scss";
import { Axios } from "../../../api/apiConsts";
import { Button } from "@material-ui/core";

const styles = {
  root1: {
    display: "flex",
    height: "140px",
    marginBottom: "22px",
    background:
      "linear-gradient(279.73deg, #C3F4FF 0%, rgba(255,255,255,0) 100%)",
    backgroundColor: "white",
    "@media (max-width: 1300px)": {
      height: "158px",
    },
  },
  root2: {
    display: "flex",
    height: "140px",
  },
  gridCard: {
    // maxHeight : "140px !important",
    // minHeight : "140px !important",
    cursor: "pointer",
  },
  details: {
    width: "65%",
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
  cover: {
    width: "35% !important",
    height: "148px !important",
    "@media (max-width: 880px)": {
      width: "50%",
    },
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    backgroundColor: "#FAFBFC",
  },
  headerCell: {
    color: "#888FA0",
    fontSize: 11,
    lineHeight: 15 / 11,
    fontWeight: 600,
  },
  paper: {
    padding: 20,
    // marginBottom: 30,
  },
  cover_two: {
    width: "55%",
    backgroundPosition: "unset",
  },
  tableMinWidth: {
    minWidth: "103px",
  },
  img: {
    height: "100%",
    width: "100%",
    objectFit: "cover",
  },
  viewBank: {
    fontWeight: "bold",
  },
  addBank: {
    color: "#C117CC",
    fontWeight: "bold",
  },
};

class Dashboard extends Component {
  state = {
    thankYouDialogOpen: false,
    managerDialogOpen: true,
    search: "",
    pageSize: 10,
    currentfacilityPage: 1,
    loading: false,
    sortValue: 1,
    facilities: [],
    sortStatus: "-created_at",
    totalfacilities: 0,
    activeTab: "active",
    dashboardStats: null,
    // addBankAccount: false,
    facilitiesCards: [],
    selectedFacilitiesID: new Set(),
    isRunMultiplePayroll: false,
    multipleFacilitiesData: [],
    isRunSinglePayroll: false,
    singleFacilitiesData: [],
    totalFacilitiesOnPayroll: 0,
    currentPayrollFacilityPage: 1,
    payrollFacilityPageSize: 10,
    isFacilityViewAll: false,
    fid: "",
    isViewBankAccount: false,
    isAddBankAccount: false,
    selectedFacilities: [],
  };

  componentDidMount = () => {
    if (this.props.is_profile_complete) {
      this.closeManagerInformationDialog();
    } else if (
      this.props.user.first_name !== null &&
      this.props.user.last_name !== null
      // this.props.user.profile_photo !== null
    ) {
      this.closeManagerInformationDialog();
    }

    this.getFacilityList();
    this.getPayrollSummary();

    // Axios.get("/facility").then((response) => {
    //   console.log(response.data.data[1])
    // })

    // Axios.get("/payroll/summary").then((res) => {
    //   console.log(res.data.data);
    // })
  };

  handleAddBank = () => {
    this.setState({ isAddBankAccount: false });
  };
  getPayrollSummary = () => {
    this.setState({ loading: true });

    const params = {
      page_size: this.state.payrollFacilityPageSize,
      page: this.state.currentPayrollFacilityPage,
    };

    const urlParams = queryString.stringify(params);

    Axios.get(`owner/payroll/summary?${urlParams}`)
      .then((response) => {
        this.setState({ loading: false });

        if (response.data.statusCode === 200) {
          this.setState({
            facilities: response.data.data,
            totalFacilitiesOnPayroll: response.data.data.count,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  openManagerInformationDialog = () => {
    this.setState({ managerDialogOpen: true });
  };
  closeManagerInformationDialog = () => {
    this.setState({ managerDialogOpen: false });
  };
  changeTab = (e, value) => {
    if (value) {
      this.setState({ activeTab: value }, () => {
        this.getFacilityList();
      });
    }
  };

  getFacilityList = () => {
    this.setState({ loading: true });
    Axios.get("owner/facility")
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          this.setState({
            facilitiesCards: response.data.data,
            // totalfacilities: response.data.data.count,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleSort = (e) => {
    this.setState({ sortValue: e });
    if (e === 1) {
      this.setState({ sortStatus: "-created_at" }, () => {
        this.getFacilityList();
      });
    } else {
      this.setState({ sortStatus: "created_at" }, () => {
        this.getFacilityList();
      });
    }
  };

  handleChangePageSize = (pageSize) => {
    this.setState({ pageSize, currentfacilityPage: 1 }, () => {
      this.getFacilityList();
    });
  };

  handleSearchInput = (e) => {
    this.setState({ search: e.target.value }, () => {
      this.getFacilityList();
    });
  };

  handleCloseSearch = () => {
    if (this.state.search !== "") {
      this.setState({ search: "" }, () => {
        this.getFacilityList();
      });
    }
  };

  toggleFacilities = (id) => {
    const { selectedFacilitiesID } = this.state;
    const newSet = new Set(selectedFacilitiesID);

    if (selectedFacilitiesID.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.setState({
      selectedFacilitiesID: newSet,
    });
  };

  handleAllSelection = () => {
    const { facilities, selectedFacilitiesID } = this.state;
    let newSet = new Set();
    if (selectedFacilitiesID.size < facilities.results.length) {
      // add all employees
      facilities.results.forEach((item) => newSet.add(item.id));
    }
    this.setState({ selectedFacilitiesID: newSet });
  };

  handleRunMultiplePayroll = async () => {
    this.setState({ loading: true });

    this.setState({ isRunMultiplePayroll: true });

    let facilitiesData = [];
    for (let i of this.state.selectedFacilitiesID) {
      facilitiesData.push(i);
    }

    const packet = {
      facility: facilitiesData,
    };

    const urlParams = queryString.stringify(packet);

    const response = await Axios.get(
      `owner/payroll/summary/detail?${urlParams}`
    );
    this.setState({ loading: false });

    this.setState({ multipleFacilitiesData: response.data.data });
  };

  handleUpdateSuccessModal = () => {
    this.setState({ isRunMultiplePayroll: false });
    this.setState({ isRunSinglePayroll: false });
  };

  handleRunSinglePayroll = async (id) => {
    this.setState({ loading: true });

    this.setState({ isRunSinglePayroll: true });

    const singleFacilityID = [];
    singleFacilityID.push(id);

    const packet = {
      facility: singleFacilityID,
    };

    const urlParams = queryString.stringify(packet);

    const response = await Axios.get(
      `owner/payroll/summary/detail?${urlParams}`
    );
    this.setState({ loading: false });

    this.setState({ singleFacilitiesData: response.data.data });
  };

  onPayClick = () => {
    this.setState(
      {
        isRunSinglePayroll: false,
        isRunMultiplePayroll: false,
        selectedFacilitiesID: new Set(),
      },
      () => {
        this.getPayrollSummary();
      }
    );
  };

  handleUpdateClick = () => {
    this.setState(
      {
        isAddBankAccount: false,
      },
      () => {
        this.getPayrollSummary();
      }
    );
  };

  handleViewAll = () => {
    this.setState({ isFacilityViewAll: true });
  };
  handleFacilityClick = (id) => {
    //Add authentication headers as params
    var params = {
      access_token: StorageManager.get(API_TOKEN),
      facility_id: id,
      agalia_id: StorageManager.get(AGALIA_ID),
    };
    //Add authentication headers in URL
    var url = [process.env.REACT_APP_URL, $.param(params)].join("?");
    var win = window.open(url);
  };

  handleViewVaultClick = (id) => {
    //Add authentication headers as params
    var params = {
      access_token: StorageManager.get(API_TOKEN),
      facility_id: id,
      route_to: "vault",
    };

    //Add authentication headers in URL
    var url = [process.env.REACT_APP_URL, $.param(params)].join("?");
    var win = window.open(url);
  };

  handleCloseBankAccount = () => {
    this.setState({
      isViewBankAccount: false,
    });
    this.getPayrollSummary();
  };

  handleAddClick = () => {
    this.setState({
      isViewBankAccount: false,
      isAddBankAccount: true,
    });
  };

  render() {
    const {
      managerDialogOpen,
      sortValue,
      currentfacilityPage,
      totalfacilities,
      loading,
      search,
      pageSize,
      facilities,
      activeTab,
      dashboardStats,
    } = this.state;
    const { classes } = this.props;

    const arr = [
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
      { name: "ICU Memorial" },
    ];
    return (
      <>
        <ManagerInformationDialog
          open={managerDialogOpen}
          handleClose={this.closeManagerInformationDialog}
          updateInfo={this.props.updateInfo}
          updateProfile={this.props.updateProfile}
        />
        <Card className={classes.root1}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="h2">
                Welcome {this.props?.user?.first_name}&nbsp;
                {this.props?.user?.last_name && this.props?.user?.last_name}
              </Typography>
              <Typography variant="subtitle1" color="textPrimary">
                Select and manage skilled nursing workforce that best suits your
                patient's needs.
              </Typography>
              <Button
                style={{
                  marginTop: "2px",
                  border: "1px solid #EDECF6",
                  borderRadius: "8px",
                }}
              >
                Total number of Facilities :
                <div style={{ color: "#C117CC", paddingLeft: "3px" }}>
                  {this.state.facilitiesCards.length}
                </div>
              </Button>
            </CardContent>
          </div>
          <CardMedia
            className={classes.cover_two}
            image={dashboardMountain}
          ></CardMedia>
        </Card>

        <Grid container spacing={2} style={{ marginBottom: "23px" }}>
          {this.state.facilitiesCards.slice(0, 6).map((e) => {
            return (
              <Grid
                item
                xs={6}
                md={4}
                className={classes.gridCard}
                onClick={() => this.handleFacilityClick(e.id)}
              >
                <Card
                  className={classes.root2}
                  style={{ borderRadius: "10px" }}
                >
                  <div style={{ height: "100%", width: "35%" }}>
                    <img
                      className={classes.img}
                      src={e.image.image ? e.image.image : facilityImage}
                    ></img>
                  </div>
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Typography component="h5" variant="h5">
                        {e.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="textSecondary"
                        style={{ marginTop: "3px" }}
                      >
                        {/* 12-A, Whitefield Road, New York */}
                        {e?.address?.address_line1
                          ? `${e?.address?.address_line1}, ${e?.address?.city}, ${e?.address?.state?.name}`
                          : "NA"}
                      </Typography>
                      <Button
                        style={{
                          marginTop: "6px",
                          border: "1px solid #EDECF6",
                          borderRadius: "8px",
                        }}
                      >
                        {/* Total Nurses : */}
                        {e.total_employees > 1
                          ? `Total Nurses : `
                          : `Total Nurse :`}
                        <div style={{ color: "#C117CC" }}>
                          {e.total_employees}
                        </div>
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </Grid>
            );
          })}

          {this.state.isFacilityViewAll &&
            this.state.facilitiesCards.slice(6).map((e) => {
              return (
                <Grid
                  item
                  xs={6}
                  md={4}
                  className={classes.gridCard}
                  onClick={() => this.handleFacilityClick(e.id)}
                >
                  <Card
                    className={classes.root2}
                    style={{ borderRadius: "10px" }}
                  >
                    {/* <CardMedia
                  className={classes.cover}
                  image={e.image.image ? e.image.image : facilityImage}
                  title="Live from space album cover"
                /> */}
                    <div style={{ height: "100%", width: "35%" }}>
                      <img
                        className={classes.img}
                        src={e?.image?.image ? e?.image?.image : facilityImage}
                      ></img>
                    </div>
                    <div className={classes.details}>
                      <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                          {e.name}
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="textSecondary"
                          style={{ marginTop: "3px" }}
                        >
                          {/* 12-A, Whitefield Road, New York */}
                          {e?.address?.address_line1
                            ? `${e?.address?.address_line1}, ${e?.address?.city}, ${e?.address?.state?.name}`
                            : "NA"}
                        </Typography>
                        <Button
                          style={{
                            marginTop: "6px",
                            border: "1px solid #EDECF6",
                            borderRadius: "8px",
                          }}
                        >
                          Total Nurses :
                          <div style={{ color: "#C117CC" }}>
                            {e.total_employees}
                          </div>
                        </Button>
                      </CardContent>
                    </div>
                  </Card>
                </Grid>
              );
            })}
        </Grid>

        {this.state.facilitiesCards.length > 6 &&
          !this.state.isFacilityViewAll && (
            <div
              className="ec-btn"
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "30px",
              }}
            >
              <Hidden only={["xs", "sm", "md"]}>
                <PrimaryButton wide type="submit" onClick={this.handleViewAll}>
                  View All
                </PrimaryButton>
              </Hidden>
              <Hidden only={["xl", "lg"]}>
                <PrimaryButton
                  type="submit"
                  style={{ marginBottom: 10 }}
                  onClick={this.handleViewAll}
                >
                  View All
                </PrimaryButton>
              </Hidden>
            </div>
          )}
        {loading && <Loader />}
        <Paper>
          <Grid
            container
            justify="space-between"
            alignItems="center"
            className={classes.paper}
            style={{ borderBottom: "1px solid #EDECF5" }}
          >
            <div className="btn-grp-prime">
              <Typography variant="h5" style={{ padding: 20 }}>
                Payroll Summary
              </Typography>
            </div>
            {this.state.selectedFacilitiesID.size > 1 && (
              <div>
                <Hidden only={["xs", "sm", "md"]}>
                  <PrimaryButton
                    type="submit"
                    onClick={this.handleRunMultiplePayroll}
                  >
                    Run Payroll
                  </PrimaryButton>
                </Hidden>
                <Hidden only={["xl", "lg"]}>
                  <PrimaryButton
                    type="submit"
                    style={{ marginBottom: 4 }}
                    onClick={this.handleRunMultiplePayroll}
                  >
                    Run Payroll
                  </PrimaryButton>
                </Hidden>
              </div>
            )}
          </Grid>

          <TableContainer>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: 30 }}>
                    <SelectRow
                      selected={
                        facilities.results?.length > 0 &&
                        this.state.selectedFacilitiesID.size ===
                          facilities.results?.length
                      }
                      // selected={facilities.length == selectedFacilitiesID.size}
                      onClick={this.handleAllSelection}
                    />
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Facility
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Last Payroll Executed On
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Next Payroll Due On
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Payroll Due Amount
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Vault Balance
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Connected Bank Account
                  </TableCell>
                  <TableCell className={classes.tableMinWidth}>
                    Action
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {facilities.results?.map((row) => (
                  <TableRow
                    key={row.id}
                    // onClick={() =>
                    //   this.props.history.push({
                    //     pathname: "/facility/facility-detail",
                    //     state: {
                    //       content: {
                    //         id: row.id,
                    //       },
                    //     },
                    //   })
                    // }
                    className="cursor-pointer"
                  >
                    <TableCell style={{ width: 30 }}>
                      <SelectRow
                        selected={this.state.selectedFacilitiesID.has(row.id)}
                        onClick={() => {
                          this.toggleFacilities(row.id);
                        }}
                      />
                    </TableCell>
                    <TableCell style={{ color: "#434966" }}>
                      {row.name}
                    </TableCell>
                    <TableCell>
                      {row?.payroll?.last_execute_date
                        ? row?.payroll?.last_execute_date
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row?.payroll?.next_execute_date
                        ? row?.payroll?.next_execute_date
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row?.payroll?.due_amount
                        ? row?.payroll?.due_amount
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {row?.vault?.balance ? row?.vault?.balance : "N/A"}
                    </TableCell>
                    <TableCell>
                      <div>
                        {row?.vault?.account_number ? (
                          <div
                            className={classes.viewBank}
                            onClick={() => {
                              this.setState({
                                fid: row.id,
                                isViewBankAccount: true,
                              });
                            }}
                          >
                            <u>View Bank Accounts</u>
                          </div>
                        ) : (
                          <div
                            className={classes.addBank}
                            onClick={() => {
                              this.setState({
                                fid: row.id,
                                isAddBankAccount: true,
                              });
                            }}
                          >
                            <u>Add Bank Account</u>
                          </div>
                        )}
                      </div>
                      {/* <div>{row?.vault?.account_number}</div>
                      <div
                        style={{ color: "#C117CC" }}
                        onClick={() => {
                          this.setState({ isAddBankAccount: true });
                        }}
                      >
                        Update Bank Account
                      </div> */}
                    </TableCell>
                    <TableCell>
                      <Button
                        style={{
                          border: "0.61px solid #EDECF6",
                          borderRadius: "8px",
                          minWidth: "96px",
                        }}
                        onClick={() => {
                          this.handleViewVaultClick(row.id);
                        }}
                      >
                        View Vault
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Hidden only={["xs", "sm", "md"]}>
                        <PrimaryButton
                          type="submit"
                          style={{
                            width: "95px",
                            padding: "9px",
                            maxHeight: "32px",
                          }}
                          onClick={() => {
                            this.handleRunSinglePayroll(row.id);
                          }}
                        >
                          Run Payroll
                        </PrimaryButton>
                      </Hidden>
                      <Hidden only={["xl", "lg"]}>
                        <PrimaryButton
                          type="submit"
                          style={{
                            marginBottom: 4,
                            width: "95px",
                            padding: "9px",
                            maxHeight: "32px",
                          }}
                          onClick={() => {
                            this.handleRunSinglePayroll(row.id);
                          }}
                        >
                          Run Payroll
                        </PrimaryButton>
                      </Hidden>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && facilities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="12">No data found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <FacilityfilterMultiSelecte
              selectedItems={this.state.selectedFacilities}
              onSelect={(items) =>
                this.setState({
                  selectedFacilities: items,
                })
              }
              onBlur={() => {}}
            ></FacilityfilterMultiSelecte>
            <TablePagination
              count={this.state.totalFacilitiesOnPayroll}
              page={this.state.currentPayrollFacilityPage}
              rowsPerPage={this.state.payrollFacilityPageSize}
              // setRowsPerPage={(size) => {
              //   this.setState({ payrollFacilityPageSize: size }, () => {
              //     // this.getAssignedEmployee()
              //   });
              // }}
              onChangePage={(e, page) => {
                this.setState({ currentPayrollFacilityPage: page }, () => {
                  this.getPayrollSummary();
                });
              }}
            />
          </TableContainer>
        </Paper>
        {this.state.isAddBankAccount && (
          <FeedbackInput
            open={this.state.isAddBankAccount}
            // open={true}
            handleClose={() => this.handleAddBank()}
            fid={this.state.fid}
            onUpdateClick={this.handleUpdateClick}
          ></FeedbackInput>
        )}

        {this.state.fid && this.state.isViewBankAccount && (
          <BankAccounts
            open={this.state.isViewBankAccount}
            fid={this.state.fid}
            handleClose={this.handleCloseBankAccount}
            handleAddClick={this.handleAddClick}
          ></BankAccounts>
        )}
        <AccountAdded
          open={false}
          title={"Account Added"}
          description={"You have successfully added the bank account"}
        ></AccountAdded>
        {this.state.isRunMultiplePayroll && (
          <SuccessModal
            open={this.state.isRunMultiplePayroll}
            handleClose={() => this.handleUpdateSuccessModal()}
            // onBlur={() => this.handleUpdateSuccessModal()}
            data={this.state.multipleFacilitiesData}
            loading={this.state.loading}
            onPayClick={() => {
              this.onPayClick();
            }}
          ></SuccessModal>
        )}
        {this.state.isRunSinglePayroll && (
          <SuccessModal
            open={this.state.isRunSinglePayroll}
            handleClose={() => this.handleUpdateSuccessModal()}
            data={this.state.singleFacilitiesData}
            loading={this.state.loading}
            onPayClick={() => {
              this.onPayClick();
            }}
            // onBlur={() => {this.handleUpdateSuccessModal()}}
          ></SuccessModal>
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    is_profile_complete: state.auth.is_profile_complete,
    user: state.auth.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateInfo: (data) => dispatch(updateInfo(data)),
  updateProfile: (data) => dispatch(updateProfile(data)),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Dashboard));
