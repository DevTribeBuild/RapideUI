import React, { useState } from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Profile from './Profile';
import CartDialog from './CartDialog'; // Import CartDialog
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import ShoppingCartIcon
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import useAuthStore from '@/stores/useAuthStore'

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {
  const [openCartDialog, setOpenCartDialog] = useState(false); // State for cart dialog

  const handleOpenCartDialog = () => {
    setOpenCartDialog(true);
  };

  const handleCloseCartDialog = () => {
    setOpenCartDialog(false);
  };

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: theme.shadows[1],
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));

    const user = useAuthStore((state) => state.user)
    const token = useAuthStore((state) => state.token) 
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: "none",
              xs: "inline",
            },
          }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>


        <IconButton
          size="large"
          aria-label="show 11 new notifications"
          color="inherit"
          aria-controls="msgs-menu"
          aria-haspopup="true"
        >
          <Badge variant="dot" color="primary">
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>

        </IconButton>
        {/* Cart Icon */}
        <IconButton
          size="large"
          aria-label="show cart items"
          color="inherit"
          onClick={handleOpenCartDialog}
        >
          <ShoppingCartIcon />
        </IconButton>
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
           {!user?.email && (
            <Button variant="contained" component={Link} href="/authentication/login"   disableElevation color="primary" >
              Login
            </Button>
           )}
          {user && (
            <Profile />
          )}
        </Stack>
      </ToolbarStyled>
      <CartDialog open={openCartDialog} onClose={handleCloseCartDialog} />
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
