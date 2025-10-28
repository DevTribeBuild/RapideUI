'use client';
import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
    Button,
    Card,
    Grid,
} from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { MY_ORDERS_QUERY } from '@/graphql/order/queries';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import useAuthStore from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

type Product = {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
};

type CartItem = {
    id: string;
    createdAt: string;
    updatedAt: string;
    quantity: number;
    product: Product;
};

type Order = {
    id: string;
    status: string;
    deliveryAddress: string;
    deliveryLat: number;
    deliveryLng: number;
    notes: string;
    assignedRiderId: string;
    createdAt: string;
    updatedAt: string;
    total: number;
    payment: {
        amount: number;
        method: string;
    };
    cart: {
        id: string;
        createdAt: string;
        updatedAt: string;
        total: number;
        items: CartItem[];
    };
};

type MyOrdersQuery = {
    myOrders: Order[];
};

const Orders = () => {
    const { token } = useAuthStore();
    const router = useRouter();
    const { data, loading, error } = useQuery<MyOrdersQuery>(MY_ORDERS_QUERY, {
        skip: !token,
        onError: (err) => {
            console.error("Error fetching orders:", err);
            if (err.message === 'Unauthorized') {
                useAuthStore.getState().clearAuth();
            }
        },
    });

    if (loading) return <Typography>Loading orders...</Typography>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    const orders = data?.myOrders || [];

    return (
        <PageContainer title="My Orders" description="View your past orders">
  <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
    {/* Page Header */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        mb: 3,
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        gutterBottom
        color="text.primary"
      >
        My Orders
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Review your past orders and track deliveries in real time.
      </Typography>
    </Box>

    {/* No Orders */}
    {orders.length === 0 ? (
      <Box
        sx={{
          textAlign: "center",
          mt: 6,
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" gutterBottom color="text.secondary">
          You have no orders yet.
        </Typography>
        <Typography variant="body2" color="text.disabled">
          When you place an order, it will appear here.
        </Typography>
      </Box>
    ) : (
      <Grid container spacing={2}>
        {orders.map((order) => (
          <Grid size={{xs:12, sm:6, md:4}} key={order.id} sx={{ mb: 3 }}>
            <Card
              elevation={2}
              sx={{
                p: 2.5,
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                },
              }}
            >
              {/* Order Header */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{ color:"#ffd700" }}
                >
                  Order #{order.id}
                </Typography>
                <Chip
                  label={order.status}
                  color={
                    order.status === "DELIVERED"
                      ? "success"
                      : order.status === "PENDING"
                      ? "warning"
                      : "info"
                  }
                  size="small"
                  sx={{ fontWeight: 500 }}
                />
              </Box>

              {/* Order Info */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Ordered On:{" "}
                  <strong>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total: <strong>KES {order.total.toFixed(2)}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Items: <strong>{order.cart?.items?.length || 0}</strong>
                </Typography>
              </Box>

              <Divider sx={{ my: 1.5 }} />

              {/* Actions */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: "auto",
                }}
              >
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => router.push(`/cart/tracking/${order.id}`)}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  View Details
                </Button>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontStyle: "italic" }}
                >
                  {order.status === "DELIVERED"
                    ? "Delivered"
                    : "In Progress"}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </Container>
</PageContainer>

    );
};

export default Orders;