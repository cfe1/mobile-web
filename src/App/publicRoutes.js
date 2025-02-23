import React from "react";

const Login = React.lazy(() => import("./pages/Auth/Login"));
const ResetPassword = React.lazy(() => import("./pages/Auth/ResetPassword"));
const ChangePassword = React.lazy(() => import("./pages/Auth/ChangePassword"));

const route = [
  { path: "/auth/login", exact: true, name: "Login", component: Login },
  {
    path: "/auth/reset-password",
    exact: true,
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/set-password/:uidb64/:token",
    exact: true,
    name: "ChangePassword",
    component: ChangePassword,
  },
];

export default route;
