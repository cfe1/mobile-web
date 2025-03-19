import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import { API, ENDPOINTS } from "api/apiService";
import { apiErrorHandler } from "utils/apiUtil";
import { Toast } from "App/components";

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: "#F3F4F7",
    padding: theme.spacing(2),
  },
  dialogContent: {
    padding: theme.spacing(3),
  },
  formField: {
    marginBottom: theme.spacing(3),
  },
  actionButton: {
    height: 44,
    margin: theme.spacing(1),
  },
  saveButton: {
    backgroundColor: "#FF0083",
    color: "white",
    "&:hover": {
      backgroundColor: "#FF0083",
    },
  },
  errorText: {
    color: "#f44336",
    fontSize: "0.75rem",
    marginTop: "3px",
    marginLeft: "14px",
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
    width: 300,
    "& .MuiOutlinedInput-root": {
      width: 300,
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
}));

const ChangePasswordModal = ({ open, handleClose, subAdminId, subAdminName, subAdminEmail }) => {
  const classes = useStyles();
  const [formState, setFormState] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setFormState({
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  }, [open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formState.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formState.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }
    
    if (!formState.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formState.newPassword !== formState.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const payload = {
        email: subAdminEmail,
        password: formState.newPassword,
      };
      
      const resp = await API.patch(ENDPOINTS.CHANGE_SUBADMIN_PASSWORD(subAdminId), payload);
      
      if (resp.success) {
        Toast.showSuccessToast("Password changed successfully");
        handleClose();
      }
    } catch (e) {
      apiErrorHandler(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle className={classes.dialogTitle}>
        Change Password for {subAdminName}
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {/* Hidden fields to trick browser autofill */}
        <div style={{ display: 'none' }}>
          <input type="text" name="username" autoComplete="username" />
          <input type="password" name="password" autoComplete="current-password" />
        </div>
        
        <div className={classes.inputRow}>
          <div className={classes.inputLabel}>New Password</div>
          <TextField
            variant="outlined"
            name="newPassword"
            type={showNewPassword ? "text" : "password"}
            value={formState.newPassword}
            onChange={handleInputChange}
            placeholder="Enter New Password"
            className={classes.inputField}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility("new")}
                    edge="end"
                    aria-label="toggle password visibility"
                    size="small"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
        
        <div className={classes.inputRow}>
          <div className={classes.inputLabel}>Confirm Password</div>
          <TextField
            variant="outlined"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formState.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            className={classes.inputField}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
            autoComplete="new-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility("confirm")}
                    edge="end"
                    aria-label="toggle password visibility"
                    size="small"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          className={classes.actionButton}
          variant="outlined"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className={`${classes.actionButton} ${classes.saveButton}`}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;