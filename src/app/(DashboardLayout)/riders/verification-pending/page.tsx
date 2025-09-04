"use client";
import React from "react";
import {
  Box,
  Typography,
  Container,
  Paper,
  Button
} from "@mui/material";
import { styled } from "@mui/system";
import Link from "next/link";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows ? theme.shadows[3] : 'none',
  marginTop: theme.spacing(4),
  textAlign: "center",
}));

const VerificationPendingPage = () => {
  return (
    <Container maxWidth="sm">
      <StyledPaper>
        <Typography variant="h4" align="center" gutterBottom>
          Verification Pending
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" sx={{ mb: 3 }}>
          Thank you for submitting your rider details. Your application is currently under review.
          We will notify you once your verification is complete.
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} href="/">
            Go to Home
          </Button>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default VerificationPendingPage;
