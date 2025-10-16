
"use client";
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_RIDER_ORDERS_QUERY } from '@/graphql/rider/queries';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Stack,
} from '@mui/material';

type Order = {
  id: string;
  status: string;
  total: number;
  deliveryAddress: string;
  notes?: string;
  cart: {
    items: {
      id: string;
      quantity: number;
      product: {
        name: string;
        price: number;
      };
    }[];
  };
};

const AssignedOrders = () => {
  const { data, loading, error } = useQuery(GET_RIDER_ORDERS_QUERY);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleOpen = (order) => {
    setSelectedOrder(order);
  };

  const handleClose = () => {
    setSelectedOrder(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">Error fetching orders: {error.message}</Alert>;
  }

  const orders = data?.getRiderOrders || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Assigned Orders
      </Typography>
      <Grid container spacing={3} sx={{ m: 2 }}>
        {orders.map((order) => (
          <Grid  size={{xs:12, sm:6, md:4}} key={order.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Order #{order.id.substring(0, 8)}</Typography>
                <Typography color="textSecondary">Status: {order.status}</Typography>
                <Typography>Total: Kes {order.total}</Typography>
                <Button onClick={() => handleOpen(order)} size="small" sx={{ mt: 2 }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

       <Dialog
      open={!!selectedOrder}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
        },
      }}
    >
      {selectedOrder && (
        <>
          <DialogTitle sx={{ fontWeight: 600, borderBottom: "1px solid #eee" }}>
            🧾 Order Details
          </DialogTitle>

          <DialogContent dividers>
            <Stack spacing={2}>
              {/* Header Section */}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Order #{selectedOrder.id}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" mt={1}>
                  <Chip
                    label={selectedOrder.status}
                    color={
                      selectedOrder.status === "Delivered"
                        ? "success"
                        : selectedOrder.status === "Pending"
                        ? "warning"
                        : "info"
                    }
                    size="small"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Total:{" "}
                    <Typography
                      component="span"
                      sx={{ fontWeight: 600, color: "text.primary" }}
                    >
                      KES {selectedOrder.total.toLocaleString()}
                    </Typography>
                  </Typography>
                </Stack>
              </Box>

              <Divider />

              {/* Delivery Info */}
              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Delivery Information
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Address: {selectedOrder.deliveryAddress}
                </Typography>
                {selectedOrder.notes && (
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "text.secondary",
                    }}
                  >
                    Notes: {selectedOrder.notes}
                  </Typography>
                )}
              </Stack>

              <Divider />

              {/* Items Section */}
              <Stack spacing={1}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Items
                </Typography>

                <Box
                  sx={{
                    border: "1px solid #eee",
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: "#fafafa",
                  }}
                >
                  {selectedOrder?.cart?.items?.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        py: 0.5,
                        "&:not(:last-child)": {
                          borderBottom: "1px dashed #e0e0e0",
                        },
                      }}
                    >
                      <Typography variant="body2">
                        {item.product.name}{" "}
                        <Typography
                          component="span"
                          color="text.secondary"
                        >
                          (x{item.quantity})
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500 }}
                      >
                        KES {(item.product.price * item.quantity).toLocaleString()}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ borderTop: "1px solid #eee", p: 2 }}>
            <Button
              onClick={handleClose}
              variant="outlined"
              color="primary"
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Close
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
    </Box>
  );
};

export default AssignedOrders;
