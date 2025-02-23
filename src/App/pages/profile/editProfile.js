import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import Link from "@material-ui/core/Link";
import { Link as Route } from "react-router-dom";
import UploadIcon from "../../assets/icons/upload-image.png";
import {
  PrimaryButton,
  InputField,
  Dropdown,
  CancelButton,
  Datepicker,
  PhoneInputField,
  Loader,
  Toast,
  DeleteModal,
  SecondaryButton,
} from "../../components";
import "../pages.scss";
import { FormControl, InputLabel, MenuItem } from "@material-ui/core";
import { Axios } from "../../../api/apiConsts";
import moment from "moment";
import Avatar from "react-avatar-edit";
import { connect } from "react-redux";
import { updateInfo, updateProfile } from "../../../redux/actions/authActions";
import DefaultImage from "../../assets/icons/profile_default.svg";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
// import { API, ENDPOINTS } from "../../../api/apiService"

const styles = {
  base1: {
    color: "#9C00BA",
  },
  base2: {
    position: "absolute",
    top: "-2.5%",
    left: "72%",
    color: "white",
  },
  base3: {
    width: "102%",
  },
  updateButton: {
    height: 48,
    marginLeft: 12,
  },
  cancelButton: {
    height: 48,
  },
};

export class EditProfile extends Component {
  state = {
    gender: "",
    loading: false,
    firstName: "",
    errorFirstName: false,
    firstNameHelperText: "",
    secondName: "",
    errorSecondName: false,
    secondNameHelperText: "",
    mobile: "",
    errorMobile: false,
    mobileHelperText: "",
    email: "",
    errorEmail: false,
    emailHelperText: "",
    birthDate: new Date("October 14, 2002 23:15:30"),
    imageRemoved: false,
    open: false,
    heading: "",
    subHeading: "",
    modalOpen: false,
    modalAlertOpen: false,
    image: null,
    imageLink: null,
    preview: null,
    src: null,
    display: "block",
    showUploadIcon: false,
  };

