"use client";
import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Skeleton,
  useTheme,
  useMediaQuery,
  Card,
  CardActions,
  CardContent,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_ORDERS_QUERY } from '../../../../graphql/order/queries';
import { ASSIGN_NEAREST_RIDER_MUTATION, PAY_ORDER_MUTATION, COMPLETE_ORDER_ADMIN } from '../../../../graphql/order/mutations';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#212121',
  borderTop: '1px solid #ffd700',
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
}));

export default function OrderManagement() {
  const [tabValue, setTabValue] = useState('ALL');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };



  return (
    <Box sx={{ p: 4, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Order Management
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: isMobile ? 12 : 12 }}>
          {isMobile ? (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Filter by Status</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="order status tabs"
                  orientation="vertical"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab label="All" value="ALL" />
                  <Tab label="Pending" value="PENDING" />
                  <Tab label="Awaiting Payment" value="AWAITING_PAYMENT_CONFIRMATION" />
                  <Tab label="Paid" value="PAID" />
                  <Tab label="Confirmed" value="CONFIRMED" />
                  <Tab label="Processing" value="PROCESSING" />
                  <Tab label="Assigned" value="ASSIGNED" />
                  <Tab label="In Transit" value="IN_TRANSIT" />
                  <Tab label="Delivered" value="DELIVERED" />
                  <Tab label="Rejected" value="REJECTED" />
                  <Tab label="Cancelled" value="CANCELLED" />
                </Tabs>
              </AccordionDetails>
            </Accordion>
          ) : (
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="order status tabs"
              orientation="horizontal"
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab label="All" value="ALL" />
              <Tab label="Pending" value="PENDING" />
              <Tab label="Awaiting Payment" value="AWAITING_PAYMENT_CONFIRMATION" />
              <Tab label="Paid" value="PAID" />
              <Tab label="Confirmed" value="CONFIRMED" />
              <Tab label="Processing" value="PROCESSING" />
              <Tab label="Assigned" value="ASSIGNED" />
              <Tab label="In Transit" value="IN_TRANSIT" />
              <Tab label="Delivered" value="DELIVERED" />
              <Tab label="Rejected" value="REJECTED" />
              <Tab label="Cancelled" value="CANCELLED" />
            </Tabs>
          )}
        </Grid>
        <Grid size={{ xs: 12, md: isMobile ? 12 : 12 }}>
          <OrderCards status={tabValue} />
        </Grid>
      </Grid>
    </Box>
  );
}

function OrderCardSkeleton() {
  return (
    <Grid container spacing={3}>
      {[...Array(3)].map((_, index) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
          <Skeleton variant="rectangular" height={200} />
        </Grid>
      ))}
    </Grid>
  );
}

