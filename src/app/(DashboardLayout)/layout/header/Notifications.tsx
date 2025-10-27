
import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { MARK_NOTIFICATION_AS_READ, MARK_ALL_NOTIFICATIONS_AS_READ } from '@/graphql/notifications/mutations';
import { IconButton, Badge, Menu, MenuItem, Typography, CircularProgress, Box, Divider, Avatar, Button } from '@mui/material';
import { IconBellRinging, IconCircleCheck } from '@tabler/icons-react';
import { GET_MY_NOTIFICATIONS } from '@/graphql/notifications/queries';
import useAuthStore from '@/stores/useAuthStore';

const Notifications = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuthStore();

  const [markAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [markAllAsRead] = useMutation(MARK_ALL_NOTIFICATIONS_AS_READ);

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

  const { data, loading, error, refetch } = useQuery(GET_MY_NOTIFICATIONS, {
    variables: {
      filter: {
        limit: 10,
        page: 1,
      },
    },
    skip: !user,
  });

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      refetch(); // Refetch notifications to update UI
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

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
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '360px',
            borderRadius: 2,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="bold">Notifications</Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={handleMarkAllAsRead} disabled={loading}>
              Mark All As Read
            </Button>
          )}
        </Box>
        <Divider />
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
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <IconCircleCheck size={48} style={{ marginBottom: '8px' }} />
            <Typography variant="body2">
              No new notifications. You're all caught up!
            </Typography>
          </Box>
        )}
        <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        {notifications.map((notification: any) => (
          <MenuItem
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            sx={{
              // backgroundColor: notification.readAt ? '#f5f5f5' : '#e3f2fd',
              borderBottom: '1px solid #eee',
              '&:last-of-type': { borderBottom: 'none' },
              py: 1.5,
              px: 2,
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
              <IconBellRinging size={20} />
            </Avatar>
            <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
              <Typography
                variant="subtitle1"
                fontWeight={notification.readAt ? 'normal' : 'bold'}
                noWrap
                sx={{ textOverflow: 'ellipsis' }}
              >
                {notification.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                noWrap
                sx={{ textOverflow: 'ellipsis' }}
              >
                {notification.message}
              </Typography>
              <Typography variant="caption" color="text.disabled">
                {new Date(notification.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </MenuItem>
        ))}
        </Box>
      </Menu>
    </>
  );
};

export default Notifications;
