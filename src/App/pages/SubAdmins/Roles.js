import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, TextField, Typography } from "@material-ui/core";
import { NewDialogModal } from "App/components/modal/NewDialogModal";
import { SwitchButton, Toast } from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import { apiErrorHandler } from "utils/apiUtil";

const useStyles = makeStyles((theme) => ({
  dialog: {
    maxWidth: "600px",
    borderRadius: 9,
  },
  infosAccess: {
    marginTop: "17px",
  },
  infoAccess: {
    marginBottom: "22px",
    "& .title": {
      fontSize: "13px",
      fontWeight: 600,
      color: "#82889C",
      marginBottom: "17px",
      textTransform: "capitalize",
    },
  },
  accessContainer: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
  },
  accessContent: {
    display: "flex",
    marginRight: "29px",
    "& .title": {
      fontSize: "14px",
      fontWeight: 600,
      color: "#131523",
      marginRight: "24px",
      textTransform: "capitalize",
      minWidth: "44px",
    },
  },
  switch: {
    marginLeft: "8px",
  },
  formContainer: {
    // padding: "24px",
  },
  hr: {
    height: 1,
    background: "#DDDFE6",
  },
  inputContainer: {
    marginBottom: "24px",
  },
  roleLabel: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#131523",
    marginBottom: "8px",
  },
  textField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#E5E7EB",
      },
      "&:hover fieldset": {
        borderColor: "#B8BCCA",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#FF0083",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "12px 16px",
      fontSize: "14px",
      "&::placeholder": {
        color: "#9CA3AF",
        opacity: 1,
      },
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      fontSize: "12px",
    },
  },
}));

