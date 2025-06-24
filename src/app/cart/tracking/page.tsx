'use client';
import React from "react";
import {
  Grid,
  Typography,
  Paper,
  Divider,
  Box,
  Avatar,
  Button
} from "@mui/material";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";

// Example order and rider data (replace with real data/fetch from API)
const order = {
  id: "ORD-123456",
  items: [
    { name: "Product A", quantity: 2, price: 29.99 },
    { name: "Product B", quantity: 1, price: 15.5 },
  ],
  total: 75.48,
  status: "On the way", // can be "Order Placed", "On the way", "Delivered"
  address: "123 Main St, Springfield",
  placedAt: "2025-06-19 14:32",
};

const rider = {
  name: "Jane Doe",
  phone: "+1234567890",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  vehicle: "Bike",
  currentLocation: { lat: 37.7749, lng: -122.4194 },
};

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

  return (
    <Grid container sx={{ minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Grid size={12}>
        <Paper elevation={3} sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Tracking
          </Typography>
            <OrderStatusStepper status="On the way" />

          <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6" gutterBottom>
                        Order Details
                    </Typography>
                    <Typography>Order ID: <b>{order.id}</b></Typography>
                    <Typography>Status: <b>{order.status}</b></Typography>
                    <Typography>Delivery Address: <b>{order.address}</b></Typography>
                    <Typography>Placed At: <b>{order.placedAt}</b></Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">Items:</Typography>
                        {order.items.map((item, idx) => (
                        <Typography key={idx}>
                            {item.quantity} × {item.name} — ${item.price.toFixed(2)}
                        </Typography>
                        ))}
                        <Typography sx={{ mt: 1 }} fontWeight="bold">
                        Total: ${order.total.toFixed(2)}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>
            Rider Details
          </Typography>
          <Grid container alignItems="center" spacing={2}>
            <Grid size={4}>
              <Avatar src={rider.avatar} alt={rider.name} sx={{ width: 56, height: 56 }} />
            </Grid>
            <Grid size={8}>
              <Typography>Name: <b>{rider.name}</b></Typography>
              <Typography>Phone: <b>{rider.phone}</b></Typography>
              <Typography>Vehicle: <b>{rider.vehicle}</b></Typography>
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Rider&apos;s Real-Time Location
          </Typography>
          <RiderMap lat={rider.currentLocation.lat} lng={rider.currentLocation.lng} />
          <br/><br/>
          <Button variant="contained" href="/cart/received"   disableElevation color="primary" >
            Mark as Received
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default TrackingPage;
