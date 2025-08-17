'use client';
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import { CREATE_ORDER_MUTATION } from '@/graphql/order/mutations';
import { CLEAR_CART_MUTATION } from '@/graphql/cart/mutations';
import toast from 'react-hot-toast';
import { Grid, Typography, Paper, Button, Divider, TextField, Tabs, Tab, Box, Stack, CircularProgress, Skeleton } from "@mui/material";
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
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(MY_CART_QUERY);
  const [createOrder, { loading: createOrderLoading }] = useMutation(CREATE_ORDER_MUTATION);
  const [clearCart] = useMutation(CLEAR_CART_MUTATION);

  const cartItems = cartData?.myCart?.items || [];
  const cartId = cartData?.myCart?.id;

  const calculateTotal = () => {
    return cartItems.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);
  };

  const total = calculateTotal();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleCheckout = async () => {
    if (!fullName || !email || !address || !city || !postalCode || !country) {
        toast.error("Please fill in all shipping information fields.");
        return;
    }

    const deliveryAddress = `${address}, ${city}, ${postalCode}, ${country}`;

    try {
        await createOrder({
            variables: {
                input: {
                    cartId,
                    deliveryAddress,
                    notes: "", // You can add a notes field if you want
                },
            },
        });
        toast.success("Order placed successfully!");
        await clearCart();
        router.push("/cart/tracking");
    } catch (err) {
        console.error("Error creating order:", err);
        toast.error("Failed to place order.");
    }
  }

  const gridSize = { xs: 12, md: 6 };
  return (
    <Grid container sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Grid size={{ xs: 12 }}>
        <Paper elevation={3} sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Checkout & Payment
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <OrderStatusStepper status="Order Placed" />
          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
                <Typography variant="h6" gutterBottom>
                    Shipping Information
                </Typography>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Full Name" fullWidth value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Address" fullWidth value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="City" fullWidth value={city} onChange={(e) => setCity(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Postal Code" fullWidth value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                    <TextField label="Country" fullWidth value={country} onChange={(e) => setCountry(e.target.value)} />
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
                        <Button variant="contained" color="primary" fullWidth onClick={handleCheckout} disabled={createOrderLoading || cartLoading}>
                            {createOrderLoading || cartLoading ? 'Processing...' : `Pay with Card`}
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
                        <Button variant="contained" color="success" fullWidth onClick={handleCheckout} disabled={createOrderLoading || cartLoading}>
                            {createOrderLoading || cartLoading ? 'Processing...' : `Send Mpesa Prompt`}
                        </Button>
                    </Stack>
                    )}
                    {tab === 2 && (
                    <Stack spacing={2}>
                        <ConnectWalletButton />
                        <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handleCheckout} disabled={createOrderLoading || cartLoading}>
                            {createOrderLoading || cartLoading ? 'Processing...' : `Pay with Crypto`}
                        </Button>
                    </Stack>
                    )}
                </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
                <Typography variant="h6" gutterBottom>
                    Order Summary
                </Typography>
                {cartLoading ? (
                    <Stack spacing={1} sx={{ width: '100%' }}>
                        <Skeleton variant="rectangular" width="100%" height={40} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                        <Skeleton variant="rectangular" width="100%" height={40} />
                        <Divider sx={{ my: 2 }} />
                        <Skeleton variant="rectangular" width="100%" height={50} />
                    </Stack>
                ) : cartError ? (
                    <Typography color="error">Error: {cartError.message}</Typography>
                ) : (
                    <Paper elevation={1} sx={{ p: 2 }}>
                        {cartItems.map((item: any) => (
                            <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>{item.product.name} x {item.quantity}</Typography>
                                <Typography>${(item.product.price * item.quantity).toFixed(2)}</Typography>
                            </Box>
                        ))}
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6">${total.toFixed(2)}</Typography>
                        </Box>
                    </Paper>
                )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CheckoutPage;