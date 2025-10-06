"use client";
import React, { useState, useEffect } from 'react';
import useAppStore from '@/stores/useAuthStore';
import {
  Box,
  Typography,
  CircularProgress,
  Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton,
  Button,
  useTheme,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_ALL_CATEGORIES } from '@/graphql';
import { PRODUCTS_BY_MERCHANT_QUERY } from '@/graphql/product/queries';
import { CREATE_PRODUCT_MUTATION, UPDATE_PRODUCT_MUTATION, DELETE_PRODUCT_MUTATION } from '@/graphql/product/mutations';
import { ProductImageUpload } from './components/ProductImageUpload';
import { ProductFormDialog } from './components/ProductFormDialog';
import { DeleteConfirmationDialog } from './components/DeleteConfirmationDialog';
import { ProductDetailsDialog } from './components/ProductDetailsDialog';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  merchantId: string;
  currencyId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

type ProductsByMerchantQuery = {
  productsByMerchant: Product[];
};

type Category = {
  id: string;
  name: string;
};

type GetAllCategoriesQuery = {
  allCategories: Category[];
};

type CreateProductMutationVariables = {
  input: {
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    categoryId: string;
    // currencyId: string;
    // merchantId: string;
  };
};

type UpdateProductInputType = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  quantity: number;
};

type UpdateProductMutationVariables = {
  input: UpdateProductInputType;
};

type DeleteProductMutationVariables = {
  id: string;
};

const ProductManagementApp: React.FC = () => {
  const user = useAppStore((state) => state.user);
  const merchantId = user?.id || "";
  const theme = useTheme();
  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<ProductsByMerchantQuery>(PRODUCTS_BY_MERCHANT_QUERY, {
    variables: { merchantId },
  });
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery<GetAllCategoriesQuery>(GET_ALL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.productsByMerchant); // Changed from allProducts to productsByMerchant
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

  const [createProduct, { loading: creatingProduct }] = useMutation<any, CreateProductMutationVariables>(CREATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_BY_MERCHANT_QUERY, variables: { merchantId } }], // Refetch with merchantId
  });
  const [updateProduct, { loading: updatingProduct }] = useMutation<any, UpdateProductMutationVariables>(UPDATE_PRODUCT_MUTATION, {
    refetchQueries: [{ query: PRODUCTS_BY_MERCHANT_QUERY, variables: { merchantId } }], // Refetch with merchantId
  });

  const handleSaveProduct = async (productToSave: Product) => {
    try {
      if (productToSave.id) {
        await updateProduct({
          variables: {
            input: {
              id: productToSave.id,
              name: productToSave.name,
              description: productToSave.description,
              price: Number(productToSave.price),
              imageUrl: productToSave.imageUrl,
              categoryId: productToSave.category,
              quantity: Number(productToSave.quantity),
            },
          },
        });
        toast.success('Product updated successfully!');
      } else {
        const createProductInput = {
          categoryId: productToSave.category,
          // currencyId: "983ffabb-f015-457a-a02b-b2d91c071edf",
          description: productToSave.description,
          imageUrl: productToSave.imageUrl,
          name: productToSave.name,
          price: Number(productToSave.price),
          // merchantId: merchantId, // Add merchantId here
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
    refetchQueries: [{ query: PRODUCTS_BY_MERCHANT_QUERY, variables: { merchantId } }], // Refetch with merchantId
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
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          p: 4,
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1200px', // Adjusted max-width for better table display
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
            color="primary"
          >
            Add New Product
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: '8px', boxShadow: 'none', border: `1px solid ${theme.palette.divider}` }}>
          <Table sx={{ minWidth: 650 }} aria-label="product table">
            <TableHead sx={{ bgcolor: theme.palette.background.paper }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Stock</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productsLoading || categoriesLoading ? (
                <>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                      <TableCell><Skeleton variant="text" width={100} /></TableCell>
                      <TableCell><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell align="right"><Skeleton variant="text" width={50} /></TableCell>
                      <TableCell align="right"><Skeleton variant="text" width={50} /></TableCell>
                      <TableCell align="center"><Skeleton variant="rectangular" width={80} height={30} /></TableCell>
                    </TableRow>
                  ))}
                </>
              ) : productsError || categoriesError ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: theme.palette.error.main }}>
                    Error loading data. Please try again.
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: theme.palette.text.secondary }}>
                    No products found. Click &quot;Add New Product&quot; to get started!
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:nth-of-type(odd)': { bgcolor: theme.palette.action.hover },
                      cursor: 'pointer', // Indicate clickable row
                      '&:hover': { bgcolor: theme.palette.action.hover },
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
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>{product.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {product.description.substring(0, 50)}{product.description.length > 50 ? '...' : ''}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>{getCategoryName(product.category)}</TableCell>
                    <TableCell align="right" sx={{ color: theme.palette.text.primary, fontWeight: 'medium' }}>${product.price.toFixed(2)}</TableCell>
                    <TableCell align="right" sx={{ color: product.quantity <= 5 ? theme.palette.error.main : theme.palette.text.primary, fontWeight: 'medium' }}>
                      {product.quantity}
                    </TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}> {/* Stop propagation to prevent details dialog from opening again */}
                      <IconButton aria-label="details" onClick={() => handleOpenDetailsDialog(product)} sx={{ color: theme.palette.info.main }}>
                        <InfoIcon />
                      </IconButton>
                      <IconButton aria-label="edit" onClick={() => handleOpenEditForm(product)} sx={{ color: theme.palette.warning.main }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleOpenDeleteConfirm(product)} sx={{ color: theme.palette.error.main }}>
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
      <ProductImageUpload
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
