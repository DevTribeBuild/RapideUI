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
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import useAppStore from "@/stores/useAuthStore"
import SendTokenDialog from "../components/dashboard/sendToken";
import { useQuery } from "@apollo/client";
import { GET_MY_TRANSACTIONS } from "@/graphql/queries";
import useAuthStore from "@/stores/useAuthStore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import SwapToken from "@/app/(DashboardLayout)/components/dashboard/SwapToken"

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


// Example transaction history
const transactions = [
    {
        id: "tx1",
        type: "Deposit",
        amount: 500,
        currency: "USD",
        date: "2025-06-18",
        icon: AttachMoneyIcon,
    },
    {
        id: "tx2",
        type: "Withdrawal",
        amount: 0.1,
        currency: "BTC",
        date: "2025-06-17",
        icon: CurrencyBitcoinIcon,
    },
    {
        id: "tx3",
        type: "Deposit",
        amount: 10000,
        currency: "KES",
        date: "2025-06-16",
        icon: CurrencyFrancIcon,
    },
    {
        id: "tx4",
        type: "Deposit",
        amount: 1.5,
        currency: "ETH",
        date: "2025-06-15",
        icon: EuroIcon,
    },
];

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
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const token = useAuthStore((state) => state.token);
    const userDetails: any = useAppStore((state) => state.userDetails);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"Deposit" | "Withdraw">("Deposit");
    const [selectedAsset, setSelectedAsset] = useState(assetOptions[0]);
    const [amount, setAmount] = useState("");
    const { data: transaction_data, loading: loading_transactions, error: error_transactions } = useQuery(GET_MY_TRANSACTIONS, {
        variables: { isTest: false, skip: 0, take: 10 },
    });
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
        handleCloseModal();
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Wallet
            </Typography>
            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                                <AccountBalanceWalletIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">Fiat Wallet</Typography>
                                {wallet.fiat.map((f) => (
                                    <Typography key={f.currency} variant="h5" fontWeight="bold">
                                        {f.currency} {f.balance.toLocaleString()}
                                    </Typography>
                                ))}
                            </Box>
                            <Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                    onClick={() => handleOpenModal("Deposit", "fiat")}
                                >
                                    Deposit
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 1 }}
                                    onClick={() => handleOpenModal("Withdraw", "fiat")}
                                >
                                    Withdraw
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                                <CurrencyBitcoinIcon />
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">Crypto Wallet</Typography>
                                {wallet.crypto.map((c) => (
                                    <Typography key={c.currency} variant="h5" fontWeight="bold">
                                        {c.balance} {c.currency}
                                    </Typography>
                                ))}
                            </Box>
                            <Box
                            sx={{display:"flex"}}
                            >
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                    onClick={() => handleOpenModal("Deposit", "crypto")}
                                >
                                    Receive
                                </Button>
                                <SwapToken/>
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
                                    }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, minHeight: 200, overflow: "auto" }}>
                        <Typography variant="h6" gutterBottom>
                            Crypto Wallet Accounts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {!userDetails ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : userDetails?.cryptoWallet?.accounts?.length > 0 ? (
                            <Grid container spacing={2}>
                                {userDetails.cryptoWallet.accounts.map((account) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={account.id}>
                                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Account Address
                                                </Typography>
                                                <Typography variant="body2" sx={{ wordBreak: "break-all", mb: 1, display: "flex", alignItems: "center" }}>
                                                    {`${account.address.slice(0, 6)}...${account.address.slice(-6)}`}
                                                    <Tooltip title="Copy Address">
                                                        <IconButton
                                                        size="small"
                                                        sx={{ ml: 1 }}
                                                        onClick={() => navigator.clipboard.writeText(account.address)}
                                                        >
                                                        <ContentCopyIcon fontSize="inherit" />
                                                        </IconButton>
                                                    </Tooltip>
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
                            <Typography color="text.secondary">No crypto accounts found.</Typography>
                        )}
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, minHeight: 200, overflow: "auto" }}>
                        <Typography variant="h6" gutterBottom>
                            Fiat Wallet Accounts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {!userDetails ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : userDetails?.fiatWallet?.accounts?.length > 0 ? (
                            <Grid container spacing={2}>
                                {userDetails.fiatWallet.accounts.map((account) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={account.id}>
                                        <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
                                            <CardContent>
                                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                                    Account Number
                                                </Typography>
                                                <Typography variant="body2" sx={{ wordBreak: "break-all", mb: 1 }}>
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
                            <Typography color="text.secondary">No fiat accounts found.</Typography>
                        )}
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, height: 400 }}>
                        <Typography variant="h6" gutterBottom>
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
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, height: 400, overflow: "auto", position: "relative" }}>
                        <Typography variant="h6" gutterBottom>
                            Transaction History
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {loading_transactions ? (
                            <List>
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <>
                                        <ListItem key={index} sx={{ position: "relative" }}>
                                            <ListItemAvatar>
                                                <Skeleton variant="circular" width={40} height={40} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Skeleton width="60%" />}
                                                secondary={<Skeleton width="40%" />}
                                            />
                                            <Skeleton
                                                variant="rectangular"
                                                width={60}
                                                height={24}
                                                sx={{ position: "absolute", top: 8, right: 16, borderRadius: 1 }}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </>
                                ))}
                            </List>
                        ) : transaction_data?.myCryptoTransactions?.length > 0 ? (
                            <List>
                                {transaction_data.myCryptoTransactions.map((tx) => (
                                    <React.Fragment key={tx.id}>
                                        <ListItem sx={{ position: "relative" }}>
                                            <ListItemAvatar>
                                                <Avatar>{tx.toSymbol?.charAt(0) || "T"}</Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${tx.type} - ${tx.value} ${tx.toSymbol}`}
                                                secondary={new Date(tx.timeStamp).toLocaleString()}
                                            />
                                            <Chip
                                                label={tx.status.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                                                size="small"
                                                sx={{
                                                    position: "absolute",
                                                    top: 8,
                                                    right: 16,
                                                    backgroundColor:
                                                        tx.status === "COMPLETED"
                                                            ? "#4caf50"
                                                            : tx.status === "FAILED"
                                                                ? "#f44336"
                                                                : "#ff9800",
                                                    color: "#fff",
                                                    fontWeight: "bold",
                                                    textTransform: "capitalize",
                                                }}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                No transactions found.
                            </Typography>
                        )}
                    </Paper>
                </Grid>

            </Grid>
            <Dialog open={modalOpen} onClose={handleCloseModal}>
                <DialogTitle>
                    {modalType} {selectedAsset.type === "fiat" ? "Fiat" : "Crypto"}
                </DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="asset-select-label">Asset</InputLabel>
                        <Select
                            labelId="asset-select-label"
                            value={`${selectedAsset.type}:${selectedAsset.currency}`}
                            label="Asset"
                            onChange={handleAssetChange}
                        >
                            {assetOptions
                                .filter((a) => a.type === selectedAsset.type)
                                .map((a) => (
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
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Cancel</Button>
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