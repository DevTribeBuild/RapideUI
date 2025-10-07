'use client';
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import useAuthStore from '@/stores/useAuthStore';

const ExplorePage = () => {
  const { token } = useAuthStore();

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box sx={{ width:"100%"}}>
        <Grid container spacing={0} justifyContent="center" sx={{ width: '100%' }}>
          <Grid size={{ xs: 12 }}>
            {token ? <Blog /> : <p>Please log in to see the content.</p>}
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default ExplorePage;
