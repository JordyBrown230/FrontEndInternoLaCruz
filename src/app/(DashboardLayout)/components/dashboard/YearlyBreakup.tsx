import { Grid } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const YearlyBreakup = () => {
  return (
    <DashboardCard title="">
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <img
            src="/images/logos/Muni.png" // Reemplaza con la ruta de tu imagen
            alt="Imagen Descriptiva"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Grid>
        <Grid item>
          <img
            src="/images/logos/logo_La_Cruz_2.png" // Reemplaza con la ruta de tu imagen
            alt="Imagen Descriptiva"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
