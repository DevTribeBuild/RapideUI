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
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import SendTokenDialog from "../components/dashboard/sendToken";
import SwapToken from "@/app/(DashboardLayout)/components/dashboard/SwapToken";

import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import useAppStore from "@/stores/useAuthStore"; // Assuming this is correct
import { useQuery, useMutation, gql } from "@apollo/client"; // Added gql and useMutation
import { GET_MY_TRANSACTIONS, GET_FIAT_BALANCE, GET_CRYPTO_BALANCE, GET_TOTAL_CRYPTO_BALANCE, FIAT_WALLET_ACCOUNTS } from "@/graphql/queries";
import { FIAT_DEPOSIT } from "@/graphql/mutations"; // Assuming FIAT_DEPOSIT is correctly imported from mutations
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

    // GraphQL Queries
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

    const { data: data_fiat_accounts, loading: loading_fiat_accounts } = useQuery(FIAT_WALLET_ACCOUNTS, {
        variables: { isTest },
    });

    const {
        data: fiat_balance,
        loading: loading_balance,
        error: error_balance,
    } = useQuery(GET_FIAT_BALANCE);

    const {
        data: crypto_balance,
        loading: loading_crypto_balance,
        error: error_crypto_balance
    } = useQuery(GET_TOTAL_CRYPTO_BALANCE, {
        variables: { isTest: false },
    });

    // GraphQL Mutation for Fiat Deposit
    const [depositFiat, { loading: depositingFiat, error: depositFiatError }] = useMutation(FIAT_DEPOSIT);


    const handleOpenModal = (type: "Deposit" | "Withdraw", assetType: "fiat" | "crypto") => {
        setModalType(type);
        // Find the first asset of the specified type, or default to the first overall asset
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

    const handleSubmit = async () => {
        if (modalType === "Deposit" && selectedAsset.type === "fiat") {
            try {
                const response = await depositFiat({
                    variables: {
                        input: {
                            amount: parseFloat(amount),
                            currencyCode: selectedAsset.currency, // Changed from 'currency' to 'currencyCode'
                            paymentMethod: "Mpesa", // Added required paymentMethod
                        },
                    },
                });
                console.log("Fiat Deposit Successful:", response.data.depositFiat);
                // Optionally refetch balances or update UI state here
                // refetchFiatBalance(); // If you have a refetch function for fiat balance
                handleCloseModal();
            } catch (error) {
                console.error("Fiat Deposit Error:", error);
                // Handle error (e.g., show error message to user)
            }
        } else {
            // Handle other types of deposits/withdrawals if they were previously implemented
            console.log(`Submitting ${modalType} of ${amount} ${selectedAsset.currency}`);
            handleCloseModal();
        }
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

    const TOKEN_COLORS: Record<string, string> = {
        BTC: '#F7931A',     // Bitcoin orange
        ETH: '#627EEA',     // Ethereum blue
        USDT: '#26A17B',    // Tether green
        USDC: '#2775CA',    // USD Coin blue
        BNB: '#F3BA2F',     // BNB yellow
        DAI: '#F4B731',     // DAI gold
        // Add more as needed
    };


    const pieData =
        data_crypto_balances?.balances
            ?.filter((t: any) => Number(t.amount) > 0)
            .reduce((acc: any[], curr: any) => {
                const existing = acc.find((a) => a.name === curr.symbol);
                if (existing) {
                    existing.value += Number(curr.amount);
                } else {
                    acc.push({ name: curr.symbol, value: Number(curr.amount) });
                }
                return acc;
            }, []) || [];

    const getTokenColor = (symbol: string, index: number): string => {
        if (TOKEN_COLORS[symbol]) return TOKEN_COLORS[symbol];
        return `hsl(${(index * 360) / pieData.length}, 70%, 50%)`;
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4, mb: 2 } }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                My Wallet
            </Typography>
            <Grid container spacing={4}>
                {/* Fiat Wallet Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ display: "flex", alignItems: "center", p: 3 }}>
                            <Box sx={{ flexGrow: 1 }}>
                                {loading_balance ? (
                                    <Skeleton width="60%" height={30} sx={{ mt: 0.5 }} />
                                ) : (
                                    <Typography variant="h5" fontWeight="bold">
                                        {fiat_balance?.fiatWalletBalance} {userDetails?.fiatWallet?.Currency?.symbol || 'KES'}
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
                            <Box sx={{ width: "100%" }}>
                                {loading_crypto_balance ? (
                                    <Skeleton width="60%" height={30} sx={{ mt: 0.5 }} />
                                ) : (
                                    <Typography variant="h5" fontWeight="bold">
                                        {crypto_balance?.totalBalances}{" "} USDT
                                    </Typography>
                                )}

                            </Box>
                            <br />
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
                                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                                            <Typography
                                                                variant="body1"
                                                                fontWeight={500}
                                                                sx={{ wordBreak: "break-all", mr: 1 }}
                                                            >
                                                                {balance.symbol}
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
                                                            {balance.amount}
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

                        {loading_fiat_accounts ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                            <Skeleton variant="text" width="70%" height={24} />
                                            <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : data_fiat_accounts?.fiatWallets?.length > 0 ? (
                            <Grid container spacing={2}>
                                {data_fiat_accounts?.fiatWallets?.map((account: any) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={account.id}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 0 }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="body1" fontWeight={500} sx={{ wordBreak: "break-all", mb: 1 }}>
                                                    {account.Currency.code} Account
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Balance: {account.balance}
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
                        {loading_crypto_balances ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 'calc(100% - 48px)', // Adjust height to account for Typography
                                }}
                            >
                                <Skeleton variant="circular" width={180} height={180} />
                                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <Skeleton variant="text" width={100} height={20} />
                                    <Skeleton variant="text" width={80} height={20} sx={{ mt: 0.5 }} />
                                    <Skeleton variant="text" width={120} height={20} sx={{ mt: 0.5 }} />
                                </Box>
                            </Box>
                        ) : (
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
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={getTokenColor(entry.name, index)}
                                            />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
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
                    {depositFiatError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            Error: {depositFiatError.message}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleCloseModal} color="error" disabled={depositingFiat}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={!amount || Number(amount) <= 0 || depositingFiat}
                    >
                        {depositingFiat ? 'Processing...' : modalType}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WalletPage;