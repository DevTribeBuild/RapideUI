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
} from "@mui/material";
import { Stack } from "@mui/system";
import { IconBasket, IconX, IconCheck } from "@tabler/icons-react";
import { QuantityAdjuster } from "./QuantityAdjuster";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ALL_PRODUCTS_QUERY } from "@/graphql/product/queries";


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
  
  const Blog = () => {
  const router = useRouter();
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);

  const { data, loading, error } = useQuery(ALL_PRODUCTS_QUERY);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data && data.allProducts) {
      setProducts(data.allProducts);
    }
  }, [data]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQuantities, setProductQuantities] = useState({});
  const [addedToCartStatus, setAddedToCartStatus] = useState({});

  const handleOpenPreviewDialog = (product: Product) => {
    setSelectedProduct(product);
    setOpenPreviewDialog(true);
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
    setSelectedProduct(null);
  };

  const handleAddToCartClick = (productId: string) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: { count: 1, showAdjuster: true },
    }));
    setAddedToCartStatus((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const handleProductQuantityChange = (productId: string, newQuantity: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], count: newQuantity },
    }));
    console.log(`Updated quantity for ${productId} to ${newQuantity}`);
  };

  const handleConfirmAddToCart = (product: Product) => {
    const quantity = productQuantities[product.id]?.count || 1;
    console.log(`Adding ${quantity} of ${product.name} to cart.`);
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Grid container spacing={3}>
      {products.map((product) => {
        const productId = product.id;
        const currentProductState = productQuantities[productId];
        const showAdjuster = currentProductState?.showAdjuster || false;
        const currentQuantity = currentProductState?.count || 1;
        const isAdded = addedToCartStatus[productId] || false;

        return (
          <Grid size={{xs:12, sm:6, md:4, lg:3}} key={product.id}>
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
                  {!showAdjuster ? (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<IconBasket size="16" />}
                      onClick={() => handleAddToCartClick(productId)}
                      sx={{ padding: "8px 16px", fontSize: "0.875rem" }}
                    >
                      Add To Cart
                    </Button>
                  ) : (
                    <>
                      <Typography variant="subtitle2">Quantity:</Typography>
                      <QuantityAdjuster
                        initialQuantity={currentQuantity}
                        onQuantityChange={(newQuantity) =>
                          handleProductQuantityChange(productId, newQuantity)
                        }
                      />
                      {!isAdded ? (
                        <Button
                          variant="outlined"
                          color="primary"
                          fullWidth
                          size="small"
                          onClick={() => handleConfirmAddToCart(product)}
                          sx={{ mt: 1 }}
                        >
                          Add {currentQuantity} to Basket
                        </Button>
                      ) : (
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          sx={{ mt: 1, color: "success.main" }}
                        >
                          <IconCheck size="20" />
                          <Typography variant="subtitle1">Added to Cart!</Typography>
                        </Stack>
                      )}
                    </>
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
                <Grid size={{xs: 12, md: 6 }}>
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
                <Grid size={{xs: 12, md: 6 }}>
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
                onClick={() => {
                  console.log(
                    `Adding ${selectedProduct.name} from preview to cart.`
                  );
                  handleClosePreviewDialog();
                }}
                startIcon={<IconBasket size="16" />}
              >
                Add to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Grid>
  );
}
  export default Blog;