function OrderCards({ status }: { status: string }) {
  const router = useRouter();
  const [expandedOrder, setExpandedOrder] = useState<string | false>(false);
  const [assigningRiderId, setAssigningRiderId] = useState<string | null>(null);

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery(ALL_ORDERS_QUERY, {
    variables: { status: status === 'ALL' ? null : status.toUpperCase() },
  });

  const [assignNearestRider, { loading: assignRiderLoading }] = useMutation(ASSIGN_NEAREST_RIDER_MUTATION, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY, variables: { status: status === 'ALL' ? null : status.toUpperCase() } }],
    onCompleted: () => {
      toast.success('Rider assigned successfully');
      setAssigningRiderId(null);
    },
    onError: (error) => {
      toast.error(`Failed to assign rider: ${error.message}`);
      setAssigningRiderId(null);
    }
  });

  const [payOrder, { loading: payOrderLoading }] = useMutation(PAY_ORDER_MUTATION, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY, variables: { status: status === 'ALL' ? null : status.toUpperCase() } }],
    onCompleted: () => {
      toast.success('Order paid successfully');
    },
    onError: (error) => {
      toast.error(`Failed to pay for order: ${error.message}`);
    }
  });

  const [completeOrderAdmin, { loading: completeOrderLoading }] = useMutation(COMPLETE_ORDER_ADMIN, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY, variables: { status: status === 'ALL' ? null : status.toUpperCase() } }],
    onCompleted: () => {
      toast.success('Order completed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to complete order: ${error.message}`);
    }
  });

  const handleExpand = (orderId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedOrder(isExpanded ? orderId : false);
  };

  const handleAssignRider = async (orderId: string) => {
    setAssigningRiderId(orderId);
    await assignNearestRider({ variables: { orderId } });
  };

  const handlePayOrder = async (orderId: string, tokenSymbol: string) => {
    await payOrder({ variables: { orderId, tokenSymbol } });
  };

  const handleCompleteOrder = async (orderId: string) => {
    await completeOrderAdmin({ variables: { orderId } });
  };

  if (ordersLoading) return <OrderCardSkeleton />;
  if (ordersError) return <p>Error loading orders: {ordersError.message}</p>;

  return (
    <Grid container spacing={3}>
      {ordersData.allOrders.map((order: any) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
          <Card sx={{ border: '1px solid #ffd700', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Order #{order.id.substring(0, 8)}</Typography>
              <Typography variant="body2" color="text.secondary">Date: {new Date(order.createdAt).toLocaleDateString()}</Typography>
              <Box sx={{ my: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: '#000',
                    backgroundColor: '#ffd700',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    display: 'inline-block',
                  }}
                >
                  {order.status}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">Assigned Rider: {order.assignedRiderId ? order.assignedRiderId.substring(0, 8) : 'Unassigned'}</Typography>
            </CardContent>
            <CardActions sx={{ px: 2 }}>
              <Grid container spacing={1}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleAssignRider(order.id)}
                    size="small"
                    fullWidth
                    disabled={assignRiderLoading || order.assignedRiderId}
                    sx={{
                      color: '#ffd700',
                      borderColor: '#ffd700',
                      '&:hover': {
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    {assignRiderLoading && assigningRiderId === order.id ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Assign Rider'
                    )}
                  </Button>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handlePayOrder(order.id, 'BNB')}
                    size="small"
                    fullWidth
                    disabled={order.status !== 'PENDING'}
                    sx={{
                      color: '#ffd700',
                      borderColor: '#ffd700',
                      '&:hover': {
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    Pay for Order
                  </Button>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push(`/cart/tracking/${order.id}`)}
                    size="small"
                    fullWidth
                    sx={{
                      color: '#ffd700',
                      borderColor: '#ffd700',
                      '&:hover': {
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    Track Order
                  </Button>
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleCompleteOrder(order.id)}
                    size="small"
                    fullWidth
                    disabled={completeOrderLoading || order.status === 'DELIVERED'}
                    sx={{
                      color: '#ffd700',
                      borderColor: '#ffd700',
                      '&:hover': {
                        borderColor: '#ffd700',
                        backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      },
                    }}
                  >
                    {completeOrderLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Complete Order'
                    )}
                  </Button>
                </Grid>
              </Grid>
            </CardActions>

            <br />
            <Accordion
              expanded={expandedOrder === order.id}
              onChange={handleExpand(order.id)}
              sx={{ boxShadow: 'none', '&:before': { display: 'none' }, borderRadius: 0 }}
            >
              <StyledAccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#b8860b' }} />}>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#b8860b' }}>
                  View Products
                </Typography>
              </StyledAccordionSummary>
              <AccordionDetails sx={{ bgcolor: '#151515ff', borderTop: '1px solid #E0E0E0' }}>
                <Table size="small" aria-label="products in order">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell>Quantity</TableCell>
                      <TableCell>Price</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order?.cart?.items?.map((item: any, idx: number) => (
                      <TableRow key={idx}>
                        <TableCell>{item?.product?.name}</TableCell>
                        <TableCell>{item?.quantity}</TableCell>
                        <TableCell>${item?.product?.price.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
