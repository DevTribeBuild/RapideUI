"use client";
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Skeleton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton,
  Button,
  useTheme,
  Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Tabs, Tab,
  Grid, Card, CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import toast from 'react-hot-toast';
import { useQuery, useMutation } from "@apollo/client/react";
import { MERCHANTS_BY_STATUS_QUERY } from '@/graphql/merchant/queries';
import {
  CREATE_MERCHANT_MUTATION,
  UPDATE_MERCHANT_MUTATION,
  DELETE_MERCHANT_MUTATION,
  REVIEW_MERCHANT_DETAILS_MUTATION, // Changed to REVIEW_MERCHANT_DETAILS_MUTATION
} from '@/graphql/merchant/mutations';

interface Merchant {
  id: string;
  bankAccountNumber: string;
  bankConfirmation: string;
  bankName: string;
  businessName: string;
  certificateOfIncorp: string;
  cr12Form: string;
  createdAt: string;
  foodHandlerCert: string;
  healthCert: string;
  kraPinCert: string;
  menuFile: string;
  menuImages: string[];
  mpesaPaybill: string;
  mpesaTill: string;
  ownerKraPinCert: string;
  status: string; // APPROVED, PENDING, REJECTED
  tradingLicense: string;
  updatedAt: string;
  userId: string;
  verifiedAt: string;
  email: string; // Extracted from user.email
}

type MerchantsByStatusQuery = {
  merchantsByStatus: (Omit<Merchant, 'email'> & { user: { email: string } })[];
};

type CreateMerchantMutationVariables = {
  input: {
    businessName: string;
    email: string;
  };
};

type UpdateMerchantMutationVariables = {
  input: {
    id: string;
    businessName: string;
    email: string;
  };
};

type DeleteMerchantMutationVariables = {
  id: string;
};

type ReviewMerchantDetailsMutationVariables = {
  input: {
    comment: string | null;
    status: string;
  };
  userId: string;
};

