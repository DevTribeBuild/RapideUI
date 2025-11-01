import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Button, Badge } from '@mui/material';
import PropTypes from 'prop-types';
import Link from 'next/link';
// components
import Notifications from './Notifications';
import CartMenu from './CartMenu';
import Profile from './Profile';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

import { IconMenu } from '@tabler/icons-react';
import useAuthStore from '@/stores/useAuthStore';
import { useQuery, gql } from '@apollo/client'; // Import useQuery and gql
import { keyframes } from '@emotion/react'; // Import keyframes for animation

// Define the blinking animation

const blink = keyframes`
  0% { color: inherit; }
  50% { color: #ffd700; }
  100% { color: inherit; }
`;


import { MY_ORDERS_QUERY, RIDER_ORDERS_QUERY } from '@/graphql/order/queries'; // Import specific order queries


interface ItemType {
  toggleMobileSidebar:  (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({toggleMobileSidebar}: ItemType) => {

  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: 'none',
    justifyContent: 'center',
    minHeight: '70px',
  }));

  const user = useAuthStore((state) => state.user);

  const isRider = user?.userType === 'RIDER';

  const { data: ordersData } = useQuery(isRider ? RIDER_ORDERS_QUERY : MY_ORDERS_QUERY, {
    skip: !user, // Skip query if user is not logged in
    pollInterval: 5000, // Poll every 5 seconds to check for status changes
  });

  // Determine the correct array of orders based on user type
  const orders = isRider ? ordersData?.riderOrders : ordersData?.myOrders;

  // Check for active orders (ASSIGNED or IN_TRANSIT)
  const hasActiveOrders = orders?.some(
    (order: any) => order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT'
  );

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
        <IconButton
          size="large"
          aria-label="show bookmarks"
          color="inherit"
          component={Link}
          href={hasActiveOrders ? `/cart/tracking/${orders.find((order: any) => order.status === 'ASSIGNED' || order.status === 'IN_TRANSIT')?.id}` : "/cart/tracking"}
          sx={{
            ...(hasActiveOrders && {
              animation: `${blink} 1s infinite`,
              color: '#ffd700', // Blinking color for the icon itself
            }),
          }}
        >
          <Badge
            badgeContent={hasActiveOrders ? 1 : 0}
            color="primary"
            sx={{
              ...(hasActiveOrders && {
                '& .MuiBadge-badge': {
                  animation: `${blink} 1s infinite`,
                  color: '#ffd700', // Blinking color for the badge content
                  backgroundColor: 'transparent', // Ensure background is transparent to see the blinking color
                },
              }),
            }}
          >
            <BookmarkBorderIcon />
          </Badge>
        </IconButton>
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
