"use client";
import React, { useState } from "react";
import {
    Grid,
    Card,
    CardContent,
    Typography,
    Box,
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Skeleton,
    Chip,
    IconButton,
    InputAdornment, // Added for input field enhancements
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from "@mui/icons-material/Euro";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import SendTokenDialog from "../components/dashboard/sendToken";
import SwapToken from "@/app/(DashboardLayout)/components/dashboard/SwapToken";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import useAppStore from "@/stores/useAuthStore"; // Assuming this is correct
import { useQuery } from "@apollo/client";
import { GET_MY_TRANSACTIONS, GET_FIAT_BALANCE, GET_CRYPTO_BALANCE } from "@/graphql/queries";
import useAuthStore from "@/stores/useAuthStore"; // Assuming this is correct

// Example wallet data (replace with real data/fetch from API or store)
const wallet = {
    fiat: [
        { currency: "USD", balance: 1250.75 },
        { currency: "KES", balance: 32000 },
    ],
    crypto: [
        { currency: "BTC", balance: 0.5234 },
        { currency: "ETH", balance: 2.1 },
    ],
};

// Pie chart data (sum all balances, convert to USD for demo)
const pieData = [
    { name: "USD", value: 1250.75 },
    { name: "KES", value: 32000 / 150 }, // Assume 1 USD = 150 KES
    { name: "BTC", value: 0.5234 * 65000 }, // Assume 1 BTC = 65,000 USD
    { name: "ETH", value: 2.1 * 3500 }, // Assume 1 ETH = 3,500 USD
];

const COLORS = ["#1976d2", "#43a047", "#fbc02d", "#ff7043"];

const assetOptions: any = [
    ...wallet.fiat.map((f) => ({ type: "fiat", currency: f.currency })),
    ...wallet.crypto.map((c) => ({ type: "crypto", currency: c.currency })),
];

const WalletPage = () => {
    let isTest: boolean = false; // This seems like a constant for now, consider if it should be dynamic
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const token = useAuthStore((state) => state.token); // Assuming token is used for auth checks
    const userDetails: any = useAppStore((state) => state.userDetails);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"Deposit" | "Withdraw">("Deposit");
    const [selectedAsset, setSelectedAsset] = useState(assetOptions[0]);
    const [amount, setAmount] = useState("");

    const {
        data: transaction_data,
        loading: loading_transactions,
        error: error_transactions,
    } = useQuery(GET_MY_TRANSACTIONS, {
        variables: { isTest: false, skip: 0, take: 10 },
    });
    const { data: data_crypto_balances, loading: loading_crypto_balances } = useQuery(GET_CRYPTO_BALANCE, {
        variables: { isTest },
    });

    const {
        data: fiat_balance,
        loading: loading_balance,
        error: error_balance,
    } = useQuery(GET_FIAT_BALANCE);
    console.log(fiat_balance, "^&*^&%^$%")

    const handleOpenModal = (type: "Deposit" | "Withdraw", assetType: "fiat" | "crypto") => {
        setModalType(type);
        setSelectedAsset(assetOptions.find((a: any) => a.type === assetType) || assetOptions[0]);
        setAmount("");
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const handleAssetChange = (
        event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ value: unknown }> | any
    ) => {
        const val = event.target.value as string;
        const [type, currency] = val.split(":");
        setSelectedAsset({ type, currency });
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.target.value);

    const handleSubmit = () => {
        // Here you would handle the deposit/withdraw action
        console.log(`Submitting ${modalType} of ${amount} ${selectedAsset.currency}`);
        handleCloseModal();
    };

    // Helper to format currency display
    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 8, // For crypto, allow more decimal places
        }).format(amount);
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Wallet
            </Typography>
            <Grid container spacing={4}>
                {/* Fiat Wallet Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                            {/* <Avatar sx={{ bgcolor: "primary.main", mr: 2, width: 56, height: 56 }}>
                                <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />
                            </Avatar> */}
                            <Box sx={{ flexGrow: 1 }}>
                                {loading_balance ? (
                                    <Skeleton width="60%" height={30} sx={{ mt: 0.5 }} />
                                ) : (
                                    <Typography variant="h5" fontWeight="bold">
                                            {fiat_balance.fiatWalletBalance } KES
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleOpenModal("Deposit", "fiat")}
                                >
                                    Deposit
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleOpenModal("Withdraw", "fiat")}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Crypto Wallet Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                            {/* <Avatar sx={{ bgcolor: "warning.main", mr: 2, width: 56, height: 56 }}>
                                <CurrencyBitcoinIcon sx={{ fontSize: 32 }} />
                            </Avatar> */}
                            <Box sx={{ width:"100%" }}>
                                {loading_crypto_balances ? (
                                    <Skeleton width="60%" height={30} sx={{ mt: 0.5 }} />
                                ) : (
                                    <Typography variant="h5" fontWeight="bold">
                                        {data_crypto_balances?.balances
                                            ?.reduce((total: number, c: any) => total + Number(c.amount), 0)
                                            .toFixed(2)}{" "} ETH
                                    </Typography>
                                )}

                            </Box>
                            <br/>
                            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                    onClick={() => handleOpenModal("Deposit", "crypto")}
                                >
                                    Receive
                                </Button>
                                <SwapToken />
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 1 }}
                                    onClick={() => setSendDialogOpen(true)}
                                >
                                    Send
                                </Button>
                                <SendTokenDialog
                                    open={sendDialogOpen}
                                    onClose={() => setSendDialogOpen(false)}
                                    assetOptions={assetOptions}
                                    onSend={(data: any) => {
                                        console.log("Send Data:", data);
                                    }}
                                />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Crypto Wallet Accounts */}
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: 250, overflow: "hidden" }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Crypto Wallet Accounts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {!userDetails ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : userDetails?.cryptoWallet?.accounts?.length > 0 || data_crypto_balances?.balances?.length > 0 ? (
                            <Grid container spacing={2}>
                                {loading_crypto_balances
                                    ? Array.from({ length: 3 }).map((_, idx) => (
                                        <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                            <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                                <Skeleton variant="text" width="80%" />
                                                <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                                            </Card>
                                        </Grid>
                                    ))
                                    : data_crypto_balances?.balances?.map(
                                        (balance: { address: string; amount: number; symbol: string }, idx: number) => (
                                            <Grid size={{ xs: 6, md: 4 }} key={idx}>
                                                <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 0 }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Address:
                                                        </Typography>
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight={500}
                                                                sx={{ wordBreak: "break-all", mr: 1 }}
                                                            >
                                                                {`${balance.address.slice(0, 6)}...${balance.address.slice(-6)}`}
                                                            </Typography>
                                                            <Tooltip title="Copy Address">
                                                                <IconButton
                                                                    size="small"
                                                                    color="primary"
                                                                    onClick={() => navigator.clipboard.writeText(balance.address)}
                                                                >
                                                                    <ContentCopyIcon fontSize="small" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Box>
                                                        <Typography variant="body1" fontWeight={600} color="text.primary">
                                                            {balance.amount} {balance.symbol}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        )
                                    )}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                No crypto accounts found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Fiat Wallet Accounts */}
                <Grid size={{ xs: 12 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: 250, overflow: "hidden" }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Fiat Wallet Accounts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {!userDetails ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : userDetails?.fiatWallet?.accounts?.length > 0 ? (
                            <Grid container spacing={2}>
                                {userDetails?.fiatWallet?.accounts.map((account: any) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={account.id}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 0 }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    Account Number:
                                                </Typography>
                                                <Typography variant="body1" fontWeight={500} sx={{ wordBreak: "break-all", mb: 1 }}>
                                                    {account.address}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Created: {new Date(account.createdAt).toLocaleString()}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                No fiat accounts found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Asset Distribution Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 450 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Asset Distribution
                        </Typography>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Transaction History */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 450, overflowY: "auto" }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Transaction History
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {loading_transactions ? (
                            <List>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <ListItem key={index} sx={{ pb: 2, pt: 2 }}>
                                        <ListItemAvatar>
                                            <Skeleton variant="circular" width={40} height={40} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Skeleton width="70%" />}
                                            secondary={<Skeleton width="40%" />}
                                        />
                                        <Skeleton variant="rectangular" width={70} height={25} sx={{ borderRadius: 1 }} />
                                    </ListItem>
                                ))}
                            </List>
                        ) : transaction_data?.myCryptoTransactions?.length > 0 ? (
                            <List disablePadding>
                                {transaction_data.myCryptoTransactions.map((tx: any, index: number) => (
                                    <React.Fragment key={tx.id}>
                                        <ListItem
                                            sx={{
                                                px: 0,
                                                py: 1.5,
                                                "&:not(:last-of-type)": { borderBottom: "1px solid #eee" },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: "primary.light" }}>
                                                    {tx.toSymbol?.charAt(0) || "T"}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" fontWeight={500}>
                                                        {tx.type} - {tx.value} {tx.toSymbol}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography variant="body2" color="text.secondary">
                                                        {new Date(tx.timeStamp).toLocaleString()}
                                                    </Typography>
                                                }
                                            />
                                            <Chip
                                                label={tx.status.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                                                size="small"
                                                color={
                                                    tx.status === "COMPLETED"
                                                        ? "success"
                                                        : tx.status === "FAILED"
                                                            ? "error"
                                                            : "warning"
                                                }
                                                sx={{ fontWeight: "bold", textTransform: "capitalize" }}
                                            />
                                        </ListItem>
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                No transactions found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Deposit/Withdraw Modal */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    {modalType} {selectedAsset.type === "fiat" ? "Fiat" : "Crypto"} Asset
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="asset-select-label">Asset</InputLabel>
                        <Select
                            labelId="asset-select-label"
                            value={`${selectedAsset.type}:${selectedAsset.currency}`}
                            label="Asset"
                            onChange={handleAssetChange}
                        >
                            {assetOptions
                                .filter((a: any) => a.type === selectedAsset.type)
                                .map((a: any) => (
                                    <MenuItem key={a.currency} value={`${a.type}:${a.currency}`}>
                                        {a.currency}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                    <TextField
                        label="Amount"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={handleAmountChange}
                        inputProps={{ min: 0, step: "any" }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">{selectedAsset.currency}</InputAdornment>
                            ),
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseModal} color="error">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!amount || Number(amount) <= 0}
                    >
                        {modalType}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WalletPage;