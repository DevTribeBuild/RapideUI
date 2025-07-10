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
import { UPDATE_USER_MUTATION } from "@/graphql/mutations";
import toast from 'react-hot-toast';
import { SelectChangeEvent } from '@mui/material/Select'; // Explicitly import SelectChangeEvent
import { CREATE_PRODUCT_CATEGORY } from '@/graphql/mutations';
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CATEGORIES } from '@/graphql/queries';

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
interface ProductFormDialogProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null; // Optional, for editing
  onSave: (product: Product) => void;
  isSaving: boolean;
  onImageUploadRequest: (callback: (url: string) => void) => void; // Callback to request image upload
}

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

const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ open, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  useEffect(() => {
    // Clean up preview URL when dialog closes or component unmounts
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
        URL.revokeObjectURL(previewUrl); // Revoke previous object URL
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

    setIsUploading(true);
    // Simulate image upload to a server
    // In a real application, you would send `selectedFile` to your backend
    // and receive the actual image URL.
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Generate a dummy image URL. In a real app, this would come from the server.
    const dummyImageUrl = `https://placehold.co/100x100/FFD700/000000?text=Uploaded+${Date.now()}`;

    onUploadSuccess(dummyImageUrl);
    setIsUploading(false);
    onClose(); // Close the dialog after successful upload
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
            <img src={previewUrl} alt="Image Preview" style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px' }} />
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
          endIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isUploading ? 'Uploading...' : 'Upload Image'}
        </YellowButton>
      </DialogActions>
    </Dialog>
  );
};

// -----------------------------------------------------------------------------
// ProductFormDialog Component (Create/Edit Product)
// -----------------------------------------------------------------------------

const ProductFormDialog: React.FC<ProductFormDialogProps> = ({ open, onClose, product, onSave, isSaving, onImageUploadRequest }) => {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
    category: '',
  });


  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      // Reset form for new product
      setFormData({
        id: '',
        name: '',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: '',
        category: '',
      });
    }
  }, [product, open]); // Reset when dialog opens or product changes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof Product]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }));
  };
  console.log("Selected category:", formData.category);

  const handleImageChange = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };
const { data, loading, error, refetch } = useQuery(GET_ALL_CATEGORIES);
const [newCategoryName, setNewCategoryName] = useState("");

// Show error if fetching categories fails
useEffect(() => {
  if (error) {
    // Only show once per error
    toast.error("Failed to load categories.");
  }
}, [error]);

const [createCategory, { data: data_create, loading: loading_create, error: error_create }] = useMutation(CREATE_PRODUCT_CATEGORY);
const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

const handleCreateCategory = async () => {
  if (!newCategoryName.trim()) return;

  try {
    const res = await createCategory({
      variables: { input: { name: newCategoryName } },
    });
    // Use data_create and loading_create after mutation
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

  const handleSelectChange = (event) => {
    const value = event.target.value;

    if (value === "__create_new__") {
      setIsCategoryDialogOpen(true); // Open dialog to create new category
    } else {
      setFormData((prev) => ({ ...prev, category: value }));
    }
    // Show toast for category selection (optional, only for demonstration)
    // toast.success("Category selected!");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: formData.id || `prod-${Date.now()}` }); // Assign a unique ID if new
  };

  const isFormValid = formData.name && formData.description && formData.price > 0 && formData.stock >= 0 && formData.imageUrl && formData.category;

  // const handleCreateCategory = async () => {
  //   if (!newCategoryName.trim()) return;

  //   try {
  //     const { data: result } = await createCategory({
  //       variables: { input: { name: newCategoryName } },
  //     });

  //     const newCategory = result?.createCategory;
  //     if (newCategory) {
  //       setFormData((prev) => ({ ...prev, category: newCategory.id }));
  //       if (refetch) await refetch(); // optional, if using Apollo useQuery
  //     }
  //   } catch (err) {
  //     console.error("Category creation failed:", err);
  //   } finally {
  //     setIsCategoryDialogOpen(false);
  //     setNewCategoryName("");
  //   }
  // };

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
                readOnly: true, // Make it read-only as it's set by the upload dialog
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
                height: '56px', // Match TextField height
                borderColor: '#F59E0B', color: '#F59E0B', '&:hover': { borderColor: '#D97706', color: '#D97706' }
              }}
            >
              Upload
            </Button>
          </Box>
          {formData.imageUrl && (
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
              <img src={formData.imageUrl} alt="Product Preview" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'contain', borderRadius: '4px' }}
                onError={(e) => {
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
              
              {data?.allCategories?.flatMap((category: any) => [ // Use flatMap here
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>,
                ...(category?.subcategories?.map((sub: any) => (
                  <MenuItem key={sub.id} value={sub.id} sx={{ pl: 4 }}>
                    └ {sub.name}
                  </MenuItem>
                )) || []) // Ensure subcategories is an array or empty for spread
              ])}

              <MenuItem value="__create_new__" sx={{ fontStyle: "italic", color: "#0EA5E9" }}>
            ➕ Create new category…
          </MenuItem>
            </Select>
          </FormControl>


      {/* Dialog for creating a new category */}
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
          endIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSaving ? 'Saving...' : 'Save Product'}
        </YellowButton>
      </DialogActions>
    </Dialog>
  );
};

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
          Are you sure you want to delete the product "<strong>{productName}</strong>"? This action cannot be undone.
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
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E5E7EB' }}
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/200x200/E5E7EB/4B5563?text=Image+N/A`;
              }}
            />
            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#6B7280' }}>
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
              {product.category}
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
  const [products, setProducts] = useState<Product[]>(() => [
    { id: 'p1', name: 'Wireless Headphones', description: 'High-quality sound, noise-cancelling. Perfect for immersive audio experience.', price: 99.99, stock: 50, imageUrl: 'https://placehold.co/60x60/FFD700/000000?text=HP', category: 'Electronics' },
    { id: 'p2', name: 'Ergonomic Office Chair', description: 'Adjustable, comfortable, lumbar support. Designed for long working hours.', price: 249.00, stock: 20, imageUrl: 'https://placehold.co/60x60/ADD8E6/000000?text=Chair', category: 'Home Goods' },
    { id: 'p3', name: 'Smartwatch X', description: 'Fitness tracking, heart rate monitor, notifications. Compatible with iOS and Android.', price: 149.50, stock: 35, imageUrl: 'https://placehold.co/60x60/90EE90/000000?text=Watch', category: 'Electronics' },
  ]);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState<boolean>(false);

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

  const handleSaveProduct = async (productToSave: Product) => {
    setIsSavingProduct(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (productToSave.id && products.some(p => p.id === productToSave.id)) {
      // Update existing product
      setProducts((prev) => prev.map((p) => (p.id === productToSave.id ? productToSave : p)));
    } else {
      // Add new product
      setProducts((prev) => [...prev, { ...productToSave, id: `prod-${Date.now()}` }]);
    }
    setIsSavingProduct(false);
    handleCloseFormDialog();
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

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      setIsDeletingProduct(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 700));
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
      setIsDeletingProduct(false);
      handleCloseDeleteConfirm();
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
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#6B7280' }}>
                    No products found. Click "Add New Product" to get started!
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
                    <TableCell sx={{ color: '#374151' }}>{product.category}</TableCell>
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
        isSaving={isSavingProduct}
        onImageUploadRequest={handleImageUploadRequest} // Pass the new handler
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onClose={handleCloseDeleteConfirm}
        onConfirm={handleDeleteProduct}
        productName={productToDelete?.name || ''}
        isDeleting={isDeletingProduct}
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
