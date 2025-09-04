"use client";
import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Box,
  TextField,
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import Link from "next/link";
import { GET_ALL_RIDERS } from "@/graphql/queries";
import { UPDATE_RIDER_DETAILS_MUTATION } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client/react";
import { User } from "@/stores/useAuthStore";

type Rider = {
  certificateOfGoodConduct: string;
  createdAt: string;
  driverLicense: string;
  id: string;
  insurance: string;
  logbook: string;
  motorbikeCC: string;
  nationalIdOrPassport: string;
  smartphoneType: string;
  status: string;
  updatedAt: string;
  user: User;
  userId: string;
};

type GetAllRidersQuery = {
  allRiders: Rider[];
};

const RidersPage = () => {
  const { data, loading, error } = useQuery<GetAllRidersQuery>(GET_ALL_RIDERS, {
    fetchPolicy: "cache-and-network",
  });

  const [selectedRider, setSelectedRider] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [updateRiderDetails] = useMutation(UPDATE_RIDER_DETAILS_MUTATION, {
    refetchQueries: [{ query: GET_ALL_RIDERS }],
  });

  const handleApprove = async () => {
    if (selectedRider) {
      await updateRiderDetails({
        variables: {
          updateRiderDetailsInput: {
            id: selectedRider.id,
            status: "APPROVED",
          },
        },
      });
      setSelectedRider(null);
    }
  };

  const handleReject = async () => {
    if (selectedRider) {
      await updateRiderDetails({
        variables: {
          updateRiderDetailsInput: {
            id: selectedRider.id,
            status: "REJECTED",
            rejectionReason,
          },
        },
      });
      setSelectedRider(null);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const filteredRiders = data?.allRiders?.filter((rider: any) =>
    rider.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        All Riders
      </Typography>

      <TextField
        label="Search by Email"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Grid container spacing={3}>
        {filteredRiders?.map((rider: any) => (
          <Grid key={rider.id} size={{xs:12, sm:6, md:4, lg:3}}>
            <Card
              sx={{
                borderRadius: 2,
                boxShadow: 3,
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea onClick={() => { setSelectedRider(rider); setTab(0); }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={rider.user.imageUrl}
                    alt={`${rider.user.firstName} ${rider.user.lastName}`}
                    sx={{ width: 56, height: 56, border: "2px solid #1976d2" }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {`${rider.user.firstName} ${rider.user.lastName}`}
                    </Typography>
                    <Typography color="text.secondary">{rider.user.email}</Typography>
                    <Chip label={rider.status} color={rider.status === 'APPROVED' ? 'success' : 'warning'} size="small" />
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedRider}
        onClose={() => setSelectedRider(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rider Details</DialogTitle>
        <DialogContent dividers>
          {selectedRider && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  src={selectedRider.user.imageUrl}
                  alt={`${selectedRider.user.firstName} ${selectedRider.user.lastName}`}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Typography variant="h6">{`${selectedRider.user.firstName} ${selectedRider.user.lastName}`}</Typography>
                <Chip label={selectedRider.status} color={selectedRider.status === 'APPROVED' ? 'success' : 'warning'} />
              </Box>

              <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Basic Info" />
                <Tab label="Contact" />
                <Tab label="Documents" />
              </Tabs>

              {tab === 0 && (
                <>
                  <TextField
                    label="First Name"
                    value={selectedRider.user.firstName || ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    label="Last Name"
                    value={selectedRider.user.lastName || ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    label="Username"
                    value={selectedRider.user.username || ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </>
              )}

              {tab === 1 && (
                <>
                  <TextField
                    label="Email"
                    value={selectedRider.user.email || ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                  <TextField
                    label="Phone"
                    value={selectedRider.user.phone || ""}
                    fullWidth
                    margin="normal"
                    disabled
                  />
                </>
              )}

              {tab === 2 && (
                <>
                  <Button component={Link} href={selectedRider.nationalIdOrPassport} target="_blank" fullWidth>View National ID/Passport</Button>
                  <Button component={Link} href={selectedRider.driverLicense} target="_blank" fullWidth>View Driver License</Button>
                  <Button component={Link} href={selectedRider.logbook} target="_blank" fullWidth>View Logbook</Button>
                  <Button component={Link} href={selectedRider.certificateOfGoodConduct} target="_blank" fullWidth>View Certificate of Good Conduct</Button>
                  <Button component={Link} href={selectedRider.insurance} target="_blank" fullWidth>View Insurance</Button>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRider(null)} color="primary">
            Close
          </Button>
          <Button onClick={handleApprove} color="success">
            Approve
          </Button>
          <Button onClick={handleReject} color="error">
            Reject
          </Button>
        </DialogActions>
        <DialogContent>
          <TextField
            label="Reason for Rejection"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RidersPage;