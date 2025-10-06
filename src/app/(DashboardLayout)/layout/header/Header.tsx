import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button, Switch } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Notifications from './Notifications';
import CartMenu from './CartMenu';
import Profile from './Profile';

import { IconMenu } from '@tabler/icons-react';
import useAuthStore from '@/stores/useAuthStore';
import useThemeStore from '@/stores/useThemeStore';
import { LightMode, DarkMode } from "@mui/icons-material";


interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {

  const ThemeSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        content: "'🌙'",
        fontSize: 16,
      },
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#ffd700",
    width: 24,
    height: 24,
    "&:before": {
      content: "'🌞'",
      position: "absolute",
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: 20 / 2,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    opacity: 1,
  },
}));


  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    justifyContent: 'center',
    minHeight: '70px',
  }));

  const user = useAuthStore((state) => state.user)
  const { theme, toggleTheme } = useThemeStore();

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
          <ThemeSwitch
            checked={theme === 'dark'}
            onChange={toggleTheme}
            inputProps={{ 'aria-label': 'controlled' }}
          />
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
