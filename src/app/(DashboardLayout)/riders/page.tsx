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
  CardActions,
} from "@mui/material";
import Link from "next/link";
import { GET_ALL_RIDERS } from "@/graphql/queries";
import { APPROVE_RIDER_MUTATION, REJECT_RIDER_MUTATION } from "@/graphql/mutations";
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
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [approveRider] = useMutation(APPROVE_RIDER_MUTATION, {
    refetchQueries: [{ query: GET_ALL_RIDERS }],
  });
  const [rejectRider] = useMutation(REJECT_RIDER_MUTATION, {
    refetchQueries: [{ query: GET_ALL_RIDERS }],
  });

  const handleApprove = async (rider: Rider) => {
    await approveRider({ variables: { userId: rider.userId } });
    setSelectedRider(null);
  };

  const handleReject = async (rider: Rider) => {
    await rejectRider({ variables: { userId: rider.userId } });
    setSelectedRider(null);
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
          <Grid key={rider.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                border: '1px solid #ffd700',
                borderRadius: 2,
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
                      {rider.user.firstName && rider.user.lastName
                        ? `${rider.user.firstName} ${rider.user.lastName}`
                        : rider.user.email}
                    </Typography><br/>
                    <Typography color="text.secondary">{rider.user.email}</Typography><br/>
                    <Chip label={rider.status} color={rider.status === 'APPROVED' ? 'success' : 'warning'} size="small" variant="outlined" />
                  </Box>
                </CardContent>
              </CardActionArea>
              <CardActions sx={{ justifyContent: 'space-between', gap: 1, pr: 2, pb: 2 }}>
                <Button
                  onClick={() => handleReject(rider)}
                  color="error"
                  variant="outlined"
                  size="small"
                  disabled={rider.status !== 'PENDING'}
                  sx={{ flexGrow: 1 }}
                >
                  Reject
                </Button>
                <Button
                  onClick={() => handleApprove(rider)}
                  color="primary"
                  variant="outlined"
                  size="small"
                  disabled={rider.status !== 'PENDING'}
                  sx={{ flexGrow: 1 }}
                >
                  Approve
                </Button>
              </CardActions>
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
                <Typography variant="h6">
                  {selectedRider.user.firstName && selectedRider.user.lastName
                    ? `${selectedRider.user.firstName} ${selectedRider.user.lastName}`
                    : selectedRider.user.email}
                </Typography>
                <Chip label={selectedRider.status} color={selectedRider.status === 'APPROVED' ? 'success' : 'warning'} variant="outlined" />
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
                  <Button
                    component={Link}
                    href={selectedRider.nationalIdOrPassport}
                    target="_blank"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                      borderRadius: 0,
                    }}
                  >
                    View National ID/Passport
                  </Button>

                  <Button
                    component={Link}
                    href={selectedRider.driverLicense}
                    target="_blank"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                      borderRadius: 0,
                    }}
                  >
                    View Driver License
                  </Button>

                  <Button
                    component={Link}
                    href={selectedRider.logbook}
                    target="_blank"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                      borderRadius: 0,
                    }}
                  >
                    View Logbook
                  </Button>

                  <Button
                    component={Link}
                    href={selectedRider.certificateOfGoodConduct}
                    target="_blank"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                      borderRadius: 0,
                    }}
                  >
                    View Certificate of Good Conduct
                  </Button>

                  <Button
                    component={Link}
                    href={selectedRider.insurance}
                    target="_blank"
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      textAlign: 'left',
                      borderBottom: '1px solid #ddd',
                      borderRadius: 0,
                    }}
                  >
                    View Insurance
                  </Button>
                </>

              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedRider(null)} color="primary">
            Close
          </Button>
          <Button
            onClick={() => selectedRider && handleApprove(selectedRider)}
            color="success"
            variant="outlined"
            disabled={selectedRider?.status !== 'PENDING'}
          >
            Approve
          </Button>
          <Button
            onClick={() => selectedRider && handleReject(selectedRider)}
            color="error"
            variant="outlined"
            disabled={selectedRider?.status !== 'PENDING'}
          >
            Reject
          </Button>
        </DialogActions>

      </Dialog>
    </Box>
  );
};

export default RidersPage;