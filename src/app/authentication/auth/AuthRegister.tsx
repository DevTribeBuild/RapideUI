import React, { useState } from 'react';
import { Box, Typography, Button, MenuItem, Skeleton } from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import { useMutation, useQuery } from '@apollo/client';
import { REGISTER_MUTATION, VERIFY_OTP_MUTATION } from '@/graphql';
import { useRouter } from 'next/navigation';
import useAuthStore from '@/stores/useAuthStore';
import { handleLoginHelper } from '@/helpers/authHelper';
import toast from 'react-hot-toast';
import { GET_FIAT_CURRENCIES } from '@/graphql';

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
        const [register, { loading }] = useMutation(REGISTER_MUTATION);
        const [verifyOtp, { loading: otpLoading }] = useMutation(VERIFY_OTP_MUTATION);
        const router = useRouter();
        const {
                data: fiat_currencies_data,
                loading: loading_fiat_currencies,
                error: error_fiat_currencies,
        } = useQuery(GET_FIAT_CURRENCIES);
        console.log(fiat_currencies_data, "(*&*^&%^")

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
                                if (res.data.register.status === "SUCCESS") {
                                        toast.success(res.data.register.msg || "Registration successful. Check your email for OTP.");
                                        setStep('verify');
                                } else {
                                        toast.error(res.data.register.msg || "Registration failed.");
                                }
                        }
                } catch (err: any) {
                        toast.error(err?.message || "An unexpected error occurred.");
                }
        };

        const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                try {
                        const res = await verifyOtp({
                                variables: {
                                        email,
                                        otp,
                                },
                        });
                        if (res.data?.verifyOtp) {
                                if (res.data.verifyOtp.status === "SUCCESS") {
                                        toast.success(res.data.verifyOtp.msg || "OTP verified successfully!");
                                        setToken(res.data.verifyOtp.token);
                                        await handleLoginHelper(res.data.verifyOtp.token);
                                        setUser(res.data.verifyOtp.user);
                                        router.push("/explore");
                                } else {
                                        toast.error(res.data.verifyOtp.msg || "OTP verification failed.");
                                }
                        }
                } catch (err: any) {
                        toast.error(err?.message || "An unexpected error occurred.");
                }
        };

        return (
                <>
                        {title && (
                                <Typography fontWeight="700" variant="h2" mb={1}>
                                        {title}
                                </Typography>
                        )}

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
                                                {loading_fiat_currencies ? (
                                                        <Skeleton variant="rectangular" height={56} width="100%" sx={{ borderRadius: 1 }} />
                                                ) : (
                                                        <CustomTextField
                                                                id="currency"
                                                                select
                                                                variant="outlined"
                                                                fullWidth
                                                                value={currencyCode}
                                                                onChange={(e) => setCurrencyCode(e.target.value)}
                                                                required
                                                        >
                                                                {fiat_currencies_data?.currencies?.length > 0 ? (
                                                                        fiat_currencies_data.currencies.map((currency: any) => (
                                                                                <MenuItem key={currency.code} value={currency.code}>
                                                                                        {currency.name} ({currency.code})
                                                                                </MenuItem>
                                                                        ))
                                                                ) : (
                                                                        <MenuItem disabled value="">
                                                                                No currencies found
                                                                        </MenuItem>
                                                                )}
                                                        </CustomTextField>
                                                )}
                                        </Stack>
                                        <Stack mb={3}>
                                                <Typography
                                                        variant="subtitle1"
                                                        fontWeight={600}
                                                        component="label"
                                                        htmlFor="email"
                                                        mb="5px"
                                                >
                                                        Email Address
                                                </Typography>
                                                <CustomTextField
                                                        id="email"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
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
                                                        onChange={(e) => setOtp(e.target.value)}
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
                                </Box>
                        )}

                        {subtitle}
                </>
        );
};

export default AuthRegister;
