import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { PrimaryButton, SecondaryButton, Toast } from "../../components";
import Success from "../../assets/icons/popup-success.svg";
import { Hidden } from "@material-ui/core";

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
import moment from "moment";
import queryString from "query-string";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Divider from "../Views/Divider";
import SelectRow from "../Table/SelectRow";
import Loader from "../Loader";
import { ContactSupportOutlined, NoEncryption } from "@material-ui/icons";
import { Axios } from "../../../api/apiConsts";
import user from "../../assets/icons/User@1x.svg";

const styles = {
  root: {},
  title: {
    marginBottom: 9,
    color: "#050D33",
    fontFamily: "Manrope",
    fontSize: "18px",
    fontWeight: "bold",
  },
  breadcrumbs: {
    marginBottom: 23,
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

  paper: {
    paddingTop: 10,
    paddingBottom: 0,
    marginBottom: 10,
  },
  grid: {
    paddingLeft: 30,
    paddingRight: 30,
  },

  tableHeader: {
    backgroundColor: "#FAFBFC",
    zIndex: 600,
  },
  headerCell: {
    color: "#888FA0",
    fontSize: 11,
    lineHeight: 15 / 11,
    fontWeight: 600,
    borderBottom: "none !important",
  },
  rowCell: {},
  alertMessage: {
    fontWeight: 600,
    marginBottom: 30,
    marginTop: 30,
    fontSize: 16,
  },
  container: {
    maxHeight: 440,
  },
  AmountCell: {
    borderBottom: "none !important",
  },
  emptyCell: {
    borderBottom: "none !important",
  },
  name: {
    fontSize: "16px !important",
  },
  accountNumber: {
    color: "#82889C !important",
    fontSize: "12px !important",
  },
  selectRowStick: {
    position: "none !important",
  },
  tableMinWidth: {
    minWidth: "103px",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  namePhotoDiv: {
    display: "flex",
    alignItems: "center",
  },
  photo: {
    height: 35,
    width: 35,
    borderRadius: "50%",
    marginRight: 10,
  },
};

export class SuccessModal extends Component {
  state = {
    open: true,
    icon: null,
    loading: false,
    selectedPayrollId: new Set(),
    to_date: "",
    from_date: "",
    totalAmount: 0,
  };

  // handleClose = () => {
  //   this.setState({ open: false });
  // };

  componentDidMount() {
    // this.handleDates();
  }

  toggleEmployee = (id) => {
    const { selectedPayrollId } = this.state;
    const newSet = new Set(selectedPayrollId);

    if (selectedPayrollId.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.setState({
      selectedPayrollId: newSet,
    });
  };

  calculateNoOfPayroll = () => {
    let count = 0;
    if (this.props.data) {
      this.props.data.forEach((facility) => {
        facility.payroll.forEach((item) => {
          count++;
        });
      });
    }

    return count;
  };

  handleDates = () => {
    let maxDate = [],
      minDate = [];
    this.props.data.forEach((facility) => {
      facility.payroll.forEach((item) => {
        maxDate.push(new Date(item.max_created_at));
        minDate.push(new Date(item.min_created_at));
      });
    });
  };

  handleAllSelection = () => {
    const { selectedPayrollId } = this.state;
    let newSet = new Set();
    if (selectedPayrollId.size < this.calculateNoOfPayroll()) {
      // add all employees
      this.props.data.forEach((facility) => {
        facility.payroll.forEach((item) => newSet.add(item.id));
      });
    }
    this.setState({ selectedPayrollId: newSet });
  };

  handlePay = () => {
    const { selectedPayrollId } = this.state;

    let packet = {
      ids: Array.from(selectedPayrollId),
    };

    this.setState({ loading: true });

    Axios.post(`owner/run-payroll`, packet)
      .then((resp) => {
        this.props.onPayClick();
        Toast.showInfoToast(resp.data.data.message);
        this.setState({
          loading: false,
          open: false,
        });
      })
      .catch((err) => {
        Toast.showErrorToast("Error in Payment");
        this.setState({
          loading: false,
        });
      });
  };

  render() {
    const { classes } = this.props;
    let viewList = {};
    let totalAmount = 100;
    let paymentList = [1, 2, 3, 4, 5, 6];
    let selectedPaymentID = {};
    let isAllSelection = false;

    let TotalAmount = 0;
    let payArray = [];
    // this.handleDates();
    this.props.data.forEach((facility) => {
      facility.payroll.forEach((payroll) => {
        if (this.state.selectedPayrollId.has(payroll.id)) {
          payArray.push(payroll);
        }
      });
    });
    TotalAmount = (
      payArray.reduce(
        (row1, row2) => parseFloat(row1) + parseFloat(row2.net_pay),
        0
      ) +
      payArray.reduce(
        (row1, row2) => parseFloat(row1) + parseFloat(row2.credit_balance),
        0
      ) +
      payArray.reduce(
        (row1, row2) => parseFloat(row1) + parseFloat(row2.employee_tax_amount),
        0
      ) +
      payArray.reduce(
        (row1, row2) => parseFloat(row1) + parseFloat(row2.employer_tax_amount),
        0
      )
    ).toFixed(2);

    let maxDate = [],
      minDate = [],
      maxPayoutDate = [];
    this.props.data.forEach((facility) => {
      facility.payroll.forEach((item) => {
        maxDate.push(new Date(item.max_created_at));
        minDate.push(new Date(item.min_created_at));
        maxPayoutDate.push(new Date(item.payout_date));
      });
    });

    // console.log(maxDate)
    // console.log(new Date(Math.max.apply(null, maxDate)))

    const to_date = moment(new Date(Math.max.apply(null, maxDate))).format(
      "MMMM DD, yyyy"
    );
    const from_date = moment(new Date(Math.min.apply(null, minDate))).format(
      "MMMM DD, yyyy"
    );
    const payoutDate = moment(
      new Date(Math.max.apply(null, maxPayoutDate))
    ).format("MMMM DD, yyyy");

    return (
      <Modal
        className="modal-container"
        // style={{position : "fixed",bottom : "-60px"}}
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onBackdropClick={this.props.handleClose}
        // onBlur={() => {
        //   console.log("onBlur")
        //   this.setState({
        //     selectedPayrollId: new Set(),
        //   })
        //   this.props.handleClose();
        // }}
      >
        <div
          className="modal-content"
          style={{
            width: "70%",
            maxHeight: "60%",
            position: "relative",
            bottom: "134px",
          }}
        >
          <Paper style={{ marginBottom: 20 }}>
            {/* <Grid
              container
              justify="space-between"
              alignItems="center"
              style={{ padding: 20, }}
            >
              <div style={{ display: "flex", position: "relative" }}>
                <Typography variant="h5" className={classes.title}>
                  <b>Payment Details</b>
                </Typography>
                <div style={{ display: "flex", }}>
                  <SecondaryButton
                    variant="contained"
                    style={{ height: 54, }}
                  // onClick={this.props.handleClose}
                  >
                    Cancel
                  </SecondaryButton>
                  <PrimaryButton
                    variant="contained"
                    color="primary"
                    style={{ height: 54 }}
                  // onClick={() => this.props.confirm(this.state)}
                  >
                    Pay
                  </PrimaryButton>
                </div>
              </div>
            </Grid> */}
            <Grid
              container
              justify="space-between"
              alignItems="center"
              className={classes.paper}
              // style={{ borderBottom: "1px solid #EDECF5" }}
            >
              <div className="btn-grp-prime">
                <Typography variant="h5" style={{ marginLeft: "28px" }}>
                  Payment Details
                </Typography>
              </div>
              <div>
                {/* <Hidden only={["xs", "sm", "md"]}> */}
                <SecondaryButton
                  type="submit"
                  style={{ background: "#F3F4F7" }}
                  onClick={() => {
                    this.setState({
                      selectedPayrollId: new Set(),
                    });
                    this.props.handleClose();
                  }}
                >
                  Cancel
                </SecondaryButton>
                {/* </Hidden>
                <Hidden only={["xl", "lg"]}> */}
                {/* <SecondaryButton type="submit" style={{ marginBottom: 4 }}>
                    Cancel
                  </SecondaryButton> */}
                {/* </Hidden>
                <Hidden only={["xs", "sm", "md"]}> */}
                {/* <PrimaryButton type="submit" style={{ marginRight: "20px", marginLeft: "16px" }}>
                    Pay
                  </PrimaryButton> */}
                {/* </Hidden>
                <Hidden only={["xl", "lg"]}> */}
                <PrimaryButton
                  type="submit"
                  style={{
                    marginBottom: 4,
                    marginRight: "20px",
                    marginLeft: "16px",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    this.handlePay();
                  }}
                >
                  Pay
                </PrimaryButton>
                {/* </Hidden> */}
              </div>
            </Grid>
            <Divider></Divider>
            {viewList !== null && (
              <div className="paydetail">
                <div className="payAmount" style={{ fontWeight: "400" }}>
                  The payment amount will be debited on
                  <b>{moment(payoutDate).format("MMMM DD, yyyy")}</b> and
                  {this.calculateNoOfPayroll()} person will be paid.This payment
                  is from
                  <b>
                    {moment(from_date).format("MMMM DD, yyyy") +
                      " to " +
                      moment(to_date).format("MMMM DD, yyyy")}
                  </b>
                </div>
                <div className="pay-content">
                  <div className="divider"></div>
                  <div className="pay-info">
                    <div className="title">Total Amount</div>
                    <div
                      className="info"
                      style={{ fontSize: "24px", fontWeight: "600" }}
                    >
                      <b>{`$ ${TotalAmount}`}</b>
                    </div>
                  </div>
                  <div>
                    <button
                      className="view-more"
                      onClick={() =>
                        this.setState({ openPayrollDetails: true })
                      }
                    >
                      View more
                    </button>
                  </div>
                </div>
              </div>
            )}

            {this.props?.loading && <Loader />}
            {this.state.loading && <Loader />}

            <TableContainer className={classes.container}>
              <Table
                stickyHeader
                aria-label="sticky table"
                className={classes.table}
              >
                <TableHead className={classes.tableHeader}>
                  <TableRow className={classes.tableRow}>
                    <TableCell className={classes.headerCell}>
                      <SelectRow
                        style={{ width: 30 }}
                        className={classes.selectRowStick}
                        // selected={
                        //   paymentList &&
                        //   paymentList.length > 0 &&
                        //   selectedPaymentID.size === paymentList.length
                        // }
                        selected={
                          this.calculateNoOfPayroll() > 0 &&
                          this.calculateNoOfPayroll() ===
                            this.state.selectedPayrollId.size
                        }
                        onClick={this.handleAllSelection}
                      />
                    </TableCell>
                    <TableCell
                      className={`${classes.headerCell} ${classes.tableMinWidth}`}
                    >
                      Employee Name
                    </TableCell>
                    <TableCell
                      className={`${classes.headerCell} ${classes.tableMinWidth}`}
                    >
                      Total Working Hour
                    </TableCell>
                    <TableCell
                      className={`${classes.headerCell} ${classes.tableMinWidth}`}
                    >
                      Employee Tax
                    </TableCell>
                    <TableCell
                      className={`${classes.headerCell} ${classes.tableMinWidth}`}
                    >
                      Employer tax
                    </TableCell>
                    <TableCell
                      className={`${classes.headerCell} ${classes.tableMinWidth}`}
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      className={`${classes.headerCell} ${classes.tableMinWidth}`}
                    >
                      Remark
                    </TableCell>
                    {/* <TableCell></TableCell> */}
                  </TableRow>
                </TableHead>
                {/* <caption>This is thing </caption> */}
                {/* <div style={{width : "100%", height : "49px"}}>
                <p>ICU Menorial Hospital</p>
                </div> */}
                {/* <Typography style={{width : "100%"}}>ICU Menorial Hospital</Typography> */}
                <TableBody>
                  {this.props.data?.map((facility, idx1) => {
                    return (
                      <>
                        <TableRow style={{ background: "#F3F4F7" }}>
                          <TableCell></TableCell>
                          <TableCell className={classes.name}>
                            {facility.name}
                          </TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell className={classes.accountNumber}>
                            Bank Account No.
                            <div>
                              {facility.account_number
                                ? facility.account_number
                                : "N/A"}
                            </div>
                          </TableCell>
                        </TableRow>

                        {facility?.payroll?.map((row, idx2) => {
                          return (
                            <>
                              <TableRow key={row.id} className="cursor-pointer">
                                <TableCell style={{ width: 30 }}>
                                  <SelectRow
                                    style={{ width: 30 }}
                                    selected={this.state.selectedPayrollId.has(
                                      row.id
                                    )}
                                    onClick={() => {
                                      this.toggleEmployee(row.id);
                                    }}
                                  />
                                </TableCell>
                                <TableCell
                                  className={
                                    classes.rowCell + " cursor-pointer"
                                  }
                                >
                                  <div className={classes.namePhotoDiv}>
                                    <div className={classes.photo}>
                                      <img
                                        className={classes.image}
                                        src={
                                          row?.profile_photo
                                            ? row.profile_photo
                                            : user
                                        }
                                        alt="."
                                      ></img>
                                    </div>
                                    <div>
                                      {row?.first_name +
                                        " " +
                                        (row?.last_name ? row.last_name : "")}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell
                                  className={
                                    classes.rowCell + " cursor-pointer"
                                  }
                                >
                                  {row?.hours_worked + "h"}
                                </TableCell>

                                <TableCell
                                  className={
                                    classes.rowCell + " cursor-pointer"
                                  }
                                >
                                  ${row.employee_tax_amount}
                                </TableCell>
                                <TableCell
                                  className={
                                    classes.rowCell + " cursor-pointer"
                                  }
                                >
                                  ${row?.employer_tax_amount}
                                </TableCell>
                                <TableCell
                                  className={
                                    classes.rowCell + " cursor-pointer"
                                  }
                                >
                                  $
                                  {parseFloat(
                                    row?.net_pay + row?.credit_balance
                                  ).toFixed(2)}
                                </TableCell>
                                <TableCell
                                  className={
                                    classes.rowCell + " cursor-pointer"
                                  }
                                >
                                  {row?.remark ? row?.remark : "N/A"}
                                </TableCell>
                              </TableRow>

                              {/* {paymentList.length !== 0 && ( */}
                            </>
                          );
                        })}
                        <TableRow>
                          <TableCell className={classes.AmountCell}></TableCell>
                          <TableCell className={classes.AmountCell}>
                            Total Amount
                          </TableCell>
                          <TableCell className={classes.AmountCell}>
                            {facility.payroll
                              .reduce(
                                (row1, row2) =>
                                  parseFloat(row1) +
                                  parseFloat(row2.hours_worked),
                                0
                              )
                              .toFixed(2) + "h"}
                          </TableCell>
                          <TableCell className={classes.AmountCell}>
                            $
                            {facility.payroll
                              .reduce(
                                (row1, row2) =>
                                  parseFloat(row1) +
                                  parseFloat(row2?.employee_tax_amount),
                                0
                              )
                              .toFixed(2)}
                          </TableCell>
                          <TableCell className={classes.AmountCell}>
                            $
                            {facility.payroll
                              .reduce(
                                (row1, row2) =>
                                  parseFloat(row1) +
                                  parseFloat(row2.employer_tax_amount),
                                0
                              )
                              .toFixed(2)}
                          </TableCell>
                          <TableCell className={classes.AmountCell}>
                            $
                            {(
                              facility.payroll.reduce(
                                (row1, row2) =>
                                  parseFloat(row1) + parseFloat(row2.net_pay),
                                0
                              ) +
                              facility.payroll.reduce(
                                (row1, row2) =>
                                  parseFloat(row1) +
                                  parseFloat(row2.credit_balance),
                                0
                              )
                            ).toFixed(2)}
                          </TableCell>
                          <TableCell className={classes.AmountCell}></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.emptyCell}></TableCell>
                          <TableCell className={classes.emptyCell}></TableCell>
                          <TableCell className={classes.emptyCell}></TableCell>
                          <TableCell className={classes.emptyCell}></TableCell>
                          <TableCell className={classes.emptyCell}></TableCell>
                          <TableCell className={classes.emptyCell}></TableCell>
                          <TableCell className={classes.emptyCell}></TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                  {!this.state.loading && this.props?.data?.length === 0 && (
                    <TableRow>
                      <TableCell className={classes.rowCell} colSpan="3">
                        No data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
          {/* <div className="modal-icon">
              <img src={Success} alt="delete icon" />
              </div>
              <div className="modal-heading">{this.props.heading}</div>
              <div className="modal-sub-heading">{this.props.subHeading}</div>
              <div className="modal-cta">

              <SecondaryButton
              variant="contained"
              style={{ height: 54, marginRight: 16,display:this.props.hideCancelBtn===true?"none":"block" }}
              onClick={this.props.handleClose}
              >
              Cancel
              </SecondaryButton>
              <PrimaryButton
              variant="contained"
              color="primary"
              style={{ height: 54 }}
              onClick={this.props.confirm}
              >
              {this.props.hideCancelBtn===true?"Close":"Confirm"}
              </PrimaryButton>
          </div> */}
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(SuccessModal);
