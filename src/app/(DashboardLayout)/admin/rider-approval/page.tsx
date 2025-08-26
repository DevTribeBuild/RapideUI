"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions as MuiDialogActions,
  Link as MuiLink,
  Container,
  Skeleton,
} from "@mui/material";
import { useQuery, useMutation } from "@apollo/client/react";
import {
  GET_RIDERS_BY_STATUS_QUERY,
} from "@/graphql/queries";
import {
  APPROVE_RIDER_MUTATION,
  REJECT_RIDER_MUTATION,
} from "@/graphql/mutations";
import toast from "react-hot-toast";

// Define types for GraphQL data
type Rider = {
  id: string;
  userId: string;
  status: string;
  nationalIdOrPassportUrl?: string;
  driverLicenseUrl?: string;
  logbookUrl?: string;
  certificateOfGoodConductUrl?: string;
  insuranceUrl?: string;
};

type GetRidersByStatusQueryResult = {
  ridersByStatus: Rider[];
};

type ApproveRejectRiderMutationResult = {
  approveRider?: {
    id: string;
    userId: string;
    status: string;
  };
  rejectRider?: {
    id: string;
    userId: string;
    status: string;
  };
};

type ApproveRejectRiderMutationVariables = {
  userId: string;
};

const RiderApprovalPage = () => {
  const [selectedRider, setSelectedRider] = useState<Rider | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, loading, error, refetch } = useQuery<GetRidersByStatusQueryResult>(
    GET_RIDERS_BY_STATUS_QUERY,
    {
      variables: { status: "PENDING" }, // Fetch only pending riders
      fetchPolicy: "network-only", // Always get fresh data
    }
  );

  const [approveRiderMutation, { loading: approving }] = useMutation<ApproveRejectRiderMutationResult, ApproveRejectRiderMutationVariables>(
    APPROVE_RIDER_MUTATION,
    {
      onCompleted: () => {
        toast.success("Rider approved successfully!");
        refetch();
        setDialogOpen(false);
      },
      onError: (err) => {
        toast.error(`Error approving rider: ${err.message}`);
      },
    }
  );

  const [rejectRiderMutation, { loading: rejecting }] = useMutation<ApproveRejectRiderMutationResult, ApproveRejectRiderMutationVariables>(
    REJECT_RIDER_MUTATION,
    {
      onCompleted: () => {
        toast.success("Rider rejected successfully!");
        refetch();
        setDialogOpen(false);
      },
      onError: (err) => {
        toast.error(`Error rejecting rider: ${err.message}`);
      },
    }
  );

  const handleViewDetails = (rider: Rider) => {
    setSelectedRider(rider);
    setDialogOpen(true);
  };

  const handleApprove = async () => {
    if (selectedRider) {
      await approveRiderMutation({ variables: { userId: selectedRider.userId } });
    }
  };

  const handleReject = async () => {
    if (selectedRider) {
      await rejectRiderMutation({ variables: { userId: selectedRider.userId } });
    }
  };

  if (loading) return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rider Approval Dashboard
      </Typography>
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Skeleton variant="text" width="60%" height={30} /> {/* For User ID */}
                <Skeleton variant="text" width="40%" height={20} sx={{ mt: 1 }} /> {/* For Status */}
                <Box sx={{ mt: 2 }}>
                  <Skeleton variant="rectangular" width={100} height={36} /> {/* For Button */}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  const pendingRiders = data?.ridersByStatus || [];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Rider Approval Dashboard
      </Typography>

      {pendingRiders.length === 0 ? (
        <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
          No pending riders for approval.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {pendingRiders.map((rider) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={rider.id}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6">User ID: {rider.userId}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Status: {rider.status}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewDetails(rider)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Rider Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Rider Details for Approval</DialogTitle>
        <DialogContent dividers>
          {selectedRider && (
            <Box>
              <Typography variant="h6" gutterBottom>User ID: {selectedRider.userId}</Typography>
              <Typography variant="body1" gutterBottom>Status: {selectedRider.status}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>Uploaded Documents:</Typography>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {selectedRider.nationalIdOrPassportUrl && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle1">National ID/Passport:</Typography>
                    <MuiLink href={selectedRider.nationalIdOrPassportUrl} target="_blank" rel="noopener noreferrer">
                      View Document
                    </MuiLink>
                  </Grid>
                )}
                {selectedRider.driverLicenseUrl && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle1">Driver&apos;s License:</Typography>
                    <MuiLink href={selectedRider.driverLicenseUrl} target="_blank" rel="noopener noreferrer">
                      View Document
                    </MuiLink>
                  </Grid>
                )}
                {selectedRider.logbookUrl && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle1">Logbook:</Typography>
                    <MuiLink href={selectedRider.logbookUrl} target="_blank" rel="noopener noreferrer">
                      View Document
                    </MuiLink>
                  </Grid>
                )}
                {selectedRider.certificateOfGoodConductUrl && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle1">Certificate of Good Conduct:</Typography>
                    <MuiLink href={selectedRider.certificateOfGoodConductUrl} target="_blank" rel="noopener noreferrer">
                      View Document
                    </MuiLink>
                  </Grid>
                )}
                {selectedRider.insuranceUrl && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="subtitle1">Insurance:</Typography>
                    <MuiLink href={selectedRider.insuranceUrl} target="_blank" rel="noopener noreferrer">
                      View Document
                    </MuiLink>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <MuiDialogActions>
          <Button onClick={() => setDialogOpen(false)} color="secondary">
            Close
          </Button>
          <Button
            onClick={handleReject}
            color="error"
            variant="contained"
            disabled={rejecting || approving}
          >
            {rejecting ? <CircularProgress size={24} /> : "Reject"}
          </Button>
          <Button
            onClick={handleApprove}
            color="primary"
            variant="contained"
            disabled={approving || rejecting}
          >
            {approving ? <CircularProgress size={24} /> : "Approve"}
          </Button>
        </MuiDialogActions>
      </Dialog>
    </Container>
  );
};

export default RiderApprovalPage;
