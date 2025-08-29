import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useQuery, useMutation } from "@apollo/client/react";
import { MY_CART_QUERY } from '@/graphql/cart/queries';
import { UPDATE_CART_ITEM_MUTATION, REMOVE_FROM_CART_MUTATION, CLEAR_CART_MUTATION } from '@/graphql/cart/mutations';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface CartDialogProps {
  open: boolean;
  onClose: () => void;
}

type CartItem = {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
  };
  quantity: number;
};

type MyCartQuery = {
  myCart: {
    items: CartItem[];
    total: number;
  } | null;
};

type UpdateCartItemMutationVariables = {
  input: {
    productId: string;
    quantity: number;
  };
};

type RemoveFromCartMutationVariables = {
  productId: string;
};

import useAuthStore from '@/stores/useAuthStore';

const CartDialog: React.FC<CartDialogProps> = ({ open, onClose }) => {
  const { token } = useAuthStore();

  const { data, loading, error, refetch } = useQuery<MyCartQuery>(MY_CART_QUERY, {
    skip: !token,
  });

  // Handle auth error from query result
  React.useEffect(() => {
    if (error?.message === 'Unauthorized') {
      useAuthStore.getState().clearAuth();
    }
  }, [error]);

  const [updateCartItem] = useMutation<any, UpdateCartItemMutationVariables>(UPDATE_CART_ITEM_MUTATION);
  const [removeFromCart] = useMutation<any, RemoveFromCartMutationVariables>(REMOVE_FROM_CART_MUTATION);
  const [clearCart] = useMutation(CLEAR_CART_MUTATION);

  const cartItems = data?.myCart?.items || [];
  const total = data?.myCart?.total || 0;

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await updateCartItem({ variables: { input: { productId, quantity } } });
      toast.success('Cart item quantity updated!');
      refetch();
    } catch (err) {
      console.error("Error updating cart item:", err);
      toast.error('Failed to update cart item.');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeFromCart({ variables: { productId } });
      toast.success('Product removed from cart!');
      refetch();
    } catch (err) {
      console.error("Error removing item from cart:", err);
      toast.error('Failed to remove item from cart.');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared successfully!');
      refetch();
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast.error('Failed to clear cart.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Your Cart ({cartItems.length} items)</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Typography>Loading cart...</Typography>
        ) : error ? (
          <Typography>Error: {error.message}</Typography>
        ) : cartItems.length === 0 ? (
          <Typography>Your cart is empty.</Typography>
        ) : (
          <List>
            {cartItems.map((item: any) => (
              <React.Fragment key={item.product.id}>
                <ListItem>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      width={50}
                      height={50}
                      style={{ borderRadius: '4px', marginRight: '10px' }}
                    />
                    <ListItemText
                      primary={item.product.name}
                      secondary={`$${item.product.price.toFixed(2)} x ${item.quantity}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="remove"
                        onClick={() => handleRemoveItem(item.product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="decrease quantity"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="increase quantity"
                        onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button onClick={handleClearCart} color="error">Clear Cart</Button>
        <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartDialog;
