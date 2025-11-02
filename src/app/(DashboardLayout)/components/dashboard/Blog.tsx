"use client";
import { useRouter } from "next/navigation";
import {
  CardContent,
  Typography,
  Grid,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { Box, Stack } from "@mui/material";
import { IconBasket, IconX, IconCheck, IconChevronDown, IconFilter } from "@tabler/icons-react"; // Added IconFilter
import { QuantityAdjuster } from "./QuantityAdjuster";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_PRODUCTS_QUERY } from "@/graphql/product/queries";
import { ALL_CATEGORIES_QUERY } from "@/graphql/category/queries"; // New import
import { MY_CART_QUERY } from "@/graphql/cart/queries";
import { ADD_TO_CART_MUTATION, UPDATE_CART_ITEM_MUTATION } from "@/graphql/cart/mutations";
import toast from 'react-hot-toast';
import { Tabs, Tab, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, useTheme } from "@mui/material"; // New import


type Category = {
  createdAt: string;
  id: string;
  name: string;
  parentId: string | null;
  subcategories: {
    name: string;
  }[];
  updatedAt: string;
};

type AllCategoriesQuery = {
  allCategories: Category[];
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  merchantId: string;
  currencyId: string;
  categoryId: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  merchant: {
    id: string;
    businessName: string;
    merchantDetails: {
      businessName: string;
      id: string;
    };
  };
  category: {
    createdAt: string;
    id: string;
    name: string;
    parentId: string | null;
    updatedAt: string;
  };
  currency: {
    code: string;
    createdAt: string;
    decimals: number;
    id: string;
    name: string;
    rateToUSD: number;
    symbol: string;
    updatedAt: string;
  };
};

type AllProductsQuery = {
  allProducts: Product[];
};

type MyCartQuery = {
  myCart: {
    items: {
      product: { id: string };
      quantity: number;
    }[];
  } | null;
};

import useAuthStore from '@/stores/useAuthStore';
import { ApolloError } from "@apollo/client";


