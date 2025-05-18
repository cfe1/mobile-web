import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { API, ENDPOINTS } from "api/apiService";
import queryString from "query-string";
import { Toast } from "App/components";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepFour } from "./StepFour";
import { StepFive } from "./StepFive";
import { StepSix } from "./StepSix";
import { StepSeven } from "./StepSeven";
import { StepEight } from "./StepEight";
import { StepNine } from "./StepNine";
const useStyles = makeStyles((theme) => ({
  onboardingContainer: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: theme.spacing(4),
  },
}));

const Onboarding = (props) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    // Check if we have data from location state or props
    const locationState = props.location?.state.data;
    console.log(locationState);
    const queryParams = queryString.parse(props.location?.search);

    // Initialize profile data from props or location state
    if (props.profileData) {
      setProfileData(props.profileData);
      setCurrentStep(parseInt(props.profileData.onboarding_step) || 1);
    } else if (locationState?.profile) {
      setProfileData(locationState.profile);
      //   setCurrentStep(parseInt(locationState.onboarding_step) || 1);
      setCurrentStep(8);
    } else if (queryParams?.step) {
      setCurrentStep(parseInt(queryParams.step) || 1);
      // If no profile data is available, we may need to fetch it
      fetchProfileData();
    } else {
      // If no step info is available, fetch profile data
      fetchProfileData();
    }
  }, [props]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await API.get(ENDPOINTS.UPDATE_PROFILE);
      if (response?.success) {
        setProfileData(response.data);
        // setCurrentStep(parseInt(response.data.onboarding_step) || 1);
      }
    } catch (error) {
      Toast.showErrorToast(
        error.data?.error?.message[0] || "Failed to fetch profile data"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      const response = await API.patch(ENDPOINTS.UPDATE_PROFILE, data);
      if (response?.success) {
        // Update local profile data
        setProfileData({ ...profileData, ...data });
        // Move to next step
        moveToNextStep();
        fetchProfileData();
        return true;
      }
      return false;
    } catch (error) {
      Toast.showErrorToast(
        error.data?.error?.message[0] || "Failed to update profile"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const moveToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const moveToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prevStep) => prevStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
          />
        );

      case 2:
        return (
          <StepTwo
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );

      case 3:
        return (
          <StepThree
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      case 4:
        return (
          <StepFour
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      case 5:
        return (
          <StepFive
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      case 6:
        return (
          <StepSix
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      case 7:
        return (
          <StepSeven
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      case 8:
        return (
          <StepEight
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      case 9:
        return (
          <StepNine
            profileData={profileData}
            updateProfile={updateProfile}
            loading={loading}
            onBack={moveToPreviousStep}
          />
        );
      // We'll add more cases for other steps as we build them
      default:
        return <div>Unknown step</div>;
    }
  };

  return <div className={classes.onboardingContainer}>{renderStep()}</div>;
};

export default Onboarding;
