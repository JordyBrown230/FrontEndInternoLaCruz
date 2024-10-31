'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, Snackbar, Alert
} from '@mui/material';
import { Search as SearchIcon, Delete as DeleteIcon, Edit as EditIcon, CheckCircle, Error,Info } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { ServicioBasico, getServiciosBasicos, deleteServicioBasico } from '@/services/serviciosbasicos.service';

const ServiciosBasicosList: React.FC = () => {
  const [serviciosBasicos, setServiciosBasicos] = useState<ServicioBasico[]>([]);
  const [filteredServiciosBasicos, setFilteredServiciosBasicos] = useState<ServicioBasico[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [servicioToDelete, setServicioToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchServiciosBasicos();
  }, []);

  const fetchServiciosBasicos = async () => {
    try {
      const data = await getServiciosBasicos();
      if (data && data.length > 0) {
        setServiciosBasicos(data);
        setFilteredServiciosBasicos(data);
        showSnackbar('Servicios básicos cargados exitosamente.', 'success');
      } else {
        setServiciosBasicos([]);
        setFilteredServiciosBasicos([]);
        showSnackbar('No hay servicios básicos disponibles.', 'info');
      }
    } catch (error) {
      showSnackbar('Error al cargar los servicios básicos.', 'error');
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredServiciosBasicos(
      serviciosBasicos.filter(servicio =>
        servicio.nombre.toLowerCase().includes(query) ||
        servicio.descripcion.toLowerCase().includes(query) ||
        (servicio.telefono && servicio.telefono.toLowerCase().includes(query)) ||
        (servicio.direccion && servicio.direccion.toLowerCase().includes(query))
      )
    );
  };

  const handleDelete = async () => {
    if (servicioToDelete !== null) {
      try {
        await deleteServicioBasico(servicioToDelete);
        const updatedServicios = serviciosBasicos.filter(servicio => servicio.idServicioBasico !== servicioToDelete);
        setServiciosBasicos(updatedServicios);
        setFilteredServiciosBasicos(updatedServicios);
        showSnackbar('Servicio básico eliminado con éxito.', 'success');
      } catch (error) {
        showSnackbar('Error al eliminar el servicio básico.', 'error');
      }
      setDeleteDialogOpen(false);
      setServicioToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setServicioToDelete(id);
    setDeleteDialogOpen(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageContainer title="Servicios Básicos" description="Gestión de servicios básicos">
      <DashboardCard>
        <>
          <Box textAlign="center" mb={4}>
            <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Servicios Básicos</Typography>
            <Typography variant="h6" color="text.secondary" data-aos="fade-down">
              Administra los servicios básicos de tu localidad.
            </Typography>
            <Link href='/guardar-servicio-basico' passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>+ Agregar Servicio Básico</Button>
            </Link>
          </Box>
          
          <TextField
            label="Buscar"
            variant="outlined"
            fullWidth
            margin="dense"
            onChange={handleSearch}
            value={searchQuery}
            sx={{ mb: 4, maxWidth: 400 }}
            InputProps={{
              endAdornment: <SearchIcon />,
            }}
          />

          {filteredServiciosBasicos.length > 0 ? (
            <Grid container spacing={4} justifyContent="center">
              {filteredServiciosBasicos.map((servicio) => (
                <Grid item xs={12} md={6} lg={4} key={servicio.idServicioBasico} data-aos="fade-up">
                  <Card sx={{ maxHeight: 400, display: 'flex', flexDirection: 'column' }}>
                    <Carousel>
                      {servicio.foto && (
                        <img
                          src={`data:image/jpeg;base64,${Buffer.from(servicio.foto).toString('base64')}`}
                          alt="Servicio Básico"
                          height="300"
                          width="100%"
                        />
                      )}
                    </Carousel>
                    <CardContent>
                      <Typography gutterBottom variant="h5">{servicio.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {servicio.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Teléfono: {servicio.telefono}
                      </Typography>
                      <Box mt={2}>
                        <Link href={`/guardar-servicio-basico?id=${servicio.idServicioBasico}`} passHref>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton color="error" onClick={() => openDeleteDialog(servicio.idServicioBasico)}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary" textAlign="center" mt={4}>
              No hay servicios básicos disponibles.
            </Typography>
          )}

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogContent>
              <Typography>¿Deseas eliminar este servicio básico? Esta acción no se puede deshacer.</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancelar</Button>
              <Button onClick={handleDelete} color="error">Eliminar</Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={1500}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              iconMapping={{
                success: <CheckCircle style={{ color: '#fff' }} />,
                error: <Error style={{ color: '#fff' }} />,
                info: <Info style={{ color: '#fff' }} />,
              }}
              sx={{
                width: '100%',
                bgcolor: snackbar.severity === 'success' ? '#4caf50' : snackbar.severity === 'error' ? '#f44336' : '#2196f3',
                color: '#fff'
              }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      </DashboardCard>
    </PageContainer>
  );
};

export default ServiciosBasicosList;
