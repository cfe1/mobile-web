import React, { Component } from "react";
import "../../pages.scss";
import { PrimaryButton, Modal, PasswordField,Toast,Loader } from "../../../components";
import { Axios } from "../../../../api/apiConsts";

export class ChangePassword extends Component {
  state = {
    pv1: false,
    pv2: false,
    pv3: false,
    e1: false,
    e2: false,
    e3: false,
    h1: "",
    h2: "",
    h3: "",
    modalOpen: false,
    modalAlertOpen:false,
    heading: "",
    subHeading: "",
    oldPassword: "",
    newPassword: "",
    verifyPassword: "",
    loading:false
  };

  togglePasswordVisible(keyName, e) {
    this.setState({ [keyName]: !e });
  }
  handleChange = (event, p_type) => {
    if (p_type === "old_password") {
      this.setState({ oldPassword: event.target.value });
    } else if (p_type === "new_password") {
      this.setState({ newPassword: event.target.value });

    } else if (p_type === "verify_password") {
      this.setState({ verifyPassword: event.target.value });
   
     }
  };

  OPErrorHandler=()=>{
      if(this.state.oldPassword===""){
        this.setState({e1:true, h1:"Old Password is required."}) 
      }
     else if(this.state.oldPassword.length<8){
          
          this.setState({e1:true, h1:"Minimum password length is 8 characters."})
      }
      else{
        this.setState({e1:false, h1:""})
      }
  }
  NPErrorHandler=()=>{
    if(this.state.newPassword===""){
        this.setState({e2:true, h2:"New Password is required."}) 
    }
    else if(this.state.newPassword.length<8){
        this.setState({e2:true, h2:"Minimum password length is 8 characters."}) 
    }
    else{
        this.setState({e2:false, h2:""})
      }
    if(this.state.verifyPassword.length>0){
        this.VPErrorHandler()
    }
  }

  VPErrorHandler=()=>{
      if(this.state.newPassword!==this.state.verifyPassword){
        this.setState({e3:true, h3:"Confirm Password did not match with New Password."})
      }else{
        this.setState({e3:false, h3:""})
      }

  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true });
  };
  handleModalClose = () => {
    this.setState({ modalOpen: false },()=>{
        this.props.history.push("/auth/login")
    });
  };
  handleAlertModalOpen = () => {
    this.setState({ modalAlertOpen: true });
  };
  handleAlertModalClose = () => {
    this.setState({ modalAlertOpen: false });
  };
  handleChangePassword = () => {
      if(this.state.oldPassword==="" || this.state.newPassword==="" || this.state.verifyPassword==="" || this.state.e1===true || this.state.e2===true || this.state.e3===true){
          this.NPErrorHandler();
          this.OPErrorHandler();
          this.VPErrorHandler();
      }
      else{
        this.setState({loading:true})
        const packet = {
            current_password: this.state.oldPassword,
            new_password: this.state.newPassword
          };
          Axios.patch(`/change-password`, packet)
            .then((response) => {
              this.setState({loading:false})
                
              if (response.data.statusCode === 200) {
                
                Toast.showInfoToast("Password Updated Successfully.")
              }
            })
            .catch((error) => {
              this.setState({loading:false})
              
              if(error.response.status!==500){
                if ([400,405,422,403].includes(error.response.data.statusCode)) {
                 
                  Toast.showErrorToast(error.response.data.error.message[0])
                }
              }
             
            });
      }
   
  };
  render() {
    const {loading} = this.state;
    return (
      <>
        {loading && <Loader/>}
        <div className="line1">
          <PasswordField
            id="p1"
            label="Old Password*"
            variant="outlined"
            showPassword={this.state.pv1}
            togglePassword={() => {
              this.togglePasswordVisible("pv1", this.state.pv1);
            }}
            onChange={(event) => {
              this.handleChange(event, "old_password");
            }}
            value={this.state.oldPassword}
            error={this.state.e1}
            helperText={this.state.h1}
            style={{ marginTop: 22, width: 323, height: 62 }}
            onBlur={this.OPErrorHandler}
          />
        </div>
        <div className="line2">
          <PasswordField
            id="p2"
            label="New Password*"
            variant="outlined"
            value={this.state.newPassword}
            showPassword={this.state.pv2}
            togglePassword={() => {
              this.togglePasswordVisible("pv2", this.state.pv2);
            }}
            onChange={(event) => {
              this.handleChange(event, "new_password");
            }}
            error={this.state.e2}
            helperText={this.state.h2}
            style={{
              marginTop: 22,
              width: 323,
              height: 62,
              marginRight: 30,
            }}
            onBlur={this.NPErrorHandler}
          />
          <PasswordField
            id="p3"
            label="Confirm Password*"
            variant="outlined"
            value={this.state.verifyPassword}
            showPassword={this.state.pv3}
            togglePassword={() => {
              this.togglePasswordVisible("pv3", this.state.pv3);
            }}
            onChange={(event) => {
              this.handleChange(event, "verify_password");
            }}
            error={this.state.e3}
            helperText={this.state.h3}
            style={{ marginTop: 22, width: 323, height: 62 }}
            onBlur={this.VPErrorHandler}
          />
        </div>
        <div className="sett-cta">
          <PrimaryButton
            variant="contained"
            color="primary"
            type="submit"
            onClick={this.handleChangePassword}
            style={{ width: 208, height: 54 }}
          >
            Change Password
          </PrimaryButton>
        </div>
        <Modal
          open={this.state.modalOpen}
          handleClose={this.handleModalClose}
          heading={this.state.heading}
          subHeading={this.state.subHeading}
          confirm={this.handleModalClose}
          type="success"
          hideCancelBtn={true}
        ></Modal>
         <Modal
          open={this.state.modalAlertOpen}
          handleClose={this.handleAlertModalClose}
          heading={this.state.heading}
          subHeading={this.state.subHeading}
          confirm={this.handleAlertModalClose}
          type="alert"
          hideCancelBtn={true}
        ></Modal>
      </>
    );
  }
}

export default ChangePassword;
