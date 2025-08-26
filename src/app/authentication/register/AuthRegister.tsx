import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { REGISTER_MUTATION } from "@/graphql";
import { Button, TextField, Alert, Stack } from "@mui/material";
import { useRouter } from "next/navigation";

type RegisterMutationResult = {
  register: {
    status: string;
    msg: string;
  };
};

type RegisterMutationVariables = {
  registerRequest: {
    email: string;
  };
};

const AuthRegister = ({ subtext, subtitle }: any) => {
  const [email, setEmail] = useState("");
  const [register, { data, loading, error }] = useMutation<RegisterMutationResult, RegisterMutationVariables>(REGISTER_MUTATION);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await register({
        variables: {
          registerRequest: { email },
        },
      });
      if (res.data?.register?.status === "SUCCESS") {
        router.push("/authentication/login");
      }
    } catch (err) {
      // Error handled by Apollo
    }
  };

  return (
    <form onSubmit={handleRegister}>
      {subtext}
      <Stack spacing={2} mt={2}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? "Registering..." : "Register"}
        </Button>
        {error && <Alert severity="error">{error.message}</Alert>}
        {data?.register?.msg && (
          <Alert severity={data.register.status === "SUCCESS" ? "success" : "error"}>
            {data.register.msg}
          </Alert>
        )}
      </Stack>
      {subtitle}
    </form>
  );
};

export default AuthRegister;