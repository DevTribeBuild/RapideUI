"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION, REQUEST_OTP_MUTATION } from "@/graphql";
import { useRouter } from "next/navigation";
import { handleLoginHelper } from "@/helpers/authHelper";
import {
  Typography,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import useAuthStore, { User } from '@/stores/useAuthStore';
import toast from "react-hot-toast";

interface loginType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

type RequestOtpMutationResult = {
  requestOtp: {
    status: string;
    msg: string;
  };
};

type RequestOtpMutationVariables = {
  requestOtp: {
    email: string;
  };
};

type LoginMutationResult = {
  login: {
    token: string;
    msg: string;
    user: User;
  };
};

type LoginMutationVariables = {
  loginRequest: {
    email: string;
    otp: string;
  };
};

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const { setToken, setUser } = useAuthStore.getState();
  const router = useRouter();
  const [step, setStep] = useState<"REQUEST_OTP" | "LOGIN">("REQUEST_OTP");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [requestOtp, { loading: otpLoading }] = useMutation<RequestOtpMutationResult, RequestOtpMutationVariables>(REQUEST_OTP_MUTATION);
  const [login, { loading: loginLoading }] = useMutation<LoginMutationResult, LoginMutationVariables>(LOGIN_MUTATION);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      const res = await requestOtp({
        variables: { requestOtp: { email } },
      });

      if (res.data?.requestOtp.status === "success") {
        if (res.data.requestOtp) {
          toast.success(res.data.requestOtp.msg || "OTP sent to your email.");
          setStep("LOGIN");
        } else {
          toast.error("Failed to send OTP.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error("Please enter the OTP.");
      return;
    }
    try {
      const res = await login({
        variables: { loginRequest: { email, otp } },
      });

      if (res.data?.login) {
        if (res.data.login.token) {
          toast.success(res.data.login.msg || "Login successful!");
          await handleLoginHelper(res.data.login.token, res.data.login.user, router);
        } else {
          toast.error(res.data.login.msg || "Login failed.");
        }
      }
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred.");
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
          variant="outlined"
        />
        {step === "LOGIN" && (
          <TextField
            label="OTP"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            fullWidth
            variant="outlined"
          />
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={otpLoading || loginLoading}
          fullWidth
          size="large"
        >
          {step === "REQUEST_OTP"
            ? otpLoading
              ? "Requesting OTP..."
              : "Request OTP"
            : loginLoading
            ? "Logging in..."
            : "Login"}
        </Button>
      </Stack>
      {subtitle}
    </form>
  );
};

export default AuthLogin;
