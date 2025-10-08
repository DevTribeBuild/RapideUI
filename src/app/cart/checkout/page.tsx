
'use client';
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import { CREATE_ORDER_MUTATION } from '@/graphql/order/mutations';
import { CREATE_PAYMENT_MUTATION } from '@/graphql/payment/mutations';
import { CLEAR_CART_MUTATION } from '@/graphql/cart/mutations';
import toast from 'react-hot-toast';
import { Grid, Typography, Paper, Button, Divider, TextField, Tabs, Tab, Box, Stack, Stepper, Step, StepLabel, CircularProgress, Skeleton } from "@mui/material";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/useAuthStore";

const ConnectWalletButton = () => (
  <Button variant="contained" color="primary" fullWidth>
    Connect Wallet
  </Button>
);

type CartItem = {
  product: {
    id: string;
    name: string;
    price: number;
  };
  quantity: number;
};

type MyCartQuery = {
  myCart: {
    id: string;
    items: CartItem[];
  } | null;
};

type CreateOrderMutationVariables = {
  input: {
    cartId: string;
    deliveryAddress: string;
    notes: string;
    deliveryLat: number;
    deliveryLng: number;
  };
};

type CreatePaymentMutationVariables = {
  input: {
    orderId: string;
    amount: number;
  };
};

const steps = ['Shipping Information', 'Confirm Order', 'Payment', 'Order Complete'];

