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
  CircularProgress,
  TextField, // Added for ProductFormDialog
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, // Added for ProductManagementApp
  MenuItem, Select, InputLabel, FormControl, // Added for ProductFormDialog
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit'; // Added for ProductManagementApp
import DeleteIcon from '@mui/icons-material/Delete'; // Added for ProductManagementApp
import AddIcon from '@mui/icons-material/Add'; // Added for ProductManagementApp
import InfoIcon from '@mui/icons-material/Info'; // Added for ProductDetailsDialog
import { styled } from '@mui/system';
import toast from 'react-hot-toast';
import { CREATE_PRODUCT_CATEGORY } from '@/graphql';
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION, DELETE_PRODUCT_MUTATION } from '@/graphql/product/mutations';
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CATEGORIES } from '@/graphql';
import { ALL_PRODUCTS_QUERY } from '@/graphql/product/queries';
import Image from 'next/image'; // Importing Image from next/image for optimized image handling
import ImageWithFallback from '../components/dashboard/ImageWithFallBack';
import { ImageUploadDialog } from './components/ImageUploadDialog';
import { ProductFormDialog } from './components/ProductFormDialog';
// -----------------------------------------------------------------------------
// Type Definitions
// -----------------------------------------------------------------------------

/**
 * Interface for a Product.
 */
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
  onSave: (payload: { input: ProductInput }) => void;
  product?: ProductInput | null;
  isSaving: boolean;
  onImageUploadRequest: (callback: (url: string) => void) => void;
}

interface ProductInput {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  currencyId: string;
}

/**
 * Props for the ImageUploadDialog component.
 */
interface ImageUploadDialogProps {
  open: boolean;
  onClose: () => void;
  onUploadSuccess: (url: string) => void;
}

/**
 * Props for the ProductFormDialog component.
 */
// interface ProductFormDialogProps {
//   open: boolean;
//   onClose: () => void;
//   product?: ProductInput | null; // Optional, for editing
//   // onSave: (product: ProductInput) => void;
//   isSaving: boolean;
//   onImageUploadRequest: (callback: (url: string) => void) => void; // Callback to request image upload
// }

/**
 * Props for the DeleteConfirmationDialog component.
 */
interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  isDeleting: boolean;
}

/**
 * Props for the ProductDetailsDialog component.
 */
interface ProductDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}


// -----------------------------------------------------------------------------
// Styled Components
// -----------------------------------------------------------------------------

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

const OrangeButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#F97316', // Tailwind orange-500
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#EA580C', // Tailwind orange-600
  },
  '&.Mui-disabled': {
    backgroundColor: '#FDBA74', // Lighter orange for disabled
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

// -----------------------------------------------------------------------------
// ImageUploadDialog Component (Global Dialog for Image Upload)
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// ProductFormDialog Component (Create/Edit Product)
// -----------------------------------------------------------------------------



// -----------------------------------------------------------------------------
// DeleteConfirmationDialog Component
// -----------------------------------------------------------------------------

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({ open, onClose, onConfirm, productName, isDeleting }) => {
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
          endIcon={isDeleting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </OrangeButton>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------------------------------------------------------------
// ProductDetailsDialog Component (New Component for Product Details)
// -----------------------------------------------------------------------------

const ProductDetailsDialog: React.FC<ProductDetailsDialogProps> = ({ open, onClose, product, onEdit, onDelete }) => {
  if (!product) return null; // Don't render if no product is provided

  const handleEditClick = () => {
    onEdit(product);
    onClose(); // Close details dialog when opening edit form
  };

  const handleDeleteClick = () => {
    onDelete(product);
    onClose(); // Close details dialog when opening delete confirmation
  };

  function getCategoryName(category: string): React.ReactNode {
    throw new Error('Function not implemented.');
  }

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


// -----------------------------------------------------------------------------
// ProductManagementApp Component (Main UI for Product Management)
// -----------------------------------------------------------------------------

const ProductManagementApp: React.FC = () => {
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery(ALL_PRODUCTS_QUERY);
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_ALL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.allProducts);
    }
  }, [productsData]);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isImageUploadDialogOpen, setIsImageUploadDialogOpen] = useState<boolean>(false);
  const [setImageUrlCallback, setSetImageUrlCallback] = useState<((url: string) => void) | null>(null);

  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState<boolean>(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);


  // Handlers for Product Form Dialog
  const handleOpenCreateForm = () => {
    setEditingProduct(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditForm = (product: Product) => {
    setEditingProduct(product);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
    setEditingProduct(null); // Clear editing product on close
  };

  const [createProduct, { loading: creatingProduct }] = useMutation(CREATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
  });
  const [updateProduct, { loading: updatingProduct }] = useMutation(UPDATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
  });

  const handleSaveProduct = async (productToSave: Product) => {
    try {
      if (productToSave.id) {
        await updateProduct({ variables: { input: { ...productToSave, price: Number(productToSave.price), stock: Number(productToSave.stock) } } });
        toast.success('Product updated successfully!');
      } else {
        const createProductInput = {
          categoryId: productToSave.category,
          currencyId: productToSave.currencyId,
          description: productToSave.description,
          imageUrl: productToSave.imageUrl,
          name: productToSave.name,
          price: Number(productToSave.price),
        };
        await createProduct({ variables: { input: createProductInput } });
        toast.success('Product created successfully!');
      }
      handleCloseFormDialog();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Error saving product. Please try again.');
    }
  };

  // Handlers for Delete Confirmation Dialog
  const handleOpenDeleteConfirm = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const [deleteProduct, { loading: deletingProduct }] = useMutation(DELETE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
  });

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct({ variables: { id: productToDelete.id } });
        toast.success('Product deleted successfully!');
        handleCloseDeleteConfirm();
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error('Error deleting product. Please try again.');
      }
    }
  };

  // Handlers for Image Upload Dialog
  const handleImageUploadRequest = (callback: (url: string) => void) => {
    setSetImageUrlCallback(() => callback); // Store the callback
    setIsImageUploadDialogOpen(true); // Open the image upload dialog
  };

  const handleImageUploadSuccess = (url: string) => {
    if (setImageUrlCallback) {
      setImageUrlCallback(url); // Call the stored callback with the new URL
    }
    setIsImageUploadDialogOpen(false); // Close the image upload dialog
    setSetImageUrlCallback(null); // Clear the callback
  };

  const handleCloseImageUploadDialog = () => {
    setIsImageUploadDialogOpen(false);
    setSetImageUrlCallback(null); // Clear the callback if dialog is closed without upload
  };

  // Handlers for Product Details Dialog
  const handleOpenDetailsDialog = (product: Product) => {
    setViewingProduct(product);
    setIsDetailsDialogOpen(true);
  };

  const handleCloseDetailsDialog = () => {
    setIsDetailsDialogOpen(false);
    setViewingProduct(null);
  };

  // Callback from ProductDetailsDialog to open edit form
  const handleEditFromDetails = (product: Product) => {
    handleOpenEditForm(product);
  };

  // Callback from ProductDetailsDialog to open delete confirmation
  const handleDeleteFromDetails = (product: Product) => {
    handleOpenDeleteConfirm(product);
  };

  const getCategoryName = (categoryId: string) => {
    if (!categoriesData) return '...';
    const category = categoriesData.allCategories.find((c: any) => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };


  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <Box
        sx={{
          bgcolor: '#ffffff',
          p: 4,
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1200px', // Adjusted max-width for better table display
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
            Product Management
          </Typography>
          <YellowButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
          >
            Add New Product
          </YellowButton>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 'none', border: '1px solid #E5E7EB' }}>
          <Table sx={{ minWidth: 650 }} aria-label="product table">
            <TableHead sx={{ bgcolor: '#FEF3C7' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E' }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#92400E' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#92400E' }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: '#92400E' }}>Stock</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#92400E' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsLoading || categoriesLoading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : productsError || categoriesError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'red' }}>
                    Error loading data. Please try again.
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#6B7280' }}>
                    No products found. Click &quot;Add New Product&quot; to get started!
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { bgcolor: '#F9FAFB' },
                      cursor: 'pointer', // Indicate clickable row
                      '&:hover': { bgcolor: '#FEEBC8' }, // Light yellow on hover
                    }}
                    onClick={() => handleOpenDetailsDialog(product)} // Open details dialog on row click
                  >
                    <TableCell component="th" scope="row">
                      <Box
                        component="img"
                        src={product.imageUrl}
                        alt={product.name}
                        sx={{ width: 40, height: 40, borderRadius: '4px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.currentTarget.src = `https://placehold.co/40x40/E5E7EB/4B5563?text=N/A`;
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#374151' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {product.description.substring(0, 50)}{product.description.length > 50 ? '...' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: '#374151' }}>{getCategoryName(product.category)}</TableCell>
                    <TableCell align="right" sx={{ color: '#374151', fontWeight: 'medium' }}>${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ color: product.stock <= 5 ? '#EF4444' : '#374151', fontWeight: 'medium' }}>
                      {product.stock}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}> {/* Stop propagation to prevent details dialog from opening again */}
                      <IconButton aria-label="details" onClick={() => handleOpenDetailsDialog(product)} sx={{ color: '#2196F3' }}>
                        <InfoIcon />
                      </IconButton>
                      <IconButton aria-label="edit" onClick={() => handleOpenEditForm(product)} sx={{ color: '#F59E0B' }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleOpenDeleteConfirm(product)} sx={{ color: '#EF4444' }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Product Form Dialog */}
      <ProductFormDialog
        open={isFormDialogOpen}
        onClose={handleCloseFormDialog}
        product={editingProduct}
        onSave={handleSaveProduct}
        isSaving={creatingProduct || updatingProduct}
        onImageUploadRequest={handleImageUploadRequest} // Pass the new handler
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteProduct}
        productName={productToDelete?.name || ''}
        isDeleting={deletingProduct}
      />

      {/* Global Image Upload Dialog */}
      <ImageUploadDialog
        open={isImageUploadDialogOpen}
        onClose={handleCloseImageUploadDialog}
        onUploadSuccess={handleImageUploadSuccess}
      />

      {/* New Product Details Dialog */}
      <ProductDetailsDialog
        open={isDetailsDialogOpen}
        onClose={handleCloseDetailsDialog}
        product={viewingProduct}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
      />
    </Box>
  );
};

export default ProductManagementApp;