const MerchantManagementPage: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING'); // State for tabs

  const { data, loading, error, refetch } = useQuery<MerchantsByStatusQuery>(MERCHANTS_BY_STATUS_QUERY, {
    variables: { status: selectedTab }, // Pass selectedTab as status variable
  });
  const [merchants, setMerchants] = useState<Merchant[]>([]);

  useEffect(() => {
    if (data) {
      const mappedMerchants = data.merchantsByStatus.map(merchant => ({
        ...merchant,
        email: merchant.user?.email || '',
      }));
      setMerchants(mappedMerchants);
    }
  }, [data]);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState<boolean>(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [merchantToDelete, setMerchantToDelete] = useState<Merchant | null>(null);

  const [createMerchant, { loading: creatingMerchant }] = useMutation<any, CreateMerchantMutationVariables>(CREATE_MERCHANT_MUTATION, {
    refetchQueries: [{ query: MERCHANTS_BY_STATUS_QUERY, variables: { status: selectedTab } }],
  });
  const [updateMerchant, { loading: updatingMerchant }] = useMutation<any, UpdateMerchantMutationVariables>(UPDATE_MERCHANT_MUTATION, {
    refetchQueries: [{ query: MERCHANTS_BY_STATUS_QUERY, variables: { status: selectedTab } }],
  });
  const [deleteMerchant, { loading: deletingMerchant }] = useMutation<any, DeleteMerchantMutationVariables>(DELETE_MERCHANT_MUTATION, {
    refetchQueries: [{ query: MERCHANTS_BY_STATUS_QUERY, variables: { status: selectedTab } }],
  });
  const [reviewMerchantDetails, { loading: reviewingMerchant }] = useMutation<any, ReviewMerchantDetailsMutationVariables>(REVIEW_MERCHANT_DETAILS_MUTATION, {
    refetchQueries: [{ query: MERCHANTS_BY_STATUS_QUERY, variables: { status: selectedTab } }],
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'PENDING' | 'APPROVED' | 'REJECTED') => {
    setSelectedTab(newValue);
  };

  const handleOpenCreateForm = () => {
    setEditingMerchant(null);
    setIsFormDialogOpen(true);
  };

  const handleOpenEditForm = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setIsFormDialogOpen(true);
  };

  const handleCloseFormDialog = () => {
    setIsFormDialogOpen(false);
    setEditingMerchant(null);
  };

  const handleSaveMerchant = async (merchantToSave: Partial<Merchant>) => {
    try {
      if (merchantToSave.id) {
        await updateMerchant({
          variables: {
            input: {
              id: merchantToSave.id,
              businessName: merchantToSave.businessName!,
              email: merchantToSave.email!,
            },
          },
        });
        toast.success('Merchant updated successfully!');
      } else {
        await createMerchant({
          variables: {
            input: {
              businessName: merchantToSave.businessName!,
              email: merchantToSave.email!,
            },
          },
        });
        toast.success('Merchant created successfully!');
      }
      handleCloseFormDialog();
    } catch (err: any) {
      console.error('Error saving merchant:', err);
      toast.error(`Error saving merchant: ${err.message}`);
    }
  };

  const handleOpenDeleteConfirm = (merchant: Merchant) => {
    setMerchantToDelete(merchant);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    setMerchantToDelete(null);
  };

  const handleDeleteMerchant = async () => {
    if (merchantToDelete) {
      try {
        await deleteMerchant({ variables: { id: merchantToDelete.id } });
        toast.success('Merchant deleted successfully!');
        handleCloseDeleteConfirm();
      } catch (err: any) {
        console.error('Error deleting merchant:', err);
        toast.error(`Error deleting merchant: ${err.message}`);
      }
    }
  };

  const handleApproveMerchant = async (merchant: Merchant) => {
    try {
      await reviewMerchantDetails({
        variables: {
          input: {
            status: 'APPROVED',
            comment: null, // No comment for now
          },
          userId: merchant.userId,
        },
      });
      toast.success(`Merchant ${merchant.businessName} approved successfully!`);
    } catch (err: any) {
      console.error('Error approving merchant:', err);
      toast.error(`Error approving merchant: ${err.message}`);
    }
  };

  const handleRejectMerchant = async (merchant: Merchant) => {
    try {
      await reviewMerchantDetails({
        variables: {
          input: {
            status: 'REJECTED',
            comment: null, // No comment for now
          },
          userId: merchant.userId,
        },
      });
      toast.success(`Merchant ${merchant.businessName} rejected successfully!`);
    } catch (err: any) {
      console.error('Error rejecting merchant:', err);
      toast.error(`Error rejecting merchant: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          p: 3,
          fontFamily: 'Inter, sans-serif',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            bgcolor: theme.palette.background.paper,
            p: 4,
            borderRadius: '12px',
            width: '100%',
            maxWidth: '1200px',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
              Merchant Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              color="primary"
              disabled // Disable button during loading
            >
              Add New Merchant
            </Button>
          </Box>

          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="merchant status tabs" sx={{ mb: 3 }}>
            <Tab label="Pending" value="PENDING" disabled={true} />
            <Tab label="Approved" value="APPROVED" disabled={true} />
            <Tab label="Rejected" value="REJECTED" disabled={true} />
          </Tabs>

          <Grid container spacing={3}>
            {[...Array(6)].map((_, index) => (
              <Grid size={{xs:12, sm:6, md:4}} key={index}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent>
                    <Skeleton variant="text" width="80%" height={30} sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                    <Skeleton variant="rectangular" width={100} height={25} sx={{ borderRadius: 1, mb: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="circular" width={40} height={40} />
                      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
                      <Skeleton variant="rectangular" width={80} height={36} sx={{ borderRadius: 1 }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error fetching merchants: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 3,
        fontFamily: 'Inter, sans-serif',
        bgcolor: theme.palette.background.default,
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          p: 4,
          borderRadius: '12px',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, fontSize:{md:"1rem", xs:"0.8rem"} }}>
            Merchant Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateForm}
            color="primary"
            sx={{ fontSize:{md:"0.875rem", xs:"0.7rem"} }}
          >
            Merchant
          </Button>
        </Box>

        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="merchant status tabs" sx={{ mb: 3 }}>
          <Tab label="Pending" value="PENDING" />
          <Tab label="Approved" value="APPROVED" />
          <Tab label="Rejected" value="REJECTED" />
        </Tabs>

        {/* Replaced TableContainer with Grid container for cards */}
        <Grid container spacing={3}>
          {merchants.length === 0 ? (
            <Grid size={{xs:12}}>
              <Typography align="center" sx={{ py: 4, color: theme.palette.text.secondary }}>
                No {selectedTab.toLowerCase()} merchants found.
              </Typography>
            </Grid>
          ) : (
            merchants.map((merchant) => (
              <Grid size={{xs:12, sm:6, md:4}} key={merchant.id}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
                    },
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                      {merchant.businessName || 'N/A'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {merchant.email}
                    </Typography>
                    <Chip
                      label={merchant.status}
                      variant="outlined"
                      color={
                        merchant.status === 'APPROVED' ? 'success' :
                        merchant.status === 'PENDING' ? 'warning' :
                        'error'
                      }
                      icon={
                        merchant.status === 'APPROVED' ? <CheckCircleIcon /> :
                        merchant.status === 'PENDING' ? <InfoIcon /> :
                        <CancelIcon />
                      }
                      size="small"
                      sx={{ mb: 2 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1 }}>
                      {selectedTab === 'PENDING' && (
                        <>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleApproveMerchant(merchant)}
                            color="success"
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => handleRejectMerchant(merchant)}
                            color="error"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {selectedTab === 'APPROVED' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleRejectMerchant(merchant)}
                          color="error"
                        >
                          Reject
                        </Button>
                      )}
                      {selectedTab === 'REJECTED' && (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleApproveMerchant(merchant)}
                          color="success"
                        >
                          Approve
                        </Button>
                      )}
                      <IconButton aria-label="edit" onClick={() => handleOpenEditForm(merchant)} sx={{ color: theme.palette.warning.main }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete" onClick={() => handleOpenDeleteConfirm(merchant)} sx={{ color: theme.palette.error.main }}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* Merchant Form Dialog */}
      <Dialog open={isFormDialogOpen} onClose={handleCloseFormDialog}>
        <DialogTitle>{editingMerchant ? 'Edit Merchant' : 'Add New Merchant'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="businessName"
            label="Merchant Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={editingMerchant?.businessName || '!'}
            onChange={(e) => setEditingMerchant(prev => prev ? { ...prev, businessName: e.target.value } : { id: '', businessName: e.target.value, email: '', status: 'PENDING', createdAt: '', updatedAt: '', bankAccountNumber: '', bankConfirmation: '', bankName: '', certificateOfIncorp: '', cr12Form: '', foodHandlerCert: '', healthCert: '', kraPinCert: '', menuFile: '', menuImages: [], mpesaPaybill: '', mpesaTill: '', ownerKraPinCert: '', tradingLicense: '', userId: '', verifiedAt: '' })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            id="email"
            label="Merchant Email"
            type="email"
            fullWidth
            variant="outlined"
            defaultValue={editingMerchant?.email || '!'}
            onChange={(e) => setEditingMerchant(prev => prev ? { ...prev, email: e.target.value } : { id: '', businessName: '', email: e.target.value, status: 'PENDING', createdAt: '', updatedAt: '', bankAccountNumber: '', bankConfirmation: '', bankName: '', certificateOfIncorp: '', cr12Form: '', foodHandlerCert: '', healthCert: '', kraPinCert: '', menuFile: '', menuImages: [], mpesaPaybill: '', mpesaTill: '', ownerKraPinCert: '', tradingLicense: '', userId: '', verifiedAt: '' })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormDialog}>Cancel</Button>
          <Button onClick={() => handleSaveMerchant(editingMerchant!)} disabled={creatingMerchant || updatingMerchant}>
            {creatingMerchant || updatingMerchant ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onClose={handleCloseDeleteConfirm}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete merchant &quot;{merchantToDelete?.businessName}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button onClick={handleDeleteMerchant} color="error" disabled={deletingMerchant}>
            {deletingMerchant ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MerchantManagementPage;