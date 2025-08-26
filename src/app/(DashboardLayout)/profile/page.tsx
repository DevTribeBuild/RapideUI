'use client';
import React, { useState, useEffect } from 'react';
import useAppStore from "@/stores/useAuthStore";
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
} from '@mui/material';
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { UPDATE_USER_MUTATION } from "@/graphql";

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

export default function ProfilePage() {
    const userDetails: any = useAppStore((state) => state.userDetails);
    const [tab, setTab] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<UserDetails>(userDetails);

    const [updateUser, { loading, error }] = useMutation(UPDATE_USER_MUTATION);

    useEffect(() => {
        setForm(userDetails);
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
                    id: userDetails.id,
                    // firstName: form?.firstName || "",
                    // lastName: form?.lastName || "",
                    email: form?.email,
                    // username: form?.username || "",
                    // phone: form?.phone || "",
                    // walletAddress: form?.walletAddress || "",
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
            </TabPanel>

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
