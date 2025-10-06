import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Notifications from './Notifications';
import CartMenu from './CartMenu';
import Profile from './Profile';

import { IconMenu } from '@tabler/icons-react';
import useAuthStore from '@/stores/useAuthStore'

interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    justifyContent: 'center',
    minHeight: '70px',
  }));

  const user = useAuthStore((state) => state.user)

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


        <Notifications />
        {/* Cart Icon */}
        <CartMenu />
        <Box flexGrow={1} />
        <Stack spacing={1} direction="row" alignItems="center">
           {!user?.email && (
            <Stack direction="row" spacing={1}>
              <Button variant="text" component={Link} href="/authentication/login" color="primary">
                Login
              </Button>
              <Button variant="contained" component={Link} href="/authentication/register" disableElevation color="primary">
                Register
              </Button>
            </Stack>
           )}
          {user && (
            <Profile />
          )}
        </Stack>
      </ToolbarStyled>
      
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
