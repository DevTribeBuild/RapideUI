"use client";
import React, { useState, useEffect } from "react";
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
    InputAdornment,
    Tabs,
    Tab,
    useTheme,
} from "@mui/material";
import { TabContext } from "@mui/lab";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import SendTokenDialog from "../components/dashboard/sendToken";
import SwapToken from "@/app/(DashboardLayout)/components/dashboard/SwapToken";
import BuySellCryptoDialog from "@/app/(DashboardLayout)/components/dashboard/BuySellCryptoDialog";
import SendFiatDialog from "@/app/(DashboardLayout)/components/dashboard/SendFiatDialog";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import useAppStore from "@/stores/useAuthStore";
import { useQuery, useMutation } from "@apollo/client/react";
import {
    GET_MY_TRANSACTIONS_COMBINED, // Imported the new combined query
    GET_CRYPTO_BALANCE,
    GET_TOTAL_CRYPTO_BALANCE,
    FIAT_WALLET_ACCOUNTS,
    CURRENCIES_QUERY,
} from "@/graphql";
import { FIAT_DEPOSIT, CREATE_FIAT_WALLET } from "@/graphql";
import useAuthStore from "@/stores/useAuthStore";
import { toast } from "react-hot-toast";
import { AccountBalanceWalletOutlined, ArrowDownward, ArrowUpward } from "@mui/icons-material";
import UnarchiveIcon from '@mui/icons-material/Unarchive';
import ArchiveIcon from '@mui/icons-material/Archive';
import PaidIcon from '@mui/icons-material/Paid';

// Type definitions
type FiatTransaction = {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    Currency: {
        code: string;
    };
};

type CryptoTransaction = {
    id: string;
    type: string;
    value: number;
    toSymbol: string;
    status: string;
    timeStamp: string;
};

type TransactionsQuery = {
    transactionsHistory: {
        fiat: FiatTransaction[];
        crypto: CryptoTransaction[];
    };
};

type CryptoBalance = {
    address: string;
    amount: number;
    symbol: string;
};

type CryptoBalanceQuery = {
    balances: CryptoBalance[];
};

type FiatWallet = {
    id: string;
    balance: number;
    Currency: {
        code: string;
    };
};

type FiatWalletQuery = {
    fiatWallets: FiatWallet[];
};

type TotalCryptoBalanceQuery = {
    totalBalances: number;
};

type FiatDepositMutationResult = {
    depositFiat: any; // Define this more accurately if possible
};

type FiatDepositMutationVariables = {
    input: {
        amount: number;
        currencyCode: string;
        paymentMethod: string;
    };
};

type CreateFiatWalletMutationResult = {
    createMyFiatWallet: any; // Define this more accurately if possible
};

