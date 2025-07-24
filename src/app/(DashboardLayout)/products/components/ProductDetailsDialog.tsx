
"use client";
import React from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import ImageWithFallback from '../../components/dashboard/ImageWithFallBack';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  merchantId: string;
  currencyId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

interface ProductDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  getCategoryName: (categoryId: string) => string;
}

const YellowButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F59E0B',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#D97706',
  },
  '&.Mui-disabled': {
    backgroundColor: '#FCD34D',
    color: '#9CA3AF',
  },
}));

const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F97316',
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#EA580C',
  },
  '&.Mui-disabled': {
    backgroundColor: '#FDBA74',
    color: '#9CA3AF',
  },
}));

const GreyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E5E7EB',
  color: '#4B5563',
  '&:hover': {
    backgroundColor: '#D1D5DB',
  },
  '&.Mui-disabled': {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: 'none',
}));

export const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({ open, onClose, product, onEdit, onDelete, getCategoryName }) => {
  if (!product) return null;

  const handleEditClick = () => {
    onEdit(product);
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(product);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
          Product Details: {product.name}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
          <Box sx={{ flexShrink: 0, textAlign: 'center' }}>
            <ImageWithFallback
              src={product.imageUrl}
              alt={product.name}
              width={200}
              height={200}
              fallback="https://placehold.co/200x200/E5E7EB/4B5563?text=Image+N/A"
              style={{
                maxWidth: '200px',
                maxHeight: '200px',
                objectFit: 'contain',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
              }}
            />
            <Typography
              variant="caption"
              display="block"
              sx={{ mt: 1, color: '#6B7280' }}
            >
              Image Preview
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body1" sx={{ mb: 1.5, color: '#1F2937' }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Description:</Typography>{' '}
              {product.description}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5, color: '#1F2937' }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Category:</Typography>{' '}
              {getCategoryName(product.category)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5, color: '#1F2937' }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Price:</Typography>{' '}
              ${product.price.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5, color: '#1F2937' }}>
              <Typography component="span" sx={{ fontWeight: 'medium' }}>Stock:</Typography>{' '}
              {product.stock} units
            </Typography>
            <Typography variant="body2" sx={{ mt: 2, color: '#6B7280', fontSize: '0.8rem' }}>
              Product ID: {product.id}
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB' }}>
        <GreyButton onClick={onClose}>Close</GreyButton>
        <YellowButton onClick={handleEditClick} variant="contained" startIcon={<EditIcon />}>
          Edit Product
        </YellowButton>
        <OrangeButton onClick={handleDeleteClick} variant="contained" startIcon={<DeleteIcon />}>
          Delete Product
        </OrangeButton>
      </DialogActions>
    </Dialog>
  );
};
