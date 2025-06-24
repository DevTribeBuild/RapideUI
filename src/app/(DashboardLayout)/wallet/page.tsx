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
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EuroIcon from "@mui/icons-material/Euro";
import CurrencyFrancIcon from "@mui/icons-material/CurrencyFranc";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import useAppStore from "@/stores/useAuthStore"


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

const assetOptions = [
    ...wallet.fiat.map((f) => ({ type: "fiat", currency: f.currency })),
    ...wallet.crypto.map((c) => ({ type: "crypto", currency: c.currency })),
];

const WalletPage = () => {
    const userDetails:any = useAppStore((state) => state.userDetails);
    console.log("User Details: ****", userDetails);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"Deposit" | "Withdraw">("Deposit");
    const [selectedAsset, setSelectedAsset] = useState(assetOptions[0]);
    const [amount, setAmount] = useState("");

    const handleOpenModal = (type: "Deposit" | "Withdraw", assetType: "fiat" | "crypto") => {
        setModalType(type);
        setSelectedAsset(assetOptions.find((a) => a.type === assetType) || assetOptions[0]);
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
                            <Box>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                    onClick={() => handleOpenModal("Deposit", "crypto")}
                                >
                                    Deposit
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ mb: 1 }}
                                    onClick={() => handleOpenModal("Withdraw", "crypto")}
                                >
                                    Withdraw
                                </Button>
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
                        <Grid  container spacing={2}>
                            {userDetails?.cryptoWallet?.accounts.map((account) => (
                                <Grid size={{ xs:12, md:6, }} key={account.id}>
                                    <Card>
                                        <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Account Address
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                            {account.address}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Created At: {new Date(account.createdAt).toLocaleString()}
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 2, minHeight: 200, overflow: "auto" }}>
                        <Typography variant="h6" gutterBottom>
                            Fiat Wallet Accounts
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Grid  container spacing={2}>
                            {userDetails?.cryptoWallet?.accounts.map((account) => (
                                <Grid size={{ xs:12, md:6, }} key={account.id}>
                                    <Card>
                                        <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            Account Address
                                        </Typography>
                                        <Typography variant="body2" sx={{ wordBreak: "break-all" }}>
                                            {account.address}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Created At: {new Date(account.createdAt).toLocaleString()}
                                        </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
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
                    <Paper sx={{ p: 2, height: 400, overflow: "auto" }}>
                        <Typography variant="h6" gutterBottom>
                            Transaction History
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List>
                            {transactions.map((tx) => {
                                const Icon = tx?.icon;
                                return (
                                    <ListItem key={tx.id}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <Icon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${tx.type} - ${tx.amount} ${tx.currency}`}
                                            secondary={tx.date}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
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