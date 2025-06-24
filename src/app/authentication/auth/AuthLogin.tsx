"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, REQUEST_OTP_MUTATION } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import { handleLoginHelper } from "@/helpers/authHelper";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  Alert,
  TextField,
} from "@mui/material";
import Link from "next/link";
import useAuthStore from '@/stores/useAuthStore'

interface loginType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { setToken, setUser } = useAuthStore.getState();
  const router = useRouter();
  const [step, setStep] = useState<"REQUEST_OTP" | "LOGIN">("REQUEST_OTP");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [requestOtp, { data: otpData, loading: otpLoading, error: otpError }] =
    useMutation(REQUEST_OTP_MUTATION);
  const [login, { data: loginData, loading: loginLoading, error: loginError }] =
    useMutation(LOGIN_MUTATION);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    await requestOtp({
      variables: {
        requestOtp: { email },
      },
    });
    setStep("LOGIN"); // Use string, not number
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({
        variables: {
          loginRequest: { email, otp },
        },
      });
      if (res.data?.login?.token) {
        setToken(res.data.login.token);
        await handleLoginHelper(res.data.login.token);
        setUser(res.data.login.user);
        if (res.data.login.user.userType === "ADMIN") {
          router.push("/"); // Use router to navigate
        } else {
          router.push("/explore"); // Use router to navigate
        }
      }
    } catch {
    }
  };

  return (
    <form onSubmit={step === "REQUEST_OTP" ? handleRequestOtp : handleLogin}>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}
      <Stack spacing={2} mt={2}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          disabled={step === "LOGIN"}
        />
        {step === "LOGIN" && (
          <TextField
            label="OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            fullWidth
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={otpLoading || loginLoading}
          fullWidth
        >
          {step === "REQUEST_OTP"
            ? otpLoading
              ? "Requesting OTP..."
              : "Request OTP"
            : loginLoading
            ? "Logging in..."
            : "Login"}
        </Button>
        {otpError && <Alert severity="error">{otpError.message}</Alert>}
        {otpData?.requestOtp?.msg && (
          <Alert
            severity={
              otpData.requestOtp.status === "SUCCESS" ? "success" : "error"
            }
          >
            {otpData.requestOtp.msg}
          </Alert>
        )}
        {loginError && <Alert severity="error">{loginError.message}</Alert>}
        {loginData?.login?.msg && (
          <Alert
            severity={
              loginData.login.status === "SUCCESS" ? "success" : "error"
            }
          >
            {loginData.login.msg}
          </Alert>
        )}
      </Stack>
      {subtitle}
    </form>
  );
};

export default AuthLogin;
