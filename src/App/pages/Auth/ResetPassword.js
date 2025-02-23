import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  InputField,
  BackButton,
  PrimaryButton,
  Loader,
  Toast,
} from "../../components";

import AgaliaBanner from "./components/AgaliaBanner";
import EmailSent from "./components/EmailSent";

import styles from "./auth.module.scss";
import { AuthAxios } from "../../../api/apiConsts";

class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      emailSent: false,
      email: "",
      loading: false,
    };
  }

  handleSentRestLink = async (email) => {
    this.setState({ loading: true, email: email });
    const packet = {
      email: email,
    };
    AuthAxios.patch(`/forgot-password`, packet)
      .then((response) => {
        if (response.data.statusCode === 200) {
          this.setState({ emailSent: true, loading: false });
        }
      })
      .catch((error) => {
        this.setState({
          loading: false,
        });

        if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
          Toast.showErrorToast(error.response.data.error.message[0]);
        }
      });
  };

  resendEmailHandler = () => {
    this.setState({ loading: true });
    const packet = {
      email: this.state.email,
    };
    AuthAxios.patch(`/forgot-password`, packet)
      .then((response) => {
        this.setState({ loading: false });
        if (response.data.statusCode === 200) {
          this.setState({
            alertMessage: response.data.data.message[0],
            alerType: "success",
          });
          Toast.showInfoToast("Email Resent Successfully");
        }
      })
      .catch((error) => {
        this.setState({ loading: false });

        if ([400, 405, 422, 403].includes(error.response.data.statusCode)) {
          Toast.showErrorToast(error.response.data.data.message[0]);
        }
      });
  };

  render() {
    const { emailSent, loading } = this.state;
    return (
      <div className={styles.rootContainer}>
        {loading && <Loader />}
        <div className={styles.mainContainer}>
          <div className={styles.formContainer}>
            <div
              className="row-center cursor-pointer"
              onClick={() => this.props.history.goBack()}
            >
              <BackButton />
              <span className="c2">Back to login</span>
            </div>
            {emailSent ? (
              <div style={{ marginTop: 93 }}>
                <EmailSent
                  onResend={() => {
                    this.resendEmailHandler();
                  }}
                  onLoginClick={() => this.props.history.replace("/auth/login")}
                />
              </div>
            ) : (
              <>
                <Typography variant="h3" style={{ marginTop: 39 }}>
                  Forgot password?
                </Typography>
                <br />
                <span className="text-muted p2" style={{ marginTop: 17 }}>
                  Please enter your email below and we'll send a message to help
                  you reset your password.
                </span>
                <div style={{ marginTop: 55 }}>
                  <Formik
                    initialValues={{ email: "", password: "" }}
                    validationSchema={Yup.object().shape({
                      email: Yup.string().email("Wrong email format!"),
                    })}
                    onSubmit={({ email }) => {
                      this.handleSentRestLink(email);
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
                        <InputField
                          id="email"
                          type="text"
                          label="Email address"
                          variant="outlined"
                          onChange={handleChange("email")}
                          error={touched.email && errors.email}
                          helperText={
                            touched.email && errors.email && errors.email
                          }
                          fullWidth
                        />

                        <PrimaryButton
                          variant="contained"
                          color="primary"
                          style={{ marginTop: 148 }}
                          type="submit"
                          wide
                        >
                          Send
                        </PrimaryButton>
                      </form>
                    )}
                  </Formik>
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

export default ResetPassword;

