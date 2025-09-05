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
} from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { RIDER_ORDERS_QUERY } from '@/graphql/order/queries';
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

type RiderOrdersQuery = {
    riderOrders: Order[];
};

const RiderOrdersPage = () => {
    const { token } = useAuthStore();
    const router = useRouter();
    const { data, loading, error } = useQuery<RiderOrdersQuery>(RIDER_ORDERS_QUERY, {
        skip: !token,
        onError: (err) => {
            console.error("Error fetching rider orders:", err);
            if (err.message === 'Unauthorized') {
                useAuthStore.getState().clearAuth();
            }
        },
    });

    if (loading) return <Typography>Loading assigned orders...</Typography>;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;

    const orders = data?.riderOrders || [];

    return (
        <PageContainer title="Assigned Orders" description="View your assigned orders">
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Assigned Orders
                </Typography>
                <br />
                {orders.length === 0 ? (
                    <Typography>You have no assigned orders yet.</Typography>
                ) : (
                    <Paper elevation={3}>
                        <List>
                            {orders.map((order) => (
                                <React.Fragment key={order.id}>
                                    <ListItemButton onClick={() => router.push(`/cart/orders/${order.id}`)}>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="h6">Order ID: {order.id}</Typography>
                                                    <Chip label={order.status} color={order.status === 'DELIVERED' ? 'success' : 'warning'} />
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2">Total: ${order.total.toFixed(2)}</Typography>
                                                    <Typography variant="body2">Delivery Address: {order.deliveryAddress}</Typography>
                                                    <Typography variant="body2">Ordered On: {new Date(order.createdAt).toLocaleDateString()}</Typography>
                                                </>
                                            }
                                        />
                                    </ListItemButton>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                )}
            </Container>
        </PageContainer>
    );
};

export default RiderOrdersPage;
