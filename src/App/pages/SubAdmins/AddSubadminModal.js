import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { FormControl, TextField, IconButton } from "@material-ui/core";
import { NewDialogModal } from "App/components/modal/NewDialogModal";
import CustomMultiSelect from "App/components/CustomMultiSelect";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import { SwitchButton, Toast } from "App/components";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import Roles from "./Roles";

const AddSubadminModal = ({
  setisOpenNew,
  onSubmit,
  isLoading = false,
  handleCloseAddSubADmin,
  subAdminData,
}) => {
  const classes = useStyles(); // Form statec

  const [formData, setFormData] = useState(() => {
    if (subAdminData?.email) {
      // Split the name into first and last name
      const [firstName, ...lastNameParts] = subAdminData.name.split(" ");
      const lastName = lastNameParts.join(" "); // Format existing phone number if present

      let formattedMobile = "+1";
      if (subAdminData.mobile) {
        const digitsOnly = subAdminData.mobile.replace(/\D/g, "");
        if (digitsOnly) {
          formattedMobile = formatPhoneNumber(digitsOnly);
        }
      }

      return {
        first_name: firstName || "",
        last_name: lastName || "",
        email: subAdminData.email || "",
        mobile: formattedMobile,
      };
    }
    return {
      first_name: "",
      last_name: "",
      email: "",
      mobile: "+1",
    };
  }); // Form errors

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    facilities: "",
  });

  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const [facilityRows, setFacilityRows] = useState(() => {
    // If subAdminData exists and has facilities, map them
    if (subAdminData?.facilities?.length > 0) {
      return subAdminData.facilities.map((facility) => ({
        facility_id: facility?.facility_details?.facility_id,
        role: facility?.facility_details?.role?.role_id,
        is_active:
          facility?.facility_details?.subadmin_data?.subamdin_is_active,
        employee_id: facility?.employee_id,
        roleOptions: [], // Will be populated when roles are fetched
      }));
    } // Default state if no subAdminData
    return [{ facility_id: "", role: "", is_active: true, roleOptions: [] }];
  });
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [openRolesCreataion, setOpenRolesCreataion] = useState(false);
  useEffect(() => {
    getFacilityList(); // If subAdminData exists, fetch roles for each facility

    const fetchAllRoles = async () => {
      if (subAdminData?.facilities?.length > 0) {
        try {
          setLoading(true); // Create an array of promises for all API calls
          const rolePromises = subAdminData.facilities.map(
            async (facility, index) => {
              const params = {
                facility: facility?.facility_details?.facility_id,
              };
              const urlParams = queryString.stringify(params);

              const resp = await API.get(ENDPOINTS.FETCH_ROLES(urlParams));
              if (resp.success) {
                const roles = resp.data[0]?.roles?.map((role) => ({
                  value: role?.id,
                  label: role?.name,
                }));

                return {
                  index,
                  roles,
                  facilityId: facility.facility_details.facility_id,
                  roleId: facility?.facility_details?.role?.role_id,
                };
              }
              return null;
            }
          ); // Wait for all promises to resolve

          const results = await Promise.all(rolePromises); // Update state once with all results

          setFacilityRows((prevRows) => {
            const newRows = [...prevRows];
            results.forEach((result) => {
              if (result) {
                newRows[result.index] = {
                  ...newRows[result.index],
                  roleOptions: result.roles,
                  role: result.roleId || "",
                  facility_id: result.facilityId || "",
                };
              }
            });
            return newRows;
          });
        } catch (e) {
          Toast.showErrorToast(e.data?.error?.message[0]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAllRoles();
  }, []);
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) {
      newErrors.first_name = "First name is required";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    } // if (!formData.mobile.trim()) { //   newErrors.mobile = "Mobile number is required"; // } else if (!validatePhone(formData.mobile)) { //   newErrors.mobile = "Invalid mobile number"; // }

    const hasInvalidFacility = facilityRows.some(
      (row) => !row.facility_id || !row.role
    );
    if (hasInvalidFacility) {
      newErrors.facilities = "Please fill in all facility and role fields";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFacilityList = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.OWNER_FACILITY_LISTING);
      if (resp.success) {
        const facilitynames = resp.data.map((data) => ({
          value: data.id,
          label: data.name,
        }));
        setFacilities(facilitynames);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };

  const getRolesByFacility = async (facilityId, index, rollId) => {
    try {
      setLoading(true);
      const params = { facility: facilityId };
      const urlParams = queryString.stringify(params);

      const resp = await API.get(ENDPOINTS.FETCH_ROLES(urlParams));
      if (resp.success) {
        const roles = resp.data[0]?.roles?.map((role) => ({
          value: role?.id,
          label: role?.name,
        }));
        const rollIdExisting = facilityRows.find(
          (facility, facilityIndex) => facilityIndex === index
        ).role;
        const newFacilityRows = [...facilityRows];
        newFacilityRows[index] = {
          ...newFacilityRows[index],
          roleOptions: roles,
          role: rollIdExisting || "",
          facility_id: facilityId || "",
        };
        setFacilityRows(newFacilityRows);
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };
  const addAdminToFaciltiy = async (payload) => {
    try {
      setLoading(true);

      const resp = subAdminData?.email
        ? await API.patch(ENDPOINTS.PATCH_SUBADMIN, payload)
        : await API.post(ENDPOINTS.ADD_SUBADMIN, payload);
      if (resp?.success) {
        Toast.showInfoToast(resp?.data?.message);
        setisOpenNew(false);
        handleCloseAddSubADmin();
      }
    } catch (e) {
      Toast.showErrorToast(e.data?.error?.message[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === "mobile") {
      // Format phone number when it's the mobile field
      const formattedValue = formatPhoneNumber(value);
      setFormData((prev) => ({
        ...prev,
        [field]: formattedValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } // Clear error when user starts typing

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleAddFacility = () => {
    setFacilityRows([
      ...facilityRows,
      { facility_id: "", role: "", is_active: true, roleOptions: [] },
    ]);
  };

  const handleFacilityChange = (index, field, value) => {
    if (field === "facility_id" && value) {
      if (facilityRows.find((data) => data.facility_id === value)) {
        Toast.showErrorToast(
          "You cannot choose same facility twice. Please select another facility."
        );
        return;
      }
    }
    const newFacilityRows = [...facilityRows];
    newFacilityRows[index] = {
      ...newFacilityRows[index],
      [field]: value,
    };
    setFacilityRows(newFacilityRows);

    if (field === "facility_id" && value) {
      getRolesByFacility(value, index);
      setSelectedFacilityId(value);
      setSelectedRowIndex(index);
    } else if (field === "facility_id" && !value) {
      setSelectedFacilityId(null);
      setSelectedRowIndex(null);
    } // Clear facilities error when user makes a selection

    if (errors.facilities) {
      setErrors((prev) => ({
        ...prev,
        facilities: "",
      }));
    }
  };
  const handleRoleCreated = (newRole) => {
    if (selectedRowIndex !== null && selectedFacilityId) {
      // Refresh roles for the specific facility
      getRolesByFacility(selectedFacilityId, selectedRowIndex);
    }
  };

  const handleRemoveFacility = (index) => {
    const newFacilityRows = facilityRows.filter((_, i) => i !== index);
    setFacilityRows(newFacilityRows);
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submissionData = {
        ...formData,
        country_code: "+1",
        facility_role_data: facilityRows.map((row) => {
          const { employee_id = "" } = row || {};
          return {
            facility_id: row.facility_id,
            role: row.role,
            is_active: row.is_active,
            ...(employee_id && { employee_id }),
          };
        }),
        mobile: formData.mobile.replace(/\D/g, "").replace(/^1/, ""),
      };
      addAdminToFaciltiy(submissionData);
    }
  };
  function formatPhoneNumber(value) {
    // Remove everything except digits
    let digitsOnly = value.replace(/\D/g, ""); // Remove the country code if it exists at the start

    if (digitsOnly.startsWith("1")) {
      digitsOnly = digitsOnly.slice(1);
    } // Build the formatted number

    let formatted = "+1";

    if (digitsOnly.length > 0) {
      formatted += " (";
      formatted += digitsOnly.slice(0, 3);

      if (digitsOnly.length > 3) {
        formatted += ") ";
        formatted += digitsOnly.slice(3, 6);

        if (digitsOnly.length > 6) {
          formatted += "-";
          formatted += digitsOnly.slice(6, 10);
        }
      }
    }

    return formatted;
  }

  console.log({ facilityRows });
  return (
    <NewDialogModal
      dialogCls={classes.dialog}
      heading={subAdminData?.email ? "Details" : "Add New Sub Admin"}
      isBackBtnNeeded={true}
      onBack={handleCloseAddSubADmin}
      closeCrossBtnNeeded={false}
      onClose={handleCloseAddSubADmin}
      handleConfirm={handleSubmit}
      loading={isLoading || loading}
      isConfirmDisable={isLoading || loading}
    >
           {" "}
      <div className={classes.formContainer}>
               {" "}
        <div className={classes.formSection}>
                   {" "}
          <div className={classes.inputRow}>
                        <div className={classes.inputLabel}>First Name</div>   
                   {" "}
            <div>
                           {" "}
              <TextField
                variant="outlined"
                value={formData.first_name}
                onChange={(e) =>
                  handleInputChange("first_name", e.target.value)
                }
                placeholder="Enter Here"
                className={classes.inputField}
                error={!!errors.first_name}
                helperText={errors.first_name}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className={classes.inputRow}>
                        <div className={classes.inputLabel}>Last Name</div>     
                 {" "}
            <div>
                           {" "}
              <TextField
                variant="outlined"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
                placeholder="Enter Here"
                className={classes.inputField}
                error={!!errors.last_name}
                helperText={errors.last_name}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className={classes.inputRow}>
                        <div className={classes.inputLabel}>Email</div>         
             {" "}
            <div>
                           {" "}
              <TextField
                variant="outlined"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter Here"
                className={classes.inputField}
                error={!!errors.email}
                helperText={errors.email}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className={classes.inputRow}>
                        <div className={classes.inputLabel}>Number</div>       
               {" "}
            <div>
                           {" "}
              <TextField
                variant="outlined"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange("mobile", e.target.value)}
                placeholder="+1 (555) 555-5555"
                className={classes.inputField}
                error={!!errors.mobile}
                helperText={errors.mobile}
                inputProps={{
                  maxLength: 17,
                }}
              />
                         {" "}
            </div>
                     {" "}
          </div>
                 {" "}
        </div>
                <div className={classes.hr} />       {" "}
        <div>
                   {" "}
          <div className={classes.divContainer}>
                       {" "}
            <div className={classes.facilitiesLabel}>Facilities</div>           {" "}
            <div className={classes.facilitiesLabel}>Role</div>         {" "}
          </div>
                   {" "}
          {facilityRows.map((facility, index) => (
            <div key={index} className={classes.facilityRow}>
                           {" "}
              <FormControl className={classes.facilitySelect}>
                               {" "}
                <CustomMultiSelect
                  id={`facility-${index}`}
                  variant="outlined"
                  value={facility.facility_id}
                  onChange={(e) =>
                    handleFacilityChange(index, "facility_id", e.target.value)
                  }
                  needCreateRole={false}
                  options={facilities}
                  labelField="label"
                  valueField="value"
                  multiple={false}
                  fontSize={14}
                  placeholder="Select Here"
                  height={42}
                />
                             {" "}
              </FormControl>
                           {" "}
              <FormControl className={classes.roleSelect}>
                               {" "}
                <CustomMultiSelect
                  id={`role-${index}`}
                  variant="outlined"
                  value={facility.role}
                  onChange={(e) =>
                    handleFacilityChange(index, "role", e.target.value)
                  }
                  needCreateRole={true}
                  options={facility?.roleOptions}
                  labelField="label"
                  valueField="value"
                  multiple={false}
                  fullSelectDisable={!Boolean(facility?.facility_id)}
                  fontSize={14}
                  placeholder="Select Here"
                  showEditIcon={!!facility.facility_id}
                  handleEditClick={(e, itemIndex) => {
                    console.log(facility);
                    e.stopPropagation();
                    setSelectedRowId(facility?.roleOptions[itemIndex]?.value);
                    setOpenRolesCreataion(true);
                    setSelectedFacilityId(facility?.facility_id);
                  }}
                  onCreateRole={(e) => {
                    e.stopPropagation();
                    setSelectedFacilityId(facility?.facility_id);
                    setSelectedRowIndex(index);
                    setOpenRolesCreataion(true);
                  }}
                  disabled={!facility.facility_id}
                  height={42}
                />
                             {" "}
              </FormControl>
                           {" "}
              <div className={classes.switchContainer}>
                               {" "}
                <SwitchButton
                  value={facility.is_active}
                  onChange={() =>
                    handleFacilityChange(
                      index,
                      "is_active",
                      !facility.is_active
                    )
                  }
                  color="#086375"
                  width={28}
                  height={16}
                  handleDiameter={14}
                />
                             {" "}
              </div>
                           {" "}
              {facilityRows.length > 1 && (
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFacility(index)}
                >
                                   {" "}
                  <DeleteOutlineIcon className={classes.deleteIcon} />         
                       {" "}
                </IconButton>
              )}
                         {" "}
            </div>
          ))}
                   {" "}
          {errors.facilities && (
            <div className={classes.error}>{errors.facilities}</div>
          )}
                   {" "}
          <button className={classes.addButton} onClick={handleAddFacility}>
                        Add Facility and Role          {" "}
          </button>
                 {" "}
        </div>
             {" "}
      </div>
           {" "}
      {openRolesCreataion && (
        <Roles
          setOpenRolesCreataion={setOpenRolesCreataion}
          facilityId={selectedFacilityId}
          onRoleCreated={handleRoleCreated}
          selectedRowId={selectedRowId}
          onClose={() => {
            setOpenRolesCreataion(false);
            setSelectedRowId(null);
            setSelectedFacilityId(null);
          }}
        />
      )}
         {" "}
    </NewDialogModal>
  );
};

export default AddSubadminModal;

const useStyles = makeStyles((theme) => ({
  dialog: {
    maxWidth: "420px",
    borderRadius: 9,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  formSection: {
    // marginBottom: "24px",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
    justifyContent: "space-between",
  },
  inputLabel: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#434966",
  },
  inputField: {
    width: 200,
    "& .MuiOutlinedInput-root": {
      width: 200,
      fontSize: "14px",
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#2563EB",
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#E5E7EB",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "10px 14px",
      "&::placeholder": {
        // color: "#9CA3AF",
        color: "#08083D",
        opacity: 1,
      },
    },
    "& .MuiFormLabel-root": {
      display: "none",
    },
    "& .MuiFormHelperText-root": {
      marginLeft: 0,
      fontSize: "12px",
    },
  },
  facilityRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    gap: 16,
  },
  facilitySelect: {
    flex: 1,
    width: "155px", // marginRight: "16px",
  },
  roleSelect: {
    flex: 1,
    width: "155px", // marginRight: "16px",
  },
  switchContainer: {
    // width: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteIcon: {
    color: "#EF4444",
    fontSize: 20,
  },
  addButton: {
    color: "#00735D",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    padding: "8px",
    marginTop: "8px",
    width: "100%",
    height: 32,
    borderRadius: 7,
    border: "1px dotted rgba(8, 8, 61, 0.12)",
    background: "none",
    "&:hover": {
      backgroundColor: "rgba(255, 26, 140, 0.04)",
    },
  },
  facilitiesLabel: {
    color: "#82889C",
    fontSize: "12px",
    fontWeight: 500,
    marginBottom: "16px",
  },
  hr: {
    width: "100%",
    height: 1,
    backgroundColor: "#EDECF5",
    margin: "16px 0",
  },
  error: {
    color: "#EF4444",
    fontSize: "12px",
    marginTop: "4px",
  },
  divContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& div": {
      width: "50%",
    },
  },
}));
