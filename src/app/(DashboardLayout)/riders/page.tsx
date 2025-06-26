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
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import { GET_ALL_USERS } from "@/graphql/queries";
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";
import { useQuery, useMutation } from "@apollo/client";

const UsersPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "cache-and-network",
  });

  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setEditMode(false);
      setSelectedUser(null);
    },
    onError: (err) => {
      console.error(err);
    },
  });

  const users = data?.users || [];
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMode(e.target.checked);
    if (e.target.checked && selectedUser) {
      setForm(selectedUser);
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSave = () => {
    updateUser({
      variables: {
        updateUserInput: {
          id: selectedUser.id,
          email: form.email,
        },
      },
    });
  };

  const filteredUsers = users.filter((user: any) =>
    user.userType === "RIDER" && user.email.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredUsers.map((user: any) => (
          <Grid key={user.id} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
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
              <CardActionArea onClick={() => { setSelectedUser(user); setEditMode(false); setTab(0); }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{ width: 56, height: 56, border: "2px solid #1976d2" }}
                  />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography color="text.secondary">{user.email}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  src={selectedUser.avatar}
                  alt={selectedUser.name}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Typography variant="h6">{selectedUser.userType}</Typography>
              </Box>

              <FormControlLabel
                control={<Switch checked={editMode} onChange={handleEditToggle} />}
                label="Edit Mode"
              />

              <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="Basic Info" />
                <Tab label="Contact" />
                <Tab label="Settings" />
              </Tabs>

              {tab === 0 && (
                <>
                  <TextField
                    label="First Name"
                    name="firstName"
                    value={editMode ? form.firstName || "" : selectedUser.firstName || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                  <TextField
                    label="Last Name"
                    name="lastName"
                    value={editMode ? form.lastName || "" : selectedUser.lastName || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                </>
              )}

              {tab === 1 && (
                <>
                  <TextField
                    label="Email"
                    name="email"
                    value={editMode ? form.email || "" : selectedUser.email || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                  <TextField
                    label="Phone"
                    name="phone"
                    value={editMode ? form.phone || "" : selectedUser.phone || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                </>
              )}

              {tab === 2 && (
                <>
                  <TextField
                    label="Username"
                    name="username"
                    value={editMode ? form.username || "" : selectedUser.username || ""}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                  />
                  <Typography mt={2} variant="body2">
                    Wallet Address: {selectedUser.walletAddress}
                  </Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {editMode && (
            <Button
              onClick={handleSave}
              color="primary"
              variant="contained"
              disabled={updating}
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          )}
          <Button onClick={() => setSelectedUser(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