const Roles = ({
  setisOpenNew,
  onSubmit,
  isLoading = false,
  setOpenRolesCreataion,
  facilityId,
  onRoleCreated,
  selectedRowId,
  onClose,
}) => {
  console.log(selectedRowId);
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [acls, setAcls] = useState([]);
  const [roleValues, setRoleValues] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [errorRoleName, setErrorRoleName] = useState(false);
  const [roleNameHelperText, setRoleNameHelperText] = useState("");

  useEffect(() => {
    fetchRoles();
  }, []);

  const preventNumbers = (e) => {
    if (e.key >= "0" && e.key <= "9") {
      e.preventDefault();
    }
  };

  const roleNameChangeHandler = (event) => {
    setRoleName(event.target.value);
    if (event.target.value.trim() !== "") {
      setErrorRoleName(false);
      setRoleNameHelperText("");
    }
  };

  const roleErrorHandler = () => {
    if (roleName.trim() === "") {
      setErrorRoleName(true);
      setRoleNameHelperText("Role name is required");
    }
  };

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = selectedRowId
        ? await API.get(ENDPOINTS.GET_ROLE_DETAILS(selectedRowId))
        : await API.get("facilities/features?page_size=40");

      console.log(response);
      if (response.statusCode === 200) {
        console.log(
          !selectedRowId ? response?.data?.results : response.data.acls
        );
        const transformedData = (
          !selectedRowId ? response?.data?.results : response.data.acls
        ).map((el) => ({
          feature: selectedRowId ? el.feature.id : el.id,
          name: selectedRowId ? el.feature.name : el.name,
          acl: el.acl.map((acl) => ({
            key: acl.key,
            title: acl.title,
            value: acl.value || false,
          })),
        }));

        if (selectedRowId) {
          setRoleName(response.data.name);
        }

        setAcls(transformedData);
        setRoleValues(transformedData);
      }
    } catch (error) {
      setLoading(false);
      Toast.error(apiErrorHandler(error));
    } finally {
      setLoading(false);
    }
  };

  const addRoles = async () => {
    if (roleName.trim() === "") {
      setErrorRoleName(true);
      setRoleNameHelperText("Role name is required");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        acls,
        name: roleName,
        facility_id: facilityId,
        is_active: true,
      };

      const response = !selectedRowId
        ? await API.post(ENDPOINTS.ADD_ROLE, payload)
        : await API.patch(ENDPOINTS.PATCH_ROLE(selectedRowId), payload);
      console.log(response);
      if (response.success === true) {
        Toast.showInfoToast("Role created successfully");
        setOpenRolesCreataion(false);
        onRoleCreated();
      }
    } catch (error) {
      console.log(error);
      apiErrorHandler(error);
      Toast.showErrorToast(apiErrorHandler(error));
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setActive(e);
    handleAclSwitch(e, null, null);
  };

  const handleAclSwitch = (e, f, key) => {
    if (f === null && key === null) {
      setActive(e);
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl: feat.acl.map((acl) => ({
            ...acl,
            value: e,
          })),
        }))
      );
      return;
    }

    const updateAclsWithKeys = (keyArr) => {
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl:
            f === feat.feature
              ? feat.acl.map((acl) => ({
                  ...acl,
                  value: keyArr.includes(acl.key) ? e : acl.value,
                }))
              : feat.acl,
        }))
      );
    };

    if (key === "is_create" && e === true) {
      updateAclsWithKeys(["is_create", "is_view"]);
    } else if (key === "is_update" && e === true) {
      updateAclsWithKeys(["is_create", "is_view", "is_update"]);
    } else if (key === "is_delete" && e === true) {
      updateAclsWithKeys(["is_view", "is_update", "is_delete"]);
    } else if (key === "is_assign_employee" && e === true) {
      updateAclsWithKeys(["is_view", "is_assign_employee"]);
    } else if (key === "is_process" && e === true) {
      updateAclsWithKeys(["is_view", "is_process"]);
    } else if (key === "is_export" && e === true) {
      updateAclsWithKeys(["is_view", "is_export"]);
    } else if (key === "is_hire" && e === true) {
      updateAclsWithKeys(["is_view", "is_hire"]);
    } else if (
      key === "is_view" &&
      e === false &&
      acls.some(
        (feat) =>
          feat.feature === f &&
          feat.acl.some((acl) => acl.key === "is_view" && acl.value === true)
      )
    ) {
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl:
            f === feat.feature
              ? feat.acl.map((acl) => ({
                  ...acl,
                  value: e,
                }))
              : feat.acl,
        }))
      );
    } else {
      setAcls((prevAcls) =>
        prevAcls.map((feat) => ({
          ...feat,
          acl:
            f === feat.feature
              ? feat.acl.map((acl) => ({
                  ...acl,
                  value: key === acl.key ? e : acl.value,
                }))
              : feat.acl,
        }))
      );
    }
  };

  const handleSubmit = () => {
    addRoles();
  };

  return (
    <NewDialogModal
      dialogCls={classes.dialog}
      heading={`${selectedRowId ? "Edit" : "Create"} Role`}
      isBackBtnNeeded={true}
      onBack={onClose}
      closeCrossBtnNeeded={false}
      onClose={onClose}
      handleConfirm={handleSubmit}
      loading={loading || isLoading}
      isConfirmDisable={loading || isLoading}
    >
      <div className={classes.formContainer}>
        <div className={classes.inputContainer}>
          <Typography className={classes.roleLabel}>Role</Typography>
          <TextField
            placeholder="Enter Here"
            variant="outlined"
            value={roleName}
            onChange={roleNameChangeHandler}
            onKeyPress={preventNumbers}
            onBlur={roleErrorHandler}
            error={errorRoleName}
            helperText={roleNameHelperText}
            className={classes.textField}
            inputProps={{
              "aria-label": "role name",
            }}
          />
        </div>
      </div>
      <div className={classes.infosAccess}>
        <div className={classes.infoAccess}>
          <div className={classes.accessContainer}>
            <div className={classes.accessContent}>
              <div className="title">Select All</div>
              <div className={classes.switch}>
                <SwitchButton
                  value={active}
                  onChange={handleChange}
                  color="#FF0083"
                  width={28}
                  height={16}
                  handleDiameter={14}
                />
              </div>
            </div>
          </div>
        </div>
        {acls.map((role) => (
          <div key={role.feature} className={classes.infoAccess}>
            <div className="title">{role.name}</div>
            <div className={classes.accessContainer}>
              {role.acl.map((acl) => (
                <div key={acl.key} className={classes.accessContent}>
                  <div className="title">{acl.title}</div>
                  <div className={classes.switch}>
                    <SwitchButton
                      value={acl.value}
                      onChange={(checked) =>
                        handleAclSwitch(checked, role.feature, acl.key)
                      }
                      color="#FF0083"
                      width={28}
                      height={16}
                      handleDiameter={14}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.hr}></div>
          </div>
        ))}
      </div>
    </NewDialogModal>
  );
};

export default Roles;
