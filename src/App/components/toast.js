import React from "react";
import { toast } from "react-toastify";
import POPUP from "../assets/icons/POPUP.svg";
import "./toast.scss";

const showErrorToast = (message) => {
  toast.error(message, {
    position: "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "custom-toast",
  });
};

const showInfoToast = (message) => {
  toast.info(
    <div className="base1">
      <div>
        <img src={POPUP} alt="icon" />
      </div>
      <div className="base2">{message}</div>
    </div>,
    {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: "toast-custom-info",
    }
  );
};

const showWarnToast = (message, position) => {
  toast.warn(message, {
    position: position ? position : "bottom-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    className: "toast-custom-warn",
  });
};

const Toast = {
  showErrorToast,
  showInfoToast,
  showWarnToast,
};

export default Toast;
