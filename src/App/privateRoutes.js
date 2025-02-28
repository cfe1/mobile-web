import React from "react";

import MODULES from "./moduleList";

const Dashboard = React.lazy(() => import("./pages/NewDashboard"));

const Profile = React.lazy(() => import("./pages/profile"));
const EditProfile = React.lazy(() => import("./pages/profile/editProfile"));

const Settings = React.lazy(() => import("./pages/Settings"));
const HddpTracker = React.lazy(() => import("./pages/HppdTracker"));
const SubAdmins = React.lazy(() => import("./pages/SubAdmins"));
const Notifications = React.lazy(() =>
  import("./pages/Notifications/notifications")
);
const FacilityDetails = React.lazy(() => import("./pages/FacilityDetails"));
const ErrorPage = React.lazy(() => import("./pages/404/404"));

const routes = [
  {
    path: "/dashboard",
    key: "CODE_BOARD",
    exact: true,
    name: "Dashboard",
    module: MODULES.DASHBOARD,
    checkAccess: false,
    component: Dashboard,
  },
  {
    path: "/dashboard/facility-details/:id",
    key: "facilityDetails",
    exact: true,
    name: "Facility Details",
    module: MODULES.FACILITYDETAILS,
    component: FacilityDetails,
  },
  {
    path: "/notifications",
    key: "notifications",
    exact: true,
    name: "Notifications",
    module: MODULES.NOTIFICATIONS,
    checkAccess: false,
    component: Notifications,
  },

  {
    path: "/profile",
    key: "profile",
    exact: true,
    name: "Profile",
    module: MODULES.PROFILE,
    checkAccess: false,
    component: Profile,
  },
  {
    path: "/profile/edit",
    key: "profile",
    exact: true,
    name: "Edit Profile",
    module: MODULES.PROFILE,
    checkAccess: false,
    component: EditProfile,
  },
  {
    path: "/settings",
    key: "settings",
    exact: true,
    name: "Settings",
    module: MODULES.SETTINGS,
    checkAccess: false,
    component: Settings,
  },
  {
    path: "/hppd-tracker",
    key: "hppdTracker",
    exact: true,
    name: "HPPD TRACKER",
    module: MODULES.HddpTracker,
    checkAccess: false,
    component: HddpTracker,
  },
  {
    path: "/sub-admins",
    key: "hppdTracker",
    exact: true,
    name: "SUB ADMINS",
    module: MODULES.SUBADMIN,
    checkAccess: false,
    component: SubAdmins,
  },
  {
    path: "*",
    key: "error",
    exact: true,
    name: "404",
    component: ErrorPage,
  },
];

export default routes;
