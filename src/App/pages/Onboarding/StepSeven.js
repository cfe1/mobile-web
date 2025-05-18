import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Typography, CircularProgress } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 600,
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    fontSize: "1.2rem",
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(4),
  },
  dropzone: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(4),
    borderRadius: theme.spacing(1),
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#F83E7D",
    backgroundColor: "#FFF5F9",
    color: "#F83E7D",
    outline: "none",
    transition: "border .24s ease-in-out",
    cursor: "pointer",
    marginBottom: theme.spacing(4),
    minHeight: 150,
    textAlign: "center",
  },
  activeDropzone: {
    borderColor: "#F83E7D",
    backgroundColor: "#FFE6F0",
  },
  previewContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(4),
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #F83E7D",
  },
  uploadText: {
    color: "#F83E7D",
    fontWeight: 500,
    marginBottom: theme.spacing(1),
  },
  formatText: {
    color: theme.palette.text.secondary,
    fontSize: "0.9rem",
  },
  continueButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    backgroundColor: "#F83E7D",
    color: "white",
    "&:hover": {
      backgroundColor: "#E52D6A",
    },
    "&:disabled": {
      backgroundColor: "#F83E7D",
      opacity: 0.7,
      color: "white",
    },
  },
  skipButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "#F83E7D",
    border: "1px solid #F83E7D",
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "rgba(248, 62, 125, 0.05)",
    },
  },
  backButton: {
    padding: theme.spacing(1.5),
    borderRadius: theme.spacing(1),
    fontSize: "1.1rem",
    textTransform: "none",
    marginTop: theme.spacing(2),
    color: "#F83E7D",
    backgroundColor: "transparent",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(248, 62, 125, 0.05)",
      boxShadow: "none",
    },
  },
  uploadIcon: {
    fontSize: 40,
    marginBottom: theme.spacing(1),
    color: "#F83E7D",
  },
}));

export const StepSeven = ({ profileData, updateProfile, loading, onBack }) => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Check if profile photo already exists
  useEffect(() => {
    if (profileData?.profile_photo) {
      setPreviewUrl(profileData.profile_photo);
    }
  }, [profileData]);

  // Set up dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: "image/jpeg, image/jpg, image/png, image/gif", // Older react-dropzone format
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setSelectedFile(file);

        // Create preview URL
        const fileURL = URL.createObjectURL(file);
        setPreviewUrl(fileURL);
      }
    },
  });

  // Handle continue with file upload
  const handleContinue = () => {
    if (selectedFile) {
      // Create FormData
      const formData = new FormData();
      formData.append("profile_photo", selectedFile);

      // Use updateProfile from parent component
      updateProfile(formData);
    }
  };

  // Handle skip
  const handleSkip = () => {
    // Just move to the next step without uploading anything
    updateProfile({});
  };

  return (
    <div className={classes.formContainer}>
      <Typography className={classes.title}>Profile Image</Typography>
      <Typography className={classes.subtitle}>
        You can take photo with your computer camera or upload an image from
        your device.
      </Typography>

      {previewUrl ? (
        <div className={classes.previewContainer}>
          <img
            src={previewUrl}
            alt="Profile Preview"
            className={classes.preview}
          />
        </div>
      ) : null}

      <div
        {...getRootProps()}
        className={`${classes.dropzone} ${
          isDragActive ? classes.activeDropzone : ""
        }`}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon className={classes.uploadIcon} />
        <Typography className={classes.uploadText}>
          Click to upload or drag and drop
        </Typography>
        <Typography className={classes.formatText}>
          jpeg, jpg, png, gif
        </Typography>
      </div>

      <Button
        fullWidth
        variant="contained"
        className={classes.continueButton}
        disabled={!selectedFile || loading}
        onClick={handleContinue}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Continue"}
      </Button>

      <Button
        fullWidth
        variant="outlined"
        className={classes.skipButton}
        disabled={loading}
        onClick={handleSkip}
      >
        Skip
      </Button>

      <Button
        fullWidth
        className={classes.backButton}
        onClick={onBack}
        disabled={loading}
      >
        Back
      </Button>
    </div>
  );
};
