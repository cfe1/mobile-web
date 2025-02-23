import { Grid, makeStyles } from "@material-ui/core";
import React, { Component } from "react";
import {
  PrimaryButton,
  InputField,
  Toast,
  Loader,
  SecondaryButton,
  Select,
} from "../../../components";
import { Axios, LAxios } from "../../../../api/apiConsts";
import NumberFormat from "react-number-format";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { FormControl } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

const styles = {
  root: {},
  title: {
    marginBottom: 9,
  },
  breadcrumbs: {
    marginBottom: 23,
  },
  tabs: {
    marginBottom: 30,
  },
  paper: {
    padding: 30,
    marginBottom: 30,
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
  facilityImagePreview: {
    borderRadius: 10,
    marginRight: 20,
    height: 82,
    width: 82,
    objectFit: "cover",
  },
  icon: {
    left: 10,
    top: 5
  },
  iconOpen: {
    transform: 'none'
  },
  formControlLabel: {
    left: 24
  },
  selectSelect: {
    paddingLeft: '12px'
  }
};

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

export class AgaliaInfo extends Component {
  state = {
    loading: false,
    editMode: false,
    EIN: "",
    htEIN: "",
    errEIN: false,
    name: "",
    htName: "",
    errName: false,
    addressLine1: "",
    htAddressLine1: "",
    errAddressLine1: false,
    addressLine2: "",
    htAddressLine2: "",
    errAddressLine2: false,
    city: "",
    htCity: "",
    errCity: false,
    zipCode: "",
    htZip: "",
    errZip: false,
    state: "",
    htState: "",
    errState: false,
    country: "",
    countryID: "",
    countries: [],
    stateID: "",
    states: [],
  };


  componentDidMount = () => {
    this.getAgaliaInfoData();
    this.getCountry();
  };

  cancelHandleAgaliaData = () => {
    this.setState({
      editMode: false,
    });
    this.getAgaliaInfoData();
  };
  getAgaliaInfoData = () => {
    this.setState({ loading: true });
    Axios.get(`/agalia-info-setting`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let data = response.data.data;
          this.setState({
            EIN: data.ein_no,
            name: data.name,
            zipCode: data.address.zipcode,
            addressLine1: data.address.address_line1,
            addressLine2: data.address.address_line2,
            city: data.address.city,
            state: data.address.state.name,
            country: data.address.country.name,
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

  getCountry = () => {
    this.setState({ loading: true });
    LAxios.get(`/common/country`)
      .then((response) => {
        this.setState({ loading: false });

        if (response.status === 200) {
          let countries = response.data.data.map((country) => {
            return {
              label: country.name,
              value: country.name,
              id: country.id,
            };
          });
          this.setState({ countries: countries }, () => {

            if (countries.length === 1) {
              this.setState(
                { country: countries[0].value, countryID: countries[0].id },
                () => {
                  this.getStates(countries[0].id);
                }
              );
            }
          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  getStates = (id) => {
    this.setState({ loading: true });
    LAxios.get(`/common/state/${id}`)
      .then((response) => {
        this.setState({ loading: false });

        if (response.status === 200) {

          let states = response.data.data.map((state) => {
            return {
              label: state.name,
              value: state.name,
              id: state.id,
            };
          });
          this.setState({ states: states }, () => {

          });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  updateProfile = (values) => {
    this.setState({ loading: true });
    const { countries, states } = this.state;
    let c = countries.filter(
      (country) => country["label"] === values.country.name
    );
    let s = states.filter((state) => state["label"] === values.state.name);
    const payload = {
      ein_no: values.einNumber,
      name: values.name,
      address: {
        address_line1: values.address_line1,
        address_line2: values.address_line2,
        city: values.city,
        state: s[0].id,
        zipcode: values.zipcode,
      },
    };

    Axios.patch(`agalia-info-setting`, payload)
      .then((response) => {
        this.setState({ loading: false, editMode: false });

        if (response.data.statusCode === 200) {
          Toast.showInfoToast("Agalia Informations Upated Successfully.");
          this.setState({ loading: false });
          this.getAgaliaInfoData();
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

  render() {

    const { classes } = this.props;
    return (
      <div>
        {this.state.loading && <Loader />}
        <Grid container spacing={3} style={{ marginTop: 10 }}>
          {this.state.editMode === false && (
            <>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Name</div>
                  <div className="info">{this.state.name}</div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">EIN Number</div>
                  <div className="info">{this.state.EIN}</div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Address</div>
                  <div className="info">{`${this.state.addressLine1},  ${this.state.addressLine2}, ${this.state.city} `}</div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">State</div>
                  <div className="info">{this.state.state}</div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Country</div>
                  <div className="info">{this.state.country}</div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="fd-info">
                  <div className="title">Zip Code</div>
                  <div className="info">{this.state.zipCode}</div>
                </div>
              </Grid>
            </>
          )}

          {this.state.editMode === true && (
            <>
              <Formik
                initialValues={{
                  name: this.state.name ?? "",

                  einNumber: this.state.EIN ?? "",

                  address_line1: this.state.addressLine1 ?? "",
                  address_line2: this.state.addressLine2 ?? "",
                  city: this.state.city ?? "",

                  zipcode: this.state.zipCode ?? "",

                  stateID: "",
                  state: { name: this.state.state ?? "" },

                  country: { name: this.state.country ?? "" },
                  countryID: "",
                  stateID: "",
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string().required("Name is required"),

                  einNumber: Yup.string()
                    .required("EIN is required")
                    .test("valid", "Please enter a valid EIN number", (val) =>
                      [...val].every((c) => "0123456789".includes(c))
                    )
                    .test(
                      "len",
                      "EIN Number should be 9 digits long",
                      (val) => val.length === 9
                    ),

                  address_line1: Yup.string().required(
                    "Address Line 1 is required"
                  ),
                  city: Yup.string().required("City is required"),

                  zipcode: Yup.number()
                    .required("Zipcode is required")
                    .test(
                      "is_valid_zipcode",
                      "Please enter valid zip code",
                      (val) => {
                        var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(val);

                        if (!isValidZip) {
                          return false;
                        } else {
                          return true;
                        }
                      }
                    ),
                })}
                onSubmit={(values) => {
                  this.updateProfile(values);
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  setFieldValue,
                  values,
                  errors,
                  touched,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <InputField
                            type="text"
                            label="Facility Name"
                            variant="outlined"
                            fullWidth
                            value={values.name}
                            onChange={handleChange("name")}
                            onBlur={handleBlur("name")}
                            error={touched.name && errors.name}
                            helperText={touched.name && errors.name}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <InputField
                            type="text"
                            label="EIN Number"
                            variant="outlined"
                            fullWidth
                            value={values.einNumber}
                            onChange={handleChange("einNumber")}
                            onBlur={handleBlur("einNumber")}
                            error={touched.einNumber && errors.einNumber}
                            helperText={touched.einNumber && errors.einNumber}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <InputField
                            type="text"
                            label="Street - line 1*"
                            variant="outlined"
                            fullWidth
                            value={values.address_line1}
                            onChange={handleChange("address_line1")}
                            onBlur={handleBlur("address_line1")}
                            error={
                              touched.address_line1 && errors.address_line1
                            }
                            helperText={
                              touched.address_line1 && errors.address_line1
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <InputField
                            type="text"
                            label="Street - line 2 (optional)"
                            variant="outlined"
                            fullWidth
                            value={values.address_line2}
                            onChange={handleChange("address_line2")}
                            onBlur={handleBlur("address_line2")}
                            error={
                              touched.address_line2 && errors.address_line2
                            }
                            helperText={
                              touched.address_line2 && errors.address_line2
                            }
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <InputField
                            type="text"
                            label="City*"
                            variant="outlined"
                            fullWidth
                            value={values.city}
                            onChange={handleChange("city")}
                            onBlur={handleBlur("city")}
                            error={touched.city && errors.city}
                            helperText={touched.city && errors.city}
                          />
                        </Grid>

                        <Grid item xs={4}>
                          <Select
                            id="country"
                            label="Country*"
                            fullWidth
                            items={this.state.countries}
                            value={values.country.name}
                            onChange={(value) => {
                              setFieldValue("country", { name: value });
                              let c = this.state.countries.filter(
                                (country) => country["label"] === value
                              );
                              this.getStates(c[0].id);
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <FormControl variant="outlined" fullWidth>
                            <Select
                              id="state"
                              label="State"
                              items={this.state.states}
                              fullWidth
                              value={values.state.name}
                              onChange={(value) => {

                                setFieldValue("state", { name: value });
                              }}
                              onBlur={handleBlur("state")}
                              error={touched.state && errors.state}
                              helperText={touched.state && errors.state}
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={4}>
                          <InputField
                            type="number"
                            label="Zip code*"
                            variant="outlined"
                            fullWidth
                            value={values.zipcode}
                            onChange={handleChange("zipcode")}
                            onBlur={handleBlur("zipcode")}
                            error={touched.zipcode && errors.zipcode}
                            helperText={touched.zipcode && errors.zipcode}
                          />
                        </Grid>
                      </Grid>
                    </>
                    {this.state.editMode === true && (
                      <div className="sett-cta">
                        <SecondaryButton
                          variant="contained"
                          color="primary"
                          onClick={this.cancelHandleAgaliaData}
                          style={{
                            width: 208,
                            height: 54,
                            marginRight: "10px",
                          }}
                        >
                          Cancel
                        </SecondaryButton>
                        <PrimaryButton
                          variant="contained"
                          color="primary"
                          type="submit"
                          style={{ width: 208, height: 54 }}
                        >
                          Update
                        </PrimaryButton>
                      </div>
                    )}
                  </form>
                )}
              </Formik>
            </>
          )}
        </Grid>

        {this.state.editMode === false && (
          <div className="sett-cta">
            <PrimaryButton
              variant="contained"
              color="primary"
              type="submit"
              onClick={() =>
                this.setState({
                  editMode: true,
                })
              }
              style={{ width: 208, height: 54 }}
            >
              Edit
            </PrimaryButton>
          </div>
        )}
      </div>
    );
  }
}

export default AgaliaInfo;
