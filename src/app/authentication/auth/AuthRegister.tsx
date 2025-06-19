import React, { useState } from 'react';
import { Box, Typography, Button, Alert } from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION } from '@/graphql/mutations';
import { useRouter } from 'next/navigation';

interface registerType {
    title?: string;
    subtitle?: React.ReactNode;
    subtext?: React.ReactNode;
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
    const [email, setEmail] = useState('');
    const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const res = await register({
                variables: {
                    registerRequest: {
                        email,
                    },
                },
            });
            if (res.data?.register?.status === "success") {
                router.push("/authentication/login");
            }
        } catch (err) {
            // Error handled by Apollo
        }
    };

    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Box component="form" onSubmit={handleRegister}>
                <Stack mb={3}>
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='email' mb="5px">Email Address</Typography>
                    <CustomTextField
                        id="email"
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </Stack>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Registering..." : "Sign Up"}
                </Button>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error.message}</Alert>}
                {data?.register?.msg && (
                    <Alert
                        severity={data.register.status === "SUCCESS" ? "success" : "error"}
                        sx={{ mt: 2 }}
                    >
                        {data.register.msg}
                    </Alert>
                )}
            </Box>
            {subtitle}
        </>
    );
};

export default AuthRegister;
