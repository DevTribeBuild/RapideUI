"use client";
import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Avatar,
  Box,
} from "@mui/material";
import { GET_ALL_USERS } from "@/graphql/queries";
import { useQuery } from "@apollo/client";

const UsersPage = () => {
  // ✅ Move useQuery inside the component
  const { data, loading, error } = useQuery(GET_ALL_USERS, {
    fetchPolicy: "cache-and-network",
  });

  const users = data?.users || [];

  const [selectedUser, setSelectedUser] = useState<typeof users[0] | null>(null);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error.message}</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        All Users
      </Typography>
      <Grid container spacing={3}>
        {users.map((user: any) => (
          <Grid
            key={user.id}
            size={{
              xs: 12,
              sm: 6,
              md: 4,
              lg: 4,
            }}
          >
            <Card>
              <CardActionArea onClick={() => setSelectedUser(user)}>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    src={user.avatar}
                    alt={user.name}
                    sx={{ mr: 2, width: 56, height: 56 }}
                  />
                  <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography color="text.secondary">{user.email}</Typography>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                src={selectedUser.avatar}
                alt={selectedUser.name}
                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
              />
              <Typography variant="h6">{selectedUser.userType}</Typography>
              <Typography>Email: {selectedUser.email}</Typography>
              <Typography>Phone: {selectedUser.phone}</Typography>
              <Typography>Address: {selectedUser.walletAddress}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedUser(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
