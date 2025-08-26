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
import { VERIFY_RIDER_MUTATION } from "@/graphql/mutations";
import toast from "react-hot-toast";

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
];

type VerifyRiderMutationResult = {
  verifyRider: {
    success: boolean;
    message: string;
  };
};

type VerifyRiderMutationVariables = {
  input: {
    nationalIdOrPassportUrl: string;
    driverLicenseUrl: string;
    logbookUrl: string;
    certificateOfGoodConductUrl: string;
    insuranceUrl: string;
    motorbikeCC: number;
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
  });

  const [verifyRider, { loading: isSubmitting }] = useMutation<VerifyRiderMutationResult, VerifyRiderMutationVariables>(VERIFY_RIDER_MUTATION);

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
    });
  };

  const handleUploadSuccess = (fieldName: string) => (url: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: url }));
  };

  const handleMotorbikeCCChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, motorbikeCC: event.target.value });
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload National ID or Passport
            </Typography>
            <FileUploadInput
              label="National ID or Passport"
              onUploadSuccess={handleUploadSuccess("nationalIdOrPassport")}
              currentFileUrl={formData.nationalIdOrPassport}
            />
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Driver&apos;s License
            </Typography>
            <FileUploadInput
              label="Driver's License"
              onUploadSuccess={handleUploadSuccess("driverLicense")}
              currentFileUrl={formData.driverLicense}
            />
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Logbook
            </Typography>
            <FileUploadInput
              label="Logbook"
              onUploadSuccess={handleUploadSuccess("logbook")}
              currentFileUrl={formData.logbook}
            />
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Certificate of Good Conduct
            </Typography>
            <FileUploadInput
              label="Certificate of Good Conduct"
              onUploadSuccess={handleUploadSuccess("certificateOfGoodConduct")}
              currentFileUrl={formData.certificateOfGoodConduct}
            />
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload Insurance
            </Typography>
            <FileUploadInput
              label="Insurance"
              onUploadSuccess={handleUploadSuccess("insurance")}
              currentFileUrl={formData.insurance}
            />
          </Box>
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
      default:
        return false;
    }
  };

  const handleFormSubmit = async () => {
    try {
      const input = {
        nationalIdOrPassportUrl: formData.nationalIdOrPassport,
        driverLicenseUrl: formData.driverLicense,
        logbookUrl: formData.logbook,
        certificateOfGoodConductUrl: formData.certificateOfGoodConduct,
        insuranceUrl: formData.insurance,
        motorbikeCC: parseInt(formData.motorbikeCC),
      };
      const { data } = await verifyRider({ variables: { input } });

      if (data && data.verifyRider && data.verifyRider.success) {
        toast.success(data.verifyRider.message || "Rider verification process completed!");
        // In a real application, you would navigate away or show a success message
      } else {
        toast.error(data?.verifyRider?.message || "Rider verification failed.");
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
                  disabled={!isStepComplete(activeStep)}
                >
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
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
