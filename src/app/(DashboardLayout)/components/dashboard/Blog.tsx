"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CardContent,
  Typography,
  Grid,
  Rating,
  Tooltip,
  Fab,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Stack } from "@mui/system";
import {
  IconBasket,
  IconMinus,
  IconPlus,
  IconX,
  IconCheck,
} from "@tabler/icons-react";
import BlankCard from "@/app/(DashboardLayout)/components/shared/BlankCard";
import Image from "next/image";
import React, { useState } from "react";

const ecoCard = [
  {
    title: "Boat Headphone",
    subheader: "September 14, 2023",
    photo: "/images/products/s4.jpg",
    salesPrice: 375,
    price: 285,
    rating: 4,
    description:
      "Experience immersive sound with these high-quality boat headphones. Perfect for music lovers on the go.",
  },
  {
    title: "MacBook Air Pro",
    subheader: "September 14, 2023",
    photo: "/images/products/s5.jpg",
    salesPrice: 650,
    price: 900,
    rating: 5,
    description:
      "Unleash your productivity with the powerful MacBook Air Pro. Sleek design and exceptional performance.",
  },
  {
    title: "Red Valvet Dress",
    subheader: "September 14, 2023",
    photo: "/images/products/s7.jpg",
    salesPrice: 150,
    price: 200,
    rating: 3,
    description:
      "Step out in style with this elegant red velvet dress. Perfect for any special occasion.",
  },
  {
    title: "Cute Soft Teddybear",
    subheader: "September 14, 2023",
    photo: "/images/products/s11.jpg",
    salesPrice: 285,
    price: 345,
    rating: 2,
    description:
      "A cuddly and cute soft teddy bear, perfect for gifting or as a comforting companion.",
  },
];

const QuantityAdjuster = ({ initialQuantity = 1, onQuantityChange }) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(newQty);
    }
  };

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(newQty);
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton size="small" onClick={handleDecrease} disabled={quantity === 1}>
        <IconMinus size="18" />
      </IconButton>
      <Typography variant="h6">{quantity}</Typography>
      <IconButton size="small" onClick={handleIncrease}>
        <IconPlus size="18" />
      </IconButton>
    </Stack>
  );
};

const Blog = () => {
  const router = useRouter();
  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQuantities, setProductQuantities] = useState({});
  const [addedToCartStatus, setAddedToCartStatus] = useState({});

  const handleOpenPreviewDialog = (product) => {
    setSelectedProduct(product);
    setOpenPreviewDialog(true);
  };

  const handleClosePreviewDialog = () => {
    setOpenPreviewDialog(false);
    setSelectedProduct(null);
  };

  const handleAddToCartClick = (productId) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: { count: 1, showAdjuster: true },
    }));
    setAddedToCartStatus((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const handleProductQuantityChange = (productId, newQuantity) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], count: newQuantity },
    }));
    console.log(`Updated quantity for ${productId} to ${newQuantity}`);
  };

  const handleConfirmAddToCart = (product) => {
    const quantity = productQuantities[product.title]?.count || 1;
    console.log(`Adding ${quantity} of ${product.title} to cart.`);
  };

  return (
    <Grid container spacing={3}>
      {ecoCard.map((product, index) => {
        const productId = product.title;
        const currentProductState = productQuantities[productId];
        const showAdjuster = currentProductState?.showAdjuster || false;
        const currentQuantity = currentProductState?.count || 1;
        const isAdded = addedToCartStatus[productId] || false;

        return (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
            <BlankCard>
              <Typography
                component="div"
                onClick={() => handleOpenPreviewDialog(product)}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  src={product.photo}
                  variant="square"
                  sx={{ height: 250, width: "100%" }}
                />
              </Typography>

              <CardContent sx={{ p: 3, pt: 2 }}>
                <Typography variant="h6">{product.title}</Typography>
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
                      ${product.salesPrice}
                    </Typography>
                  </Stack>
                  <Rating
                    name="read-only"
                    size="small"
                    value={product.rating}
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
              {selectedProduct.title}
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
                <Grid item xs={12} md={6}>
                  <Image
                    src={selectedProduct.photo}
                    alt={selectedProduct.title}
                    width={500}
                    height={400}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "4px",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" gutterBottom>
                    {selectedProduct.title}
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
                      ${selectedProduct.salesPrice}
                    </Typography>
                  </Stack>
                  <Rating
                    name="read-only"
                    value={selectedProduct.rating}
                    readOnly
                    sx={{ mt: 1 }}
                  />
                  <Typography variant="caption" display="block" mt={1}>
                    Last updated: {selectedProduct.subheader}
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
                    `Adding ${selectedProduct.title} from preview to cart.`
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
};

export default Blog;
