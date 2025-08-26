
"use client";
import React, { useState, useEffect } from 'react';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/system';
import Image from 'next/image';
import { useMutation } from "@apollo/client/react";
import { SINGLE_UPLOAD_MUTATION } from "@/graphql/upload/mutations";
import toast from 'react-hot-toast';

interface ProductImageUploadProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
}

const YellowButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F59E0B', // Tailwind yellow-500
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#D97706', // Tailwind yellow-600
  },
  '&.Mui-disabled': {
    backgroundColor: '#FCD34D', // Lighter yellow for disabled
    color: '#9CA3AF', // Gray text for disabled
  },
}));

const GreyButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E5E7EB', // gray-200
  color: '#4B5563', // gray-700
  '&:hover': {
    backgroundColor: '#D1D5DB', // gray-300
  },
  '&.Mui-disabled': {
    backgroundColor: '#F3F4F6', // Lighter gray for disabled
    color: '#9CA3AF', // Gray text for disabled
  },
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: 'none',
}));

export const ProductImageUpload: React.FC<ProductImageUploadProps> = ({ open, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadFile, { loading: isUploading }] = useMutation(SINGLE_UPLOAD_MUTATION);

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [open, previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const { data } = await uploadFile({ variables: { file: selectedFile } });
      if (data && data.singleUpload && data.singleUpload.success) {
        onUploadSuccess(data.singleUpload.url);
        toast.success("Image uploaded successfully!");
        onClose();
      } else {
        toast.error(data?.singleUpload?.message || "Image upload failed.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
          Upload Product Image
        </Typography>
        <IconButton onClick={onClose} size="small" disabled={isUploading}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          multiple
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} sx={{ borderColor: '#F59E0B', color: '#F59E0B', '&:hover': { borderColor: '#D97706', color: '#D97706' } }}>
            {selectedFile ? selectedFile.name : 'Choose Image'}
          </Button>
        </label>
        {previewUrl && (
          <Box sx={{ mt: 2, p: 1, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
            <Image
              src={previewUrl}
              alt="Image Preview"
              width={200}
              height={200}
              style={{
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
          </Box>
        )}
        {!selectedFile && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            No image selected.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB' }}>
        <GreyButton onClick={onClose} disabled={isUploading}>
          Cancel
        </GreyButton>
        <YellowButton
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          variant="contained"
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </YellowButton>
      </DialogActions>
    </Dialog>
  );
};
