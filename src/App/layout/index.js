import React, { Component, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import Loader from "../components/Loader";
import AppContainer from "./AppContainer";
import routes from "../privateRoutes";
import { connect } from "react-redux";
import StorageManager from "../../storage/StorageManager";

class Layout extends Component {
  render() {
    let routeEnableList = [
      "CODE_BOARD",
      "profile",
      "settings",
      "notifications",
      "error",
      "facilityDetails",
      "hppdTracker",
    ];

    const role = JSON.parse(StorageManager.get("ROLE"));

    const menu = routes
      .filter((ele) => {
        if (routeEnableList.includes("CODE_FULL")) {
          //if user is admin we need not to add any filter
          return true;
        } else {
          return routeEnableList.includes(ele.key);
        }
      })
      .map((route, index) => {
        return route.component ? (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            render={(props) => {
              return <route.component {...props} />;
            }}
          />
        ) : null;
      });

    return (
      <AppContainer>
        <Suspense fallback={<Loader />}>
          <Switch>{menu}</Switch>
        </Suspense>
      </AppContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    roleInfo: state.admin.roleInfo,
  };
}

export default connect(mapStateToProps)(Layout);
