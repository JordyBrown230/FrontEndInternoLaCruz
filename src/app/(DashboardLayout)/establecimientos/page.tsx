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
import { Establecimiento, getEstablecimientos, deleteEstablecimiento } from '@/services/establecimiento.service';

const EstablecimientosList: React.FC = () => {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [filteredEstablecimientos, setFilteredEstablecimientos] = useState<Establecimiento[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [establecimientoToDelete, setEstablecimientoToDelete] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchEstablecimientos();
  }, []);

  const fetchEstablecimientos = async () => {
    try {
      const data = await getEstablecimientos();
      console.log(data)
      if (data && data.length > 0) {
        setEstablecimientos(data);
        setFilteredEstablecimientos(data);
        console.log('Establecimientos actualizados:', data); // Usa `data` en lugar de `establecimientos`
        showSnackbar('Establecimientos cargados exitosamente.', 'success');
      } else {
        setEstablecimientos([]);
        setFilteredEstablecimientos([]);
        showSnackbar('No hay establecimientos disponibles.', 'info');
      }
    } catch (error) {
      showSnackbar('Error al cargar los establecimientos.', 'error');
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredEstablecimientos(
      establecimientos.filter(est =>
        est.name.toLowerCase().includes(query) ||
        est.address.toLowerCase().includes(query) ||
        est.description.toLowerCase().includes(query)
      )
    );
  };

  const handleDelete = async () => {
    if (establecimientoToDelete !== null) {
      try {
        await deleteEstablecimiento(establecimientoToDelete);
        const updatedEstablecimientos = establecimientos.filter(est => est.establishmentId !== establecimientoToDelete);
        setEstablecimientos(updatedEstablecimientos);
        setFilteredEstablecimientos(updatedEstablecimientos);
        showSnackbar('Establecimiento eliminado con éxito.', 'success');
      } catch (error) {
        showSnackbar('Error al eliminar el establecimiento.', 'error');
      }
      setDeleteDialogOpen(false);
      setEstablecimientoToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setEstablecimientoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <PageContainer title="Establecimientos" description="Gestión de establecimientos">
      <DashboardCard>
        <>
          <Box textAlign="center" mb={4}>
            <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Establecimientos</Typography>
            <Typography variant="h6" color="text.secondary" data-aos="fade-down">
              Administra los establecimientos de tu localidad.
            </Typography>
            <Link href='/guardar-establecimiento' passHref>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>+ Agregar Establecimiento</Button>
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

          {filteredEstablecimientos.length > 0 ? (
            <Grid container spacing={4} justifyContent="center">
              {filteredEstablecimientos.map((establecimiento) => (
                <Grid item xs={12} md={6} lg={4} key={establecimiento.establishmentId} data-aos="fade-up">
                  <Card sx={{ maxHeight: 410, display: 'flex', flexDirection: 'column' }}>
                    <Carousel>
                      {establecimiento.Images && establecimiento.Images.length > 0 ? (
                        establecimiento.Images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url} // Asegúrate de que `url` sea el campo que contiene la URL completa de la imagen
                            alt={`Imagen del establecimiento ${index + 1}`}
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
                      <Typography gutterBottom variant="h5">{establecimiento.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {establecimiento.description}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Dirección: {establecimiento.address}
                      </Typography>
                      <Box mt={2}>
                        <Link href={`/guardar-establecimiento?id=${establecimiento.establishmentId}`} passHref>
                          <IconButton color="primary">
                            <EditIcon />
                          </IconButton>
                        </Link>
                        <IconButton color="error" onClick={() => openDeleteDialog(establecimiento.establishmentId)}>
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
              No hay establecimientos disponibles.
            </Typography>
          )}

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogContent>
              <Typography>¿Deseas eliminar este establecimiento? Esta acción no se puede deshacer.</Typography>
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

export default EstablecimientosList;
