import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_CATEGORIES } from '@/graphql';
import { ALL_PRODUCTS_QUERY } from '@/graphql/product/queries';
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
  stock: number;
  imageUrl: string;
  category: string;
  merchantId: string;
  currencyId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}