const CheckoutPage = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [tab, setTab] = useState(0);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [deliveryLat, setDeliveryLat] = useState<number | null>(null);
  const [deliveryLng, setDeliveryLng] = useState<number | null>(null);

  const { data: cartData, loading: cartLoading, error: cartError } = useQuery<MyCartQuery>(MY_CART_QUERY, {
    skip: !token,
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        useAuthStore.getState().clearAuth();
      }
    }
  });
  const [createOrder, { loading: createOrderLoading }] = useMutation<any, CreateOrderMutationVariables>(CREATE_ORDER_MUTATION);
  const [createPayment, { loading: createPaymentLoading }] = useMutation<any, CreatePaymentMutationVariables>(CREATE_PAYMENT_MUTATION);
  const [clearCart] = useMutation(CLEAR_CART_MUTATION);
  const [localCartId, setLocalCartId] = useState<string | null>(null);

  useEffect(() => {
    if (cartData?.myCart?.id) {
      setLocalCartId(cartData.myCart.id);
    }
  }, [cartData]);

  const cartItems = cartData?.myCart?.items || [];
  const total = cartItems.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDeliveryLat(position.coords.latitude);
          setDeliveryLng(position.coords.longitude);
          toast.success("Location fetched successfully!");
        },
        (error) => {
          toast.error(`Error getting location: ${error.message}`);
        }
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!fullName || !email || !address || !city || !postalCode || !country) {
        toast.error("Please fill in all shipping information fields.");
        return;
      }
      if (deliveryLat === null || deliveryLng === null) {
        toast.error("Please provide your delivery location.");
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    const deliveryAddress = `${address}, ${city}, ${postalCode}, ${country}`;

    if (!localCartId) {
      toast.error("Cart ID is missing. Please try again.");
      return;
    }

    try {
      const orderResponse = await createOrder({
        variables: {
          input: {
            cartId: localCartId,
            deliveryAddress,
            notes: "",
            deliveryLat: deliveryLat!,
            deliveryLng: deliveryLng!,
          },
        },
      });
      const newOrderId = orderResponse.data.createOrder.id;
      setOrderId(newOrderId);
      toast.success("Order placed successfully!");
      handleNext();
    } catch (err) {
      console.error("Error creating order:", err);
      toast.error("Failed to place order.");
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("Order ID is missing. Cannot process payment.");
      return;
    }

    try {
      // await createPayment({
      //   variables: {
      //     input: {
      //       orderId,
      //       amount: total,
      //     },
      //   },
      // });
      toast.success("Payment successful!");
      await clearCart();
      handleNext();
    } catch (err) {
      console.error("Error processing payment:", err);
      toast.error("Failed to process payment.");
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
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
            <Grid size={{xs:12}}>
              <Button variant="outlined" fullWidth onClick={getCurrentLocation} sx={{ mt: 2 }}>
                Use Current Location
              </Button>
              {deliveryLat !== null && deliveryLng !== null && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  Location: {deliveryLat.toFixed(4)}, {deliveryLng.toFixed(4)}
                </Typography>
              )}
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cartLoading ? (
              <Stack spacing={1} sx={{ width: '100%' }}>
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Skeleton variant="rectangular" width="100%" height={40} />
                <Divider sx={{ my: 2 }} />
                <Skeleton variant="rectangular" width="100%" height={50} />
              </Stack>
            ) : cartError ? (
              <Typography color="error">Error: {cartError.message}</Typography>
            ) : (
              <>
                {cartItems.map((item: any) => (
                  <Box key={item.product.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{item.product.name} x {item.quantity}</Typography>
                    <Typography>Kes{(item.product.price * item.quantity).toFixed(2)}</Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">Kes{total.toFixed(2)}</Typography>
                </Box>
              </>
            )}
          </Paper>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Details
            </Typography>
            <Tabs value={tab} onChange={handleTabChange} centered>
              <Tab label="Zyntra wallet" />
              <Tab label="Mpesa" disabled/>
              <Tab label="Card" disabled/>
              <Tab label="Crypto" disabled/>
            </Tabs>
            <Box mt={3}>
              {tab === 0 && (
                <Stack spacing={2}>
                  <Button variant="contained" color="primary" fullWidth onClick={handlePayment} disabled={createPaymentLoading}>
                    {createPaymentLoading ? 'Processing...' : `Pay with Zyntra Wallet`}
                  </Button>
                </Stack>
              )}
              {tab === 1 && (
                <Stack spacing={2}>
                  <TextField label="Card Number" fullWidth />
                  <TextField label="Expiry Date" fullWidth />
                  <TextField label="CVV" fullWidth />
                  <Button variant="contained" color="primary" fullWidth onClick={handlePayment} disabled={createPaymentLoading}>
                    {createPaymentLoading ? 'Processing...' : `Pay with Card`}
                  </Button>
                </Stack>
              )}
              {tab === 2 && (
                <Stack spacing={2}>
                  <TextField
                    label="Mpesa Phone Number"
                    fullWidth
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                  <Button variant="contained" color="success" fullWidth onClick={handlePayment} disabled={createPaymentLoading}>
                    {createPaymentLoading ? 'Processing...' : `Send Mpesa Prompt`}
                  </Button>
                </Stack>
              )}
              {tab === 3 && (
                <Stack spacing={2}>
                  <ConnectWalletButton />
                  <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }} onClick={handlePayment} disabled={createPaymentLoading}>
                    {createPaymentLoading ? 'Processing...' : `Pay with Crypto`}
                  </Button>
                </Stack>
              )}
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Thank you for your order!
            </Typography>
            <Typography variant="subtitle1">
              Your order number is #{orderId}. We have emailed your order confirmation, and will send you an update when your order has shipped.
            </Typography>
            <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={() => router.push('/cart/tracking')}>
              Track Order
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Grid container sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Grid size={{xs:12}}>
        <Paper elevation={3} sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Thank you for your order.
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #{orderId}. We have emailed your order
                confirmation, and will send you an update when your order has
                shipped.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && activeStep < 3 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}
                {activeStep < 2 && (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
                {activeStep === 1 && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePlaceOrder}
                    disabled={createOrderLoading}
                    sx={{ ml: 1 }}
                  >
                    {createOrderLoading ? <CircularProgress size={24} /> : 'Place Order'}
                  </Button>
                )}
              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CheckoutPage;
