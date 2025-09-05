"use client";
import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Container,
  Paper,
  TextField,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";

import FileUploadInput from "@/components/FileUploadInput";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import {
  UPSERT_RIDER_DETAILS_MUTATION,
} from "@/graphql/mutations";
import toast from "react-hot-toast";
import useAuthStore from "@/stores/useAuthStore";

// Styled components for consistent UI
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows ? theme.shadows[3] : 'none',
  marginTop: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginRight: theme.spacing(1),
}));

const steps = [
  "Upload National ID/Passport",
  "Upload Driver's License",
  "Upload Logbook",
  "Upload Certificate of Good Conduct",
  "Upload Insurance",
  "Motorbike Details",
  "Smartphone Type",
];

type UpsertRiderDetailsMutationResult = {
  upsertRiderDetails: {
    id: string;
    userId: string;
    status: string;
  };
};

type UpsertRiderDetailsMutationVariables = {
  userId: string;
  input: {
    nationalIdOrPassport?: string;
    driverLicense?: string;
    logbook?: string;
    certificateOfGoodConduct?: string;
    insurance?: string;
    motorbikeCC?: number;
    smartphoneType?: string;
  };
};

const RiderVerificationPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    nationalIdOrPassport: "", // Will store URL
    driverLicense: "", // Will store URL
    logbook: "", // Will store URL
    certificateOfGoodConduct: "", // Will store URL
    insurance: "", // Will store URL
    motorbikeCC: "",
    smartphoneType: "",
  });

  const user = useAuthStore((state) => state.user);
  const userId = user?.id || "";
  const router = useRouter();

  const [upsertRiderDetails, { loading: isSubmitting }] = useMutation<UpsertRiderDetailsMutationResult, UpsertRiderDetailsMutationVariables>(UPSERT_RIDER_DETAILS_MUTATION);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setFormData({
      nationalIdOrPassport: "",
      driverLicense: "",
      logbook: "",
      certificateOfGoodConduct: "",
      insurance: "",
      motorbikeCC: "",
      smartphoneType: "",
    });
  };

  const handleUploadSuccess = (fieldName: string) => (url: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: url }));
  };

  const handleMotorbikeCCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, motorbikeCC: event.target.value });
  };

  const handleSmartphoneTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, smartphoneType: event.target.value });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <FileUploadInput
            label="National ID or Passport"
            onUploadSuccess={handleUploadSuccess("nationalIdOrPassport")}
            currentFileUrl={formData.nationalIdOrPassport}
          />
        );
      case 1:
        return (
          <FileUploadInput
            label="Driver's License"
            onUploadSuccess={handleUploadSuccess("driverLicense")}
            currentFileUrl={formData.driverLicense}
          />
        );
      case 2:
        return (
          <FileUploadInput
            label="Logbook"
            onUploadSuccess={handleUploadSuccess("logbook")}
            currentFileUrl={formData.logbook}
          />
        );
      case 3:
        return (
          <FileUploadInput
            label="Certificate of Good Conduct"
            onUploadSuccess={handleUploadSuccess("certificateOfGoodConduct")}
            currentFileUrl={formData.certificateOfGoodConduct}
          />
        );
      case 4:
        return (
          <FileUploadInput
            label="Insurance"
            onUploadSuccess={handleUploadSuccess("insurance")}
            currentFileUrl={formData.insurance}
          />
        );
      case 5:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Motorbike CC (Engine Capacity)
            </Typography>
            <TextField
              label="Motorbike CC"
              type="number"
              value={formData.motorbikeCC}
              onChange={handleMotorbikeCCChange}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          </Box>
        );
      case 6:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Enter Smartphone Type
            </Typography>
            <TextField
              label="Smartphone Type"
              type="text"
              value={formData.smartphoneType}
              onChange={handleSmartphoneTypeChange}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          </Box>
        );
      default:
        return "Unknown step";
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 0:
        return formData.nationalIdOrPassport !== "";
      case 1:
        return formData.driverLicense !== "";
      case 2:
        return formData.logbook !== "";
      case 3:
        return formData.certificateOfGoodConduct !== "";
      case 4:
        return formData.insurance !== "";
      case 5:
        return formData.motorbikeCC.trim() !== "" && parseInt(formData.motorbikeCC) > 0;
      case 6:
        return formData.smartphoneType.trim() !== "";
      default:
        return false;
    }
  };

  const handleFormSubmit = async () => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }
    try {
      const input = {
        nationalIdOrPassport: formData.nationalIdOrPassport,
        driverLicense: formData.driverLicense,
        logbook: formData.logbook,
        certificateOfGoodConduct: formData.certificateOfGoodConduct,
        insurance: formData.insurance,
        motorbikeCC: parseInt(formData.motorbikeCC),
        smartphoneType: formData.smartphoneType,
      };
      const { data } = await upsertRiderDetails({ variables: { userId, input } });

      if (data && data.upsertRiderDetails && data.upsertRiderDetails.id) {
        toast.success("Rider verification process completed!");
        router.push("/riders/orders");
      } else {
        toast.error("Rider verification failed.");
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "An unexpected error occurred during verification.");
    }
  };

  return (
    <Container maxWidth="md">
      <StyledPaper>
        <Typography variant="h4" align="center" gutterBottom>
          Rider Verification Process
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={activeStep > index || (activeStep === index && isStepComplete(index))}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="h5" gutterBottom>
                All steps completed!
              </Typography>
              <Typography variant="body1">
                Thank you for completing the rider verification process. Your documents are being reviewed.
              </Typography>
              <StyledButton onClick={handleReset}>Reset</StyledButton>
            </Box>
          ) : (
            <Box>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <StyledButton
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Back
                </StyledButton>
                <Box sx={{ flex: "1 1 auto" }} />
                <StyledButton
                  onClick={activeStep === steps.length - 1 ? handleFormSubmit : handleNext}
                  variant="contained"
                  disabled={!isStepComplete(activeStep) || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : (activeStep === steps.length - 1 ? "Finish" : "Next")}
                </StyledButton>
              </Box>
            </Box>
          )}
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default RiderVerificationPage;
