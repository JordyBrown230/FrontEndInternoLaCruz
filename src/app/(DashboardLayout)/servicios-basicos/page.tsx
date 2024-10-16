'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Typography, Container, Grid, Paper, IconButton, Box, Modal, Button, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, TextField
} from '@mui/material';
import { Delete, Edit, ArrowBackIos, ArrowForwardIos, Close, Search as SearchIcon } from '@mui/icons-material';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { ServicioBasico, getServiciosBasicos, deleteServicioBasico } from '@/services/serviciosbasicos.service';
import { message } from 'antd';

const ServiciosBasicosList: React.FC = () => {
  const [serviciosBasicos, setServiciosBasicos] = useState<ServicioBasico[]>([]);
  const [filteredServiciosBasicos, setFilteredServiciosBasicos] = useState<ServicioBasico[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentServicio, setCurrentServicio] = useState<ServicioBasico | null>(null);
  const [servicioToDelete, setServicioToDelete] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchServiciosBasicos();
  }, []);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setSuccessMessage('');
    }

    if (error) {
      message.error(error);
      setError('');
    }
  }, [successMessage, error]);

  const fetchServiciosBasicos = async () => {
    try {
      setLoading(true);
      const data = await getServiciosBasicos();
      setServiciosBasicos(data);
      setFilteredServiciosBasicos(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching servicios basicos:", error);
      setError('Error al cargar los servicios básicos.');
      setLoading(false);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = serviciosBasicos.filter(servicio =>
      servicio.nombre.toLowerCase().includes(query) ||
      servicio.descripcion.toLowerCase().includes(query) ||
      (servicio.telefono && servicio.telefono.toLowerCase().includes(query)) ||
      (servicio.direccion && servicio.direccion.toLowerCase().includes(query))
    );
    setFilteredServiciosBasicos(filtered);
  };

  const handleDelete = async () => {
    if (servicioToDelete !== null) {
      try {
        await deleteServicioBasico(servicioToDelete);
        setSuccessMessage('Servicio básico eliminado con éxito.');
        fetchServiciosBasicos();
      } catch (error) {
        setError('Error al eliminar el servicio básico.');
      }
      setDeleteDialogOpen(false);
      setServicioToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setServicioToDelete(id);
    setDeleteDialogOpen(true);
  };

  const openImageModal = (servicio: ServicioBasico) => {
    setCurrentServicio(servicio);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setModalOpen(false);
  };

  return (
    <Container maxWidth="lg" data-aos="fade-up">
      <Typography variant="h4" gutterBottom>
        Lista de Servicios Básicos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2, 
          mb: 4
        }}
      >
        <Link href='/guardar-servicio-basico' passHref>
          <Button variant='contained'>
            Agregar
          </Button>
        </Link>
        <TextField
          label="Buscar"
          variant="outlined"
          onChange={handleSearch}
          value={searchQuery}
          sx={{ maxWidth: 400 }}
          InputProps={{
            endAdornment: <SearchIcon />,
          }}
        />
      </Box>

      {loading && <Typography variant="h6" color="textSecondary">Cargando servicios básicos...</Typography>}

      {!loading && filteredServiciosBasicos.length > 0 && (
        <Grid container spacing={3}>
          {filteredServiciosBasicos.map((servicio) => (
            <Grid item xs={12} md={6} lg={4} key={servicio.idServicioBasico}>
              <Paper elevation={3} style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                height: '400px', // Ajuste para una tarjeta más grande
              }}>
                {servicio.foto && (
                  <Box style={{ height: '200px', overflow: 'hidden' }}>
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(servicio.foto).toString('base64')}`}
                      alt="Servicio Básico"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => openImageModal(servicio)}
                    />
                  </Box>
                )}

                <Box sx={{ padding: '16px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <Typography variant="h5" noWrap>{servicio.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary" mt={1} noWrap>{servicio.descripcion}</Typography>
                    <Typography variant="body2" color="textSecondary" mt={1} noWrap>Teléfono: {servicio.telefono}</Typography>
                  </div>
                  <Box style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <Link href={`/guardar-servicio-basico?id=${servicio.idServicioBasico}`} passHref>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </Link>
                    <IconButton
                      color="secondary"
                      onClick={() => openDeleteDialog(servicio.idServicioBasico)}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <Modal open={modalOpen} onClose={closeImageModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: 4,
            width: '80%',
            maxWidth: '600px',
            textAlign: 'center',
          }}
        >
          {currentServicio?.foto && (
            <img
              src={`data:image/jpeg;base64,${Buffer.from(currentServicio.foto).toString('base64')}`}
              alt="Servicio Básico grande"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          )}
          <IconButton
            sx={{ position: 'absolute', top: 10, right: 10 }}
            onClick={closeImageModal}
          >
            <Close />
          </IconButton>
        </Box>
      </Modal>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estás seguro?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar este servicio básico? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ServiciosBasicosList;
