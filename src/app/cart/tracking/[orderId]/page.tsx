'use client';
import React from "react";
import RouteMap from "@/components/RouteMap"; // Import RouteMap
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
    } catch (err: any) {
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
  console.log(rider, "*&*&^")

  if (!order) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="warning">Order not found.</Alert>
      </Box>
    );
  }

  // Assuming order.pickupLocation and order.deliveryAddress have latitude and longitude
  const originCoords = {
    lat: order.pickupLocation?.latitude || -1.286389, // Default to Nairobi coordinates if not available
    lng: order.pickupLocation?.longitude || 36.817223,
  };

  const destinationCoords = {
    lat: order.deliveryAddress?.latitude || -1.292066, // Default to Nairobi coordinates if not available
    lng: order.deliveryAddress?.longitude || 36.821946,
  };

  return (
    <Box sx={{ p: { xs: 0, md: 0 }, minHeight: "100vh" }}>
      {/* Order Details Section */}
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          p: { xs: 2, md: 4 },
          borderRadius: 0,
          boxShadow:
            "0 4px 10px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.1)",
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


        {/* Rider Section Accordion */}
        {rider && (
          <Card
            sx={{
              mb: 2,
              p: 2,
              border: "1px solid #ffd700",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              borderRadius: 2,
            }}
          >
            <CardHeader
              avatar={
                // <Avatar
                //   src={rider.imageUrl}
                //   alt={rider.firstName}
                //   sx={{
                //     width: 64,
                //     height: 64,
                //     border: "2px solid #ffd700",
                //     boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                //   }}
                // />
                <></>
              }
              title={
                // <Typography variant="h6" fontWeight={600}>
                //   Rider Details
                // </Typography>
                <></>
              }
            />

            <CardContent>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Avatar
                    src={rider.imageUrl}
                    alt={rider.firstName}
                    sx={{
                      width: 64,
                      height: 64,
                      border: "2px solid #ffd700",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      mb: 2,
                    }}
                  />
                  <Typography variant="body1">
                    <strong>Name:</strong> {rider.firstName} {rider.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {rider.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {rider.phone}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box>
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
                        textTransform: "none",
                        fontWeight: 600,
                      }}
                    >
                      {confirming ? <CircularProgress size={24} /> : 'Mark as Received'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Map Section */}
        <Box
          sx={{
            width: "100%",
            height: "50vh", // Map takes 50% of viewport height
            borderRadius: 0,
            overflow: "hidden",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <RouteMap origin={originCoords} destination={destinationCoords} />
        </Box>






        {/* Order Details Accordion */}
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight={600}>Order Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>

        {/* Items Summary Accordion */}
        <Accordion defaultExpanded sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" fontWeight={600}>Items Summary</Typography>
          </AccordionSummary>
          <AccordionDetails>
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
          </AccordionDetails>
        </Accordion>


      </Paper>
    </Box>
  );
};

export default TrackingPage;