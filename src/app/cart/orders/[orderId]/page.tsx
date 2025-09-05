'use client';
import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Chip,
    CircularProgress,
    Grid,
    TextField,
} from "@mui/material";
import { useQuery } from "@apollo/client/react";
import { GET_ORDER_QUERY } from '@/graphql/order/queries';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import useAuthStore from "@/stores/useAuthStore";
import { useParams } from 'next/navigation';
import Image from 'next/image';

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

type GetOrderQuery = {
    getOrder: Order;
};

const OrderDetailPage = () => {
    const { orderId } = useParams();
    const { token } = useAuthStore();
    const { data, loading, error } = useQuery<GetOrderQuery>(GET_ORDER_QUERY, {
        variables: { orderId },
        skip: !token || !orderId,
        onError: (err) => {
            console.error("Error fetching order details:", err);
            if (err.message === 'Unauthorized') {
                useAuthStore.getState().clearAuth();
            }
        },
    });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error.message}</Typography>;
    if (!data?.getOrder) return <Typography>Order not found.</Typography>;

    const order = data.getOrder;

    return (
        <PageContainer title={`Order ${order.id}`} description="View order details">
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Order Details: {order.id}
                </Typography>
                <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom>Order Information</Typography>
                            <Typography variant="body1"><strong>Status:</strong> <Box component="span"><Chip label={order.status} color={order.status === 'DELIVERED' ? 'success' : 'warning'} /></Box></Typography>
                            <Typography variant="body1"><strong>Total:</strong> ${order.total.toFixed(2)}</Typography>
                            {order.payment && (
                                <Typography variant="body1"><strong>Payment Method:</strong> {order.payment.method}</Typography>
                            )}
                            <Typography variant="body1"><strong>Delivery Address:</strong> {order.deliveryAddress}</Typography>
                            {order.notes && <Typography variant="body1"><strong>Notes:</strong> {order.notes}</Typography>}
                            <Typography variant="body1"><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="h6" gutterBottom>Cart Items</Typography>
                            {order.cart.items.map((item) => (
                                <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Image
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        width={40}
                                        height={40}
                                        style={{ borderRadius: '4px', marginRight: '10px' }}
                                    />
                                    <Typography variant="body2">{item.product.name} x {item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}</Typography>
                                </Box>
                            ))}
                        </Grid>
                    </Grid>
                </Paper>

                <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>Rider Location</Typography>
                <Paper elevation={3} sx={{ p: 3, height: 400 }}>
                    {/* Placeholder for Map Component */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', border: '1px dashed grey' }}>
                        <Typography variant="h6" color="textSecondary">Map Component Here</Typography>
                        {order.assignedRiderId ? (
                            <Typography variant="body1">Rider ID: {order.assignedRiderId}</Typography>
                        ) : (
                            <Typography variant="body1">No rider assigned yet.</Typography>
                        )}
                        <Typography variant="body1">Delivery Lat: {order.deliveryLat}</Typography>
                        <Typography variant="body1">Delivery Lng: {order.deliveryLng}</Typography>
                    </Box>
                </Paper>
            </Container>
        </PageContainer>
    );
};

export default OrderDetailPage;
