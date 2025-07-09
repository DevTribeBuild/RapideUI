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
  Badge
} from "@mui/material";

import { IconListCheck, IconMail, IconUser  } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import useAppStore from "@/stores/useAuthStore";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';


const Profile = () => {
  const [cartItemCount, setCartItemCount] = useState<number>(3); // start with 3 items as an example

  // Handle cart icon click
  const handleCartClick = () => {
    alert(`You have ${cartItemCount} item(s) in your cart.`);
    // You could navigate to a cart page or open a drawer here
  };
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { clearAuth } = useAppStore();
  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const router = useRouter();
  const logout = () => {
    clearAuth
    router.push("/authentication/login");
  }

  return (
    <Box>

      <IconButton
        size="large"
        aria-label={`show ${cartItemCount} items in cart`}
        color="inherit"
        onClick={handleCartClick}
        sx={{
          ...(cartItemCount > 0 && {
            color: 'primary.main',
          }),
        }}
      >
        <Badge
          badgeContent={cartItemCount}
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#F59E0B', // Tailwind yellow-500
              color: '#000',
              fontWeight: 'bold',
            },
          }}
        >
          <ShoppingCartIcon />
        </Badge>
      </IconButton>

      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
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
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button
            onClick={() => logout()}
            variant="outlined"
            color="primary"
            component={Link}
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
