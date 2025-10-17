'use client';
import React, { useState } from "react";
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
import { useQuery, useMutation } from "@apollo/client";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import { GET_ORDER_QUERY } from "@/graphql/order/queries";
import { UPDATE_ORDER_STATUS_MUTATION } from "@/graphql/order/mutations";
import toast from "react-hot-toast";

const ReceivedPage = () => {
  const { orderId } = useParams();
  const [isReceived, setIsReceived] = useState(false);

  const { data, loading, error } = useQuery(GET_ORDER_QUERY, {
    variables: { orderId },
  });

  const [updateOrderStatus, { loading: updatingStatus }] = useMutation(
    UPDATE_ORDER_STATUS_MUTATION,
    {
      onCompleted: () => {
        toast.success("Order marked as received!");
        setIsReceived(true);
      },
      onError: (error) => {
        toast.error(`Error updating order: ${error.message}`);
      },
    }
  );

  const handleMarkAsReceived = () => {
    updateOrderStatus({ variables: { orderId, status: "Delivered" } });
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
        <Paper elevation={3} sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Order Received
          </Typography>
          <OrderStatusStepper status={isReceived ? "Delivered" : order.status} />

          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Typography>Order ID: <b>{order.id}</b></Typography>
              <Typography>Status: <b>{isReceived ? "Delivered" : order.status}</b></Typography>
              <Typography>Delivery Address: <b>{order.deliveryAddress}</b></Typography>
              <Typography>Placed At: <b>{new Date(order.createdAt).toLocaleString()}</b></Typography>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">Items:</Typography>
                {order?.cart?.items?.map((item: any, idx: number) => (
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
            </>
          )}
          <br/><br/>
          <Button 
            variant="contained" 
            onClick={handleMarkAsReceived} 
            disabled={isReceived || updatingStatus}
            color="primary"
          >
            {updatingStatus ? <CircularProgress size={24} /> : "Mark as Received"}
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReceivedPage;