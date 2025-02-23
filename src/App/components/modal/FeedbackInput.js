import React, { Component } from "react";
import Modal from "@material-ui/core/Modal";
import { PrimaryButton, SecondaryButton, InputField, Select, Toast } from "../../components";
import { Grid } from "@material-ui/core";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from "@material-ui/core/styles";
import { Axios } from "../../../api/apiConsts";
import Loader from "../Loader";

const styles = {
  secondaryButton: {
    height: 54,
    marginRight: 16
  },
  gridItem: {
    paddingTop: "10px",
    marginBottom: 20
  },
  primaryButton: {
    height: 54,
  },
  formControl: {
    marginBottom: "35px !important"
  },
  modalHeading: {
    marginTop: "40px", marginBottom: "40px !important",
  }
}
export class FeedbackInput extends Component {
  state = {
    open: false,
    bankType: "Existing",
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
    accountDetails: [],
    loading: false,
    selectItems: [],
  };

  componentDidMount() {
    this.handleAccountDetails();
  }

  handleExistingBankAccounts = () => {

    this.setState({ loading: true })

    let index = this.state.accountDetails.map((account) => {
      return account.account_number
    }).indexOf(this.state.accountSelected.toString());

    console.log(index);
    if (index == -1) {
      return;
    }

    // this.setState({ loading: false })

    Axios.patch(`owner/fund-account/${this.props.fid}/${this.state.accountDetails[index].id}`).then((res) => {
      Toast.showInfoToast(res.data.data.message);
      this.setState({ loading: false })
      this.props.onUpdateClick();
      console.log(res);
    }).catch((error) => {
      Toast.showErrorToast(error.response.data.error.message[0]);
      this.setState({ loading: false })
      this.props.handleClose();
      console.log(error);
    })
  }

  handleNewBankAccounts = () => {

    const payload = {
      account_holder: this.state.accountName,
      account_number: this.state.accountNumber,
      routing_number: this.state.routingNumber,
    };

    this.setState({ loading: true });
    // console.log(payload);

    Axios.post(`owner/fund-account/${this.props.fid}`, payload).then((res) => {
      Toast.showInfoToast(res.data.data.message);
      this.setState({ loading: false });
      this.props.onUpdateClick();
    }).catch((error) => {
      if(error.response.data.statusCode===500){
        let errorString=error.response.data.error.message[0].replace("_"," ");
        errorString=errorString.split(".")[0];
        Toast.showErrorToast(errorString);
      }
      else {
        Toast.showErrorToast(error.response.data.error.message[0])
      }
      this.props.handleClose();
      this.setState({ loading: false });
    })
  }

  // handlePay = async () => {
  //   const { selectedPayrollId } = this.state;

  //   let packet = {
  //     ids: Array.from(selectedPayrollId),
  //   };

  //   this.setState({ loading: true });

  //   Axios.post(`owner/run-payroll`, packet).then((resp) => {

  //     console.log(resp);
  //     this.props.onPayClick();
  //     // Toast.showInfoToast(resp.data.data.message);
  //     this.setState({
  //       loading: false,
  //       open: false,
  //     });
  //   }).catch((err) => {
  //     // Toast.showErrorToast("Error in Payment");
  //     this.setState({
  //       loading: false,
  //     });
  //   })
  // }

  handleAccountDetails = () => {
    this.setState({ loading: true });
    Axios.get("owner/fund-account").then((res) => {
      console.log(res.data.data);
      this.setState({
        accountDetails: res.data.data,
        loading: false,
      })
      this.handleSelectItems();
    }).catch((err) => {
      this.setState({
        loading: false,
      })
    })
  }

  handleSelectItems = () => {
    let arr = [];
    // items={[{ value: "Select Bank Account" }, { value: "1234567890", name: "John" }, { value: "1234523460", name: "Mayer" }, { value: "186567890", name: "layer" },]}
    arr.push({ value: "Select Bank Account" });
    this.state.accountDetails.map((account) => {
      arr.push({
        value: account.account_number,
        name: account.account_holder,
      })
    })

    this.setState({
      selectItems: arr,
    })

    console.log(this.state.selectItems);

  }

  handleClose = () => {
    this.setState({ open: false });
  };

  handleChange = (e) => {
    this.setState({
      bankType: e.target.value
    })
  }

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
    this.setState({ accountSelected: e })
  }


  render() {
    const { classes } = this.props;
    console.log(this.state.accountSelected)
    console.log(this.props.fid)

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
          <div className={`modal-heading ${classes.modalHeading}`}>Add Bank Account</div>
          {this.state.loading && <Loader />}

          <Grid container justify="center">
            <Grid item xs={10} className={classes.gridItem}>
              <FormControl component="fieldset" className={classes.formControl} >
                <RadioGroup row aria-label="position" name="position" defaultValue="top" value={this.state.bankType}>
                  <FormControlLabel value="Existing" control={<Radio color="#17174A" />} label="Existing Bank Account" onChange={(e) => {
                    this.handleChange(e);
                  }} />
                  <FormControlLabel value="New" control={<Radio color="#17174A" />} label="New Bank Account" onChange={(e) => {
                    this.handleChange(e);
                  }} />
                </RadioGroup>
              </FormControl>
            </Grid>
            {this.state.bankType == "Existing" && <Grid item xs={10}>
              <Select
                id="Bank"
                label="Bank Account"
                items={this.state.selectItems}
                fullWidth
                MenuProps={{
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "left"
                  },
                  getContentAnchorEl: null
                }}
                value={this.state.accountSelected}
                onChange={(value) => { // Here value comes from items array 
                  this.setState({ accountSelected: value })
                }}
              />
            </Grid>}
            {this.state.bankType == "New" && <Grid item xs={10}>
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
            </Grid>}
          </Grid>
          <div className="modal-cta" style={{ marginTop: "50px" }}>
            <SecondaryButton
              variant="contained"
              // style={{ height: 54, marginRight: 16 }}
              onClick={this.props.handleClose}
              className={classes.secondaryButton}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              variant="contained"
              color="primary"
              // style={{ height: 54 }}
              className={classes.primaryButton}
              onClick={this.state.bankType == "New" ? this.handleNewBankAccounts : this.handleExistingBankAccounts}
            >
              Add
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withStyles(styles)(FeedbackInput);
