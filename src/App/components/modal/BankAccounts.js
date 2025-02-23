import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import {
  PrimaryButton,
  SecondaryButton,
  InputField,
  Select,
  Toast,
  DeleteBankAccount,
} from "../../components";
import { Grid } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import { withStyles } from "@material-ui/core/styles";
import Alert from "@material-ui/lab/Alert";
import deleteIcon from "../../assets/icons/delete2.png";
import UploadIcon from "../../assets/icons/upload.png";
import { Axios } from "../../../api/apiConsts";
import Loader from "../Loader";
const styles = {
  secondaryButton: {
    height: 54,
    fontSize: "13px !important",
  },
  gridItem: {
    paddingTop: "10px",
    marginBottom: 20,
  },
  primaryButton: {
    height: 54,
    marginLeft: "35px",
  },
  formControl: {
    marginBottom: "35px !important",
  },
  modalHeading: {
    marginTop: "40px",
    marginBottom: "40px !important",
  },
  deleteIcon: {
    height: "36px",
    width: "36px",
    border: "1px solid #EDECF5",
    borderRadius: "8px",
    background: "#FFFFFF",
    marginLeft: "81px",
  },
  accountsDiv: {
    display: "flex",
    marginBottom: "16px",
  },
  accountDetails: {
    width: "233px !important",
  },
  accountNumber: {
    fontSize: "15px",
    color: "#050D33",
  },
  accountName: {
    fontSize: "12px",
    color: "#050D33",
  },
  alertMessage: {
    fontWeight: 600,
    marginBottom: 30,
    // marginTop: 30,
    fontSize: 16,
    width: "86%",
  },
};
export class BankAccounts extends Component {
  state = {
    open: false,
    accountIndex: "0",
    accountSelected: "Select Bank Account",
    accountName: "",
    errName: "",
    htName: "",
    accountNumber: "",
    errNumber: "",
    htNumber: "",
    routingNumber: "",
    errRout: "",
    htRout: "",
    bankAccountDetails: [],
    loading: false,
    isDeleteBankAccount: false,
    deleteBankAccountId: "",
  };

  componentDidMount() {
    this.handleGetBankAccounts();
  }

  componentDidUpdate(prevProps) {
    if (this.props.fid != prevProps.fid) {
      this.handleGetBankAccounts();
    }
  }

  handleGetBankAccounts = () => {
    this.setState({ loading: true });
    Axios.get(`owner/fund-account/${this.props.fid}`)
      .then((res) => {
        this.setState({
          bankAccountDetails: res.data.data,
          loading: false,
        });

        let arr = res.data.data.filter((account) => {
          return account.key == "fund_account";
        });

        this.setState({
          accountIndex: arr[0].account_number + arr[0].routing_number,
        });
      })
      .catch((err) => {
        this.setState({ loading: false });
      });
  };

