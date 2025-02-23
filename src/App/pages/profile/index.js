import React, { Component } from "react";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import {
  Link as Route
 } from "react-router-dom";
import { EditButton,Loader } from "../../components";
import "../pages.scss";
import { Axios } from "../../../api/apiConsts";
import moment from "moment";
import DefaultImage from "../../assets/icons/profile_default.svg";


export class Profile extends Component {
  state = {
    profileData: null,
    gender: null,
    loading: false,
  };

  editBtnHandler = () => {
    this.props.history.push("/profile/edit");
  };

  componentDidMount = () => {
    this.getProfileDetails();
  };

  getProfileDetails = () => {
    this.setState({ loading: true });
    Axios.get("facilities/manager/profile")
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          
          let g = response.data.data.gender;
          let gender;
          if (g === "M") {
            gender = "Male";
          } else if (g === "F") {
            gender = "Female";
          } else {
            gender = "Others";
          }
          this.setState(
            { profileData: response.data.data, gender: gender },
            () => {}
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };
  render() {
    const { loading } = this.state;
    return (
      <>
        <div className="module-nav">
          <div className="mls">
            <div className="module-title">My Profile</div>
            <div className="module-breadcrumb">
              <Breadcrumbs separator="›" aria-label="breadcrumb">
               <Link color="inherit" component={Route} to={"/"}>
                  Agalia
                </Link>
                <Typography style={{ color: "#9C00BA" }}>My Profile</Typography>
              </Breadcrumbs>
            </div>
          </div>
          <div className="mrs"></div>
        </div>
        <div className="fc-container">
        {loading && <Loader />}
          <div className="fc-content">
            <div className="fc-heading">
              <span>Profile Information</span>
              <EditButton onClick={this.editBtnHandler}></EditButton>
            </div>
            {this.state.profileData !== null && (
              <>
                <div className="p-img">
                  <img onError={DefaultImage} src={this.state.profileData.profile_photo?this.state.profileData.profile_photo:DefaultImage} alt="profile" className="photo"/>
                </div>
                <div className="fd-infos">
                  <div className="fd-info">
                    <div className="title">Name</div>
                    <div className="info">{`${this.state.profileData.first_name} ${this.state.profileData.last_name}`}</div>
                  </div>
                  <div className="fd-info">
                    <div className="title">Status</div>
                    <div className="info">
                      {this.state.profileData.is_active === true
                        ? "Active"
                        : "Inactive"}
                    </div>
                  </div>
                  <div className="fd-info">
                    <div className="title">Date of Birth</div>
                    <div className="info">
                      {moment(this.state.profileData.dob).format("DD MMM YYYY")}
                    </div>
                  </div>
                  <br />
                  <div className="fd-info">
                    <div className="title">Phone Number</div>
                    <div className="info">{`${this.state.profileData.country_code} ${this.state.profileData.mobile}`}</div>
                  </div>
                  <div className="fd-info">
                    <div className="title">Email Address</div>
                    <div className="info">{this.state.profileData.email}</div>
                  </div>
                  <div className="fd-info">
                    <div className="title">Gender</div>
                    <div className="info">{this.state.gender}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
