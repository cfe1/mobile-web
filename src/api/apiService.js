import request from "./request";
import { ENDPOINTS } from "./apiRoutes";

function get(url, isTokenNeeded = true, customHeaders) {
  return request(
    {
      url,
      method: "GET",
      crossDomain: true,
    },
    isTokenNeeded,
    customHeaders
  );
}

function getBody(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "GET",
      crossDomain: true,
      data: body,
    },
    isTokenNeeded
  );
}

function post(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "POST",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded
  );
}

function uploadFile(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "POST",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded,
    {
      "Content-Type": "multipart/form-data",
    }
  );
}

function put(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "PUT",
      data: body,
    },
    isTokenNeeded
  );
}

function deleteResource(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "DELETE",
      crossDomain: true,
      data: body,
    },
    isTokenNeeded
  );
}

function patch(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "PATCH",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded
  );
}

function download(url, body, isTokenNeeded = true) {
  return request(
    {
      url,
      method: "GET",
      responseType: "blob",
      data: body,
      crossDomain: true,
    },
    isTokenNeeded
  );
}

const API = {
  get,
  post,
  put,
  patch,
  deleteResource,
  uploadFile,
  download,
  getBody,
};

export { API, ENDPOINTS };
