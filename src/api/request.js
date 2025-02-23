import axios from "axios";
import StorageManager from "../storage/StorageManager";
import { API_TOKEN } from "../storage/StorageKeys";
import { baseURL } from "./apiConsts";

const request = async function (options, isTokenNeeded = true, customHeaders) {
  let headers = {
    "Content-Type": "application/json",
  };
  if (isTokenNeeded) {
    const authToken = StorageManager.get(API_TOKEN);
    headers = { ...headers, Authorization: `Bearer ${authToken}` };
  }

  if (customHeaders) {
    headers = { ...headers, ...customHeaders };
  }

  const client = axios.create({
    baseURL,
    headers,
    timeout: 30000, // 30 second timeout
  });

  const onSuccess = function (response) {
    console.debug("Request Successful!", response);
    return response.data;
  };

  const onError = function (error) {
    console.debug("Request Failed:", error.config);
    if (error.response) {
      // Request was made but server responded with something
      // other than 2xx
      if (error.response.status === 401) {
        window.location.href = "/auth/login";
        StorageManager.removeItem(API_TOKEN);
      }
      console.debug("Status:", error.response.status);
      console.debug("Data:", error.response.data);
      console.debug("Headers:", error.response.headers);
    } else {
      // Something else happened while setting up the request
      // triggered the error
      console.debug("Error Message:", error.message);
    }
    let errorMessage = "";
    // Request timeout case
    if (error.code === "ECONNABORTED") {
      errorMessage = "Error: Server timeout";
    }
    // No network case
    else if (!error.response && error.message) {
      errorMessage = error.message;
    }
    const errObj = {
      data: {
        error: errorMessage,
      },
    };
    return Promise.reject(error.response || errObj);
  };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
