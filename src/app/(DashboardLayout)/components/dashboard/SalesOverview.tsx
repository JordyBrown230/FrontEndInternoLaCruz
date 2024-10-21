'use client';
import { Typography, Grid, CardContent, Box, Container } from '@mui/material';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface User {
  user_id: number;
  username: string;
  email: string;
  Person: {
    first_name: string;
    last_name: string;
    cedula: string;
  };
}

const Municipalidad: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:9000/sit/admin/listar', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Error en la red');
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    AOS.init();
    fetchUsers();
  }, []);

  return (
    <DashboardCard title="">
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" color="primary" gutterBottom data-aos="fade-up">
          Lista de Usuarios
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" data-aos="fade-up" data-aos-delay="100">
          Aquí puedes ver los usuarios registrados
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {users.length > 0 ? (
          users.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.user_id} data-aos="zoom-in" data-aos-delay="200">
              <CardContent
                sx={{
                  boxShadow: 2,
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#f9f9f9',
                  transition: '0.3s ease',
                  '&:hover': { boxShadow: 4 },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {user.Person.first_name || 'N/A'} {user.Person.last_name || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Cédula: {user.Person.cedula || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Usuario: {user.username || 'N/A'}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Email: {user.email || 'N/A'}
                </Typography>
              </CardContent>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', width: '100%' }}>
            No hay usuarios registrados.
          </Typography>
        )}
      </Grid>
    </Container>
    </DashboardCard>
  );
};

export default Municipalidad;
