'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, IconButton, Snackbar, Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, CheckCircle, Error } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { ServicioSeguridad, getServiciosSeguridad, deleteServicioSeguridad } from '@/services/serviciosseguridad.service';

const ServiciosSeguridadList: React.FC = () => {
  const [serviciosSeguridad, setServiciosSeguridad] = useState<ServicioSeguridad[]>([]);
  const [filteredServiciosSeguridad, setFilteredServiciosSeguridad] = useState<ServicioSeguridad[]>([]);
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
    fetchServiciosSeguridad();
  }, []);

  const fetchServiciosSeguridad = async () => {
    try {
      const data = await getServiciosSeguridad();
      if (Array.isArray(data) && data.length > 0) {
        setServiciosSeguridad(data);
        setFilteredServiciosSeguridad(data);
        showSnackbar('Servicios de seguridad cargados exitosamente.', 'success');
      } else {
        setServiciosSeguridad([]);
        setFilteredServiciosSeguridad([]);
        showSnackbar('No hay servicios de seguridad disponibles.', 'info');
      }
    } catch (error) {
      showSnackbar('Error al cargar los servicios de seguridad.', 'error');
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredServiciosSeguridad(
      serviciosSeguridad.filter(servicio =>
        servicio.name.toLowerCase().includes(query) ||
        servicio.description.toLowerCase().includes(query) ||
        (servicio.phoneNumber && servicio.phoneNumber.toLowerCase().includes(query)) ||
        (servicio.address && servicio.address.toLowerCase().includes(query))
      )
    );
  };

  const handleDelete = async () => {
    if (servicioToDelete !== null) {
      try {
        await deleteServicioSeguridad(servicioToDelete);
        const updatedServicios = serviciosSeguridad.filter(servicio => servicio.securityServiceId !== servicioToDelete);
        setServiciosSeguridad(updatedServicios);
        setFilteredServiciosSeguridad(updatedServicios);
        showSnackbar('Servicio de seguridad eliminado con éxito.', 'success');
      } catch (error) {
        showSnackbar('Error al eliminar el servicio de seguridad.', 'error');
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
    <PageContainer title="Servicios de Seguridad" description="Gestión de servicios de seguridad">
      <DashboardCard>
        <>
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" gutterBottom data-aos="fade-down">
            Gestión de Servicios de Seguridad
          </Typography>
          <Typography variant="h6" color="text.secondary" data-aos="fade-down">
            Administra los servicios de seguridad de tu localidad.
          </Typography>
          <Link href="/guardar-servicio-seguridad" passHref>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>
              + Agregar Servicio de Seguridad
            </Button>
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

        {filteredServiciosSeguridad.length > 0 ? (
          <Grid container spacing={4} justifyContent="center">
            {filteredServiciosSeguridad.map(servicio => (
              <Grid item xs={12} md={6} lg={4} key={servicio.securityServiceId} data-aos="fade-up">
                <Card sx={{ maxHeight: 410, display: 'flex', flexDirection: 'column' }}>
                  <Carousel navButtonsAlwaysInvisible={true}>
                    {servicio.Images && servicio.Images.length > 0 ? (
                      servicio.Images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          alt={`Imagen ${index + 1}`}
                          height="200"
                          width="100%"
                          style={{ objectFit: 'cover' }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2" mt={2} color="textSecondary" textAlign="center">
                        No hay fotos disponibles
                      </Typography>
                    )}
                  </Carousel>
                  <CardContent>
                    <Typography gutterBottom variant="h5">
                      {servicio.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {servicio.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Teléfono: {servicio.phoneNumber}
                    </Typography>
                    <Box mt={2}>
                      <Link href={`/guardar-servicio-seguridad?id=${servicio.securityServiceId}`} passHref>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Link>
                      <IconButton color="error" onClick={() => openDeleteDialog(servicio.securityServiceId!)}>
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
            No hay servicios de seguridad disponibles.
          </Typography>
        )}

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>¿Estás seguro?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Deseas eliminar este servicio de seguridad? Esta acción no se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error">
              Eliminar
            </Button>
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
            sx={{
              width: '100%',
              bgcolor: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
              color: '#fff',
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

export default ServiciosSeguridadList;
