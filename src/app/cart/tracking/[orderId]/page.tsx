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
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import { GET_ORDER_QUERY } from "@/graphql/order/queries";
import { CONFIRM_ORDER_BY_USER } from "@/graphql/order/mutations";
import toast from 'react-hot-toast';
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import PhoneIcon from "@mui/icons-material/Phone";
import CallIcon from "@mui/icons-material/Call";
import useAuthStore from "@/stores/useAuthStore";



const TrackingPage = () => {
  const { orderId } = useParams();
  const { user } = useAuthStore();

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
  console.log(order, "========order details=======");
  const rider = order?.assignedRider;
  const countryCodes: Record<string, string> = {
    ke: "254",
    ug: "256",
    tz: "255",
    rw: "250",
  };

  let fullPhoneNumber = "";
  if (rider) {
    // sanitize phone and build full international number
    const sanitizedPhone = rider?.phone?.replace(/\D/g, "").replace(/^0+/, "");
    const countryCode = countryCodes[rider.locale?.toLowerCase()] || "254";
    fullPhoneNumber = `${countryCode}${sanitizedPhone}`;
  }

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
          background:"#1e1e1e",
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
              maxWidth: 600,
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
                {/* Rider Info */}
                <Grid size={{ md: 6 }}>
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
                    <strong>Phone:</strong> <span style={{ filter: (order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT') ? 'none' : 'blur(5px)' }}>{rider.phone}</span>
                  </Typography>
                </Grid>

                {/* Action Buttons */}
                <Grid
                  size={{ md: 6 }}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: { xs: "flex-start", md: "flex-end" },
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Button
                    variant="contained"
                    onClick={handleMarkAsComplete}
                    disabled={order.status === "DELIVERED" || order.status === "RECEIVED" || confirming}
                    disableElevation
                    color="primary"
                    size="large"
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      textTransform: "none",
                      fontWeight: 500,
                    }}
                  >
                    {confirming ? <CircularProgress size={24} /> : (user?.userType === 'RIDER' ? 'Mark as Delivered' : 'Mark as Received')}
                  </Button>

                  {/* WhatsApp & Call Icons */}
                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    <IconButton
                        color="success"
                        component="a"
                        href={`https://wa.me/${fullPhoneNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!(order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT')}
                        sx={{
                          bgcolor: "#25D366",
                          "&:hover": { bgcolor: "#1DA851" },
                          color: "white",
                        }}
                      >
                        <WhatsAppIcon />
                      </IconButton>

                      <IconButton
                        color="primary"
                        component="a"
                        href={`tel:+${fullPhoneNumber}`}
                        disabled={!(order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT')}
                        sx={{
                          bgcolor: "#1976d2",
                          "&:hover": { bgcolor: "#125ea5" },
                          color: "white",
                        }}
                      >
                        <CallIcon />
                      </IconButton>
                    </Box>
                </Grid>
              </Grid>
            </CardContent>

          </Card>
        )}

        {/* Map Section */}
      {(order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT') && (
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
      )}






        {/* Order Details Accordion */}
        <Accordion defaultExpanded sx={{ mb: 2, background:"#1e1e1e", border:"1px solid #333332"   }}>
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
        <Accordion defaultExpanded sx={{ mb: 2,  background:"#1e1e1e", border:"1px solid #333332" }}>
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
              )
              )}
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