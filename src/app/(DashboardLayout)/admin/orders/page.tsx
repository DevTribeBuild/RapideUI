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
  Skeleton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_ORDERS_QUERY } from '../../../../graphql/order/queries';
import { ASSIGN_NEAREST_RIDER_MUTATION, PAY_ORDER_MUTATION } from '../../../../graphql/order/mutations';
import { toast } from 'react-hot-toast';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  borderTop: '1px solid #E0E0E0',
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
}));

export default function OrderManagement() {
  const [tabValue, setTabValue] = useState('ALL');

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Order Management
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="order status tabs">
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
      </Box>
      <OrderTable status={tabValue} />
    </Box>
  );
}

function OrderTableSkeleton() {
  return (
    <TableContainer sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mt: 2 }}>
      <Table aria-label="order management table skeleton">
        <TableHead sx={{ bgcolor: '#FEF3C7' }}>
          <TableRow>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
              <TableCell><Skeleton variant="text" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function OrderTable({ status }: { status: string }) {
  const [expandedOrder, setExpandedOrder] = useState<string | false>(false);

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery(ALL_ORDERS_QUERY, {
    variables: { status: status === 'ALL' ? null : status },
  });

  const [assignNearestRider, { loading: assignRiderLoading }] = useMutation(ASSIGN_NEAREST_RIDER_MUTATION, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY, variables: { status: status === 'ALL' ? null : status } }],
    onCompleted: () => {
      toast.success('Rider assigned successfully');
    },
    onError: (error) => {
      toast.error(`Failed to assign rider: ${error.message}`);
    }
  });

  const [payOrder, { loading: payOrderLoading }] = useMutation(PAY_ORDER_MUTATION, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY, variables: { status: status === 'ALL' ? null : status } }],
    onCompleted: () => {
      toast.success('Order paid successfully');
    },
    onError: (error) => {
      toast.error(`Failed to pay for order: ${error.message}`);
    }
  });

  const handleExpand = (orderId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedOrder(isExpanded ? orderId : false);
  };

  const handleAssignRider = async (orderId: string) => {
    await assignNearestRider({ variables: { orderId } });
  };

  const handlePayOrder = async (orderId: string, tokenSymbol: string) => {
    await payOrder({ variables: { orderId, tokenSymbol } });
  };

  if (ordersLoading) return <OrderTableSkeleton />;
  if (ordersError) return <p>Error loading orders: {ordersError.message}</p>;

  return (
    <>
      <TableContainer sx={{ border: '1px solid #E0E0E0', borderRadius: 2, mt: 2 }}>
        <Table aria-label="order management table">
          <TableHead sx={{ bgcolor: '#FEF3C7' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Order ID</TableCell>
              
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Assigned Rider</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersData.allOrders.map((order: any) => (
              <React.Fragment key={order.id}>
                <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }}>
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{order.id}</TableCell>
                  
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>
                    <Typography
                      sx={{
                        fontWeight: 500,
                        color: '#4B5563',
                        backgroundColor: '#E5E7EB',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        display: 'inline-block',
                        minWidth: '80px',
                        textAlign: 'center',
                      }}
                    >
                      {order.status}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>
                    {order.assignedRiderId ? order.assignedRiderId : 'Unassigned'}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
                    <Button variant="outlined" onClick={() => handleAssignRider(order.id)} size="small" sx={{ color: '#6B7280', borderColor: '#B0B0B0', mr: 1 }}>
                      Assign Rider
                    </Button>
                    <Button variant="outlined" onClick={() => handlePayOrder(order.id, order.cart.items[0].product.currency.symbol)} size="small" sx={{ color: '#6B7280', borderColor: '#B0B0B0' }}>
                      Pay for Order
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} sx={{ p: 0, borderBottom: '1px solid #E0E0E0' }}>
                    <Accordion
                      expanded={expandedOrder === order.id}
                      onChange={handleExpand(order.id)}
                      sx={{ boxShadow: 'none', '&:before': { display: 'none' }, borderRadius: 0 }}
                    >
                      <StyledAccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#6B7280' }} />}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#6B7280' }}>
                          View Products
                        </Typography>
                      </StyledAccordionSummary>
                      <AccordionDetails sx={{ bgcolor: '#F9FAFB', borderTop: '1px solid #E0E0E0' }}>
                        <Table size="small" aria-label="products in order">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'bold', color: '#4B5563', borderBottom: '1px solid #E0E0E0' }}>Product</TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: '#4B5563', borderBottom: '1px solid #E0E0E0' }}>Quantity</TableCell>
                              <TableCell sx={{ fontWeight: 'bold', color: '#4B5563', borderBottom: '1px solid #E0E0E0' }}>Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {order.cart.items.map((item: any, idx: number) => (
                              <TableRow key={idx}>
                                <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{item.product.name}</TableCell>
                                <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{item.quantity}</TableCell>
                                <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>${item.product.price.toFixed(2)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
