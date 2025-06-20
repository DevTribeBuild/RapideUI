import React from 'react';
import { Grid } from '@mui/material';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
const Orders = () => {
    return (
        <>
        <Grid container spacing={3}>
            <Grid
                size={{
                    xs: 12
                }}>
                <RecentTransactions />
            </Grid>
        </Grid>
        </>
    );
}

export default Orders;