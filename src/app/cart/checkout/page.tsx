'use client'
import React, { useState } from "react";
import { Grid, Typography, Paper, Button, Divider, TextField, Tabs, Tab, Box, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";

// Dummy wallet connect button (replace with your actual wallet integration)
const ConnectWalletButton = () => (
  <Button variant="contained" color="primary" fullWidth>
    Connect Wallet
  </Button>
);

const CheckoutPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState(0);
  const [phone, setPhone] = useState("");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const proceedToTracking = () =>{
    // Logic to proceed to tracking page
    console.log("Proceeding to tracking page...");
    // You can use router.push('/tracking') if using Next.js or similar routing
    router.push('/cart/tracking');
  }

  const gridSize = { xs: 12, md: 6 };
  return (
    <Grid container sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Grid size={12}>
        <Paper elevation={3} sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Checkout & Payment
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <OrderStatusStepper status="Order Placed" />
          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Shipping Information
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Full Name" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Email" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Address" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="City" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Postal Code" fullWidth />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Country" fullWidth />
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label="Card" />
            <Tab label="Mpesa" />
            <Tab label="Crypto" />
          </Tabs>
          <Box mt={3}>
            {tab === 0 && (
              <Stack spacing={2}>
                <TextField label="Card Number" fullWidth />
                <TextField label="Expiry Date" fullWidth />
                <TextField label="CVV" fullWidth />
                <Button variant="contained" color="primary" fullWidth onClick={proceedToTracking}>
                  Pay with Card
                </Button>
              </Stack>
            )}
            {tab === 1 && (
              <Stack spacing={2}>
                <TextField
                  label="Mpesa Phone Number"
                  fullWidth
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
                <Button variant="contained" color="success" fullWidth onClick={proceedToTracking}>
                  Send Mpesa Prompt
                </Button>
              </Stack>
            )}
            {tab === 2 && (
              <Stack spacing={2}>
                <ConnectWalletButton />
                <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={proceedToTracking}>
                  Pay with Crypto
                </Button>
              </Stack>
            )}
          </Box>

          {/* <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            // onClick={handlePayment}
          >
            Pay Now
          </Button> */}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CheckoutPage;