  componentDidMount = () => {
    this.getProfileDetails();
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
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

  mobileChangeHandler = (event) => {
    let str = event.target.value;
    this.setState({ mobile: str.slice(2) });
  };

  mobileErrorHandler = () => {
    let regexMob = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/;
    if (this.state.mobile.match(regexMob)) {
      this.setState({ errorMobile: false, mobileHelperText: "" });
    } else {
      this.setState({
        errorMobile: true,
        mobileHelperText: "Please enter a valid phone number",
      });
    }
  };

  emailChangeHandler = (event) => {
    this.setState({ email: event.target.value });
    let regexEmail = /\S+@\S+\.\S+/;
    if (event.target.value.match(regexEmail)) {
      this.setState({ errorEmail: false, emailHelperText: "" });
    } else {
      this.setState({
        errorEmail: true,
        emailHelperText: "Please enter a valid Email",
      });
    }
  };
  handleDateChange = (date) => {
    this.setState({ birthDate: date });
  };

  genderChangeHandler = (e) => {
    this.setState({ gender: e.target.value });
  };

  imageChangeHandler = (e) => {
    this.setState({ image: e.target.files[0] });
  };

  removeImageHandler = () => {
    this.setState({ loading: true });
    Axios.delete(`facilities/manager/profile`)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          this.setState({ imageRemoved: true, imageLink: null }, () => {
            this.props.updateProfile(
              {
                profile_photo: null,
              },
              () => {}
            );
          });
          this.handleClose();
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
          // this.setState(
          //   {
          //     heading: "Error!",
          //     subHeading: error.response.data.error.message[0],
          //   },
          //   () => {
          //     this.handleAlertModalOpen();
          //   }
          // );
          Toast.showErrorToast(error.response.data.error.message[0]);
        }
      });
  };

  fetchProfile = async () => {
    const resp = await Axios.get(`facilities/manager/profile`);
    if (resp.success) {
      this.props.updateProfile(resp.data);
    }
  };

  handleImageRemove = async () => {
    this.setState({ loading: true });

    const payload = new FormData();

    payload.set("profile_photo", "");

    try {
      const resp = await Axios.patch(`facilities/manager/profile`, payload, {
        "Content-Type": "multipart/form-data",
      });
      if (resp.data.success) {
        this.setState({ imageRemoved: true, imageLink: null }, () => {
          this.props.updateProfile({
            profile_photo: null,
          });
          this.handleClose();
        });
        // this.fetchProfile();
      }
    } catch (e) {
      Toast.showErrorToast("Error removing profile photo.");
    } finally {
      this.setState({ loading: false });
    }
  };

  updateImageHandler = () => {
    this.setState({ loading: true });
    var file = new File([this.state.image], "profile_photo", {
      lastModified: new Date(),
    });
    const packet = new FormData();
    packet.append("profile_photo", file);
    Axios.patch(`facilities/manager/profile`, packet)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          this.getImage();
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

  getImage = () => {
    this.setState({ loading: true });
    Axios.get("facilities/manager/profile")
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let profile = response.data.data;

          this.setState(
            {
              imageLink: profile.profile_photo,
            },
            () => {
              if (this.state.imageLink === null) {
                this.setState({ imageRemoved: true });
              }
            }
          );
          this.props.updateProfile(
            {
              profile_photo: profile.profile_photo,
            },
            () => {}
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  getProfileDetails = () => {
    this.setState({ loading: true });
    Axios.get("facilities/manager/profile")
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          let profile = response.data.data;
          let g = response.data.data.gender;
          let gender;
          if (g === "M") {
            gender = 3;
          } else if (g === "F") {
            gender = 2;
          } else {
            gender = 1;
          }
          this.setState(
            {
              firstName: profile.first_name,
              secondName: profile.last_name,
              mobile: profile.mobile,
              gender: gender,
              email: profile.email,
              birthDate: new Date(profile.dob),
              imageLink: profile.profile_photo,
            },
            () => {
              if (this.state.imageLink === null) {
                this.setState({ imageRemoved: true });
              }
            }
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  updateProfileHandler = () => {
    if (
      this.state.firstName === "" ||
      this.state.secondName === "" ||
      this.state.mobile === "" ||
      this.state.errorFirstName === true ||
      this.state.errorSecondName === true ||
      this.state.errorMobile === true
    ) {
      this.mobileErrorHandler();
      this.firstNameErrorHandler();
      this.secondNameErrorHandler();
    } else {
      this.setState({ loading: true });
      let gender = this.state.gender;
      if (gender === 1) {
        gender = "O";
      } else if (gender === 2) {
        gender = "F";
      } else if (gender === 3) {
        gender = "M";
      }
      const packet = {
        first_name: this.state.firstName,
        last_name: this.state.secondName,
        gender: gender,
        country_code: "+1",
        mobile: this.state.mobile.replace(/\D/g, ""),
        dob: moment(this.state.birthDate).format("YYYY-MM-DD"),
      };
      Axios.patch(`facilities/manager/profile`, packet)
        .then((response) => {
          this.setState({ loading: false });
          if (response.data.statusCode === 200) {
            this.props.updateInfo({
              first_name: packet.first_name,
              last_name: packet.last_name,
            });
            Toast.showInfoToast("Profile Updated Successfully.");
            this.props.history.push("/profile");
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

  onClose = () => {
    this.setState({ preview: null });
  };

  onCrop = (preview) => {
    let file;
    fetch(preview)
      .then((res) => res.blob())
      .then((res) => {
        file = res;

        this.setState({ preview: URL.createObjectURL(file), image: file });
      });
  };

  onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 15728640) {
      alert("File is too big!");
      elem.target.value = "";
    }
  };

  onFileLoad = () => {
    this.setState({ showUploadIcon: true });
  };

  onUpload = () => {
    this.updateImageHandler();
    this.setState({ display: "none", imageRemoved: false });
  };

  render() {
    const { loading } = this.state;
    const { classes } = this.props;
    return (
      <>
        <div className="module-nav">
          <div className="mls">
            <div className="module-title">Edit Profile</div>
            <div className="module-breadcrumb">
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" component={Route} to={"/"}>
                  Agalia
                </Link>
                <Link color="inherit" component={Route} to={"/profile"}>
                  Profile
                </Link>
                <Typography className={classes.base1}>Edit Profile</Typography>
              </Breadcrumbs>
            </div>
          </div>
          <div className="mrs"></div>
        </div>

        <div className="fc-container">
          {loading && <Loader />}
          <div className="fc-content">
            <div className="fc-heading">
              <span>Edit Profile</span>
            </div>
            <div className="p-img">
              {this.state.imageRemoved === false && (
                <>
                  <img
                    src={
                      this.state.imageLink === null
                        ? DefaultImage
                        : this.state.imageLink
                    }
                    alt="profile"
                    className="photo"
                  />
                  <CancelButton onClick={this.handleOpen}></CancelButton>
                </>
              )}

              {this.state.imageRemoved === true && (
                <div>
                  <Avatar
                    style={{ display: this.state.display }}
                    width={150}
                    height={150}
                    borderStyle={{
                      borderRadius: "50%",
                      border: "2px dashed rgb(151, 151, 151)",
                    }}
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    onFileLoad={this.onFileLoad}
                    label={<img src={UploadIcon} alt="Upload" />}
                    onBeforeFileLoad={this.onBeforeFileLoad}
                    src={this.state.src}
                  />
                  {this.state.showUploadIcon && (
                    <IconButton
                      onClick={this.onUpload}
                      className={classes.base2}
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                  )}
                </div>
              )}
            </div>

            <div className="fd-infos">
              <div className="fd-info">
                <InputField
                  className={classes.base3}
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
              </div>
              <div className="fd-info">
                <InputField
                  className={classes.base3}
                  id="secondName"
                  type="text"
                  error={this.state.errorSecondName}
                  helperText={this.state.secondNameHelperText}
                  label="Last Name*"
                  variant="outlined"
                  value={this.state.secondName}
                  onChange={(event) => this.secondNameChangeHandler(event)}
                  onBlur={this.secondNameErrorHandler}
                  fullWidth
                />
              </div>
              <div className="fd-info">
                <PhoneInputField
                  className={classes.base3}
                  id="phone"
                  type="text"
                  label="Phone Number"
                  variant="outlined"
                  value={this.state.mobile}
                  error={this.state.errorMobile}
                  helperText={this.state.mobileHelperText}
                  onChange={(event) => this.mobileChangeHandler(event)}
                  onBlur={this.mobileErrorHandler}
                  fullWidth
                />
              </div>

              <br />
              <div className="fd-info">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Datepicker
                    inputVariant="outlined"
                    className={classes.base3}
                    label="Date of Birth*"
                    format="MM/dd/yyyy"
                    disableFuture={true}
                    value={this.state.birthDate}
                    onChange={this.handleDateChange}
                    maxDate={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      )
                    }
                  ></Datepicker>
                </MuiPickersUtilsProvider>
              </div>
              <div className="fd-info">
                <FormControl variant="outlined" className={classes.base3}>
                  <InputLabel
                    id="dropdown-label"
                    variant="outlined"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    Gender
                  </InputLabel>
                  <Dropdown
                    style={{ height: 56 }}
                    labelId="dropdown-label"
                    id="dropdown"
                    label="Gender"
                    value={this.state.gender}
                    onChange={this.genderChangeHandler}
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      transformOrigin: {
                        vertical: "top",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null,
                    }}
                  >
                    <MenuItem value={1}>Others</MenuItem>
                    <MenuItem value={2}>Female</MenuItem>
                    <MenuItem value={3}>Male</MenuItem>
                  </Dropdown>
                </FormControl>
              </div>
            </div>
          </div>
        </div>
        <div className="ec-btn">
          <SecondaryButton
            variant="contained"
            className={classes.cancelButton}
            onClick={() => {
              this.props.history.push({
                pathname: "/profile",
              });
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            variant="contained"
            color="primary"
            className={classes.updateButton}
            type="submit"
            onClick={this.updateProfileHandler}
          >
            Update
          </PrimaryButton>
        </div>
        <DeleteModal
          open={this.state.open}
          handleClose={this.handleClose}
          heading={"Remove Image"}
          subHeading={`Are you sure you want to remove this image?`}
          confirm={this.handleImageRemove}
        ></DeleteModal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateInfo: (data) => dispatch(updateInfo(data)),
  updateProfile: (data) => dispatch(updateProfile(data)),
});
export default connect(
  null,
  mapDispatchToProps
)(withStyles(styles)(EditProfile));
