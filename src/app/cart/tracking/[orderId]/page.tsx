'use client';
import React from "react";
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
} from "@mui/material";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import { GET_ORDER_QUERY } from "@/graphql/order/queries";

const RiderMap = ({ lat, lng }: { lat: number; lng: number }) => (
  <Box sx={{ width: "100%", height: 300, mt: 2, borderRadius: 2, overflow: "hidden" }}>
    <iframe
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 0 }}
      src={`https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
      allowFullScreen
      aria-hidden="false"
      tabIndex={0}
      title="Rider Location"
    />
  </Box>
);

const TrackingPage = () => {
  const { orderId } = useParams();
  const { data, loading, error } = useQuery(GET_ORDER_QUERY, {
    variables: { orderId },
  });

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
        <Paper elevation={3} sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Tracking
          </Typography>
          <OrderStatusStepper status={order.status} />

          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Typography>Order ID: <b>{order.id}</b></Typography>
              <Typography>Status: <b>{order.status}</b></Typography>
              <Typography>Delivery Address: <b>{order.deliveryAddress}</b></Typography>
              <Typography>Placed At: <b>{new Date(order.createdAt).toLocaleString()}</b></Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Items:</Typography>
                {order.cart.items.map((item: any, idx: number) => (
                  <Typography key={idx}>
                    {item.quantity} × {item.product.name} — Kes {item.product.price.toFixed(2)}
                  </Typography>
                ))}
                <Typography sx={{ mt: 1 }} fontWeight="bold">
                  Total: Kes {order.total.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {rider && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                Rider Details
              </Typography>
              <Grid container alignItems="center" spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Avatar src={rider.imageUrl} alt={rider.firstName} sx={{ width: 56, height: 56 }} />
                </Grid>
                <Grid size={{ xs: 8 }}>
                  <Typography>Name: <b>{rider.firstName} {rider.lastName}</b></Typography>
                  <Typography>Phone: <b>{rider.phone}</b></Typography>
                </Grid>
              </Grid>
              <Typography variant="h6" sx={{ mt: 3 }}>
                Rider&apos;s Real-Time Location
              </Typography>
              <RiderMap lat={order.deliveryLat} lng={order.deliveryLng} />
            </>
          )}
          <br/><br/>
          <Button variant="contained" href={`/cart/received/${order.id}`} disableElevation color="primary">
            Mark as Received
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrackingPage;