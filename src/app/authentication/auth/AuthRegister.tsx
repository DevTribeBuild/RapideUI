import React, { useState } from 'react';
import { Box, Typography, Button, Alert, MenuItem } from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useMutation } from '@apollo/client';
import { REGISTER_MUTATION, VERIFY_OTP_MUTATION } from '@/graphql/mutations';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore'
import { handleLoginHelper } from '@/helpers/authHelper';

interface registerType {
        title?: string;
        subtitle?: React.ReactNode;
        subtext?: React.ReactNode;
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
        const [email, setEmail] = useState('');
        const { setToken, setUser } = useAuthStore.getState();
        const [currencyCode, setCurrencyCode] = useState('KES');
        const [step, setStep] = useState<'register' | 'verify'>('register');
        const [otp, setOtp] = useState('');
        const [register, { data, loading, error }] = useMutation(REGISTER_MUTATION);
        const [verifyOtp, { data: otpData, loading: otpLoading, error: otpError }] = useMutation(VERIFY_OTP_MUTATION);
        const router = useRouter();

        const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                try {
                        const res = await register({
                                variables: {
                                        registerRequest: {
                                                email,
                                                currencyCode,
                                        },
                                },
                        });
                        if (res.data?.register) {
                                setStep('verify');
                        }
                } catch (err) {
                        // Error handled by Apollo
                }
        };

        const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                console.log("Verifying OTP for email:", email, "with OTP:", otp);
                try {
                        const res = await verifyOtp({
                                variables: {
                                        email,
                                        otp,
                                },
                        });
                        console.log("OTP verification response:", res.data);
                        if (res.data?.verifyOtp) {
                            setToken(res.data.verifyOtp.token);
                            await handleLoginHelper(res.data.verifyOtp.token);
                            setUser(res.data.verifyOtp.user);
                            router.push("/explore");
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

                        {step === 'register' && (
                                <Box component="form" onSubmit={handleRegister}>
                                        <Stack mb={3}>
                                                <Typography
                                                        variant="subtitle1"
                                                        fontWeight={600}
                                                        component="label"
                                                        htmlFor="currency"
                                                        mb="5px"
                                                >
                                                        Select Currency
                                                </Typography>
                                                <CustomTextField
                                                        id="currency"
                                                        select
                                                        variant="outlined"
                                                        fullWidth
                                                        value={currencyCode}
                                                        onChange={(e) => setCurrencyCode(e.target.value)}
                                                        required
                                                >
                                                        <MenuItem value="KES">Kenyan Shilling (KES)</MenuItem>
                                                        <MenuItem value="USD">US Dollar (USD)</MenuItem>
                                                        <MenuItem value="EUR">Euro (EUR)</MenuItem>
                                                        <MenuItem value="GBP">British Pound (GBP)</MenuItem>
                                                        <MenuItem value="NGN">Naira (NGN)</MenuItem>
                                                </CustomTextField>
                                        </Stack>
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
                        )}

                        {step === 'verify' && (
                                <Box component="form" onSubmit={handleVerifyOtp}>
                                        <Stack mb={3}>
                                                <Typography variant="subtitle1" fontWeight={600} mb="5px">
                                                        Enter OTP sent to your email
                                                </Typography>
                                                <CustomTextField
                                                        id="otp"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={otp}
                                                        onChange={e => setOtp(e.target.value)}
                                                        required
                                                />
                                        </Stack>
                                        <Button
                                                color="primary"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                type="submit"
                                                disabled={otpLoading}
                                        >
                                                {otpLoading ? "Verifying..." : "Verify OTP"}
                                        </Button>
                                        {otpError && <Alert severity="error" sx={{ mt: 2 }}>{otpError.message}</Alert>}
                                        {otpData?.verifyOtp?.msg && (
                                                <Alert
                                                        severity={otpData.verifyOtp.status === "SUCCESS" ? "success" : "error"}
                                                        sx={{ mt: 2 }}
                                                >
                                                        {otpData.verifyOtp.msg}
                                                </Alert>
                                        )}
                                </Box>
                        )}

                        {subtitle}
                </>
        );
};

export default AuthRegister;
