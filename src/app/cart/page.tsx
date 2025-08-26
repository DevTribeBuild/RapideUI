'use client';
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import { UPDATE_CART_ITEM_MUTATION, REMOVE_FROM_CART_MUTATION, CLEAR_CART_MUTATION } from '@/graphql/cart/mutations';
import toast from 'react-hot-toast';
import { useRouter } from "next/navigation";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Card,
    Box,
} from "@mui/material";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Image from 'next/image';

const CartPage: React.FC = () => {
    const router = useRouter();
    const { data, loading, error, refetch } = useQuery(MY_CART_QUERY);
    const [updateCartItem] = useMutation(UPDATE_CART_ITEM_MUTATION);
    const [removeFromCart] = useMutation(REMOVE_FROM_CART_MUTATION);
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
            <Container maxWidth="lg" sx={{ mt: 4 }} style={{ width: '100%' }}>
                <Typography variant="h4" gutterBottom>
                    Your Cart
                </Typography>
                <br/>
                {cartItems.length === 0 ? (
                    <Typography>Your cart is empty.</Typography>
                ) : (
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <OrderStatusStepper status="Order Placed" />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Product</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Subtotal</TableCell>
                                            <TableCell align="center">Preview</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Loading cart...</TableCell>
                                            </TableRow>
                                        ) : error ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Error loading cart: {error.message}</TableCell>
                                            </TableRow>
                                        ) : cartItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">Your cart is empty.</TableCell>
                                            </TableRow>
                                        ) : (
                                            cartItems.map((item: any) => (
                                                <TableRow key={item.product.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Image
                                                                src={item.product.imageUrl}
                                                                alt={item.product.name}
                                                                width={50}
                                                                height={50}
                                                                style={{ borderRadius: '4px', marginRight: '10px' }}
                                                            />
                                                            {item.product.name}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        ${item.product.price.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</IconButton>
                                                        {item.quantity}
                                                        <IconButton size="small" onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}>+</IconButton>
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        ${(item.product.price * item.quantity).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            aria-label="remove"
                                                            onClick={() => handleRemoveItem(item.product.id)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                        <IconButton
                                                            aria-label="preview"
                                                            onClick={() => setPreviewItem(item.product)}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={3} align="right">
                                                <strong>Total:</strong>
                                            </TableCell>
                                            <TableCell align="right">
                                                <strong>${total.toFixed(2)}</strong>
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableHead>
                                </Table>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleClearCart}
                                    >
                                        Clear Cart
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={checkoutProceeed}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                </Box>
                            </TableContainer>
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
                                                {previewItem.name}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Price:</strong> ${previewItem.price.toFixed(2)}
                                            </Typography>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                <strong>Quantity:</strong> {previewItem.quantity}
                                            </Typography>
                                            <Typography variant="body1">
                                                <strong>Subtotal:</strong> ${(previewItem.price * previewItem.quantity).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid size={{ xs: 5 }}>
                                            <Image
                                                src={`https://via.placeholder.com/120x120?text=${encodeURIComponent(previewItem.name)}`}
                                                alt={previewItem.name}
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
            </Container>
        </PageContainer>
    );
};

export default CartPage;