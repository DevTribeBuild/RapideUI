
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { IconButton, Badge, Menu, MenuItem, Typography, CircularProgress, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import useAuthStore from '@/stores/useAuthStore';
import Link from 'next/link';

const CartMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuthStore();

  const { data, loading, error } = useQuery(MY_CART_QUERY, {
    skip: !user,
  });

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
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
          },
        }}
      >
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
          <Typography variant="body2" sx={{ p: 2 }}>
            Your cart is empty.
          </Typography>
        )}
        {cartItems.map((item: any) => (
          <MenuItem key={item.id}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body1">{item.product.name}</Typography>
              <Typography variant="body1">{item.quantity}</Typography>
            </Box>
          </MenuItem>
        ))}
        <Box sx={{ p: 2 }}>
          <Button component={Link} href="/cart" variant="contained" fullWidth>
            Go to Cart
          </Button>
        </Box>
      </Menu>
    </>
  );
};

export default CartMenu;
