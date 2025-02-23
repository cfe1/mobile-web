import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import { withStyles } from "@material-ui/core/styles";
import { Axios } from "../../../../api/apiConsts";

import {
  PrimaryButton,
  SecondaryButton,
  InputField,
  DeleteModal,
  ErrorModal,
  Loader,
  Toast,
  BankVerification,
} from "../../../components";

const styles = {
  title: {
    marginBottom: 9,
  },
  breadcrumbs: {
    marginBottom: 23,
  },
  paper: {
    padding: 30,
    marginBottom: 30,
  },
  subtitle: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 11,
  },
  profilePic: {
    height: 150,
    width: 150,
    borderRadius: 75,
    objectFit: "cover",
    marginBottom: 20,
  },
  documentPlaceholder: {
    backgroundColor: "#F5F6FA",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 650,
    borderRadius: 16,
  },
  downloadLinkContainer: {
    alignSelf: "center",
    display: "flex",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    padding: "12px 15px 12px 15px",
    cursor: "pointer",
  },
  footer: {
    width: "100%",
    padding: "10px 0px",
    display: "flex",
    justifyContent: "center",
  },
  head: {
    fontSize: 14,
    fontWeight: "bold",
  },
};

class TaxBank extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: "",
      errorFirstName: false,
      firstNameHelperText: "",
      secondName: "",
      errorSecondName: false,
      secondNameHelperText: "",
      email: "",
      errorEmail: false,
      emailHelperText: "",
      IBAN: "",
      errIBAN: false,
      htIBAN: "",
      RN: "",
      errRN: false,
      htRN: "",
      status: "Active",
      dateAdded: null,
      loading: false,
      editMode: false,
      showDeleteModal: false,
      showSuccessModal: false,
      showErrorModal: false,
      errorMessage: "",
      bankVerificationOpen: false,
      taxBank: null,
      modalOpen: false,
      heading: "",
      subHeading: "",
      deleteModalOpen: false,
      clearingAccount: null,
      overHeadAccount: null,
    };
  }

  componentDidMount() {
    this.getTaxBankData();
    this.getClearingBankData();
    this.getOverHeadBankData();
  }

  handleCancel = () => {
    document.location.reload();
  };

  firstNameChangeHandler = (event) => {
    this.setState({ firstName: event.target.value });
  };

  firstNameErrorHandler = () => {
    if (this.state.firstName !== "") {
      this.setState({ errorFirstName: false, firstNameHelperText: "" });
    } else {
      this.setState({
        errorFirstName: true,
        firstNameHelperText: "First Name cannot be empty.",
      });
    }
  };

  secondNameChangeHandler = (event) => {
    this.setState({ secondName: event.target.value });
  };

  secondNameErrorHandler = () => {
    if (this.state.secondName !== "") {
      this.setState({ errorSecondName: false, secondNameHelperText: "" });
    } else {
      this.setState({
        errorSecondName: true,
        secondNameHelperText: "Last Name cannot be empty.",
      });
    }
  };

  emailChangeHandler = (event) => {
    this.setState({ email: event.target.value });
  };
  emailErrorHandler = () => {
    let regexEmail = /\S+@\S+\.\S+/;
    if (this.state.email.match(regexEmail)) {
      this.setState({ errorEmail: false, emailHelperText: "" });
    } else {
      this.setState({
        errorEmail: true,
        emailHelperText: "Please enter a valid Email",
      });
    }
  };

  IBANChangeHandler = (e) => {
    this.setState({ IBAN: e.target.value });
  };
  IBANErrorHandler = () => {
    if (
      Number(this.state.IBAN) !== Number.NaN &&
      Number(this.state.IBAN).toString().length >= 4 &&
      Number(this.state.IBAN).toString().length <= 17
    ) {
      this.setState({
        errIBAN: false,
        htIBAN: "",
      });
    } else {
      this.setState({
        errIBAN: true,
        htIBAN: "Please enter a valid IBAN number",
      });
    }
  };

  RNChangeHandler = (e) => {
    this.setState({ RN: e.target.value });
  };
  RNErrorHandler = () => {
    let regexRN = /^([02][1-9]|[13][012])\d{7}$/;
    if (this.state.RN && this.state.RN.match(regexRN)) {
      this.setState({
        errRN: false,
        htRN: "",
      });
    } else {
      this.setState({
        errRN: true,
        htRN: "Please enter a valid routing number",
      });
    }
  };

  getTaxBankData = () => {
    this.setState({ loading: true });
    Axios.get(`bank/tax-account`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.setState({
            taxBank: data,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response.status !== 500) {
          if (error.response.data.statusCode === 404) {
            this.setState({ editMode: true });
          } else {
            if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
              Toast.showErrorToast(error.response.data.error.message[0]);
            }
          }
        }
      });
  };

  getClearingBankData = () => {
    this.setState({ loading: true });
    Axios.get(`bank/clearing-account`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.setState({
            clearingAccount: data,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response.status !== 500) {
          if (error.response.data.statusCode === 404) {
            this.setState({ editMode: true });
          } else {
            if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
              Toast.showErrorToast(error.response.data.error.message[0]);
            }
          }
        }
      });
  };

  getOverHeadBankData = () => {
    this.setState({ loading: true });
    Axios.get(`bank/overhead-account`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.setState({
            overHeadAccount: data,
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if (error.response.status !== 500) {
          if (error.response.data.statusCode === 404) {
            this.setState({ editMode: true });
          } else {
            if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
              Toast.showErrorToast(error.response.data.error.message[0]);
            }
          }
        }
      });
  };

  handleModalOpen = () => {
    this.setState({
      modalOpen: true,
      heading: "Delete Bank Details!",
      subHeading: "Are you sure want to delete bank details?",
    });
  };
  handleModalClose = () => {
    this.setState({ modalOpen: false });
  };
  handleLoader = (bool) => {
    this.setState({ loading: bool });
  };

  handleDelete = () => {
    this.setState({ loading: true });
    Axios.delete(`/tax-bank`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.handleModalClose();
          this.setState(
            {
              editMode: true,
              taxBank: null,
            },
            () => {}
          );
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

  addBankAccount = () => {
    if (
      this.state.IBAN === "" ||
      this.state.RN === "" ||
      this.state.errIBAN === true ||
      this.state.errRN === true ||
      this.state.firstName === "" ||
      this.state.secondName === "" ||
      this.state.email === "" ||
      this.state.errorFirstName === true ||
      this.state.errorSecondName === true ||
      this.state.errorEmail === true
    ) {
      this.IBANErrorHandler();
      this.RNErrorHandler();
      this.firstNameErrorHandler();
      this.secondNameErrorHandler();
      this.emailErrorHandler();
    } else {
      this.setState({ loading: true });
      const packet = {
        iban_number: this.state.IBAN,
        routing_number: this.state.RN,
        first_name: this.state.firstName,
        last_name: this.state.secondName,
        email: this.state.email,
      };
      Axios.patch(`/tax-bank`, packet)
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.statusCode === 200) {
            this.getTaxBankData();
            this.setState({ editMode: false });
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
    }
  };

  render() {
    const {
      loading,
      showErrorModal,
      errorMessage,
      bankVerificationOpen,
      taxBank,
      RN,
      IBAN,
      errIBAN,
      errRN,
      htIBAN,
      htRN,
      clearingAccount,
      overHeadAccount,
    } = this.state;
    const { classes } = this.props;

    return (
      <div>
        {loading && <Loader />}

        <Grid container spacing={3} style={{ marginTop: 10 }}>
          {this.state.editMode === false && taxBank !== null && (
            <>
              <Grid item xs={12}>
                {" "}
                <div className={classes.head}>Tax Bank Information</div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account </div>
                  <div className="info">
                    {taxBank.account_holder
                      ? `${taxBank.account_holder}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Number</div>
                  <div className="info">
                    {taxBank.account_number
                      ? `${taxBank.account_number}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Balance</div>
                  <div className="info">
                    {taxBank?.account_statistics?.balance
                      ? `$${taxBank?.account_statistics?.balance}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Status</div>
                  <div className="info">
                    {taxBank?.account_statistics?.status
                      ? `${taxBank?.account_statistics?.status}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Routing Number</div>
                  <div className="info">
                    {taxBank.routing_number
                      ? `${taxBank.routing_number}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account active since</div>
                  <div className="info">
                    {taxBank?.account_statistics?.date_joined
                      ? `${moment
                          .utc(taxBank?.account_statistics?.date_joined)
                          .local()
                          .format("DD MMM YYYY")}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
            </>
          )}

          {clearingAccount !== null && (
            <>
              <Grid item xs={12}>
                {" "}
                <div className={classes.head}>Clearing Account Information</div>
              </Grid>

              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account </div>
                  <div className="info">
                    {clearingAccount.account_holder
                      ? `${clearingAccount.account_holder}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Number</div>
                  <div className="info">
                    {clearingAccount.account_number
                      ? `${clearingAccount.account_number}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Balance</div>
                  <div className="info">
                    {clearingAccount?.account_statistics?.balance
                      ? `$${clearingAccount?.account_statistics?.balance}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Status</div>
                  <div className="info">
                    {clearingAccount?.account_statistics?.status
                      ? `${clearingAccount?.account_statistics?.status}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Routing Number</div>
                  <div className="info">
                    {clearingAccount.routing_number
                      ? `${clearingAccount.routing_number}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account active since</div>
                  <div className="info">
                    {clearingAccount?.account_statistics?.date_joined
                      ? `${moment
                          .utc(clearingAccount?.account_statistics?.date_joined)
                          .local()
                          .format("DD MMM YYYY")}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
            </>
          )}

          {overHeadAccount !== null && (
            <>
              <Grid item xs={12}>
                {" "}
                <div className={classes.head}>Overhead Account Information</div>
              </Grid>

              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account </div>
                  <div className="info">
                    {overHeadAccount.account_holder
                      ? `${overHeadAccount.account_holder}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Number</div>
                  <div className="info">
                    {overHeadAccount.account_number
                      ? `${overHeadAccount.account_number}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Balance</div>
                  <div className="info">
                    {overHeadAccount?.account_statistics?.balance
                      ? `$${overHeadAccount?.account_statistics?.balance}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account Status</div>
                  <div className="info">
                    {overHeadAccount?.account_statistics?.status
                      ? `${overHeadAccount?.account_statistics?.status}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Routing Number</div>
                  <div className="info">
                    {overHeadAccount.routing_number
                      ? `${overHeadAccount.routing_number}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Account active since</div>
                  <div className="info">
                    {overHeadAccount?.account_statistics?.date_joined
                      ? `${moment
                          .utc(overHeadAccount?.account_statistics?.date_joined)
                          .local()
                          .format("DD MMM YYYY")}`
                      : "N/A"}
                  </div>
                </div>
              </Grid>
            </>
          )}

          {this.state.editMode === true && (
            <>
              <Grid item xs={4}>
                <InputField
                  id="firstName"
                  type="text"
                  error={this.state.errorFirstName}
                  helperText={this.state.firstNameHelperText}
                  label="First Name*"
                  variant="outlined"
                  value={this.state.firstName}
                  onChange={(event) => this.firstNameChangeHandler(event)}
                  onBlur={this.firstNameErrorHandler}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  id="secondName"
                  type="text"
                  error={this.state.errorSecondName}
                  helperText={this.state.secondNameHelperText}
                  label="Last Name"
                  variant="outlined"
                  value={this.state.secondName}
                  onChange={(event) => this.secondNameChangeHandler(event)}
                  onBlur={this.secondNameErrorHandler}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  id="email"
                  type="text"
                  label="Email Address"
                  variant="outlined"
                  value={this.state.email}
                  error={this.state.errorEmail}
                  helperText={this.state.emailHelperText}
                  onChange={(event) => this.emailChangeHandler(event)}
                  onBlur={this.emailErrorHandler}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  id="iban"
                  type="number"
                  label="IBAN Number"
                  variant="outlined"
                  value={IBAN}
                  error={errIBAN}
                  helperText={htIBAN}
                  onChange={(event) => this.IBANChangeHandler(event)}
                  onBlur={this.IBANErrorHandler}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  id="rn"
                  type="number"
                  label="Routing Number"
                  variant="outlined"
                  value={RN}
                  error={errRN}
                  helperText={htRN}
                  onChange={(event) => this.RNChangeHandler(event)}
                  onBlur={this.RNErrorHandler}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
        <div className="sett-cta">
          {this.state.editMode === true && (
            <PrimaryButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={this.addBankAccount}
              style={{ width: 208, height: 54 }}
            >
              Add
            </PrimaryButton>
          )}
          {taxBank !== null && taxBank.status === "Verification in progress" && (
            <SecondaryButton
              variant="contained"
              type="submit"
              onClick={() => {
                this.setState({ bankVerificationOpen: true });
              }}
              style={{ width: 208, height: 54, marginRight: 20 }}
            >
              Verify
            </SecondaryButton>
          )}
          {/* {this.state.editMode === false && (
            <PrimaryButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={this.handleModalOpen}
              style={{ width: 208, height: 54 }}
            >
              Delete
            </PrimaryButton>
          )} */}
        </div>
        <ErrorModal
          open={showErrorModal}
          title="Error!"
          description={errorMessage}
          handleClose={() => this.setState({ showErrorModal: false })}
        />
        <BankVerification
          open={bankVerificationOpen}
          getTaxBankData={this.getTaxBankData}
          handleLoader={this.handleLoader}
          handleClose={() => {
            this.setState({ bankVerificationOpen: false });
          }}
        />
        <DeleteModal
          open={this.state.modalOpen}
          handleClose={this.handleModalClose}
          heading={this.state.heading}
          subHeading={this.state.subHeading}
          confirm={this.handleDelete}
        ></DeleteModal>
      </div>
    );
  }
}

export default withStyles(styles)(TaxBank);
