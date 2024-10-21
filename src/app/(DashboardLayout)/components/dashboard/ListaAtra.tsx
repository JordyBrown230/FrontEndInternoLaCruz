import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar, Box } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface Attraction {
  attraction_id: number;
  type_attraction: string;
}

const AttractionBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  // State for attractions
  const [attractionCounts, setAttractionCounts] = useState<{ [key: string]: number }>({});

  // Fetching attractions and calculating counts by type
  const fetchAttractions = async () => {
    try {
      const response = await fetch('http://localhost:9000/sit/atraccion/listar', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data: Attraction[] = await response.json();

      // Count the number of attractions per type
      const counts: { [key: string]: number } = {};
      data.forEach((attraction) => {
        counts[attraction.type_attraction] = (counts[attraction.type_attraction] || 0) + 1;
      });
      setAttractionCounts(counts);
    } catch (error) {
      console.error('Error fetching attractions:', error);
    }
  };

  useEffect(() => {
    fetchAttractions();
  }, []);

  // Prepare data for the chart
  const attractionTypes = Object.keys(attractionCounts);
  const seriesData = Object.values(attractionCounts);

  const chartOptions = {
    chart: {
      type: 'donut' as const,  // Use the exact type 'donut'
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    labels: attractionTypes,
    colors: [primary, primarylight, '#F9F9FD', '#FFD700', '#FF6347', '#40E0D0'],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
  };

  return (
    <DashboardCard title="">
      <Box>
      <Typography variant="h4" color="primary">
          Lista de Atracciones
        </Typography>
      <Grid container spacing={3}>
        {/* Left column with details */}
        <Grid item xs={7}>
          <Typography variant="h6" fontWeight="700">
            {seriesData.reduce((a, b) => a + b, 0)} Atracciones
          </Typography>
        </Grid>
        {/* Right column with donut chart */}
      </Grid>
      </Box>
    </DashboardCard>
  );
};

export default AttractionBreakup;
