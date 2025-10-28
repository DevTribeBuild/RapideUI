import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Switch,
  FormControlLabel,
  IconButton,
} from '@mui/material';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { FIAT_TRANSFER } from '@/graphql/fiat/mutations';
import { GET_ALL_USERS } from '@/graphql/user/queries';
import { PersonOutline } from '@mui/icons-material';
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PersonIcon from "@mui/icons-material/Person";

interface SendFiatDialogProps {
  open: boolean;
  onClose: () => void;
  fiatWallets: any[];
}

const SendFiatDialog: React.FC<SendFiatDialogProps> = ({ open, onClose, fiatWallets }) => {
  const [amount, setAmount] = useState('');
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [usePhoneNumberInput, setUsePhoneNumberInput] = useState(false);
  const [phoneNumberInput, setPhoneNumberInput] = useState('');

  const [sendFiat, { loading: sendingFiat }] = useMutation(FIAT_TRANSFER, {
    onCompleted: () => {
      toast.success('Fiat transfer initiated successfully!');
      onClose();
    },
    onError: (error) => {
      toast.error(`Error sending fiat: ${error.message}`);
    },
  });

  const { data: usersData, loading: loadingUsers } = useQuery(GET_ALL_USERS);

  useEffect(() => {
    if (fiatWallets.length > 0 && !selectedFiatCurrency) {
      setSelectedFiatCurrency(fiatWallets[0].Currency.code);
    }
  }, [fiatWallets, selectedFiatCurrency]);

  const handleSendFiat = () => {
    const amountNum = parseFloat(amount);
    let finalRecipientId = selectedRecipient?.id;

    if (usePhoneNumberInput) {
      const recipientByPhone = usersData?.users?.find(user => user.phone === phoneNumberInput);
      if (!recipientByPhone) {
        toast.error('No user found with that phone number.');
        return;
      }
      finalRecipientId = recipientByPhone.id;
    }

    if (!selectedFiatCurrency || !amount || amountNum <= 0 || !finalRecipientId) {
      toast.error('Please fill all fields and select a valid recipient.');
      return;
    }

    const selectedFiatWalletBalance = fiatWallets.find(w => w.Currency.code === selectedFiatCurrency)?.balance || 0;
    if (amountNum > selectedFiatWalletBalance) {
      toast.error('Amount exceeds available balance in selected fiat wallet.');
      return;
    }

    sendFiat({
      variables: {
        input: {
          amount: amountNum,
          currencyCode: selectedFiatCurrency,
          recipientId: finalRecipientId,
        },
      },
    });
  };

  const handleClose = () => {
    setAmount('');
    setSelectedFiatCurrency(fiatWallets.length > 0 ? fiatWallets[0].Currency.code : '');
    setSelectedRecipient(null);
    setUsePhoneNumberInput(false);
    setPhoneNumberInput('');
    onClose();
  };

  const selectedFiatWalletBalance = fiatWallets.find(w => w.Currency.code === selectedFiatCurrency)?.balance || 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{color:"#ffd700", fontWeight:"3"}}>Send Fiat</DialogTitle>
      <DialogContent dividers>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Fiat Currency</InputLabel>
          <Select
            value={selectedFiatCurrency}
            label="Fiat Currency"
            onChange={(e) => setSelectedFiatCurrency(e.target.value)}
          >
            {fiatWallets.map((wallet) => (
              <MenuItem key={wallet.Currency.code} value={wallet.Currency.code}>
                {wallet.Currency.code} (Balance: {wallet.balance.toFixed(2)})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Amount"
          type="number"
          fullWidth
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                  Bal: {selectedFiatWalletBalance.toFixed(2)}
                </Typography>
                <Button size="small" onClick={() => setAmount(selectedFiatWalletBalance.toString())}>
                  Max
                </Button>
              </Box>
            ),
          }}
        />
          {/* Switch */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            borderRadius: 2,
            pb:2
          }}
        >
          <Typography variant="body1">Enter phone number instead</Typography>
          <IconButton
            onClick={() => setUsePhoneNumberInput((prev) => !prev)}
            color={usePhoneNumberInput ? "primary" : "default"}
            sx={{
              backgroundColor: usePhoneNumberInput ? "primary.main" : "grey.300",
              color: usePhoneNumberInput ? "white" : "black",
              "&:hover": {
                backgroundColor: usePhoneNumberInput ? "primary.dark" : "grey.400",
              },
            }}
          >
            {usePhoneNumberInput ? <PhoneIphoneIcon /> : <PersonIcon />}
          </IconButton>

        </Box>
      {!usePhoneNumberInput && (
          <FormControl
            fullWidth
            variant="outlined"
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          >
            <InputLabel>
              {loadingUsers ? "Loading users..." : "Select Recipient"}
            </InputLabel>
            <Select
              value={selectedRecipient?.id || ""}
              label="Select Recipient"
              onChange={(e) => {
                const recipient = usersData?.users?.find(
                  (user: any) => user.id === e.target.value
                );
                setSelectedRecipient(recipient);
              }}
              disabled={loadingUsers || usePhoneNumberInput}
              startAdornment={<PersonOutline sx={{ mr: 1, color: "text.secondary" }} />}
            >
              {loadingUsers ? (
                <MenuItem disabled>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={18} /> Loading users...
                  </Box>
                </MenuItem>
              ) : usersData?.users?.length ? (
                usersData.users.map((user: any) => (
                  <MenuItem key={user.id} value={user.id}>
                    <Typography>
                      {user.firstName} {user.lastName}{" "}
                      <Typography
                        component="span"
                        sx={{ color: "text.secondary", ml: 1 }}
                      >
                        ({user.username || user.phone || user.email})
                      </Typography>
                    </Typography>
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No users found</MenuItem>
              )}
            </Select>
          </FormControl>
        )}

        {usePhoneNumberInput && (
          <TextField
            label="Recipient Phone Number"
            type="tel"
            fullWidth
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  onClick={() => {
                    navigator.clipboard.readText().then(text => {
                      setPhoneNumberInput(text);
                    }).catch(err => {
                      console.error('Failed to read clipboard contents: ', err);
                      toast.error('Failed to paste from clipboard.');
                    });
                  }}
                >
                  Paste
                </Button>
              ),
            }}
          />
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="error" disabled={sendingFiat}>
          Cancel
        </Button>
        <Button
          onClick={handleSendFiat}
          variant="contained"
          disabled={!amount || parseFloat(amount) <= 0 || !selectedRecipient?.id || sendingFiat}
        >
          {sendingFiat ? 'Sending...' : 'Send Fiat'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SendFiatDialog;
