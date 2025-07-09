"use client";
import React, { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
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
import { useRouter } from 'next/navigation';

// Styled Accordion Summary for better visual hierarchy
const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: '#F9FAFB', // Very light grey for accordions
  borderTop: '1px solid #E0E0E0', // Light grey border at the top
  '& .MuiAccordionSummary-content': {
    margin: '12px 0',
  },
}));

// Sample data (remains the same)
const orders = [
  {
    id: 'o1',
    customer: 'Jane Doe',
    status: 'Pending',
    date: '2025-07-09',
    products: [
      { name: 'Product A', quantity: 2, price: 10 },
      { name: 'Product B', quantity: 1, price: 20 }
    ]
  },
  {
    id: 'o2',
    customer: 'John Smith',
    status: 'Shipped',
    date: '2025-07-08',
    products: [
      { name: 'Product C', quantity: 1, price: 15 }
    ]
  }
];

export default function OrderManagement() {
  const [expandedOrder, setExpandedOrder] = useState<string | false>(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const proceedToTracking = () => {
      router.push('/cart/tracking');
  };

  const handleExpand = (orderId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedOrder(isExpanded ? orderId : false);
  };

  const openStatusDialog = (orderId: string) => {
    setSelectedOrderId(orderId);
    setStatusDialogOpen(true);
  };

  const closeStatusDialog = () => {
    setSelectedOrderId(null);
    setNewStatus('');
    setStatusDialogOpen(false);
  };

  const handleStatusChange = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Order ${selectedOrderId} updated to ${newStatus}`);
    // In a real application, you would update the 'orders' state here
    closeStatusDialog();
    setLoading(false);
  };


  return (
    <Box sx={{ p: 4, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}> {/* Orange header text */}
        Orders
      </Typography>

        <TableContainer sx={{ border: '1px solid #E0E0E0', borderRadius: 2 }}> {/* Outlined Table Container */}
          <Table aria-label="order management table">
            <TableHead sx={{ bgcolor: '#FEF3C7' }}> {/* Specific yellow-orange header background */}
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Order ID</TableCell> {/* Darker text, matching border */}
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E', borderBottom: '1px solid #D1AA2B' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }} onClick={proceedToTracking}>
                    <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{order.id}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{order.customer}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{order.date}</TableCell>
                    <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: '#4B5563', // Dark grey for status text
                          backgroundColor: '#E5E7EB', // Light grey background for status badge
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
                    <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>
                      <Button variant="outlined" onClick={() => openStatusDialog(order.id)} size="small" sx={{ color: '#6B7280', borderColor: '#B0B0B0' }}>
                        Update Status
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={5} sx={{ p: 0, borderBottom: '1px solid #E0E0E0' }}> {/* Border for the row containing accordion */}
                      <Accordion
                        expanded={expandedOrder === order.id}
                        onChange={handleExpand(order.id)}
                        sx={{ boxShadow: 'none', '&:before': { display: 'none' }, borderRadius: 0 }} // Ensure no rounded corners for accordion
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
                              {order.products.map((product, idx) => (
                                <TableRow key={idx}>
                                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{product.name}</TableCell>
                                  <TableCell sx={{ borderRight: '1px solid #E0E0E0', borderBottom: '1px solid #E0E0E0' }}>{product.quantity}</TableCell>
                                  <TableCell sx={{ borderBottom: '1px solid #E0E0E0' }}>${product.price.toFixed(2)}</TableCell>
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

      <Dialog open={statusDialogOpen} onClose={closeStatusDialog} PaperProps={{ sx: { borderRadius: '12px' } }}>
        <DialogTitle sx={{ bgcolor: '#F3F4F6', borderBottom: '1px solid #E5E7EB', fontWeight: 'bold', color: '#333' }}>
          Update Order Status
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 2 }}>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Status"
              sx={{ borderRadius: '8px' }}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Shipped">Shipped</MenuItem>
              <MenuItem value="Delivered">Delivered</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #E5E7EB', bgcolor: '#F3F4F6' }}>
          <Button onClick={closeStatusDialog} sx={{ color: '#6B7280', borderRadius: '8px', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleStatusChange}
            disabled={!newStatus || loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
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
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}