import React, { Component, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";
import { ThemeProvider } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Loader from "../App/components/Loader";
import AuthWrapper from "../hoc/AuthWrapper";

import publicRoutes from "./publicRoutes";

import "./theme/index.scss";
import { Axios, LAxios } from "../api/apiConsts";
import theme from "./theme/appTheme";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toast } from "./components";
import StorageManager from "../storage/StorageManager";
import { API_TOKEN } from "../storage/StorageKeys";
import { logoutSuccess } from "../redux/actions/authActions";
import { createBrowserHistory } from "history";
// Testing

const history = createBrowserHistory();
const Layout = Loadable({
  loader: () => import("./layout"),
  loading: Loader,
});

const Router = () => {
  const authPages = publicRoutes.map((route, index) => {
    return route.component ? (
      <Route
        key={index}
        path={route.path}
        exact={route.exact}
        component={route.component}
      />
    ) : null;
  });

  return (
    <Suspense fallback={<Loader />}>
      <Switch>
        <Redirect exact from="/" to="/dashboard" />
        {authPages}
        <AuthWrapper path="/" component={Layout} />
      </Switch>
    </Suspense>
  );
};

class App extends Component {

  componentDidMount = () => {
    // Create the script tag, set the appropriate attributes
    var script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}&callback=initMap`;
    script.defer = true;

    // Attach your callback function to the `window` object
    window.initMap = function () {
      // JS API is loaded and available
    };

    // Append the 'script' element to 'head'
    document.head.appendChild(script);
    Axios.interceptors.request.use(
      (config) => {
        config.headers.authorization = `Bearer ${StorageManager.get(
          API_TOKEN
        )}`;
        return config;
      },
      (error) => Promise.reject(error)
    );

    LAxios.interceptors.request.use(
      (config) => {
        config.headers.authorization = `Bearer ${StorageManager.get(
          API_TOKEN
        )}`;
        return config;
      },
      (error) => Promise.reject(error)
    );
    Axios.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      function (error) {
        // Do something with response error

        if (error?.response?.status === 500) {
          Toast.showErrorToast("Something Went Wrong!");
        }
        if ([401, 403].includes(error?.response?.status)) {
          history.push("/auth/login");
          window.location.reload();
          localStorage.clear();
          this.props.logoutSuccess();
        }
        return Promise.reject(error);
      }
    );
  };
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Router />
        <ToastContainer />
      </ThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};
const mapDispatchToProps = (dispatch) => ({
  logoutSuccess: () => dispatch(logoutSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
