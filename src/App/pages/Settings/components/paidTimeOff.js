import { Grid } from "@material-ui/core";
import React, { Component } from "react";
import {
  PrimaryButton,
  InputField,
  Toast,
  Loader,
  SecondaryButton,
} from "../../../components";
import { Axios } from "../../../../api/apiConsts";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";

function hoursFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
    />
  );
}

hoursFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

function dollarFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            value: values.value,
          },
        });
      }}
      thousandSeparator
      prefix="$"
    />
  );
}

dollarFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export class PaidTimeOff extends Component {
  state = {
    PTO: null,
    htPTO: "",
    errPTO: false,
    loading: false,
    editMode: false,
    rate: null,
    errRate: false,
    htRate: "",
  };

  componentDidMount = () => {
    this.getPTO();
  };

  setNOPTO = () => {
    this.setState({
      editMode: false,
    });
    this.getPTO();
  };
  getPTO = () => {
    this.setState({ loading: true });
    Axios.get(`/pto-setting`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.setState({
            PTO: data.pto_credits,
          });
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

  setPTO = () => {
    if (this.state.editMode === false) {
      this.setState({ editMode: true });
    } else {
      if (
        this.state.PTO === null ||
        this.state.errPTO === true ||
        this.state.rate === null ||
        this.state.errRate === true
      ) {
        this.PTOErrorHandler();
        this.rateErrorHandler();
      } else {
        this.setState({ loading: true });
        const packet = {
          pto_credits: Number(this.state.PTO),
          rate: Number(this.state.rate),
        };
        Axios.patch(`/pto-setting`, packet)
          .then((response) => {
            this.setState({ loading: false, editMode: false });

            if (response.data.statusCode === 200) {
              Toast.showInfoToast(
                "Paid Time Off Settings Updated Successfully."
              );
            }
          })
          .catch((error) => {
            this.setState({ loading: false });

            if (error.response.status !== 500) {
              if (
                [400, 405, 422, 403].includes(error.response.data.statusCode)
              ) {
                Toast.showErrorToast(error.response.data.error.message[0]);
              }
            }
          });
      }
    }
  };
  PTOChangeHandler = (e) => {
    this.setState({ PTO: e.target.value });
  };
  PTOErrorHandler = () => {
    if (this.state.PTO === "") {
      this.setState({
        errPTO: true,
        htPTO: " Paid time off is required",
      });
    } else {
      this.setState({
        errPTO: false,
        htPTO: "",
      });
    }
  };

  rateChangeHandler = (e) => {
    this.setState({ rate: e.target.value });
  };
  rateErrorHandler = () => {
    if (this.state.rate === "") {
      this.setState({
        errRate: true,
        htRate: "Monthly rate is required",
      });
    } else {
      this.setState({
        errRate: false,
        htRate: "",
      });
    }
  };

  render() {
    const { rate, errRate, htRate } = this.state;
    return (
      <div>
        {this.state.loading && <Loader />}
        <Grid container spacing={3} style={{ marginTop: 10 }}>
          {this.state.editMode === false && (
            <>
              <Grid item xs={6}>
                <div className="fd-info">
                  <div className="title">
                    Accrue (X hours per every regular hour worked)
                  </div>
                  <div className="info">{this.state.PTO}</div>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div className="fd-info">
                  <div className="title">Rate</div>
                  <div className="info">{this.state.rate}</div>
                </div>
              </Grid>
            </>
          )}

          {this.state.editMode === true && (
            <>
              <Grid item xs={6}>
                <InputField
                  id="pto"
                  InputProps={{
                    inputComponent: hoursFormatCustom,
                  }}
                  error={this.state.errPTO}
                  helperText={this.state.htPTO}
                  label="Accrue (X hours/every regular hour worked)"
                  variant="outlined"
                  value={this.state.PTO}
                  onChange={(event) => this.PTOChangeHandler(event)}
                  onBlur={this.PTOErrorHandler}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <InputField
                  id="rate"
                  error={errRate}
                  helperText={htRate}
                  label="Rate"
                  variant="outlined"
                  value={rate}
                  onChange={(event) => this.rateChangeHandler(event)}
                  onBlur={this.rateErrorHandler}
                  InputProps={{
                    inputComponent: dollarFormatCustom,
                  }}
                  fullWidth
                />
              </Grid>
            </>
          )}
        </Grid>
        <div className="sett-cta">
          {this.state.editMode === true && (
            <>
              <SecondaryButton
                variant="contained"
                color="primary"
                type="submit"
                onClick={this.setNOPTO}
                style={{ width: 208, height: 54, marginRight: "10px" }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                variant="contained"
                color="primary"
                type="submit"
                onClick={this.setPTO}
                style={{ width: 208, height: 54 }}
              >
                Update
              </PrimaryButton>
            </>
          )}
          {this.state.editMode === false && (
            <PrimaryButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={this.setPTO}
              style={{ width: 208, height: 54 }}
            >
              Edit
            </PrimaryButton>
          )}
        </div>
      </div>
    );
  }
}

export default PaidTimeOff;
