
"use client";
import React from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
} from '@mui/material';
import { GreyButton, OrangeButton } from '@/styled-components/buttons';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting: boolean;
}

export const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm, productName, isDeleting }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
          Confirm Deletion
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isDeleting}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Typography variant="body1" sx={{ mb: 2, color: '#4B5563' }}>
          Are you sure you want to delete the product &quot;<strong>{productName}</strong>&quot;? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB' }}>
        <GreyButton onClick={onClose} disabled={isDeleting}>
          Cancel
        </GreyButton>
        <OrangeButton
          onClick={onConfirm}
          disabled={isDeleting}
          variant="contained"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </OrangeButton>
      </DialogActions>
    </Dialog>
  );
};
