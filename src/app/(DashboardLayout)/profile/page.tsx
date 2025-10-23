'use client';
import React, { useState, useEffect } from 'react';
import {
    Box,
    Tabs,
    Tab,
    Typography,
    TextField,
    Switch,
    FormControlLabel,
    Button,
    Paper,
    Grid,
    Divider,
    Fade,
    IconButton,
} from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import useAppStore from "@/stores/useAuthStore";
import useThemeStore from "@/stores/useThemeStore";
import { styled } from '@mui/material';

import { useMutation, useQuery } from "@apollo/client/react";
import { UPDATE_USER_MUTATION, MY_MERCHANT_DETAILS, RIDER_DETAILS, FIND_ONE_USER_QUERY } from "@/graphql";

type UpdateUserMutationVariables = {
    updateUserInput: {
        id: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        phone?: string;
    };
};

interface UserDetails {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    username?: string;
    [key: string]: any;
}

interface TabPanelProps {
    children?: React.ReactNode;
    value: number;
    index: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`}>
            {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
        </div>
    );
}

function DetailsGrid({ details, loading, error }: { details: any, loading: boolean, error: any }) {
    if (loading) return <p>Loading details...</p>;
    if (error) return <p>Error loading details: {error.message}</p>;
    if (!details) return <p>No details found.</p>;

    return (
        <Grid container spacing={2}>
            {Object.entries(details).map(([key, value]) => {
                if (key === '__typename' || key === 'user') return null;
                return (
                    <Grid size={{ xs: 12, md: 6 }} key={key}>
                        <TextField
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                            value={value || ''}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                    </Grid>
                );
            })}
        </Grid>
    );
}

export default function ProfilePage() {
    const userDetails: any = useAppStore((state) => state.userDetails);
    const userType = userDetails?.userType;
    const [tab, setTab] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<UserDetails>({});
    const { theme, toggleTheme } = useThemeStore();

    const ThemeSwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        "& .MuiSwitch-switchBase": {
            margin: 1,
            padding: 0,
            transform: "translateX(6px)",
            "&.Mui-checked": {
                color: "#fff",
                transform: "translateX(22px)",
                "& .MuiSwitch-thumb:before": {
                    content: "'🌙'",
                    fontSize: 16,
                },
                "& + .MuiSwitch-track": {
                    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
                    opacity: 1,
                },
            },
        },
        "& .MuiSwitch-thumb": {
            backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#ffd700",
            width: 24,
            height: 24,
            "&:before": {
                content: "'🌞'",
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
            },
        },
        "& .MuiSwitch-track": {
            borderRadius: 20 / 2,
            backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
            opacity: 1,
        },
    }));


    const { data: merchantData, loading: merchantLoading, error: merchantError } = useQuery(MY_MERCHANT_DETAILS, {
        // variables: { userId: userDetails?.id },
        skip: userDetails?.me?.userType !== 'MERCHANT',
    });

    const { data: riderData, loading: riderLoading, error: riderError } = useQuery(RIDER_DETAILS, {
        variables: { userId: userDetails?.me?.id },
        skip: userDetails?.me?.userType !== 'RIDER' || !userDetails?.me?.id,
    });

    const [updateUser, { loading, error }] = useMutation<any, UpdateUserMutationVariables>(UPDATE_USER_MUTATION, {
        refetchQueries: [{ query: FIND_ONE_USER_QUERY, variables: { email: userDetails?.email } }]
    });

    useEffect(() => {
        if (userDetails && userDetails.me) {
            setForm(userDetails.me);
        }
    }, [userDetails]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    const handleEditMode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditMode(e.target.checked);
    };

    const handleSave = () => {
        updateUser({
            variables: {
                updateUserInput: {
                    id: userDetails.me.id,
                    firstName: form?.firstName || "",
                    lastName: form?.lastName || "",
                    email: form?.email,
                    username: form?.username || "",
                    phone: form?.phone || "",
                },
            },
        })
            .then(() => {
                setEditMode(false);
            })
            .catch((err) => {
                console.error("Error updating profile:", err);
            });
    };



    return (
        <Paper
  sx={{
    maxWidth: 900,
    mx: "auto",
    mt: 6,
    p: 4,
    borderRadius: 3,
    boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
    bgcolor: "background.paper",
    transition: "all 0.3s ease",
  }}
>
  {/* Header */}
  <Box
    display="flex"
    justifyContent="space-between"
    alignItems="center"
    mb={3}
  >
    <Typography variant="h5" fontWeight={700}>
      Profile
    </Typography>

    <Box>
      {editMode ? (
        <Box display="flex" gap={1}>
          <IconButton
            color="success"
            onClick={handleSave}
            sx={{
              bgcolor: "success.light",
              "&:hover": { bgcolor: "success.main", color: "white" },
            }}
          >
            <SaveIcon fontSize="small" />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => setEditMode(false)}
            sx={{
              bgcolor: "error.light",
              "&:hover": { bgcolor: "error.main", color: "white" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <IconButton
          color="primary"
          onClick={() => setEditMode(true)}
          sx={{
            color:"#000",
            bgcolor: "primary.main",
            "&:hover": { bgcolor: "primary.light" },
          }}
        >
          <EditNoteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  </Box>

  <Divider sx={{ mb: 3 }} />

  {/* Tabs */}
  <Tabs
    value={tab}
    onChange={handleTabChange}
    variant="scrollable"
    scrollButtons="auto"
    aria-label="profile tabs"
    sx={{
      borderBottom: 1,
      borderColor: "divider",
      mb: 3,
      ".MuiTab-root": {
        textTransform: "none",
        fontWeight: 600,
        minHeight: 48,
      },
    }}
  >
    <Tab label="Basic Info" />
    <Tab label="Contact" />
    <Tab label="Settings" />
    {userDetails?.me?.userType === "MERCHANT" && <Tab label="Merchant Details" />}
    {userDetails?.me?.userType === "RIDER" && <Tab label="Rider Details" />}
  </Tabs>

  {/* Tab Panels */}
  <Fade in>
    <Box>
      {/* Basic Info */}
      {tab === 0 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
          >
            Personal Information
          </Typography>
          <TextField
            label="First Name"
            name="firstName"
            value={form?.firstName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={form?.lastName || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
        </Box>
      )}

      {/* Contact */}
      {tab === 1 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
          >
            Contact Information
          </Typography>
          <TextField
            label="Email"
            name="email"
            value={form?.email || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
          <TextField
            label="Phone"
            name="phone"
            value={form?.phone || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
        </Box>
      )}

      {/* Settings */}
      {tab === 2 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
          >
            Account Settings
          </Typography>
          <TextField
            label="Username"
            name="username"
            value={form?.username || ""}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!editMode}
          />
          <FormControlLabel
            control={
              <ThemeSwitch
                checked={theme === "dark"}
                onChange={toggleTheme}
                disabled={!editMode}
              />
            }
            label="Dark Mode"
            sx={{ mt: 2 }}
          />
        </Box>
      )}

      {/* Merchant / Rider Details */}
      {userDetails?.me?.userType === "MERCHANT" && tab === 3 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
          >
            Merchant Details
          </Typography>
          <DetailsGrid
            details={merchantData?.myMerchantDetails}
            loading={merchantLoading}
            error={merchantError}
          />
        </Box>
      )}

      {userDetails?.me?.userType === "RIDER" && tab === 3 && (
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
          >
            Rider Details
          </Typography>
          <DetailsGrid
            details={riderData?.riderDetails}
            loading={riderLoading}
            error={riderError}
          />
        </Box>
      )}
    </Box>
  </Fade>

  {/* Error */}
  {error && (
    <Typography mt={2} color="error" fontWeight={500}>
      Error: {error.message}
    </Typography>
  )}
</Paper>
    );
}
