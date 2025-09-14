
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { MARK_NOTIFICATION_AS_READ } from '@/graphql/notifications/mutations';
import { IconButton, Badge, Menu, MenuItem, Typography, CircularProgress, Box } from '@mui/material';
import { IconBellRinging } from '@tabler/icons-react';
import { GET_MY_NOTIFICATIONS } from '@/graphql/notifications/queries';
import useAuthStore from '@/stores/useAuthStore';

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuthStore();

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);

  const handleNotificationClick = (notificationId: string) => {
    markAsRead({
      variables: {
        input: {
          notificationId: notificationId,
        },
      },
      update: (cache) => {
        cache.modify({
          id: cache.identify({ __typename: 'Notification', id: notificationId }),
          fields: {
            readAt() {
              return new Date().toISOString();
            },
          },
        });
      },
    });
  };

  const { data, loading, error } = useQuery(GET_MY_NOTIFICATIONS, {
    variables: {
      filter: {
        limit: 10,
        page: 1,
      },
    },
    skip: !user,
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  

  const notifications = data?.getMyNotifications?.notifications || [];
  const totalCount = data?.getMyNotifications?.totalCount || 0;

  return (
    <>
      <IconButton
        size="large"
        aria-label="show new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <Badge badgeContent={totalCount} color="primary">
          <IconBellRinging size="21" stroke="1.5" />
        </Badge>
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
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
            Error fetching notifications.
          </Typography>
        )}
        {!loading && !error && notifications.length === 0 && (
          <Typography variant="body2" sx={{ p: 2 }}>
            No new notifications.
          </Typography>
        )}
        {notifications.map((notification: any) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            sx={{
              backgroundColor: notification.readAt ? '#f5f5f5' : 'inherit',
            }}
          >
            <Box>
              <Typography variant="subtitle1">{notification.title}</Typography>
              <Typography variant="body2">{notification.message}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Notifications;
