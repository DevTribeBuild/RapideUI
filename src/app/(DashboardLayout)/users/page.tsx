"use client";
import React, { useEffect, useState } from "react";
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
  Chip,
  Alert,
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";

import { GET_ALL_USERS } from "@/graphql";
import { UPDATE_USER_MUTATION } from "@/graphql";
import { useQuery, useMutation } from "@apollo/client/react";
import Divider from '@mui/material/Divider';
import { debounce } from 'lodash';
import { User } from '@/stores/useAuthStore';

type GetAllUsersQuery = {
  users: User[];
};

type UpdateUserMutationVariables = {
  updateUserInput: {
    // id: string;
    // email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    username?: string;
  };
};

// --- Accent Color Definition ---
const ACCENT_COLOR = "#FF5722"; // You can change this to your desired accent color

// Helper function for debouncing
// function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
//   let timeout: ReturnType<typeof setTimeout> | null;

//   return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
//     const context = this;

//     const later = () => {
//       timeout = null;
//       func.apply(context, args);
//     };

//     if (timeout) {
//       clearTimeout(timeout);
//     }

//     timeout = setTimeout(later, delay);
//   };
// }


// Helper function to get initials and a consistent color
const getInitialsAndColor = (user) => {
  const name = user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim();
  let initials = '';

  if (name) {
    const nameParts = name.split(' ').filter(Boolean);
    if (nameParts.length > 1) {
      initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
    } else if (nameParts.length === 1) {
      initials = nameParts[0][0];
    }
  } else if (user.email) {
    initials = user.email[0];
  }

  initials = initials.toUpperCase();

  // Simple hash function to get a consistent color based on initials/name/email
  let hash = 0;
  for (let i = 0; i < (name || user.email || '').length; i++) {
    hash = (name || user.email || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }

  return { initials, color };
};

const getUserTypeChipProps = (userType: string) => {
  let color: "primary" | "secondary" |"warning" | "info" | "success" | "default" = "default";
  let sx = {};

  switch (userType) {
    case "ADMIN":
      color = "primary";
      break;
    case "MERCHANT":
      color = "warning";
      break;
    case "RIDER":
      color = "info";
      break;
    case "USER":
      color = "warning";
      break;
    default:
      color = "default";
      break;
  }
  return { color, sx };
};


const UsersPage = () => {
  const { data, loading, error, refetch } = useQuery<GetAllUsersQuery>(GET_ALL_USERS, {
    fetchPolicy: "cache-and-network",
  });

  const [updateUser, { loading: updating }] = useMutation<any, UpdateUserMutationVariables>(UPDATE_USER_MUTATION, {
    onCompleted: () => {
      refetch();
      setEditMode(false);
      setSelectedUser(null);
      // Potentially show a success toast/snackbar here
    },
    onError: (err) => {
      console.error("Update error:", err);
      // Show an error toast/snackbar
    },
  });

  const users = data?.users || [];
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSetSearchTerm = React.useMemo(
    () => debounce((value: string) => setSearchTerm(value), 300),
    [setSearchTerm]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditMode(e.target.checked);
    if (e.target.checked && selectedUser) {
      setForm(selectedUser);
    } else {
      setForm({});
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleSave = () => {
    if (!form.email || !form.firstName || !form.lastName) {
      alert("Please fill in all required fields.");
      return;
    }

    updateUser({
      variables: {
        updateUserInput: {
          // id: selectedUser.id,
          // email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          username: form.username,
        },
      },
    });
  };

  const filteredUsers = users.filter((user: any) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    return () => {
      debouncedSetSearchTerm.cancel();
    };
  }, [debouncedSetSearchTerm]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Box sx={{
        mb: 4,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
      }}>
        <Typography variant="h4" fontWeight="bold">
          All Users
        </Typography>
        <TextField
          label="Search users..."
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={(e) => debouncedSetSearchTerm(e.target.value)}
          sx={{ width: { xs: "100%", md: "300px" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear search"
                  onClick={() => setSearchTerm("")}
                  edge="end"
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <Divider sx={{ mb: 4 }} />

      {loading && (
        <Grid container spacing={3}>
          {Array.from(new Array(4)).map((_, index) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
              <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Skeleton variant="circular" width={56} height={56} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Skeleton variant="text" width="80%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading users: {error.message}
          <Button onClick={() => refetch()} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <Typography variant="h6" color="text.secondary" textAlign="center" mt={5}>
          No users found matching your search.
        </Typography>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <Grid container spacing={3}>
          {filteredUsers.map((user: any) => {
            const { initials, color } = getInitialsAndColor(user);
            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={user.id}>
                <Card
                  sx={{
                    border: '1px solid #ffd700',
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardActionArea onClick={() => { setSelectedUser(user); setEditMode(false); setTab(0); }} sx={{ flexGrow: 1 }}>
                    <CardContent sx={{ gap: 2 }}>
                      <Avatar
                        src={user.avatar}
                        alt={user.name || user.email}
                        sx={{
                          width: 56,
                          height: 56,
                          // border: `2px solid ${ACCENT_COLOR}`, // Using accent color
                          flexShrink: 0,
                          bgcolor: user.avatar ? undefined : color, // Dynamic background for initials
                          color: user.avatar ? undefined : 'white', // White text for dynamic background
                        }}
                      >
                        {!user.avatar && initials} {/* Display initials if no avatar */}
                      </Avatar>
                      <br />
                      <Box>
                        <Typography variant="h6" fontWeight="bold" noWrap>
                          {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                        </Typography>
                        <Typography color="text.secondary" variant="body2" noWrap>{user.email}</Typography>
                        <br />
                        {user.userType && (() => {
                          const { color, sx } = getUserTypeChipProps(user.userType);
                          return (
                            <Chip
                              label={user.userType}
                              size="small"
                              variant="outlined"
                              color={color}
                              sx={{ mt: 0.5, ...sx }}
                            />
                          );
                        })()}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          {editMode ? "Edit User Details" : "User Details"}
          <IconButton
            aria-label="close"
            onClick={() => setSelectedUser(null)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                {(() => {
                  const { initials, color } = getInitialsAndColor(selectedUser);
                  return (
                    <Avatar
                      src={selectedUser.avatar}
                      alt={selectedUser.name || selectedUser.email}
                      sx={{
                        width: 96,
                        height: 96,
                        mx: "auto",
                        mb: 2,
                        // border: `3px solid ${ACCENT_COLOR}`, // Using accent color
                        bgcolor: selectedUser.avatar ? undefined : color, // Dynamic background for initials
                        color: selectedUser.avatar ? undefined : 'white', // White text for dynamic background
                        fontSize: '2.5rem' // Larger font size for initials in dialog
                      }}
                    >
                      {!selectedUser.avatar && initials} {/* Display initials if no avatar */}
                    </Avatar>
                  );
                })()}

                <Typography variant="h5" fontWeight="bold">{selectedUser.name || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()}</Typography>
                {selectedUser.userType && (() => {
                  const { color, sx } = getUserTypeChipProps(selectedUser.userType);
                  return (
                    <Chip
                      label={selectedUser.userType}
                      variant="outlined"
                      color={color}
                      sx={{ mt: 1, fontSize: "0.9rem", padding: "4px 8px", ...sx }}
                    />
                  );
                })()}
                <Typography color="text.secondary" variant="body1" mt={0.5}>{selectedUser.email}</Typography>
              </Box>

              <FormControlLabel
                control={<Switch checked={editMode} onChange={handleEditToggle} />}
                label="Enable Edit Mode"
                sx={{ mb: 2 }}
              />

              <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }} centered>
                <Tab label="Basic Info" />
                <Tab label="Contact" />
                <Tab label="Settings" />
              </Tabs>

              {tab === 0 && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="First Name"
                      name="firstName"
                      value={editMode ? form.firstName || "" : selectedUser.firstName || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      inputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Last Name"
                      name="lastName"
                      value={editMode ? form.lastName || "" : selectedUser.lastName || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      inputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                </Grid>
              )}

              {tab === 1 && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Email"
                      name="email"
                      value={editMode ? form.email || "" : selectedUser.email || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      type="email"
                      inputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Phone"
                      name="phone"
                      value={editMode ? form.phone || "" : selectedUser.phone || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      type="tel"
                      inputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                </Grid>
              )}

              {tab === 2 && (
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      label="Username"
                      name="username"
                      value={editMode ? form.username || "" : selectedUser.username || ""}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      inputProps={{ readOnly: !editMode }}
                      variant={editMode ? "outlined" : "filled"}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Typography mt={2} variant="body1" color="text.secondary">
                      **Wallet Address:** {selectedUser.walletAddress || "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setSelectedUser(null)} color="secondary" variant="outlined">
            Close
          </Button>
          {editMode && (
            <Button
              onClick={handleSave}
              // sx={{ bgcolor: ACCENT_COLOR, '&:hover': { bgcolor: '#E64A19' } }} // Using accent color for save button
              variant="contained"
              disabled={updating}
              endIcon={updating ? null : null}
            >
              {updating ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;