import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { makeStyles } from "@material-ui/core/styles";
import { InputField, MultiSelect, Toast } from "App/components";
import { useModal } from "App/hooks";
import { ModalTypes } from "App/constants/ModalConstants";
import { SelectFacilities } from "./SelectFacilities";
import { Grid } from "@material-ui/core";
export const AddRecipient = ({
  allRecipients,
  setAllRecipients,
  recipient,
  isEdit,
  formRef,
  handleCancel,
}) => {
  const { openModal, closeModal, actionType, isOpen } = useModal() || {};

  const getError = (errorText) => {
    return <span className="error-text">{errorText}</span>;
  };

  const handleEdit = (values) => {
    const prevAllRecepients = [...allRecipients];

    // Since the search filtering is done, need to find the original index while editing the values
    const newRIndex = allRecipients.findIndex(
      (reci) => reci.uniqueId === recipient.uniqueId
    );

    if (
      allRecipients.find(
        (reci, index) => index !== newRIndex && values.email === reci.email
      )
    ) {
      Toast.showErrorToast(
        `Another recipient has same email. Please change the email.`
      );
      return;
    }

    prevAllRecepients[newRIndex] = { ...values, uniqueId: Date.now() };
    setAllRecipients(prevAllRecepients);
    handleCancel();
  };

  const handleAdd = (values) => {
    if (allRecipients.find((obj) => obj.email === values.email)) {
      Toast.showErrorToast(
        `Another recipient has same email. Please change the email.`
      );
      return;
    }
    setAllRecipients([...allRecipients, { ...values, uniqueId: Date.now() }]);
    formik.resetForm();
  };

  const handleAddRecipient = (values) => {
    if (isEdit) handleEdit(values);
    else handleAdd(values);
  };

  let formik = useFormik({
    initialValues: {
      name: recipient?.name || "",
      email: recipient?.email || "",
      facilities: recipient?.facilities || [],
      timeFrame: recipient?.timeFrame || [],
      facilityListing: recipient?.facilityListing || [],
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required."),
      email: Yup.string()
        .email("Invalid email")
        .required("Email ID is required"),
      facilities: Yup.array()
        // .min(1, "At least one facility must be selected.")
        .required("Facilities cannot be empty."),
      timeFrame: Yup.array()
        .min(1, "At least one time frame must be selected.")
        .required("Time frame cannot be empty."),
    }),
    onSubmit: (values) => {
      // Do something with values
      handleAddRecipient(values);
    },
  });

  const {
    handleChange,
    handleBlur,
    setFieldError,
    setFieldValue,
    values,
    errors,
    touched,
  } = formik || {};

  const ONLY_CHAR_REGEX = /^[a-zA-Z_ ]+$/;
  const { facilityListing } = values || {};
  const classes = useStyles();
  return (
    <>
      <form>
        <div className="flex flex-col gap-10">
          <Grid container className="flex gap-4 mt-10">
            <Grid item xs={3} className="flex flex-col gap-10">
              {!isEdit && <span className="text-14 text-500">Name</span>}
              <InputField
                id="name"
                placeholder="Name"
                variant="outlined"
                fullWidth={true}
                value={values?.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                className="name-input-field"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
                onKeyDown={(event) => {
                  if (!ONLY_CHAR_REGEX.test(event.key)) {
                    setFieldError("name", "Only alphabets can be entered");
                    event.preventDefault();
                  }
                }}
              />
            </Grid>

            <Grid item xs={3} className="flex flex-col gap-10">
              {!isEdit && <span className="text-14 text-500">Email</span>}

              <InputField
                id="email"
                placeholder="Email"
                variant="outlined"
                fullWidth={true}
                value={values?.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                className="name-input-field"
                error={touched.email && errors.email}
                helperText={touched.email && errors.email}
              />
            </Grid>

            <Grid item xs={3} className="flex flex-col gap-10">
              {!isEdit && <span className="text-14 text-500">Facilities</span>}
              <div
                className={`select-here-facility ${
                  facilityListing?.length > 0 && "text-600"
                }`}
                onClick={() => openModal(ModalTypes.EDIT)}
              >
                {facilityListing.length === 0 && "Select Here"}
                {facilityListing.length > 0 ? (
                  <span className="ellipsis">{`${facilityListing[0].name} ${
                    facilityListing.length > 1
                      ? ` + ${facilityListing.length - 1}`
                      : ""
                  }`}</span>
                ) : (
                  <></>
                )}
              </div>

              {values.facilities?.length === 0 &&
                touched.facilities &&
                getError("Facilities cannot be empty")}
            </Grid>
            <Grid item xs={3} className="flex flex-col gap-10 grid-max-w">
              {!isEdit && <span className="text-14 text-500">Time Frame</span>}
              <MultiSelect
                label={"Select Time Frame"}
                items={[
                  {
                    label: "Daily",
                    value: "DAILY",
                  },
                  {
                    label: "Weekly",
                    value: "WEEKLY",
                  },
                ]}
                onSelect={(items) => {
                  setFieldValue("timeFrame", items);
                }}
                handleReset={() => setFieldValue("timeFrame", [])}
                selectedItems={values.timeFrame}
                onBlur={handleBlur("timeFrame")}
                helperText={touched.timeFrame && errors.timeFrame}
                className={classes.multiSelect}
                classes={{ root: classes.root }}
                popoverPaper={classes.popoverPaper}
                listRoot={classes.listRoot}
                formControlClasses={{ root: classes.formRoot }}
              ></MultiSelect>

              {touched.timeFrame &&
                errors.timeFrame &&
                getError(errors.timeFrame)}
            </Grid>
          </Grid>
          <span
            className={`cursor-pointer p-border-btn mt-10 w-fit ${
              isEdit && "hidden"
            }`}
            onClick={formik.handleSubmit}
            ref={formRef}
          >
            Add
          </span>
        </div>
      </form>
      {isOpen && actionType === ModalTypes.EDIT && (
        <SelectFacilities onClose={closeModal} formik={formik} />
      )}
    </>
  );
};

const useStyles = makeStyles(() => ({
  multiSelect: {
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    maxWidth: 208,
    // marginLeft: 7,
  },
  formRoot: {
    "& .MuiInputBase-root": {
      width: "100% !important",
      height: "100% !important",
      "& .MuiSelect-root": {
        fontSize: "13px !important",
        fontWeight: "700 !important",
      },
    },
    maxWidth: "200px !important",
    height: 46,
    "& .MuiOutlinedInput-root": {
      borderColor: "#FF0083",
      "&.Mui-focused fieldset": {
        borderColor: "#FF0083 !important",
      },
    },
    "& .MuiFormLabel-root.Mui-focused": {
      color: "#FF0083 !important",
    },
    "& label": {
      lineHeight: "8px",
      paddingLeft: "0px !important",
    },
  },
  popoverPaper: {
    padding: "10px !important",
    paddingBottom: "4px !important",
    minWidth: "175px !important",
  },
  listRoot: {
    paddingTop: 0,
    paddingBottom: 0,
    "& #staffings #items": {
      border: "none !important",
      background: "#F3F4F7",
      borderRadius: "4px",
      marginBottom: "8px",
      padding: "4px 10px !important",
      minHeight: "32px",
      "& .c1": {
        fontSize: "16px",
        fontWeight: "700",
        marginTop: "0px !important",
      },
      "& #checkbox": {
        marginTop: "5px",
      },
    },
    "& #staffings #reset": {
      display: "flex",
      justifyContent: "center",
      "& .c1": {
        color: "#FF0083",
        fontWeight: "700",
        fontSize: 16,
      },
    },
  },
}));
