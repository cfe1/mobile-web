const AUTH_ROUTES = {
  LOGIN: "auth/login/",
  LOGOUT: "auth/user/logout",
  SEND_RESET_PASSWORD_MAIL: "auth/sendResetPasswordMail",
  RESET_PASSWORD: "auth/resetPassword",
};

const HOME_ROUTES = {
  OWNER_FACILITY_LISTING: "owner/facility/list",
};
const DASHBOARD = {
  FETCH_STATS: (start_date, end_date, params) =>
    `owner/dashboard/${start_date}/${end_date}/stats/`,
  SHIFT_OPENINGS_TABLE_DATA: (start_date, end_date, params) =>
    `owner/dashboard/${start_date}/${end_date}/?${params}`,
  Week_Budget_Data: (facility_id, start_date, end_date) =>
    `owner/facility/${facility_id}/${start_date}/${end_date}/budget/`,
  STAT_DETAILS: (start_date, end_date, statKey, params) =>
    `owner/dashboard/${start_date}/${end_date}/stats/${statKey}/?${params}`,
  FETCH_FACILITIES: (start_date, end_date, params) =>
    `owner/dashboard/${start_date}/${end_date}/facilities/?${params}`,
  FETCH_FACILITY_DETAILS: (start_date, end_date, facility_id, params) =>
    `owner/dashboard/${start_date}/${end_date}/facilities/${facility_id}/weeks/?${params}`,
  FETCH_FACILITY_EMPLOYEE_DETAILS: (
    start_date,
    end_date,
    facility_id,
    params
  ) =>
    `owner/dashboard/${start_date}/${end_date}/facilities/${facility_id}/employees/?${params}`,
};

const PDF_SETTINGS = {
  FETCH_PDF_SETTINGS: `owner/pdf-settings/`,
};

const FACILITY_DETAILS = {
  FETCH_PROFILE: (facility_id) => `/owner/facility/${facility_id}/detail/`,
  FACILITY_LIMIT: (facility_id) => `/owner/metrics-limit/facility/${facility_id}/`,
  FACILITY_EMPLOYEES: (facility_id, urlParams) =>
    `owner/facility/${facility_id}/employees/?${urlParams}`,
  NURSE_TYPE_LISTING: (facility_id, start_date, end_date, urlParams) =>
    `owner/facility/${facility_id}/${start_date}/${end_date}/nurses/?${urlParams}`,
  FACILITY_DETAILS: (facility_id, start_date, end_date) =>
    `owner/facility/${facility_id}/${start_date}/${end_date}/detail/`,
  SCHEDULE_LISTING: (facility_id, start_date, end_date) =>
    `owner/facility/${facility_id}/${start_date}/${end_date}/schedules/`,
  NURSE_ACTION: (facility_id, nurse_id) =>
    `/owner/facility/${facility_id}/nurse/action/${nurse_id}/`,
};
const COMMON_API = {
  FETCH_JOB_TITLES: "common/job-titles",
};

const APPLICANTS_MODAL = {
  APPLICANTS_MODAT_STATS: (facilityId, startDate, endDate, params) =>
    `/owner/facility/${facilityId}/${startDate}/${endDate}/nurses/stats/?${params}`,
  EMPLOYEE_SHIFTS: (facilityId, employeeId, startDate, endDate, params) =>
    `/owner/facility/${facilityId}/employees/${employeeId}/schedules/${startDate}/${endDate}/`,
  FACILITY_SHIFTS: (facilityId, startDate, endDate, params) =>
    `/owner/facility/${facilityId}/shifts/${startDate}/${endDate}/?is_detailed=true&dashboard_2=true`,
  ASSIGN_SHIFTS: (facilityId, employeeId, endDate, params) =>
    `/owner/facility/${facilityId}/employees/${employeeId}/assign-shift/`,
};
const HDDP_TRACKER = {
  FETCH_ALL_DEPARTMENTS_NEW: "facilities/central-department/",
  HPPD_TRACKER_DETAILS: (params) => `owner/hppd_tracker/owner-dashboard/?${params}`,
  JOBTITLE_TRACKER_DETAILS: (params) => `owner/hppd_tracker/owner-dashboard-job-wise/?${params}`,
  UPDATE_JOBS: `/owner/hppd_tracker/job_title_target/`,
  UPDATE_JOBS_TRACK: (params) => `owner/hppd_tracker/owner-dashboard-facility-job-wise/${params}/`,
  GET_JOBTITLE_TRACKER_DETAILS: (params) => `owner/hppd_tracker/owner-dashboard-facility-job-wise?${params}`,
  HPPD_CENSUS_LISTING: (params) => `owner/census/?${params}`,
  HPPD_CENSUS_UPDATE: "owner/census/",
  HPPD_TARGET_UPDATE: "owner/hppd_tracker/",
  FETCH_HDDP_FACILITY: (facilityId,params) => `owner/hppd_tracker/${facilityId}?${params}`,

};
//Test
const ENDPOINTS = {
  ...AUTH_ROUTES,
  ...HOME_ROUTES,
  ...DASHBOARD,
  ...FACILITY_DETAILS,
  ...COMMON_API,
  ...APPLICANTS_MODAL,
  ...PDF_SETTINGS,
  ...HDDP_TRACKER,
};

export { ENDPOINTS };
