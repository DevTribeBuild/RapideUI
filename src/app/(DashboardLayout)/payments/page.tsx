"use client";
import React from 'react';
import { useQuery } from '@apollo/client';
import { ADMIN_PAYMENTS_QUERY } from '@/graphql/payment/queries';
import { Card, CardContent, CircularProgress, Typography, Grid, Box, Chip, Divider, useTheme } from '@mui/material';
import { PaymentOutlined } from '@mui/icons-material';

const PaymentsPage = () => {
    const { data, loading, error } = useQuery(ADMIN_PAYMENTS_QUERY, {
        variables: {
            method: null,
            userId: null
        }
    });

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">Error fetching payments: {error.message}</Typography>;
    }

    const payments = data?.adminPayments || [];

    const theme = useTheme();

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "success":
        return "success";
      case "pending":
        return "warning";
      case "failed":
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

    return (
        <Box sx={{p:3}}>
            <Typography variant="h4" gutterBottom>
                Payments
            </Typography>
            <Grid container spacing={3} >
                {payments.map((payment) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}  key={payment.id}>
                        <Card
                            elevation={3}
                            sx={{
                                borderRadius: 3,
                                overflow: "hidden",
                                mb: 2,
                                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                                },
                            }}
                        >
                            {/* Header */}
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1.5,
                                    p: 2,
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                    // background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                    color: "#fff",
                                }}
                            >
                                <PaymentOutlined />
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color:"#ffd700" }}>
                                    Payment ID: {payment.id}
                                </Typography>
                            </Box>

                            {/* Content */}
                            <CardContent sx={{ p: 2.5 }}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={1.5}
                                >
                                    <Typography variant="h6" fontWeight={700}>
                                        {payment.amount} {payment.currency || "KES"}
                                    </Typography>
                                    <Chip
                                        label={payment.status}
                                        color={getStatusColor(payment.status)}
                                        sx={{ textTransform: "capitalize", fontWeight: 500 }}
                                    />
                                </Box>

                                <Divider sx={{ my: 1.5 }} />

                                <Box display="grid" gridTemplateColumns="1fr 1fr" gap={1}>
                                    <Typography color="text.secondary">
                                        <strong>Method:</strong> {payment.method}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        <strong>Order ID:</strong> {payment.orderId}
                                    </Typography>

                                    <Typography
                                        color="text.secondary"
                                        sx={{ gridColumn: "1 / -1", wordBreak: "break-all" }}
                                    >
                                        <strong>Transaction Hash:</strong> {payment.transactionHash}
                                    </Typography>

                                    <Typography color="text.secondary">
                                        <strong>Created:</strong>{" "}
                                        {new Date(payment.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default PaymentsPage;