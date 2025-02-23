import React, { Component } from "react";
import { Typography, withTheme } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";

import {
  InputField,
  PasswordField,
  PrimaryButton,
  Loader,
  Toast,
} from "../../components";

import { loginSuccess } from "../../../redux/actions/authActions";

import AgaliaBanner from "./components/AgaliaBanner";
import styles from "./auth.module.scss";
import { AuthAxios, LAxios } from "../../../api/apiConsts";
import { setupToken, DeleteFirebaseToken } from "../../../firebase";
import { handlePermission } from "../../../APN";
import StorageManager from "../../../storage/StorageManager";
import { API_TOKEN, ROLE, AGALIA_ID } from "../../../storage/StorageKeys";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rememberMe: false,
      passwordVisible: false,
      alertMessage: "",
      loading: false,
    };
  }

  componentDidMount = async () => {
    await DeleteFirebaseToken();
    if (StorageManager.get(API_TOKEN)) {
      this.props.history.replace("/dashboard");
    }
  };

  toggleRememberMe = () =>
    this.setState({ rememberMe: !this.state.rememberMe });

  togglePasswordVisible = () =>
    this.setState({ passwordVisible: !this.state.passwordVisible });

  handleLogin = async (email, password) => {
    this.setState({ alertMessage: "", loading: true });
    const packet = {
      email: email,
      password: password,
      device_type: "WEB",
      device_token: await setupToken(),
    };
    AuthAxios.post(`owner/login`, packet)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          const { role, token, agalia_id } = response.data.data;
          StorageManager.put(API_TOKEN, token);
          StorageManager.put(AGALIA_ID, agalia_id);
          // StorageManager.put(ROLE, JSON.stringify(role));
          this.props.loginSuccess({
            profile: response.data.data.profile,
            token: response.data.data.token,
            is_profile_complete: response.data.data.is_profile_complete,
          });
          if (window.safari) {
            let data = window.safari.pushNotification.permission(
              "web.com.admin.goagalia"
            );
            if (data.permission === "granted") {
              handlePermission(this.updateNotificationToken);
            } else {
              this.props.history.replace("/dashboard");
            }
          } else {
            this.props.history.replace("/dashboard");
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if ([400, 405, 422, 403].includes(error?.response?.data?.statusCode)) {
          Toast.showErrorToast(error.response.data.error.message[0]);
        }
      });
  };

  updateNotificationToken = async (token) => {
    const packet = {
      device_token: token,
      is_safari: true,
      is_safari_permit: true,
    };

    LAxios.patch(`auth/user/update-device-token`, packet)
      .then((response) => {
        if (response.data.statusCode === 200) {
          this.props.history.replace("/dashboard");
        }
      })
      .catch((error) => {
        if (error.response.status !== 500) {
          if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
            Toast.showErrorToast(error.response.data.error.message[0]);
          }
        }
      })
      .finally(() => {});
  };

  render() {
    const { passwordVisible, loading } = this.state;
    const { theme } = this.props;
    return (
      <div className={styles.rootContainer}>
        {loading && <Loader />}
        <div className={styles.mainContainer}>
          <div className={styles.formContainer}>
            <Typography variant="h4">Login</Typography>
            <br />
            <span className="text-muted p2" style={{ paddingTop: 17 }}>
              Please enter your credentials and login to your owner platform.
            </span>
            <div style={{ marginTop: 74 }}>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email("Wrong email format!")
                    .required("Email is required"),
                  password: Yup.string()
                    .required("Password is required")
                    .min(8, "Minimum password length is 8 characters"),
                })}
                onSubmit={({ email, password }) => {
                  this.handleLogin(email, password);
                }}
              >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                  <form onSubmit={handleSubmit}>
                    <InputField
                      id="email"
                      type="text"
                      label="Email address"
                      variant="outlined"
                      onChange={handleChange("email")}
                      error={touched.email && errors.email}
                      helperText={touched.email && errors.email && errors.email}
                      fullWidth
                    />
                    <PasswordField
                      id="password"
                      label="Password"
                      variant="outlined"
                      showPassword={passwordVisible}
                      togglePassword={this.togglePasswordVisible}
                      onChange={handleChange("password")}
                      error={touched.password && errors.password}
                      helperText={
                        touched.password && errors.password && errors.password
                      }
                      style={{ marginTop: 22 }}
                      fullWidth
                    />
                    <span
                      style={{
                        float: "right",
                        color: theme.palette.primary.main,
                      }}
                      onClick={() =>
                        this.props.history.push("/auth/reset-password")
                      }
                      className="cursor-pointer label"
                    >
                      Forgot Password?
                    </span>
                    {/* <PasswordSwitch
                      isOn={rememberMe}
                      onToggle={this.toggleRememberMe}
                      label="Remember me?"
                      style={{ marginTop: 22 }}
                    /> */}
                    <PrimaryButton
                      style={{ marginTop: 74 }}
                      type="submit"
                      wide="true"
                    >
                      Login
                    </PrimaryButton>
                  </form>
                )}
              </Formik>
            </div>
          </div>
          <AgaliaBanner />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  loginSuccess: (data) => dispatch(loginSuccess(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(Login));