const Blog = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const theme = useTheme(); // Initialize useTheme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Detect mobile screen size
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null); // New state for selected category

  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<AllProductsQuery>(ALL_PRODUCTS_QUERY);
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery<AllCategoriesQuery>(ALL_CATEGORIES_QUERY); // New query for categories
  const [cartErrorState, setCartErrorState] = useState<ApolloError | undefined>(undefined);
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery<MyCartQuery>(MY_CART_QUERY, {
    skip: !token || (cartErrorState && cartErrorState.message === 'Unauthorized'),
    onError: (error) => {
      if (error.message === 'Unauthorized') {
        useAuthStore.getState().clearAuth();
        setCartErrorState(error);
      }
    }
  });

  useEffect(() => {
    if (cartError) {
      setCartErrorState(cartError);
    }
  }, [cartError]);
  const [addToCart] = useMutation(ADD_TO_CART_MUTATION, { refetchQueries: [{ query: MY_CART_QUERY }] });
  const [updateCartItem, { loading: updateCartItemLoading }] = useMutation(UPDATE_CART_ITEM_MUTATION, { refetchQueries: [{ query: MY_CART_QUERY }] });
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState(new Set());
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);

  useEffect(() => {
    if (productsData && productsData.allProducts) {
      setProducts(productsData.allProducts);
    }
  }, [productsData]);

  useEffect(() => {
    if (cartData && cartData.myCart && cartData.myCart.items) {
      const itemIds = new Set(cartData.myCart.items.map(item => item.product.id));
      setCartItems(itemIds);
    } else {
      setCartItems(new Set());
    }
  }, [cartData]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantities, setProductQuantities] = useState({});

  const handleOpenPreviewDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenPreviewDialog(true);
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
    setSelectedProduct(null);
  };

  const handleAddToCartClick = async (product: Product) => {
    setLoadingProductId(product.id);
    try {
      await addToCart({ variables: { input: { productId: product.id, quantity: 1 } } });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(`Failed to add ${product.name} to cart.`);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleProductQuantityChange = async (productId: string, newQuantity: number) => {
    setLoadingProductId(productId);
    try {
      await updateCartItem({ variables: { input: { productId: productId, quantity: newQuantity } } });
      toast.success(`Cart updated!`);
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error(`Failed to update cart.`);
    } finally {
      setLoadingProductId(null);
    }
  };

  const handleCategoryChange = (event: React.SyntheticEvent, newValue: string | null) => {
    setSelectedCategoryId(newValue);
  };

  if (productsLoading || categoriesLoading) return (
    <Grid container spacing={3}>
      {[...Array(8)].map((_, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
          <Skeleton variant="rectangular" width="100%" height={200} />
          <Skeleton variant="text" />
          <Skeleton variant="text" width="60%" />
        </Grid>
      ))}
    </Grid>
  );
  if (productsError) return <p>Error: {productsError.message}</p>;
  if (categoriesError) return <p>Error: {categoriesError.message}</p>;

  // Render products even if cart data is loading or has an error
  const allProducts = productsData?.allProducts || [];
  const categories = categoriesData?.allCategories || [];

  const productsToDisplay = selectedCategoryId
    ? allProducts.filter(product => product.categoryId === selectedCategoryId)
    : allProducts;

  const cartItemsMap = new Map();
  if (cartData && cartData.myCart && cartData.myCart.items) {
    cartData.myCart.items.forEach(item => {
      cartItemsMap.set(item.product.id, item);
    });
  }
  return (
    <Box>
      {isMobile ? (
        <Accordion elevation={0} sx={{ mb: 3 }}>
          <AccordionSummary expandIcon={<IconChevronDown color="#ffd700" />}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconFilter color="#ffd700" /> {/* Yellow filter icon */}
              <Typography variant="subtitle1" color="#ffd700">Filter by Category</Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack direction="column" spacing={1}>
              <Button
                variant={selectedCategoryId === null ? "contained" : "text"}
                onClick={() => setSelectedCategoryId(null)}
                fullWidth
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "contained" : "text"}
                  onClick={() => setSelectedCategoryId(category.id)}
                  fullWidth
                >
                  {category.name}
                </Button>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      ) : (
        <Tabs
          value={selectedCategoryId}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="category tabs"
          sx={{ mb: 3, maxWidth: '90vw' }}
        >
          <Tab label="All" value={null} />
          {categories.map((category) => (
            <Tab key={category.id} label={category.name} value={category.id} />
          ))}
        </Tabs>
      )}
      <Grid container spacing={3}>
        {productsToDisplay.map((product) => {
          const productId = product.id;
          const cartItem = cartItemsMap.get(productId);
          const isInCart = !!cartItem;
          const currentQuantity = cartItem?.quantity || 1;
          console.log(product, "isInCart:", isInCart, "currentQuantity:", currentQuantity);

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <BlankCard>
                <Box
                  sx={{ height: 200, overflow: 'hidden' }}
                  onClick={() => handleOpenPreviewDialog(product)}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    width={500}
                    height={400}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "4px",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 3, pt: 2 , backgroundColor: "#1e1e1e"}}>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product?.merchant?.merchantDetails?.businessName}
                  </Typography>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={1}
                  >
                    <Stack direction="row" alignItems="center">
                      <Typography variant="h6">${product.price}</Typography>
                      <Typography
                        color="textSecondary"
                        ml={1}
                        sx={{ textDecoration: "line-through" }}
                      >
                        ${product.price}
                      </Typography>
                    </Stack>
                    <Rating
                      name="read-only"
                      size="small"
                      value={5} // Assuming a default rating for now
                      readOnly
                    />
                  </Stack>

                  <Stack direction="column" alignItems="center" mt={2} spacing={1}>
                    {token ? ( // Only show cart actions if logged in and cart has no error
                      product.quantity === 0 ? (
                        <Typography variant="body2" color="error">Out of Stock</Typography>
                      ) :
                        !isInCart ? (
                          <>
                            <Button
                              variant="contained"
                              color="primary"
                              fullWidth
                              onClick={() => handleAddToCartClick(product)}
                              disabled={loadingProductId === product.id || product.quantity === 0}
                              sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
                            >
                              {loadingProductId === product.id ? <CircularProgress size={24} color="inherit" /> : "Add To Cart"}
                            </Button>
                          </>
                        ) : (
                          <>
                            {/* <Typography variant="subtitle2">Quantity:</Typography> */}
                            <QuantityAdjuster
                              initialQuantity={currentQuantity}
                              onQuantityChange={(newQuantity) =>
                                handleProductQuantityChange(productId, newQuantity)
                              }
                              loading={updateCartItemLoading && loadingProductId === productId}
                            />
                          </>
                        )
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => router.push("/authentication/login")}
                        sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
                      >
                        Login to Add to Cart
                      </Button>
                    )}
                  </Stack>

                </CardContent>
              </BlankCard>
            </Grid>
          );
        })}

        <Dialog
          open={openPreviewDialog}
          onClose={handleClosePreviewDialog}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
              overflow: "hidden",
              backgroundColor: "#1e1e1e",
            },
          }}
        >
          {selectedProduct && (
            <>
              {/* Header */}
              <DialogTitle
                sx={{
                  position: "relative",
                  fontWeight: 700,
                  fontSize: "1.5rem",
                  color: "#ffd700",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  pb: 1.5,
                  backgroundColor: "#1e1e1e",
                }}
              >
                {selectedProduct.name}
                <IconButton
                  aria-label="close"
                  onClick={handleClosePreviewDialog}
                  sx={{
                    position: "absolute",
                    right: 12,
                    top: 12,
                    color: "grey.600",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#000" },
                  }}
                >
                  <IconX />
                </IconButton>
              </DialogTitle>

              {/* Content */}
              <DialogContent
                dividers
                sx={{
                  px: 3,
                  py: 3,
                  backgroundColor: "#1e1e1e",
                }}
              >
                <Grid container spacing={3}>
                  {/* Left: Product Image */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box
                      sx={{
                        height: 400,
                        borderRadius: 3,
                        overflow: "hidden",
                        "& img": {
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        },
                        "&:hover img": {
                          transform: "scale(1.05)",
                        },
                      }}
                    >
                      <Image
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        width={500}
                        height={400}
                      />
                    </Box>
                  </Grid>

                  {/* Right: Product Info */}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {selectedProduct.name}
                      </Typography>

                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{
                          lineHeight: 1.6,
                          borderLeft: "3px solid #FFD700",
                          pl: 1.5,
                        }}
                      >
                        {selectedProduct.description || "No description available."}
                      </Typography>

                      <Stack direction="row" alignItems="center" spacing={2} mt={1}>
                        <Typography
                          variant="h6"
                          sx={{ color: "#fff", fontWeight: 700 }}
                        >
                          KES {selectedProduct.price.toFixed(2)}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ textDecoration: "line-through", opacity: 0.7 }}
                        >
                          KES {(selectedProduct.price * 1.2).toFixed(2)}
                        </Typography>
                      </Stack>

                      <Rating
                        name="read-only"
                        value={5}
                        readOnly
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiRating-iconFilled": { color: "#FFD700" },
                        }}
                      />

                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary", mt: 1 }}
                      >
                        Last updated:{" "}
                        {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </DialogContent>

              {/* Actions */}
              <DialogActions
                sx={{
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  px: 3,
                  py: 2,
                  backgroundColor: "#1e1e1e",

                }}
              >
                <Button
                  onClick={handleClosePreviewDialog}
                  sx={{
                    textTransform: "none",
                    fontWeight: 500,
                    color: "text.secondary",
                    "&:hover": { color: "#000" },
                  }}
                >
                  Close
                </Button>

                <Button
                  variant="contained"
                  onClick={async () => {
                    setLoadingProductId(selectedProduct.id);
                    try {
                      await addToCart({
                        variables: { input: { productId: selectedProduct.id, quantity: 1 } },
                      });
                      toast.success(`${selectedProduct.name} added to cart!`);
                      handleClosePreviewDialog();
                    } catch (err) {
                      console.error("Error adding to cart:", err);
                      toast.error(`Failed to add ${selectedProduct.name} to cart.`);
                    } finally {
                      setLoadingProductId(null);
                    }
                  }}
                  disabled={
                    loadingProductId === selectedProduct.id ||
                    selectedProduct.quantity === 0
                  }
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    backgroundColor:
                      selectedProduct.quantity === 0 ? "grey.400" : "#FFD700",
                    color:
                      selectedProduct.quantity === 0 ? "white" : "black",
                    borderRadius: 3,
                    px: 3,
                    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                    "&:hover": {
                      backgroundColor:
                        selectedProduct.quantity === 0 ? "grey.500" : "#ffcc00",
                    },
                  }}
                >
                  {loadingProductId === selectedProduct.id
                    ? "Adding..."
                    : selectedProduct.quantity === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

      </Grid>
    </Box>
  );
}
export default Blog;