'use client';
import React from "react";
import DeliveryTracker from "@/components/DeliveryTracker";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Box,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Stack,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import { GET_ORDER_QUERY } from "@/graphql/order/queries";
import { CONFIRM_ORDER_BY_USER } from "@/graphql/order/mutations";
import toast from 'react-hot-toast';



const TrackingPage = () => {
  const { orderId } = useParams();
  const { data, loading, error, refetch } = useQuery(GET_ORDER_QUERY, {
    variables: { orderId },
  });
  const [confirmOrder, { loading: confirming }] = useMutation(CONFIRM_ORDER_BY_USER);

  const handleMarkAsComplete = async () => {
    const toastId = toast.loading('Completing order...');
    try {
      await confirmOrder({
        variables: { orderId },
      });
      toast.success('Order marked as complete!', { id: toastId });
      refetch();
    } catch (err:any) {
      toast.error(err.message || 'Failed to complete order.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="error">Error loading order details: {error.message}</Alert>
      </Box>
    );
  }

  const order = data?.getOrder;
  const rider = order?.assignedRider;

  if (!order) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="warning">Order not found.</Alert>
      </Box>
    );
  }

  return (
    <Grid container sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Grid size={{ xs: 12 }}>
        <Paper
          elevation={4}
          sx={{
            width: "100%",
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
            "&:hover": { transform: "translateY(-2px)" },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: { xs: "center", md: "left" }, mb: 3 }}>
            <Typography
              variant="h4"
              fontWeight={700}
              gutterBottom
              color="primary"
            >
              Order Tracking
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your order status, delivery details, and rider info below.
            </Typography>
          </Box>

          {/* Stepper */}
          <OrderStatusStepper status={order.status} />
          <Divider sx={{ my: 3 }} />

          {/* Order Details Section */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ mb: 1, color: "text.primary" }}
                >
                  Order Details
                </Typography>
                <Stack spacing={0.8}>
                  <Typography variant="body2">
                    <strong>Order ID:</strong> {order.id}
                  </Typography>
                  <Typography variant="body2" component="div">
                    <strong>Status:</strong>{" "}
                    <Chip
                      label={order.status}
                      color={
                        order.status === "Delivered"
                          ? "success"
                          : order.status === "Pending"
                            ? "warning"
                            : "info"
                      }
                      size="small"
                    />
                  </Typography>
                  <Typography variant="body2">
                    <strong>Delivery Address:</strong> {order.deliveryAddress}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Placed At:</strong>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </Typography>
                </Stack>
              </Box>
            </Grid>

            {/* Items Summary */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  borderRadius: 2,
                  p: 2,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{ mb: 1, color: "text.primary" }}
                >
                  Items
                </Typography>
                <Stack spacing={0.5}>
                  {order?.cart?.items?.map((item: any, idx: number) => (
                    <Typography key={idx} variant="body2">
                      {item.quantity} × {item?.product?.name} —{" "}
                      <strong>Kes {item?.product?.price.toFixed(2)}</strong>
                    </Typography>
                  ))}
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="body1" fontWeight={700}>
                  Total: Kes {order.total.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Rider Section */}
          {rider && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography
                variant="h6"
                fontWeight={600}
                sx={{ mb: 2, color: "text.primary" }}
              >
                Rider Details
              </Typography>

              <Grid container alignItems="center" spacing={2}>
                <Grid size={{ xs: 4, sm: 3, md: 2 }}>
                  <Avatar
                    src={rider.imageUrl}
                    alt={rider.firstName}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid #1976d2",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 8, sm: 9, md: 10 }}>
                  <Typography variant="body1">
                    <strong>Name:</strong> {rider.firstName} {rider.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {rider.phone}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 1.5 }}>
                Rider&apos;s Real-Time Location
              </Typography>
              <Box
                sx={{
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}
              >
                <DeliveryTracker orderId={orderId as string} />
              </Box>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Button
                  variant="contained"
                  onClick={handleMarkAsComplete}
                  disabled={order.status === 'DELIVERED' || order.status === 'RECEIVED' || confirming}
                  disableElevation
                  color="primary"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {confirming ? <CircularProgress size={24} /> : 'Mark as Received'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrackingPage;