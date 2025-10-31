import React, { useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/useAuthStore";
import { IconListCheck, IconMail, IconUser } from "@tabler/icons-react";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Profile = () => {
  const { clearAuth } = useAppStore();
  const router = useRouter();
    const user:any = useAppStore((state) => state.user);


  const logout = () => {
    clearAuth();
    router.push("/authentication/login");
  };

  const [anchorEl2, setAnchorEl2] = useState(null);
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleNavigate = (link: string) => {
    handleClose2();
    router.push(link);
  };

  // Cart
  const [cartItemCount, setCartItemCount] = useState<number>(3);
  const [cartAnchorEl, setCartAnchorEl] = useState<null | HTMLElement>(null);
  const handleCartClick = (event: React.MouseEvent<HTMLElement>) => {
    setCartAnchorEl(event.currentTarget);
  };
  const handleCartClose = () => {
    setCartAnchorEl(null);
  };
  const cartItems = [
    { id: 1, name: "T-shirt - Medium", quantity: 2 },
    { id: 2, name: "Leather Wallet", quantity: 1 },
    { id: 3, name: "Running Shoes", quantity: 1 },
  ];

  // Notifications
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationCount] = useState<number>(5);
  const notifications = [
    { id: 1, text: "Order #1234 has shipped" },
    { id: 2, text: "New message from support" },
    { id: 3, text: "Price drop on item in wishlist" },
  ];
  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <Box display="flex" alignItems="center">
      <Menu
        id="notifications-menu"
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: 300,
          },
        }}
      >
        <Box p={2}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        {notifications.length === 0 ? (
          <Box px={2} py={1}>
            <Typography variant="body2">No new notifications</Typography>
          </Box>
        ) : (
          notifications.map((notif) => (
            <MenuItem key={notif.id}>
              <Typography variant="body2">{notif.text}</Typography>
            </MenuItem>
          ))
        )}
        <Divider />
        <Box py={1.5} px={2}>
          <Button
            fullWidth
            variant="contained"
            color="warning"
            onClick={() => {
              handleNotificationClose();
              router.push("/notifications");
            }}
          >
            View All
          </Button>
        </Box>
      </Menu>

      {/* Profile */}
      <IconButton
        size="large"
        aria-label="user menu"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick2}
        sx={{
          ...(Boolean(anchorEl2) && {
            color: "primary.main",
          }),
        }}
      >
        <Avatar
          src={user?.imageUrl || '/default-profile.png'}
          alt="image"
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      {/* Profile Menu */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "200px",
          },
        }}
      >
        <MenuItem onClick={() => handleNavigate("/profile")}>
          <ListItemIcon><IconUser width={20} /></ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/wallet")}>
          <ListItemIcon><IconMail width={20} /></ListItemIcon>
          <ListItemText>Wallet</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleNavigate("/cart")}>
          <ListItemIcon><IconListCheck width={20} /></ListItemIcon>
          <ListItemText>Cart</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={logout}
            variant="outlined"
            color="primary"
            fullWidth
          >
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;

