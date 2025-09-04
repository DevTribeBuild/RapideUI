
"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Container,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import FileUploadInput from "@/components/FileUploadInput";
import { useMutation } from "@apollo/client/react";
import { UPDATE_RIDER_DETAILS_MUTATION } from "@/graphql/mutations";
import toast from "react-hot-toast";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows ? theme.shadows[3] : 'none',
  marginTop: theme.spacing(4),
}));

const vehicleTypes = ["BICYCLE", "MOTORCYCLE", "SCOOTER", "CAR"];

type UpdateRiderDetailsMutationResult = {
  updateRiderDetails: {
    id: string;
    status: string;
  };
};

type UpdateRiderDetailsMutationVariables = {
  updateRiderDetailsInput: {
    firstName: string;
    lastName: string;
    photoUrl: string;
    idNumber: string;
    licenseNumber: string;
    vehicleType: string;
  };
};

const BecomeARiderPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    photoUrl: "",
    idNumber: "",
    licenseNumber: "",
    vehicleType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [updateRiderDetails] = useMutation<
    UpdateRiderDetailsMutationResult,
    UpdateRiderDetailsMutationVariables
  >(UPDATE_RIDER_DETAILS_MUTATION);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, photoUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user?.id) {
      toast.error("User not logged in.");
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await updateRiderDetails({
        variables: {
          updateRiderDetailsInput: {
            ...formData,
          },
        },
      });

      if (data && data.updateRiderDetails && data.updateRiderDetails.id) {
        toast.success("Rider details submitted for verification!");
        router.push("/riders/verification-pending"); // Redirect to a pending page
      } else {
        toast.error("Failed to submit rider details.");
      }
    } catch (error: any) {
      console.error("Error submitting rider details:", error);
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <StyledPaper>
        <Typography variant="h4" align="center" gutterBottom>
          Become a Rider
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Fill out the form below to submit your details for rider verification.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="ID Number"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            select
            label="Vehicle Type"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          >
            {vehicleTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ mt: 2, mb: 3 }}>
            <FileUploadInput
              label="Profile Photo"
              onUploadSuccess={handlePhotoUploadSuccess}
              currentFileUrl={formData.photoUrl}
            />
          </Box>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isSubmitting}
            sx={{ mt: 2 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Submit for Verification"}
          </Button>
        </form>
      </StyledPaper>
    </Container>
  );
};

export default BecomeARiderPage;
