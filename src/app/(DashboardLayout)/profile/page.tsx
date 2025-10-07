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
} from '@mui/material';
import useAppStore from "@/stores/useAuthStore";
import useThemeStore from "@/stores/useThemeStore";
import { styled } from '@mui/material';

import { useMutation, useQuery } from "@apollo/client/react";
import { UPDATE_USER_MUTATION, MY_MERCHANT_DETAILS, RIDER_DETAILS } from "@/graphql";
import { FIND_ONE_USER_QUERY } from "@/graphql/user/queries";

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
                    <Grid size={{xs:12, md:6}} key={key}>
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

    const { data: userData, loading: userLoading, error: userError } = useQuery(FIND_ONE_USER_QUERY, {
        variables: { email: userDetails?.email },
        skip: !userDetails?.email,
    });
    console.log("userDetails", userDetails?.me);
    const { data: merchantData, loading: merchantLoading, error: merchantError } = useQuery(MY_MERCHANT_DETAILS, {
        // variables: { userId: userDetails?.id },
        skip: userDetails?.me?.userType !== 'MERCHANT',
    });
    console.log("merchantData", merchantData);

    const { data: riderData, loading: riderLoading, error: riderError } = useQuery(RIDER_DETAILS, {
        variables: { userId: userDetails?.me?.id },
        skip: userDetails?.me?.userType !== 'RIDER' || !userDetails?.me?.id,
    });

    const [updateUser, { loading, error }] = useMutation<any, UpdateUserMutationVariables>(UPDATE_USER_MUTATION, {
        refetchQueries: [{ query: FIND_ONE_USER_QUERY, variables: { email: userDetails?.email } }]
    });

    useEffect(() => {
        if (userData && userData.user) {
            setForm(userData.user);
        }
    }, [userData]);

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
                    id: userData.user.id,
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

    if (userLoading) return <p>Loading profile...</p>;
    if (userError) return <p>Error loading profile: {userError.message}</p>;

    return (
        <Paper sx={{ maxWidth: 1000, mx: 'auto', mt: 4, p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h5">Profile</Typography>
                <FormControlLabel
                    control={<Switch checked={editMode} onChange={handleEditMode} />}
                    label="Update Profile"
                />
            </Box>

            <Tabs value={tab} onChange={handleTabChange} aria-label="profile tabs">
                <Tab label="Basic Info" />
                <Tab label="Contact" />
                <Tab label="Settings" />
                {userDetails?.me?.userType === 'MERCHANT' && <Tab label="Merchant Details" />}
                {userDetails?.me?.userType === 'RIDER' && <Tab label="Rider Details" />}
            </Tabs>

            <TabPanel value={tab} index={0}>
                <TextField
                    label="First Name"
                    name="firstName"
                    value={form?.firstName || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                />
                <TextField
                    label="Last Name"
                    name="lastName"
                    value={form?.lastName || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                />
            </TabPanel>

            <TabPanel value={tab} index={1}>
                <TextField
                    label="Email"
                    name="email"
                    value={form?.email || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                />
                <TextField
                    label="Phone"
                    name="phone"
                    value={form?.phone || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                />
            </TabPanel>

            <TabPanel value={tab} index={2}>
                <TextField
                    label="Username"
                    name="username"
                    value={form?.username || ''}
                    onChange={handleInputChange}
                    fullWidth
                    margin="normal"
                    disabled={!editMode}
                />
                <FormControlLabel
                    control={<ThemeSwitch checked={theme === 'dark'} onChange={toggleTheme} />}
                    label="Dark Mode"
                />
            </TabPanel>

            {userDetails?.me?.userType === 'MERCHANT' && (
                <TabPanel value={tab} index={3}>
                    <DetailsGrid details={merchantData?.myMerchantDetails} loading={merchantLoading} error={merchantError} />
                </TabPanel>
            )}

            {userDetails?.me?.userType === 'RIDER' && (
                <TabPanel value={tab} index={3}>
                    <DetailsGrid details={riderData?.riderDetails} loading={riderLoading} error={riderError} />
                </TabPanel>
            )}

            {editMode && (
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </Box>
            )}

            {error && <Typography color="error">Error: {error.message}</Typography>}
        </Paper>
    );
}
