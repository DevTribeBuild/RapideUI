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
  Tabs,
  Tab,
} from '@mui/material';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-hot-toast';
import { CURRENCIES_QUERY } from '@/graphql';
import { BUY_CRYPTO_WITH_FIAT, SELL_CRYPTO_TO_FIAT } from '@/graphql/crypto/mutations'; // Assuming these mutations exist or will be created

interface BuySellCryptoDialogProps {
  open: boolean;
  onClose: () => void;
  cryptoBalances: any[]; // Pass crypto balances to allow selection
  fiatWallets: any[]; // Pass fiat wallets for selling crypto
}

const BuySellCryptoDialog: React.FC<BuySellCryptoDialogProps> = ({ open, onClose, cryptoBalances, fiatWallets }) => {
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [cryptoAmount, setCryptoAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState('');

  const { data: currenciesData, loading: currenciesLoading } = useQuery(CURRENCIES_QUERY);

  // Get selected crypto balance
  const selectedCryptoBalance = cryptoBalances.find(b => b.symbol === selectedCrypto)?.amount || 0;
  // Get selected fiat wallet balance
  const selectedFiatWalletBalance = fiatWallets.find(w => w.Currency.code === selectedFiatCurrency)?.balance || 0;

  const [buyCrypto, { loading: buyingCrypto }] = useMutation(BUY_CRYPTO_WITH_FIAT, {
    onCompleted: () => {
      toast.success('Crypto purchase initiated!');
      onClose();
    },
    onError: (error) => {
      toast.error(`Error buying crypto: ${error.message}`);
    },
  });

  const [sellCrypto, { loading: sellingCrypto }] = useMutation(SELL_CRYPTO_TO_FIAT, {
    onCompleted: () => {
      toast.success('Crypto sell initiated!');
      onClose();
    },
    onError: (error) => {
      toast.error(`Error selling crypto: ${error.message}`);
    },
  });

  useEffect(() => {
    if (cryptoBalances.length > 0 && !selectedCrypto) {
      setSelectedCrypto(cryptoBalances[0].symbol);
    }
    if (fiatWallets.length > 0 && !selectedFiatCurrency) {
      setSelectedFiatCurrency(fiatWallets[0].Currency.code);
    }
  }, [cryptoBalances, fiatWallets, selectedCrypto, selectedFiatCurrency]);


  const handleBuyCrypto = () => {
    const fiatAmountNum = parseFloat(fiatAmount);
    if (!selectedCrypto || !fiatAmount || fiatAmountNum <= 0 || !selectedFiatCurrency) {
      toast.error('Please fill all buy fields correctly.');
      return;
    }
    if (fiatAmountNum > selectedFiatWalletBalance) {
      toast.error('Fiat amount exceeds available balance.');
      return;
    }
    buyCrypto({
      variables: {
        input: {
          cryptoSymbol: selectedCrypto,
          fiatAmount: fiatAmountNum,
          fiatCurrencyCode: selectedFiatCurrency,
          paymentMethod: 'Mpesa', // Assuming Mpesa for buying
        },
      },
    });
  };

  const handleSellCrypto = () => {
    const cryptoAmountNum = parseFloat(cryptoAmount);
    if (!selectedCrypto || !cryptoAmount || cryptoAmountNum <= 0 || !selectedFiatCurrency) {
      toast.error('Please fill all sell fields correctly.');
      return;
    }
    if (cryptoAmountNum > selectedCryptoBalance) {
      toast.error('Crypto amount exceeds available balance.');
      return;
    }
    sellCrypto({
      variables: {
        input: {
          cryptoSymbol: selectedCrypto,
          cryptoAmount: cryptoAmountNum,
          fiatCurrencyCode: selectedFiatCurrency,
        },
      },
    });
  };

  const handleClose = () => {
    setTab('buy');
    setCryptoAmount('');
    setFiatAmount('');
    setSelectedCrypto(cryptoBalances.length > 0 ? cryptoBalances[0].symbol : '');
    setSelectedFiatCurrency(fiatWallets.length > 0 ? fiatWallets[0].Currency.code : '');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Buy/Sell Crypto</DialogTitle>
      <DialogContent dividers>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} aria-label="buy sell tabs" sx={{ mb: 2 }}>
          <Tab label="Buy Crypto" value="buy" />
          <Tab label="Sell Crypto" value="sell" />
        </Tabs>

        {tab === 'buy' && (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Crypto to Buy</InputLabel>
              <Select
                value={selectedCrypto}
                label="Crypto to Buy"
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                {cryptoBalances.map((balance) => (
                  <MenuItem key={balance.symbol} value={balance.symbol}>
                    {balance.symbol}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pay With (Fiat Currency)</InputLabel>
              <Select
                value={selectedFiatCurrency}
                label="Pay With (Fiat Currency)"
                onChange={(e) => setSelectedFiatCurrency(e.target.value)}
              >
                {fiatWallets.map((wallet) => (
                  <MenuItem key={wallet.Currency.code} value={wallet.Currency.code}>
                    {wallet.Currency.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Fiat Amount"
              type="number"
              fullWidth
              value={fiatAmount}
              onChange={(e) => setFiatAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Bal: {selectedFiatWalletBalance.toFixed(2)}
                    </Typography>
                    <Button size="small" onClick={() => setFiatAmount(selectedFiatWalletBalance.toString())}>
                      Max
                    </Button>
                  </Box>
                ),
              }}
            />
            <Typography variant="body2" color="text.secondary">
              You will receive approximately: {(parseFloat(fiatAmount) / 100).toFixed(6)} {selectedCrypto} (example rate)
            </Typography>
          </Box>
        )}

        {tab === 'sell' && (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Crypto to Sell</InputLabel>
              <Select
                value={selectedCrypto}
                label="Crypto to Sell"
                onChange={(e) => setSelectedCrypto(e.target.value)}
              >
                {cryptoBalances.map((balance) => (
                  <MenuItem key={balance.symbol} value={balance.symbol}>
                    {balance.symbol} (Balance: {balance.amount})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Receive In (Fiat Currency)</InputLabel>
              <Select
                value={selectedFiatCurrency}
                label="Receive In (Fiat Currency)"
                onChange={(e) => setSelectedFiatCurrency(e.target.value)}
              >
                {fiatWallets.map((wallet) => (
                  <MenuItem key={wallet.Currency.code} value={wallet.Currency.code}>
                    {wallet.Currency.code}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Crypto Amount"
              type="number"
              fullWidth
              value={cryptoAmount}
              onChange={(e) => setCryptoAmount(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                      Bal: {selectedCryptoBalance.toFixed(6)}
                    </Typography>
                    <Button size="small" onClick={() => setCryptoAmount(selectedCryptoBalance.toString())}>
                      Max
                    </Button>
                  </Box>
                ),
              }}
            />
            <Typography variant="body2" color="text.secondary">
              You will receive approximately: {(parseFloat(cryptoAmount) * 100).toFixed(2)} {selectedFiatCurrency} (example rate)
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="error" disabled={buyingCrypto || sellingCrypto}>
          Cancel
        </Button>
        {tab === 'buy' ? (
          <Button
            onClick={handleBuyCrypto}
            variant="contained"
            disabled={!fiatAmount || parseFloat(fiatAmount) <= 0 || !selectedCrypto || buyingCrypto}
          >
            {buyingCrypto ? 'Buying...' : 'Buy Crypto'}
          </Button>
        ) : (
          <Button
            onClick={handleSellCrypto}
            variant="contained"
            disabled={!cryptoAmount || parseFloat(cryptoAmount) <= 0 || !selectedCrypto || sellingCrypto}
          >
            {sellingCrypto ? 'Selling...' : 'Sell Crypto'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BuySellCryptoDialog;
