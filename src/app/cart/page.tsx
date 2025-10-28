'use client';
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import { UPDATE_CART_ITEM_MUTATION, REMOVE_FROM_CART_MUTATION, CLEAR_CART_MUTATION } from '@/graphql/cart/mutations';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { Container, Typography, Paper, Grid, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, Box, Fab, Divider, Tooltip } from "@mui/material";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Image from 'next/image';

type CartItem = {
    product: {
        id: string;
        name: string;
        price: number;
        imageUrl: string;
    };
    quantity: number;
};

type MyCartQuery = {
    myCart: {
        items: CartItem[];
    } | null;
};

type UpdateCartItemMutationVariables = {
    input: {
        productId: string;
        quantity: number;
    };
};

type RemoveFromCartMutationVariables = {
    productId: string;
};

import useAuthStore from "@/stores/useAuthStore";
import { Remove, Add } from "@mui/icons-material";

const CartPage: React.FC = () => {
    const { token } = useAuthStore();
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery<MyCartQuery>(MY_CART_QUERY, {
        skip: !token,
        onError: (error) => {
            if (error.message === 'Unauthorized') {
                useAuthStore.getState().clearAuth();
            }
        }
    });
    const [updateCartItem] = useMutation<any, UpdateCartItemMutationVariables>(UPDATE_CART_ITEM_MUTATION);
    const [removeFromCart] = useMutation<any, RemoveFromCartMutationVariables>(REMOVE_FROM_CART_MUTATION);
    const [clearCart] = useMutation(CLEAR_CART_MUTATION);

    const cartItems = data?.myCart?.items || [];

    const calculateTotal = () => {
        return cartItems.reduce((acc: number, item: any) => acc + item.product.price * item.quantity, 0);
    };

    const total = calculateTotal();

    const [previewItem, setPreviewItem] = useState<any>(null); // Use any for now, or define a more specific type based on GraphQL response

    const handleUpdateQuantity = async (productId: string, quantity: number) => {
        try {
            await updateCartItem({ variables: { input: { productId, quantity } } });
            toast.success('Cart item quantity updated!');
            refetch();
        } catch (err) {
            console.error("Error updating cart item:", err);
            toast.error('Failed to update cart item.');
        }
    };

    const handleRemoveItem = async (productId: string) => {
        try {
            await removeFromCart({ variables: { productId } });
            toast.success('Product removed from cart!');
            refetch();
        } catch (err) {
            console.error("Error removing item from cart:", err);
            toast.error('Failed to remove item from cart.');
        }
    };

    const handleClearCart = async () => {
        try {
            await clearCart();
            toast.success('Cart cleared successfully!');
            refetch();
        } catch (err) {
            console.error("Error clearing cart:", err);
            toast.error('Failed to clear cart.');
        }
    };

    const checkoutProceeed = () => {
        // Handle checkout logic here
        alert("Proceeding to checkout...");
        router.push("/cart/checkout");
    };

    return (
        <PageContainer title="Dashboard" description="this is Dashboard">
            <Box sx={{ mt: 4 }} style={{ width: '100%' }}>
                <Typography variant="h4" gutterBottom>
                    Your Cart
                </Typography>
                <br />
                {cartItems.length === 0 ? (
                    <Typography>Your cart is empty.</Typography>
                ) : (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <OrderStatusStepper status="PENDING" />
                            {loading ? (
                                <Typography>Loading cart...</Typography>
                            ) : error ? (
                                <Typography>Error loading cart: {error.message}</Typography>
                            ) : cartItems.length === 0 ? (
                                <Typography>Your cart is empty.</Typography>
                            ) : (
                                cartItems.map((item: any) => (
                                    <Card
                                        key={item.product.id}
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            alignItems: 'flex-start',
                                            justifyContent: 'space-between',
                                            p: 2,
                                            mb: 2,
                                            borderRadius: 3,
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                            },
                                        }}
                                    >
                                        {/* Product Image */}
                                        <Box sx={{ flexShrink: 0, mr: 2 }}>
                                            <Image
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                width={120}
                                                height={120}
                                                style={{
                                                    borderRadius: '8px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </Box>

                                        {/* Product Details */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                flexGrow: 1,
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            {/* Name and Price */}
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {item.product.name}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    Price:&nbsp;
                                                    <Typography component="span" sx={{ fontWeight: 600 }}>
                                                        KES {item.product.price.toFixed(2)}
                                                    </Typography>
                                                </Typography>
                                            </Box>

                                            <Divider sx={{ my: 1.5 }} />

                                            {/* Quantity Controls */}
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                }}
                                            >
                                                <IconButton
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    sx={{
                                                        border: '2px solid',
                                                        borderColor: 'primary.main',
                                                        color: 'primary.main',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        },
                                                        '&.Mui-disabled': {
                                                        borderColor: 'grey.300',
                                                        color: 'grey.400',
                                                        },
                                                    }}
                                                    >
                                                    <Remove fontSize="small" />
                                                    </IconButton>

                                                    <Typography
                                                    variant="body1"
                                                    sx={{
                                                        minWidth: 28,
                                                        textAlign: 'center',
                                                        fontWeight: 600,
                                                    }}
                                                    >
                                                    {item.quantity}
                                                    </Typography>

                                                    <IconButton
                                                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                                                    sx={{
                                                        border: '2px solid',
                                                        borderColor: 'primary.main',
                                                        color: 'primary.main',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        },
                                                    }}
                                                    >
                                                    <Add fontSize="small" />
                                                    </IconButton>
                                            </Box>

                                            {/* Subtotal */}
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    mt: 2,
                                                    fontWeight: 500,
                                                    color: 'text.primary',
                                                }}
                                            >
                                                Subtotal:&nbsp;
                                                <Typography component="span" sx={{ fontWeight: 700 }}>
                                                    KES {(item.product.price * item.quantity).toFixed(2)}
                                                </Typography>
                                            </Typography>
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                ml: 1,
                                            }}
                                        >
                                            <Tooltip title="Remove from Cart">
                                                <IconButton
                                                    color="error"
                                                    onClick={() => handleRemoveItem(item.product.id)}
                                                    sx={{ mb: 1 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>

                                            {/* <Tooltip title="Preview Item">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setPreviewItem(item.product)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip> */}
                                        </Box>
                                    </Card>
                                ))
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Paper
                                elevation={3}
                                sx={{
                                p: 3,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                                },
                                }}
                            >
                                {/* Header */}
                                <Typography
                                variant="h6"
                                gutterBottom
                                sx={{ fontWeight: 700, mb: 2, color: 'text.primary' }}
                                >
                                Order Summary
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                {/* Subtotal */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Subtotal
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    KES {total.toFixed(2)}
                                </Typography>
                                </Box>

                                {/* Shipping */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1" color="text.secondary">
                                    Shipping
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                    KES 0.00
                                </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {/* Total */}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Total
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    KES {total.toFixed(2)}
                                </Typography>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    onClick={handleClearCart}
                                    sx={{
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    py: 1,
                                    '&:hover': { borderColor: 'error.dark', color: 'error.dark' },
                                    }}
                                >
                                    Clear Cart
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={checkoutProceeed}
                                    sx={{
                                    textTransform: 'none',
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    py: 1,
                                    boxShadow: 'none',
                                    '&:hover': { boxShadow: 2 },
                                    }}
                                >
                                    Checkout
                                </Button>
                                </Box>
                            </Paper>
                            </Grid>
                    </Grid>
                )}
                <Dialog
                    open={!!previewItem}
                    onClose={() => setPreviewItem(null)}
                    maxWidth="sm"
                    fullWidth
                >
                    <Paper elevation={0} sx={{ p: 0, background: 'none', boxShadow: 'none' }}>
                        <Card sx={{ p: 3, minWidth: 300, boxShadow: 3 }}>
                            <DialogTitle>Product Preview</DialogTitle>
                            <DialogContent>
                                {previewItem && (
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid size={{ xs: 7 }}>
                                            <Typography variant="h5" gutterBottom>
                                                {previewItem.product.name}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Price:</strong> Kes {previewItem.product.price.toFixed(2)}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Quantity:</strong> {previewItem.quantity}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Subtotal:</strong> Kes {(previewItem.product.price * previewItem.quantity).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 5 }}>
                                            <Image
                                                src={previewItem.product.imageUrl}
                                                alt={previewItem.product.name}
                                                width={120}
                                                height={120}
                                                style={{ width: '100%', borderRadius: 8, objectFit: 'cover' }}
                                            />
                                        </Grid>
                                    </Grid>
                                )}
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setPreviewItem(null)} variant="contained" color="primary">
                                    Close
                                </Button>
                            </DialogActions>
                        </Card>
                    </Paper>
                </Dialog>
            </Box>
        </PageContainer>
    );
};

export default CartPage;