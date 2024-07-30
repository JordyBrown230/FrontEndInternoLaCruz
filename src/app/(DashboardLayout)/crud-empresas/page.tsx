'use client';
import { Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Municipalidad = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <PageContainer title="Crud empresas" description="Una vista con un crud de empresas">
            <>
            aqui ira un crud de empresas
            </>
        </PageContainer>
    );
};

export default Municipalidad;
