import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import { BrowserRouter } from "react-router-dom";

import "./firebase";

import App from "./App/index";
import * as serviceWorker from "./serviceWorker";
import {registerServiceWorker} from "./serviceWorker";

import { persistor, store } from "./redux/store";
// this is a comment

const app = (
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

serviceWorker.register();
registerServiceWorker();
