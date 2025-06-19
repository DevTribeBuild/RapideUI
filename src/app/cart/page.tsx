'use client';
import React, { useState } from "react";
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
} from "@mui/material";
import OrderStatusStepper from "@/app/(DashboardLayout)/components/shared/OrderStatusStepper";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";

const CartPage: React.FC = () => {
    const router = useRouter();
    // Placeholder cart items
    const cartItems = [
        { id: 1, name: "Product A", price: 29.99, quantity: 2 },
        { id: 2, name: "Product B", price: 15.5, quantity: 1 },
    ];

    const [previewItem, setPreviewItem] = useState<null | typeof cartItems[0]>(null);

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

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
                        <Grid size={12}>
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
                                        {cartItems.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell align="right">
                                                    ${item.price.toFixed(2)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {item.quantity}
                                                </TableCell>
                                                <TableCell align="right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        aria-label="preview"
                                                        onClick={() => setPreviewItem(item)}
                                                    >
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
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
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={checkoutProceeed}
                                >
                                    Proceed to Checkout 
                                </Button>
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
                                        <Grid size={7}>
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
                                        <Grid size={5}>
                                            <img
                                                src={`https://via.placeholder.com/120x120?text=${encodeURIComponent(previewItem.name)}`}
                                                alt={previewItem.name}
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