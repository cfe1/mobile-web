import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import { PasswordField, PrimaryButton, Loader,Toast } from "../../components";

import AgaliaBanner from "./components/AgaliaBanner";
import PasswordChanged from "./components/PasswordChanged";
import Alert from '@material-ui/lab/Alert';

import styles from "./auth.module.scss";
import {AuthAxios} from "../../../api/apiConsts";

class ChangePassword extends Component {
  constructor() {
    super();

    this.state = {
      passwordVisible: false,
      confirmPasswordVisible: false,
      passwordChanged: false,
      alertMessage:"",
      loading:false
    };
  }

  componentDidMount=()=>{
  }


  togglePasswordVisible = () =>
    this.setState({ passwordVisible: !this.state.passwordVisible });

  toggleConfirmPasswordVisible = () =>
    this.setState({
      confirmPasswordVisible: !this.state.confirmPasswordVisible,
    });

  handleSubmit = async ( password ) => {
    this.setState({loading:true})
    const packet={
      uidb64:this.props.match.params.uidb64,
      token:this.props.match.params.token,
      password:password
    }
    AuthAxios.patch(`/reset-password`, packet)
        .then((response) => {
          this.setState({loading:false})
          if (response.data.statusCode === 200) {
            
            this.setState({ passwordChanged: true });
            
          }
        })
        .catch((error) => {
          this.setState({loading:false})
          
          if ([400,405,422,403].includes(error.response.data.statusCode)) {
            Toast.showErrorToast(error.response.data.error.message[0])
          }
        })
   
    
    
  };

  render() {
    const {
      passwordVisible,
      confirmPasswordVisible,
      passwordChanged,
      loading,
    } = this.state;
    return (
      <div className={styles.rootContainer}>
        {loading && <Loader />}
        <div className={styles.mainContainer}>
          <div className={styles.formContainer}>
            {passwordChanged ? (
              <div style={{ marginTop: 93 }}>
                <PasswordChanged
                  onLoginClick={() => this.props.history.replace("/auth/login")}
                />
              </div>
            ) : (
              <>
                <Typography variant="h3">
                  Set new password
                </Typography>
                <br />
                <span className="text-muted p2" style={{ marginTop: 17 }}>
                  Please enter and confirm your new password
                </span>
                <div style={{ marginTop: 84 }}>
                  <Formik
                    initialValues={{ password: "", passwordConfirmation: "" }}
                    validationSchema={Yup.object().shape({
                      password: Yup.string()
                        .min(8, "Minimum password length is 8 characters")
                        .required("Password is required"),
                      passwordConfirmation: Yup.string()
                        .oneOf([Yup.ref("password")], "Passwords must match")
                        .required("Required"),
                    })}
                    onSubmit={({ password }) => {
                      this.handleSubmit(password);
                    }}
                  >
                    {({
                      handleChange,
                      handleSubmit,
                      values,
                      errors,
                      touched,
                    }) => (
                      <form onSubmit={handleSubmit}>
                        <PasswordField
                          id="password"
                          label="New Password"
                          variant="outlined"
                          showPassword={passwordVisible}
                          togglePassword={this.togglePasswordVisible}
                          onChange={handleChange("password")}
                          error={touched.password && errors.password}
                          helperText={
                            touched.password &&
                            errors.password &&
                            errors.password
                          }
                          style={{ marginTop: 22 }}
                          fullWidth
                        />

                        <PasswordField
                          id="confirmPassword"
                          label="Confirm Password"
                          variant="outlined"
                          showPassword={confirmPasswordVisible}
                          togglePassword={this.toggleConfirmPasswordVisible}
                          onChange={handleChange("passwordConfirmation")}
                          error={
                            touched.passwordConfirmation &&
                            errors.passwordConfirmation
                          }
                          helperText={
                            touched.passwordConfirmation &&
                            errors.passwordConfirmation
                          }
                          style={{ marginTop: 22 }}
                          fullWidth
                        />

                        <PrimaryButton
                          variant="contained"
                          color="primary"
                          style={{ marginTop: 156 }}
                          type="submit"
                          wide
                        >
                          Reset password
                        </PrimaryButton>
                      </form>
                    )}
                  </Formik>
                </div>
                <div className="alert-message" style={{marginTop:20, display:this.state.alertMessage!==""?"block":"none"}}>
                  <Alert severity="error">{this.state.alertMessage}</Alert>
                  </div>
              </>
            )}
          </div>
          <AgaliaBanner />
        </div>
      </div>
    );
  }
}

export default ChangePassword;
