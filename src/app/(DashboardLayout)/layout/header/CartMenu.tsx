
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { IconButton, Badge, Menu, MenuItem, Typography, CircularProgress, Box, Button, Divider, Avatar } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import { UPDATE_CART_ITEM_MUTATION, REMOVE_FROM_CART_MUTATION } from '@/graphql/cart/mutations';
import useAuthStore from '@/stores/useAuthStore';
import Link from 'next/link';

const CartMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuthStore();

  const [updateCartItem] = useMutation(UPDATE_CART_ITEM_MUTATION);
  const [removeFromCart] = useMutation(REMOVE_FROM_CART_MUTATION);

  const { data, loading, error, refetch } = useQuery(MY_CART_QUERY, {
    skip: !user,
  });

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem({
      variables: {
        input: {
          productId,
          quantity: newQuantity,
        },
      },
    });
    refetch();
  };

  const handleRemoveItem = async (productId: string) => {
    await removeFromCart({
      variables: {
        productId,
      },
    });
    refetch();
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cartItems = data?.myCart?.items || [];
  const cartItemCount = cartItems.length > 0 ? cartItems.reduce((acc: any, item: any) => acc + item.quantity, 0) : 0;


  return (
    <>
      <IconButton
        size="large"
        aria-label="show cart items"
        color="inherit"
        aria-controls="cart-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge badgeContent={cartItemCount} color="primary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <Menu
        id="cart-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            background: '#1e1e1e',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold" sx={{ color: '#FFD700' }}>Your Cart</Typography>
          {cartItems.length > 0 && (
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#FFD700' }}>
              Total: Kes {data?.myCart?.total?.toFixed(2) || '0.00'}
            </Typography>
          )}
        </Box>
        <Divider />
        <Box> {/* Adjusted maxHeight for scrollable items */}
          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}
          {error && (
            <Typography variant="body2" color="error" sx={{ p: 2 }}>
              Error fetching cart items.
            </Typography>
          )}
          {!loading && !error && cartItems.length === 0 && (
            <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
              <ShoppingCartIcon sx={{ fontSize: 48, mb: 1 }} />
              <Typography variant="body2">
                Your cart is empty. Start shopping!
              </Typography>
            </Box>
          )}
          <Box  sx={{ maxHeight: 'calc(60vh - 120px)', overflowY: 'auto' }}>
          {cartItems.map((item: any, index: number) => (
            <Box key={index}>
              <MenuItem sx={{ py: 1.5, px: 2, display: 'flex', alignItems: 'center' }}>
                <Avatar src={item?.product?.imageUrl} alt={item?.product?.name} sx={{ mr: 2 }} />
                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>{item?.product?.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kes {item?.product?.price?.toFixed(2)} x {item?.quantity}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: '#FFD700' }}>
                    Subtotal: Kes {(item?.product?.price * item?.quantity)?.toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                  <IconButton size="small" onClick={() => handleUpdateQuantity(item?.product?.id, item?.quantity - 1)} disabled={item?.quantity <= 1}>
                    <RemoveCircleOutlineIcon />
                  </IconButton>
                  <Typography variant="body2" sx={{ mx: 0.5 }}>{item?.quantity}</Typography>
                  <IconButton size="small" onClick={() => handleUpdateQuantity(item?.product?.id, item?.quantity + 1)}>
                    <AddCircleOutlineIcon />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleRemoveItem(item?.product?.id)} sx={{ ml: 1 }}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Box>
              </MenuItem>
              {index < cartItems.length - 1 && <Divider />}
            </Box>
          ))}
          </Box>
        </Box>
        {cartItems.length > 0 && (
          <Box sx={{ p: 2 }}>
            <Button component={Link} href="/cart" variant="contained" fullWidth>
              Go to Cart
            </Button>
          </Box>
        )}
      </Menu>
    </>
  );
};

export default CartMenu;
