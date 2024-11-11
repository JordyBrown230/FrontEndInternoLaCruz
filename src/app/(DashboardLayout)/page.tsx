'use client'
import { Grid, Box, Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/ListaAtra';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Bienvenidos al Sistema de Información Turística (SIT)</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra los datos del cantón de La Cruz.</Typography>
                    </Box>
      <Box>
        <Grid container spacing={3}>
        <Grid item xs={12} lg={3}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
              <SalesOverview />
              </Grid>  
            </Grid>
          </Grid>      
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
