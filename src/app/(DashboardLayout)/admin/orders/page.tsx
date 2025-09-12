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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/system';
import { useQuery, useMutation } from '@apollo/client';
import { ALL_ORDERS_QUERY } from '../../../../graphql/order/queries';
import { FIND_ALL_USERS_QUERY } from '../../../../graphql/user/queries';
import { ASSIGN_RIDER_MUTATION } from '../../../../graphql/order/mutations';
import { toast } from 'react-hot-toast';

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#F9FAFB',
  borderTop: '1px solid #E0E0E0',
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
}));

export default function OrderManagement() {
  const [expandedOrder, setExpandedOrder] = useState<string | false>(false);
  const [assignRiderDialogOpen, setAssignRiderDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedRiderId, setSelectedRiderId] = useState<string>('');
  
  const { data: ordersData, loading: ordersLoading, error: ordersError } = useQuery(ALL_ORDERS_QUERY);
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(FIND_ALL_USERS_QUERY);
  
  const riders = usersData?.users.filter((user: any) => user.userType === 'RIDER') || [];
  
  const [assignRider, { loading: assignRiderLoading }] = useMutation(ASSIGN_RIDER_MUTATION, {
    refetchQueries: [{ query: ALL_ORDERS_QUERY }],
    onCompleted: () => {
      toast.success('Rider assigned successfully');
      closeAssignRiderDialog();
    },
    onError: (error) => {
      toast.error(`Failed to assign rider: ${error.message}`);
    }
  });

  const handleExpand = (orderId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedOrder(isExpanded ? orderId : false);
  };

  const openAssignRiderDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setAssignRiderDialogOpen(true);
  };

  const closeAssignRiderDialog = () => {
    setSelectedOrderId(null);
    setSelectedRiderId('');
    setAssignRiderDialogOpen(false);
  };

  const handleAssignRider = async () => {
    if (selectedOrderId && selectedRiderId) {
      await assignRider({ variables: { orderId: selectedOrderId, riderId: selectedRiderId } });
    }
  };

  if (ordersLoading || usersLoading) return <p>Loading...</p>;
  if (ordersError) return <p>Error loading orders: {ordersError.message}</p>;
  if (usersError) return <p>Error loading users: {usersError.message}</p>;

  return (
    <Box sx={{ p: 4, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Order Management
      </Typography>
      <TableContainer sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}>
        <Table aria-label="order management table">
          <TableHead sx={{ bgcolor: '#FEF3C7' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Order ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Customer</TableCell>
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
                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{order.cart.userId}</TableCell>
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
                    {order.assignedRiderId ? riders.find((r:any) => r.id === order.assignedRiderId)?.username : 'Unassigned'}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
                    <Button variant="outlined" onClick={() => openAssignRiderDialog(order.id)} size="small" sx={{ color: '#6B7280', borderColor: '#B0B0B0' }}>
                      Assign Rider
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

      <Dialog open={assignRiderDialogOpen} onClose={closeAssignRiderDialog} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ bgcolor: '#F3F4F6', borderBottom: '1px solid #E5E7EB', fontWeight: 'bold', color: '#333' }}>
          Assign Rider to Order
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="rider-select-label">Rider</InputLabel>
            <Select
              labelId="rider-select-label"
              value={selectedRiderId}
              onChange={(e) => setSelectedRiderId(e.target.value)}
              label="Rider"
              sx={{ borderRadius: '8px' }}
            >
              {riders.map((rider: any) => (
                <MenuItem key={rider.id} value={rider.id}>{rider.username}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB', bgcolor: '#F3F4F6' }}>
          <Button onClick={closeAssignRiderDialog} sx={{ color: '#6B7280', borderRadius: '8px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAssignRider}
            disabled={!selectedRiderId || assignRiderLoading}
            sx={{
                bgcolor: '#6B7280',
                color: '#fff',
                '&:hover': {
                    bgcolor: '#4B5563',
                },
                borderRadius: '8px',
                textTransform: 'none',
            }}
          >
            {assignRiderLoading ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
