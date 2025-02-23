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

function percentFormatCustom(props) {
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
      suffix="%"
    />
  );
}

percentFormatCustom.propTypes = {
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

export class OvertimeSetting extends Component {
  state = {
    eligibility: "",
    htEligibility: "",
    errEligibility: false,
    overtime: "",
    htOvertime: "",
    errOvertime: false,
    wage: "",
    errWage: false,
    htWage: "",
    loading: false,
    editMode: false,
  };

  componentDidMount = () => {
    this.getOvertimeData();
  };

  cancelHandleOverTime = () => {
    this.setState({
      editMode: false,
    });
    this.getOvertimeData();
  };
  getOvertimeData = () => {
    this.setState({ loading: true });
    Axios.get(`/overtime-setting`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.setState({
            eligibility: data.standard_eligibility_hours,
            overtime: data.overtime_rate_percent,
            wage: data.maximum_wage,
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
  eligibilityChangeHandler = (e) => {
    this.setState({ eligibility: e.target.value });
  };
  eligibilityErrorHandler = () => {
    if (this.state.eligibility === "") {
      this.setState({
        errEligibility: true,
        htEligibility: "Standard eligibility hours is required",
      });
    } else {
      this.setState({
        errEligibility: false,
        htEligibility: "",
      });
    }
  };
  overtimeChangeHandler = (e) => {
    this.setState({ overtime: e.target.value }, () => {});
  };
  overtimeErrorHandler = () => {
    if (this.state.overtime === "") {
      this.setState({
        errOvertime: true,
        htOvertime: "Overtime rate is required",
      });
    } else {
      this.setState({
        errOvertime: false,
        htOvertime: "",
      });
    }
  };
  wageChangeHandler = (e) => {
    this.setState({ wage: e.target.value });
  };
  wageErrorHandler = () => {
    if (this.state.wage === "") {
      this.setState({
        errWage: true,
        htWage: "Maximum wage is required",
      });
    } else {
      this.setState({
        errWage: false,
        htWage: "",
      });
    }
  };

  handleOvertime = () => {
    if (this.state.editMode === false) {
      this.setState({ editMode: true });
    } else {
      if (
        this.state.eligibility === "" ||
        this.state.overtime === "" ||
        this.state.wage === "" ||
        this.state.errEligibility === true ||
        this.state.errOvertime === true ||
        this.state.errWage === true
      ) {
        this.eligibilityErrorHandler();
        this.overtimeErrorHandler();
        this.wageErrorHandler();
      } else {
        this.setState({ loading: true });
        const packet = {
          standard_eligibility_hours: this.state.eligibility,
          overtime_rate_percent: this.state.overtime,
          maximum_wage: this.state.wage,
        };
        Axios.patch(`/overtime-setting`, packet)
          .then((response) => {
            this.setState({ loading: false, editMode: false });

            if (response.data.statusCode === 200) {
              Toast.showInfoToast("Overtime Settings Updated Successfully.");
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
  render() {
    return (
      <div>
        {this.state.loading && <Loader />}
        <Grid container spacing={3} style={{ marginTop: 10 }}>
          {this.state.editMode === false && (
            <>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">
                    Standard Eligibility Hours(Week range,Monday to Sunday)
                  </div>
                  <div className="info">
                    <br />
                    {this.state.eligibility}h
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Overtime Rate %</div>
                  <div className="info">{this.state.overtime}%</div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Maximum Wage/Hour</div>
                  <div className="info">{this.state.wage}</div>
                </div>
              </Grid>
            </>
          )}

          {this.state.editMode === true && (
            <>
              <Grid item xs={4}>
                <InputField
                  id="eligibility"
                  InputProps={{
                    inputComponent: hoursFormatCustom,
                  }}
                  error={this.state.errEligibility}
                  helperText={this.state.htEligibility}
                  label="Standard Eligibility Hours"
                  variant="outlined"
                  value={this.state.eligibility}
                  onChange={(event) => this.eligibilityChangeHandler(event)}
                  onBlur={this.eligibilityErrorHandler}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  id="overtime"
                  error={this.state.errOvertime}
                  helperText={this.state.htOvertime}
                  label="Overtime Rate %"
                  variant="outlined"
                  value={this.state.overtime}
                  onChange={(event) => this.overtimeChangeHandler(event)}
                  onBlur={this.overtimeErrorHandler}
                  InputProps={{
                    inputComponent: percentFormatCustom,
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <InputField
                  id="wage"
                  error={this.state.errWage}
                  helperText={this.state.htWage}
                  label="Maximum Wage/Hour"
                  variant="outlined"
                  value={this.state.wage}
                  onChange={(event) => this.wageChangeHandler(event)}
                  onBlur={this.wageErrorHandler}
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
                onClick={this.cancelHandleOverTime}
                style={{ width: 208, height: 54, marginRight: "10px" }}
              >
                Cancel
              </SecondaryButton>
              <PrimaryButton
                variant="contained"
                color="primary"
                type="submit"
                onClick={this.handleOvertime}
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
              onClick={this.handleOvertime}
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

export default OvertimeSetting;
