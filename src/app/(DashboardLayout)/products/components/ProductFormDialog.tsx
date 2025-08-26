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
  TextField,
  MenuItem, Select, InputLabel, FormControl,
} from '@mui/material';

import toast from 'react-hot-toast';
import { GreyButton, YellowButton } from '@/styled-components/buttons';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_CATEGORIES, CREATE_PRODUCT_CATEGORY } from '@/graphql';
import { ProductImageUpload } from './ProductImageUpload';
import Image from 'next/image';

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

interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: Product) => void;
  isSaving: boolean;
  onImageUploadRequest: (callback: (url: string) => void) => void;
}



export const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ open, onClose, product, onSave, isSaving, onImageUploadRequest }) => {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    category: '',
    merchantId: '',
    currencyId: '',
    quantity: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        id: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        category: '',
        merchantId: '',
        currencyId: '',
        quantity: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [product, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof Product]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };
  const { data, error, refetch } = useQuery(GET_ALL_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [createCategory] = useMutation(CREATE_PRODUCT_CATEGORY, {
    refetchQueries: [{ query: GET_ALL_CATEGORIES }],
  });
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const res = await createCategory({
        variables: { input: { name: newCategoryName } },
      });
      if (res?.data?.createCategory) {
        setFormData((prev) => ({ ...prev, category: res?.data?.createCategory.id }));
        toast.success("created")
        if (refetch) await refetch();
        toast.success("Category created successfully!");
      }
    } catch (err) {
      console.error("Category creation failed:", err);
      toast.error("Failed to create category.");
    } finally {
      setIsCategoryDialogOpen(false);
      setNewCategoryName("");
    }
  };

  const handleSelectChange = (event: any) => {
    const value = event.target.value;

    if (value === "__create_new__") {
      setIsCategoryDialogOpen(true);
    } else {
      setFormData((prev) => ({ ...prev, category: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, currencyId:"e5ee3050-426a-47eb-9488-11695096c008" });
  };

  const isFormValid = formData.name && formData.description && formData.price > 0 && formData.stock >= 0 && formData.imageUrl && formData.category;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
          {product ? 'Edit Product' : 'Create New Product'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D97706' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
            }}
          />
          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            required
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D97706' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
            }}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0, step: "0.01" }}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D97706' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
            }}
          />
          <TextField
            label="Stock Quantity"
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            fullWidth
            required
            inputProps={{ min: 0 }}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D97706' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              label="Image URL"
              name="imageUrl"
              value={formData.imageUrl}
              fullWidth
              required
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D97706' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#F59E0B' },
              }}
            />
            <Button
              variant="outlined"
              onClick={() => onImageUploadRequest(handleImageChange)}
              sx={{
                height: '56px',
                borderColor: '#F59E0B', color: '#F59E0B', '&:hover': { borderColor: '#D97706', color: '#D97706' }
              }}
            >
              Upload
            </Button>
          </Box>
          {formData.imageUrl && (
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
              <Image
                src={formData.imageUrl}
                alt="Product Preview"
                width={100}
                height={100}
                style={{
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
                onError={(e: { currentTarget: { src: string; }; }) => {
                  e.currentTarget.src = `https://placehold.co/100x100/E5E7EB/4B5563?text=Invalid+URL`;
                }}
              />
            </Box>
          )}

          <FormControl fullWidth required>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleSelectChange}
              sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#F59E0B' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D97706' },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>

              {data?.allCategories?.flatMap((category: any) => [
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>,
                ...(category?.subcategories?.map((sub: any) => (
                  <MenuItem key={sub.id} value={sub.id} sx={{ pl: 4 }}>
                    └ {sub.name}
                  </MenuItem>
                )) || [])
              ])}

              <MenuItem value="__create_new__" sx={{ fontStyle: "italic", color: "#0EA5E9" }}>
                ➕ Create new category…
              </MenuItem>
            </Select>
          </FormControl>

          <Dialog open={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Category Name"
                fullWidth
                variant="standard"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateCategory}>Create</Button>
            </DialogActions>
          </Dialog>

        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'flex-end', borderTop: '1px solid #E5E7EB' }}>
        <GreyButton onClick={onClose} disabled={isSaving}>
          Cancel
        </GreyButton>
        <YellowButton
          onClick={handleSubmit}
          disabled={!isFormValid || isSaving}
          variant="contained"
        >
          {isSaving ? 'Saving...' : 'Save Product'}
        </YellowButton>
      </DialogActions>
    </Dialog>
  );
};