type CreateFiatWalletMutationVariables = {
    input: {
        currencyCode: string;
    };
};

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

    const WalletPage = () => {
    const theme = useTheme();
    let isTest: boolean = false;
    const [sendDialogOpen, setSendDialogOpen] = useState(false);
    const token = useAuthStore((state) => state.token);
    const userDetails: any = useAppStore((state) => state.userDetails);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<"Deposit" | "Withdraw">("Deposit");
    const [amount, setAmount] = useState("");

    const [createWalletDialogOpen, setCreateWalletDialogOpen] = useState(false);
    const [newWalletCurrency, setNewWalletCurrency] = useState('USD');
    const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
    const [buySellDialogOpen, setBuySellDialogOpen] = useState(false);
    const [sendFiatDialogOpen, setSendFiatDialogOpen] = useState(false);

    const [selectedTab, setSelectedTab] = useState('all'); // Initial state is 'all'


    // GraphQL Queries
    const {
        data: transaction_data,
        loading: loading_transactions,
        error: error_transactions,
        refetch: refetchTransactions,
        networkStatus: transactionNetworkStatus
    } = useQuery<TransactionsQuery>(GET_MY_TRANSACTIONS_COMBINED, {
        variables: {
            type: selectedTab.toUpperCase() // Convert to uppercase for 'FIAT' or 'CRYPTO', or pass null for 'all'
        },
        notifyOnNetworkStatusChange: true,
    });

    const { data: data_crypto_balances, loading: loading_crypto_balances } = useQuery<CryptoBalanceQuery>(GET_CRYPTO_BALANCE, {
        variables: { isTest },
    });

    const { data: data_fiat_accounts, loading: loading_fiat_accounts, refetch: refetchFiatAccounts } = useQuery<FiatWalletQuery>(FIAT_WALLET_ACCOUNTS, {
        variables: { isTest },
    });

    const assetOptions: any[] = React.useMemo(() => [
        ...(data_fiat_accounts?.fiatWallets.map((f) => ({ type: "fiat", currency: f.Currency.code, icon: '💵' })) || []),
        ...(data_crypto_balances?.balances.map((c) => ({ type: "crypto", currency: c.symbol, icon: '🪙' })) || []),
    ], [data_fiat_accounts, data_crypto_balances]);

                const [selectedAsset, setSelectedAsset] = useState<any>(null);

    useEffect(() => {
        if (assetOptions.length > 0) {
            setSelectedAsset(assetOptions[0]);
            console.log(selectedAsset, "selectedAsset");
        }
    }, [assetOptions, setSelectedAsset, selectedAsset]);



    const {
        data: crypto_balance,
        loading: loading_crypto_balance,
        error: error_crypto_balance
    } = useQuery<TotalCryptoBalanceQuery>(GET_TOTAL_CRYPTO_BALANCE, {
        variables: { isTest: false },
    });
    const { data: currencies_data, loading: currencies_loading } = useQuery(CURRENCIES_QUERY);


    // GraphQL Mutation for Fiat Deposit
    const [depositFiat, { loading: depositingFiat, error: depositFiatError }] = useMutation<FiatDepositMutationResult, FiatDepositMutationVariables>(FIAT_DEPOSIT, {
        onCompleted: () => {
            refetchFiatAccounts();
            refetchTransactions();
        }
    });

    // GraphQL Mutation for Create Fiat Wallet
    const [createFiatWallet, { loading: creatingWallet, error: createWalletError }] = useMutation<CreateFiatWalletMutationResult, CreateFiatWalletMutationVariables>(CREATE_FIAT_WALLET, {
        onCompleted: () => {
            refetchFiatAccounts();
        }
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

    const handleSubmit = async () => {
        if (modalType === "Deposit" && selectedAsset?.type === "fiat") {
            try {
                const response = await depositFiat({
                    variables: {
                        input: {
                            amount: parseFloat(amount),
                            currencyCode: selectedAsset?.currency,
                            paymentMethod: "Mpesa",
                        },
                    },
                });
                if (response && response.data && response.data.depositFiat) {
                    handleCloseModal();
                }
            } catch (error) {
                console.error("Fiat Deposit Error:", error);
            }
        } else {
            handleCloseModal();
        }
    };

    const handleCreateWallet = async () => {
        try {
            const response = await createFiatWallet({
                variables: {
                    input: {
                        currencyCode: newWalletCurrency,
                    },
                },
            });
            if (response && response.data && response.data.createMyFiatWallet) {
                setCreateWalletDialogOpen(false);
                setNewWalletCurrency('USD');
            }
        } catch (error) {
            console.error("Create Fiat Wallet Error:", error);
        }
    };

    const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
        setSelectedTab(newValue);
    };

    // Prepare transactions based on the selected tab
    const getFilteredTransactions = () => {
        const fiatTransactions = transaction_data?.transactionsHistory?.fiat || [];
        const cryptoTransactions = transaction_data?.transactionsHistory?.crypto || [];

        let transactions: any[] = [];

        if (selectedTab === 'all') {
            transactions = [
                ...fiatTransactions.map((tx: any) => ({ ...tx, isFiat: true, timeStamp: tx.createdAt })),
                ...cryptoTransactions.map((tx: any) => ({ ...tx, isCrypto: true }))
            ].sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime());
        } else if (selectedTab === 'fiat') {
            transactions = fiatTransactions.map((tx: any) => ({ ...tx, isFiat: true, timeStamp: tx.createdAt }));
        } else if (selectedTab === 'crypto') {
            transactions = cryptoTransactions.map((tx: any) => ({ ...tx, isCrypto: true }));
        }
        return transactions;
    };

    const filteredTransactions = getFilteredTransactions();

    const TOKEN_COLORS: Record<string, string> = {
        BTC: '#F7931A',
        ETH: '#627EEA',
        USDT: '#26A17B',
        USDC: '#2775CA',
        BNB: '#F3BA2F',
        DAI: '#F4B731',
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
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: "#ffd700" }}>
                My Wallet
            </Typography>
            <Grid container spacing={4}>
                {/* Fiat Wallet Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: {xs:"column", md:"row"},
                                gap: 2,
                                p: { xs: 2, md: 3 },
                            }}
                        >
                            <Box sx={{ width:{ md:"45%", xs:"100%"}}}>
                                {loading_fiat_accounts ? (
                                    <Skeleton height={30} sx={{ mt: 0.5 }} />
                                ) : (
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            // justifyContent: "center",
                                            p: 2,
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        <AccountBalanceWalletOutlined
                                            sx={{
                                                mr: 1.5,
                                                fontSize: window.innerWidth < 600 ? 28 : 34,
                                                color: theme.palette.primary.main,
                                            }}
                                        />

                                        <Box textAlign="left">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    fontWeight: 500,
                                                    mb: 0.5,
                                                }}
                                            >
                                                Total Balance
                                            </Typography>

                                            <Typography
                                                variant={window.innerWidth < 600 ? "h5" : "h4"}
                                                sx={{
                                                    fontWeight: 700,
                                                    color: theme.palette.text.primary,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {data_fiat_accounts?.fiatWallets?.reduce((sum: number, wallet: any) => sum + (wallet.balance || 0), 0).toFixed(2)}{" "}
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        fontSize: window.innerWidth < 600 ? "1rem" : "1.25rem",
                                                        color: theme.palette.text.secondary,
                                                        ml: 0.5,
                                                    }}
                                                >
                                                    {userDetails?.fiatWallet?.Currency?.symbol || "KES"}
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>

                                )}
                            </Box>

                            {/* Action Buttons */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: { xs: "left", sm: "flex-start", md:"right" },
                                    flexWrap: "wrap",
                                    gap: { xs: 4, sm: 3 },
                                    width:{md:"50%", xs:"100%"},
                                    justifyItems:"right",
                                    alignItems:"center"
                                }}
                            >
                                {/* Send */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => setSendFiatDialogOpen(true)}
                                        sx={{
                                            borderRadius: "50%",
                                            width: 45,
                                            height: 45,
                                            minWidth: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ArrowUpward />
                                    </Button>
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Send
                                    </Typography>
                                </Box>

                                {/* Deposit */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal("Deposit", "fiat")}
                                        sx={{
                                            borderRadius: "50%",
                                            width: 45,
                                            height: 45,
                                            minWidth: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <ArchiveIcon />
                                    </Button>
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Deposit
                                    </Typography>
                                </Box>

                                {/* Withdraw */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleOpenModal("Withdraw", "fiat")}
                                        sx={{
                                            borderRadius: "50%",
                                            width: 45,
                                            height: 45,
                                            minWidth: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <UnarchiveIcon />
                                    </Button>
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Withdraw
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Crypto Wallet Card */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card elevation={3} sx={{ borderRadius: 2 }}>
                        <CardContent
                            sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                flexDirection: {xs:"row", md:"row"},
                                gap: 2,
                                p: { xs: 2, md: 3 },
                            }}
                        >
                            <Box sx={{ width:{md:"48%", xs:"100%"}}}>
                                {loading_crypto_balance ? (
                                    <Skeleton width="60%" height={30} sx={{ mt: 0.5 }} />
                                ) : (
                                    <>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            // justifyContent: "center",
                                            p: 2,
                                            borderRadius: 3,
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.primary.main}05)`,
                                            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                        }}
                                    >
                                        <PaidIcon
                                            sx={{
                                                mr: 1.5,
                                                fontSize: window.innerWidth < 600 ? 28 : 34,
                                                color: theme.palette.primary.main,
                                            }}
                                        />

                                        <Box textAlign="left">
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    color: theme.palette.text.secondary,
                                                    fontWeight: 500,
                                                    mb: 0.5,
                                                }}
                                            >
                                                Total Balance
                                            </Typography>

                                            <Typography
                                                variant={window.innerWidth < 600 ? "h5" : "h4"}
                                                sx={{
                                                    fontWeight: 700,
                                                    color: theme.palette.text.primary,
                                                    letterSpacing: 0.5,
                                                }}
                                            >
                                                {crypto_balance?.totalBalances}
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        fontSize: window.innerWidth < 600 ? "1rem" : "1.25rem",
                                                        color: theme.palette.text.secondary,
                                                        ml: 0.5,
                                                    }}
                                                >
                                                    USDT
                                                </Typography>
                                            </Typography>
                                        </Box>
                                    </Box>
                                    </>
                                )}
                            </Box>

                            {/* Actions */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: { xs: "left", sm: "flex-start", md:"right" },
                                    flexWrap: "wrap",
                                    gap: { xs: 4, sm: 3 },
                                    width:{md:"48%", xs:"100%"},
                                    justifyItems:"right",
                                    alignItems:"center"
                                }}
                            >
                                {/* Receive */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => setReceiveDialogOpen(true)}
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: "50%",
                                            minWidth: 0,
                                            p: 0,
                                        }}
                                    >
                                        <ArrowDownward />
                                    </Button>
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Receive
                                    </Typography>
                                </Box>

                                {/* Send */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => setSendDialogOpen(true)}
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: "50%",
                                            minWidth: 0,
                                            p: 0,
                                        }}
                                    >
                                        <ArrowUpward />
                                    </Button>
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Send
                                    </Typography>
                                </Box>

                                {/* Buy/Sell */}
                                <Box display="flex" flexDirection="column" alignItems="center">
                                    <Button
                                        variant="contained"
                                        onClick={() => setBuySellDialogOpen(true)}
                                        sx={{
                                            width: 45,
                                            height: 45,
                                            borderRadius: "50%",
                                            minWidth: 0,
                                            p: 0,
                                        }}
                                    >
                                        <PublishedWithChangesIcon />
                                    </Button>
                                    <Typography variant="caption" sx={{ mt: 0.5 }}>
                                        Buy/Sell
                                    </Typography>
                                </Box>
                                                                <SwapToken assetOptions={assetOptions} />
                            </Box>

                            {/* Dialogs */}
                            <SendTokenDialog
                                open={sendDialogOpen}
                                onClose={() => setSendDialogOpen(false)}
                                assetOptions={assetOptions}
                                onSend={() => { }}
                            />
                            <BuySellCryptoDialog
                                open={buySellDialogOpen}
                                onClose={() => setBuySellDialogOpen(false)}
                                cryptoBalances={data_crypto_balances?.balances || []}
                                fiatWallets={data_fiat_accounts?.fiatWallets || []}
                            />
                            <SendFiatDialog
                                open={sendFiatDialogOpen}
                                onClose={() => setSendFiatDialogOpen(false)}
                                fiatWallets={data_fiat_accounts?.fiatWallets || []}
                            />
                        </CardContent>
                    </Card>
                </Grid>


                {/* Crypto Wallet Accounts */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: 250, overflow: "hidden" }}>
                        <Box sx={{ mb:4}}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#ffd700" }}>
                            Crypto Wallet Accounts
                        </Typography>
                        </Box>
                        <Divider/>
                        {false ? (
                            <Grid container spacing={2} sx={{ mt:2}}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 12, md: 6 }} key={index}>
                                        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : true ? (
                            <Grid container spacing={2} sx={{ mt:2}}>
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
                <Grid size={{ xs: 12, md:6 }}>
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, minHeight: 250, overflow: "hidden" }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 0, color: "#ffd700" }}>
                                Fiat Wallets
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => setCreateWalletDialogOpen(true)}
                            >
                                Create Wallet
                            </Button>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        {loading_fiat_accounts ? (
                            <Grid container spacing={2}>
                                {Array.from({ length: 2 }).map((_, index) => (
                                    <Grid size={{ xs: 6, md: 6 }} key={index}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, p: 2 }}>
                                            <Skeleton variant="text" width="70%" height={24} />
                                            <Skeleton variant="text" width="50%" height={20} sx={{ mt: 1 }} />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : data_fiat_accounts && data_fiat_accounts.fiatWallets && data_fiat_accounts.fiatWallets.length > 0 ? (
                            <Grid container spacing={2}>
                                {data_fiat_accounts?.fiatWallets?.map((account: any) => (
                                    <Grid size={{ xs: 6, md: 6 }} key={account.id}>
                                        <Card variant="outlined" sx={{ borderRadius: 2, boxShadow: 0 }}>
                                            <CardContent sx={{ p: 2 }}>
                                                <Typography variant="body1" fontWeight={500} sx={{ wordBreak: "break-all", mb: 1 }}>
                                                    {account.Currency.code}
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
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#ffd700" }}>
                            Asset Distribution
                        </Typography>
                        {loading_crypto_balances ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: 'calc(100% - 48px)',
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
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: 450 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: "#ffd700" }}>
                            Transaction History
                        </Typography>
                        <TabContext value={selectedTab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={selectedTab} onChange={handleChangeTab} aria-label="transaction types tabs">
                                    <Tab label="All Transactions" value="all" />
                                    <Tab label="Fiat Transactions" value="fiat" />
                                    <Tab label="Crypto Transactions" value="crypto" />
                                </Tabs>
                            </Box>

                            {/* SCROLLABLE LIST WRAPPER */}
                            <Box sx={{ overflowY: "auto", maxHeight: "310px", pr: 1 }}>
                                {(loading_transactions && transactionNetworkStatus !== 4) ? (
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
                                ) : filteredTransactions.length > 0 ? (
                                    <List disablePadding sx={{ mt: 2 }}>
                                        {filteredTransactions.map((tx: any) => (
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
                                                            {tx.isFiat ? (tx.Currency?.code?.charAt(0) || "F") : (tx.toSymbol?.charAt(0) || "C")}
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <Typography variant="subtitle1" fontWeight={500}>
                                                                {tx.isFiat
                                                                    ? `Fiat ${tx.amount} ${tx.Currency?.code}`
                                                                    : `${tx.type} - ${tx.value} ${tx.toSymbol}`}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography variant="body2" color="text.secondary">
                                                                {new Date(tx.timeStamp || tx.createdAt).toLocaleString()}
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
                                        No transactions found for this category.
                                    </Typography>
                                )}
                            </Box>
                        </TabContext>
                    </Paper>
                </Grid>

            </Grid>

            {/* Deposit/Withdraw Modal */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ pb: 1 }}>
                    {modalType} {selectedAsset?.type === "fiat" ? "Fiat" : "Crypto"} Asset
                </DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel id="asset-select-label">Asset</InputLabel>
                        <Select
                            labelId="asset-select-label"
                            value={`${selectedAsset?.type}:${selectedAsset?.currency}`}
                            label="Asset"
                            onChange={handleAssetChange}
                        >
                            {assetOptions
                                .filter((a: any) => a.type === selectedAsset?.type)
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
                                <InputAdornment position="end">{selectedAsset?.currency}</InputAdornment>
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

            {/* Create Fiat Wallet Dialog */}
            <Dialog open={createWalletDialogOpen} onClose={() => setCreateWalletDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Create New Fiat Wallet</DialogTitle>
                <DialogContent dividers>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="new-wallet-currency-label">Currency</InputLabel>
                        <Select
                            labelId="new-wallet-currency-label"
                            value={newWalletCurrency}
                            label="Currency"
                            onChange={(e) => setNewWalletCurrency(e.target.value as string)}
                        >
                            {currencies_loading ? (
                                <MenuItem disabled>Loading currencies...</MenuItem>
                            ) : (
                                currencies_data?.currencies?.map((currency: any) => (
                                    <MenuItem key={currency.code} value={currency.code}>
                                        {currency.symbol} &#40;{currency.name}&#41;
                                    </MenuItem>
                                ))
                            )}
                        </Select>
                    </FormControl>
                    {createWalletError && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            Error: {createWalletError.message}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setCreateWalletDialogOpen(false)} color="error" disabled={creatingWallet}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleCreateWallet}
                        variant="contained"
                        disabled={!newWalletCurrency || creatingWallet}
                    >
                        {creatingWallet ? 'Creating...' : 'Create Wallet'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Receive Dialog */}
            <Dialog open={receiveDialogOpen} onClose={() => setReceiveDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Your Wallet Address</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-all' }}>
                        {userDetails?.me?.cryptoWallet?.accounts?.[0]?.address}
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                            navigator.clipboard.writeText(userDetails?.me?.cryptoWallet?.accounts?.[0]?.address || '');
                            toast.success('Address copied to clipboard!');
                        }}
                    >
                        Copy Address
                    </Button>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setReceiveDialogOpen(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WalletPage;