  handleDeleteBankAccount = (bankId) => {
    this.setState({ loading: true });
    Axios.delete(
      `owner/fund-account/${this.props.fid}/${this.state.deleteBankAccountId}`
    )
      .then((res) => {
        this.setState({
          loading: false,
          isDeleteBankAccount: false,
        });
        Toast.showInfoToast(res.data.data.message);
        this.handleGetBankAccounts();
      })
      .catch((error) => {
        this.setState({
          loading: false,
          isDeleteBankAccount: false,
        });
        Toast.showErrorToast(error.response.data.error.message[0]);
      });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (e) => {
    this.setState({
      accountIndex: e.target.value,
    });
  };

  nameChangeHandler = (e) => {
    this.setState({ accountName: e.target.value });
  };

  nameErrorHandler = () => {
    if (this.state.accountName === "") {
      this.setState({
        errName: true,
        htName: "Account holder's name is required",
      });
    } else {
      this.setState({
        errName: false,
        htName: "",
      });
    }
  };

  numberChangeHandler = (e) => {
    this.setState({ accountNumber: e.target.value });
  };

  numberErrorHandler = () => {
    if (this.state.accountNumber === "") {
      this.setState({
        errNumber: true,
        htNumber: "Account Number is required",
      });
    } else {
      this.setState({
        errNumber: false,
        htNumber: "",
      });
    }
  };

  routeChangeHandler = (e) => {
    this.setState({ routingNumber: e.target.value });
  };

  routeErrorHandler = () => {
    if (this.state.routingNumber === "") {
      this.setState({
        errRout: true,
        htRout: "Routing Number is required",
      });
    } else {
      this.setState({
        errRout: false,
        htRout: "",
      });
    }
  };

  selectChangeHandler = (e) => {
    this.setState({ accountSelected: e });
  };

  handleSelectPrimayAccount = () => {
    this.setState({
      loading: true,
    });

    let arr = this.state.bankAccountDetails.filter((account) => {
      return (
        this.state.accountIndex ==
        account.account_number + account.routing_number
      );
    });

    let arr1 = this.state.bankAccountDetails.filter((account) => {
      return (
        this.state.accountIndex !=
        account.account_number + account.routing_number
      );
    });

    // console.log(arr,arr1);
    let packet = {
      fund_account: arr[0].id,
      fund_account_2: arr1[0].id,
    };

    // console.log(packet);

    // if (this.state.accountIndex == 0) {
    //     packet = {

    //         fund_account: this.state.bankAccountDetails[0].id,
    //         fund_account_2: this.state.bankAccountDetails[1].id,
    //     }
    // }
    // else {
    //     packet = {

    //         fund_account: this.state.bankAccountDetails[1].id,
    //         fund_account_2: this.state.bankAccountDetails[0].id,
    //     }
    // }

    Axios.patch(`owner/fund-account/${this.props.fid}/switch`, packet)
      .then((res) => {
        this.setState({ loading: false });
        Toast.showInfoToast(res.data.data.message);
        this.props.handleClose();
      })
      .catch((error) => {
        this.setState({ loading: false });
        Toast.showErrorToast(error.response.data.error.message[0]);
        this.props.handleClose();
      });
  };

  handleDeleteClose = () => {
    this.setState({
      isDeleteBankAccount: false,
    });
  };

  render() {
    const { classes } = this.props;
    console.log(this.props.fid);
    console.log(this.state.bankAccountDetails);
    console.log(this.state.accountIndex);
    return (
      <Modal
        className="modal-container"
        open={this.props.open}
        onClose={this.props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        onBackdropClick={this.props.handleClose}
      >
        <div className="modal-content">
          <div className="modal-icon"></div>
          <div className={`modal-heading ${classes.modalHeading}`}>
            Bank Account
          </div>
          {/* {<Loader /> && this.state.loading} */}
          {this.state.loading && <Loader />}
          {/* {<Loader /> && true} */}
          <Grid container justify="center">
            <Grid item xs={10} className={classes.gridItem}>
              <FormControl component="fieldset">
                <RadioGroup
                  // aria-label="gender"
                  name="gender1"
                  value={this.state.accountIndex}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                >
                  {this.state.bankAccountDetails.length == 0 && (
                    <div style={{ marginBottom: "40px" }}>No data found</div>
                  )}
                  {this.state.bankAccountDetails[0] && (
                    <div className={classes.accountsDiv}>
                      <FormControlLabel
                        value={
                          this.state.bankAccountDetails[0]?.account_number +
                          this.state.bankAccountDetails[0]?.routing_number
                        }
                        control={<Radio />}
                      ></FormControlLabel>
                      <div className={classes.accountDetails}>
                        <div className={classes.accountNumber}>
                          {this.state.bankAccountDetails[0]?.account_number}
                        </div>
                        <div className={classes.accountName}>
                          {this.state.bankAccountDetails[0]?.account_holder}
                        </div>
                      </div>
                      <div>
                        <div
                          className={classes.deleteIcon}
                          onClick={() => {
                            // this.handleDeleteBankAccount(this.state.bankAccountDetails[0]?.id);
                            this.setState({
                              deleteBankAccountId:
                                this.state.bankAccountDetails[0]?.id,
                              isDeleteBankAccount: true,
                            });
                          }}
                        >
                          <img src={deleteIcon}></img>
                        </div>
                      </div>
                    </div>
                  )}

                  {this.state.bankAccountDetails[1] && (
                    <div className={classes.accountsDiv}>
                      <FormControlLabel
                        value={
                          this.state.bankAccountDetails[1]?.account_number +
                          this.state.bankAccountDetails[1]?.routing_number
                        }
                        control={<Radio />}
                      ></FormControlLabel>
                      <div className={classes.accountDetails}>
                        <div className={classes.accountNumber}>
                          {this.state.bankAccountDetails[1]?.account_number}
                        </div>
                        <div className={classes.accountName}>
                          {this.state.bankAccountDetails[1]?.account_holder}
                        </div>
                      </div>
                      <div>
                        <div
                          className={classes.deleteIcon}
                          onClick={() => {
                            // this.handleDeleteBankAccount(this.state.bankAccountDetails[1]?.id);
                            this.setState({
                              deleteBankAccountId:
                                this.state.bankAccountDetails[1]?.id,
                              isDeleteBankAccount: true,
                            });
                          }}
                        >
                          <img src={deleteIcon}></img>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
                </RadioGroup>
              </FormControl>
            </Grid>
            {this.state.bankAccountDetails?.length == 2 && (
              <div className={classes.alertMessage}>
                <Alert severity="info">
                  Choosing an account will make it primary for transaction.
                </Alert>
              </div>
            )}

            {this.state.bankAccountDetails?.length == 1 && (
              <div className={classes.alertMessage}>
                <Alert severity="info">
                  You can add one more bank account.
                </Alert>
              </div>
            )}
            {/*Only if there is one bank account present. There can be atmost two bank accounts.*/}

            {this.state.accountIndex == "Existing" && (
              <Grid item xs={10}></Grid>
            )}
            {this.state.accountIndex == "New" && (
              <Grid item xs={10}>
                <InputField
                  id="acname"
                  type="text"
                  label="Account Holder Name"
                  variant="outlined"
                  value={this.state.accountName}
                  error={this.state.errName}
                  helperText={this.state.htName}
                  onChange={(event) => this.nameChangeHandler(event)}
                  onBlur={this.nameErrorHandler}
                  fullWidth
                  style={{ marginBottom: "10px" }}
                />
                <InputField
                  id="acc-no"
                  type="text"
                  label="Account Number"
                  variant="outlined"
                  value={this.state.accountNumber}
                  error={this.state.errNumber}
                  helperText={this.state.htNumber}
                  onChange={(event) => this.numberChangeHandler(event)}
                  onBlur={this.numberErrorHandler}
                  fullWidth
                  style={{ marginBottom: "10px" }}
                />
                <InputField
                  id="rout-name"
                  type="text"
                  label="Routing Number"
                  variant="outlined"
                  value={this.state.routingNumber}
                  error={this.state.errRout}
                  helperText={this.state.htRout}
                  onChange={(event) => this.routeChangeHandler(event)}
                  onBlur={this.routeErrorHandler}
                  fullWidth
                  style={{ minHeight: "10px" }}
                />
              </Grid>
            )}
          </Grid>
          <div className={`modal-cta`}>
            <SecondaryButton
              variant="contained"
              onClick={this.props.handleClose}
              className={classes.secondaryButton}
            >
              Close
            </SecondaryButton>
            {this.state.bankAccountDetails.length == 1 && (
              <PrimaryButton
                variant="contained"
                color="primary"
                // style={{ height: 54 }}
                className={classes.primaryButton}
                onClick={this.props.handleAddClick}
                // onClick={() => this.props.confirm(this.state)}
              >
                Add
              </PrimaryButton>
            )}

            {this.state.bankAccountDetails.length == 2 && (
              <PrimaryButton
                variant="contained"
                color="primary"
                // style={{ height: 54 }}
                className={classes.primaryButton}
                onClick={this.handleSelectPrimayAccount}
              >
                Update
              </PrimaryButton>
            )}
          </div>
          <DeleteBankAccount
            open={this.state.isDeleteBankAccount}
            heading={"Delete Account?"}
            subHeading={"Are you sure you want to delete this account?"}
            handleClose={this.handleDeleteClose}
            loading={this.state.loading}
            confirm={this.handleDeleteBankAccount}
          ></DeleteBankAccount>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(BankAccounts);
