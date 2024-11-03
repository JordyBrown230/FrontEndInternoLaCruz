'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions,
  DialogContent, DialogTitle, IconButton, Snackbar, Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon, CheckCircle, Error, Info } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { EventoTour, getEventosTours, deleteEventoTour } from '@/services/eventotour.service';

const EventosToursList: React.FC = () => {
  const [eventosTours, setEventosTours] = useState<EventoTour[]>([]);
  const [filteredEventosTours, setFilteredEventosTours] = useState<EventoTour[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventoTourToDelete, setEventoTourToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchEventosTours();
  }, []);

  const fetchEventosTours = async () => {
    try {
      const data = await getEventosTours();
      if (data && data.length > 0) {
        setEventosTours(data);
        setFilteredEventosTours(data);
        showSnackbar('Eventos y tours cargados exitosamente.', 'success');
      } else {
        setEventosTours([]);
        setFilteredEventosTours([]);
        showSnackbar('No hay eventos o tours disponibles.', 'info');
      }
    } catch (error) {
      showSnackbar('Error al cargar los eventos y tours.', 'error');
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEventosTours(
      eventosTours.filter(evento =>
        evento.nombre.toLowerCase().includes(query) ||
        evento.ubicacion.toLowerCase().includes(query) ||
        (evento.descripcion && evento.descripcion.toLowerCase().includes(query))
      )
    );
  };

  const handleDelete = async () => {
    if (eventoTourToDelete !== null) {
      try {
        await deleteEventoTour(eventoTourToDelete);
        const updatedEventosTours = eventosTours.filter(evento => evento.idEventoTour !== eventoTourToDelete);
        setEventosTours(updatedEventosTours);
        setFilteredEventosTours(updatedEventosTours);
        showSnackbar('Evento o tour eliminado con éxito.', 'success');
      } catch (error) {
        showSnackbar('Error al eliminar el evento o tour.', 'error');
      }
      setDeleteDialogOpen(false);
      setEventoTourToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setEventoTourToDelete(id);
    setDeleteDialogOpen(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageContainer title="Eventos y Tours" description="Gestión de eventos y tours">
      <DashboardCard>
        <>
          <Box textAlign="center" mb={4}>
            <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Eventos y Tours</Typography>
            <Typography variant="h6" color="text.secondary" data-aos="fade-down">
              Administra tus eventos y tours
            </Typography>
            <Link href='/guardar-evento-tour' passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>+ Agregar Evento/Tour</Button>
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

          {filteredEventosTours.length > 0 ? (
            <Grid container spacing={4} justifyContent="center">
              {filteredEventosTours.map((evento) => (
                <Grid item xs={12} md={6} lg={4} key={evento.idEventoTour} data-aos="fade-up">
                  <Card sx={{ maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
                    <Carousel>
                      {evento.fotosEventoTour && evento.fotosEventoTour.length > 0 ? (
                        evento.fotosEventoTour.map((foto, index) => (
                          <img
                            key={index}
                            src={`data:image/jpeg;base64,${Buffer.from(foto.foto).toString('base64')}`}
                            alt="Evento o Tour"
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
                      <Typography gutterBottom variant="h5">{evento.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {evento.descripcion}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Ubicación: {evento.ubicacion}
                      </Typography>
                      <Box mt={2}>
                        <Link href={`/guardar-evento-tour?id=${evento.idEventoTour}`} passHref>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton color="error" onClick={() => openDeleteDialog(evento.idEventoTour)}>
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
              No hay eventos o tours disponibles.
            </Typography>
          )}

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogContent>
              <Typography>¿Deseas eliminar este evento o tour? Esta acción no se puede deshacer.</Typography>
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

export default EventosToursList;
