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
} from "@mui/material";
import { Stack } from "@mui/system";
import { IconBasket, IconX, IconCheck } from "@tabler/icons-react";
import { QuantityAdjuster } from "./QuantityAdjuster";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ALL_PRODUCTS_QUERY } from "@/graphql/product/queries";
import { MY_CART_QUERY } from "@/graphql/cart/queries";
import { ADD_TO_CART_MUTATION, UPDATE_CART_ITEM_MUTATION } from "@/graphql/cart/mutations";
import toast from 'react-hot-toast';


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
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const { data: productsData, loading: productsLoading, error: productsError } = useQuery<AllProductsQuery>(ALL_PRODUCTS_QUERY);
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
  const [addToCart, { loading: addToCartLoading }] = useMutation(ADD_TO_CART_MUTATION, { refetchQueries: [{ query: MY_CART_QUERY }] });
  const [updateCartItem, { loading: updateCartItemLoading }] = useMutation(UPDATE_CART_ITEM_MUTATION, { refetchQueries: [{ query: MY_CART_QUERY }] });
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState(new Set());

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
    try {
      await addToCart({ variables: { input: { productId: product.id, quantity: 1 } } });
      toast.success(`${product.name} added to cart!`);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error(`Failed to add ${product.name} to cart.`);
    }
  };

  const handleProductQuantityChange = async (productId: string, newQuantity: number) => {
    try {
      await updateCartItem({ variables: { input: { productId: productId, quantity: newQuantity } } });
      toast.success(`Cart updated!`);
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error(`Failed to update cart.`);
    }
  };

  if (productsLoading) return (
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

  // Render products even if cart data is loading or has an error
  const productsToDisplay = productsData?.allProducts || [];
  const cartItemsMap = new Map();
  if (cartData && cartData.myCart && cartData.myCart.items) {
    cartData.myCart.items.forEach(item => {
      cartItemsMap.set(item.product.id, item);
    });
  }

  return (
    <Grid container spacing={3}>
      {productsToDisplay.map((product) => {
        const productId = product.id;
        const cartItem = cartItemsMap.get(productId);
        const isInCart = !!cartItem;
        const currentQuantity = cartItem?.quantity || 1;

        return (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
            <BlankCard>
              <Typography
                component="div"
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
                    height: "auto",
                    borderRadius: "4px",
                  }}
                />
              </Typography>

              <CardContent sx={{ p: 3, pt: 2 }}>
                <Typography variant="h6">{product.name}</Typography>
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
                    !isInCart ? (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleAddToCartClick(product)}
                        disabled={addToCartLoading}
                        sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
                      >
                        {addToCartLoading ? "Adding..." : "Add To Cart"}
                      </Button>
                    ) : (
                      <>
                        <Typography variant="subtitle2">Quantity:</Typography>
                        <QuantityAdjuster
                          initialQuantity={currentQuantity}
                          onQuantityChange={(newQuantity) =>
                            handleProductQuantityChange(productId, newQuantity)
                          }
                          loading={updateCartItemLoading}
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
      >
        {selectedProduct && (
          <>
            <DialogTitle>
              {selectedProduct.name}
              <IconButton
                aria-label="close"
                onClick={handleClosePreviewDialog}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <IconX />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Image
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    width={500}
                    height={400}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px",
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="h5" gutterBottom>
                    {selectedProduct.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    {selectedProduct.description || "No description available."}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                    <Typography variant="h6" color="primary">
                      ${selectedProduct.price}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      ${selectedProduct.price}
                    </Typography>
                  </Stack>
                  <Rating
                    name="read-only"
                    value={5} // Assuming a default rating for now
                    readOnly
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" display="block" mt={1}>
                    Last updated: {new Date(selectedProduct.updatedAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClosePreviewDialog}>Close</Button>
              <Button
                variant="contained"
                onClick={async () => {
                  try {
                    await addToCart({ variables: { input: { productId: selectedProduct.id, quantity: 1 } } });
                    toast.success(`${selectedProduct.name} added to cart!`);
                    handleClosePreviewDialog();
                  } catch (err) {
                    console.error("Error adding to cart from preview:", err);
                    toast.error(`Failed to add ${selectedProduct.name} to cart.`);
                  }
                }}
                disabled={addToCartLoading}
              >
                {addToCartLoading ? "Adding..." : "Add to Cart"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
}
export default Blog;