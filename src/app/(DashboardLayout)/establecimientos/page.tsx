'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Container, Grid, Paper, IconButton, Box, Modal, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { Delete, Edit, ArrowBackIos, ArrowForwardIos, Close, Search as SearchIcon } from '@mui/icons-material';
import Aos from 'aos';
import 'aos/dist/aos.css';
import Link from 'next/link';
import { Establecimiento, getEstablecimientos, deleteEstablecimiento } from '@/services/establecimiento.service';
import { message } from 'antd';

const EstablecimientosList: React.FC = () => {
  const [establecimientos, setEstablecimientos] = useState<Establecimiento[]>([]);
  const [filteredEstablecimientos, setFilteredEstablecimientos] = useState<Establecimiento[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [currentEstablecimiento, setCurrentEstablecimiento] = useState<Establecimiento | null>(null);
  const [establecimientoToDelete, setEstablecimientoToDelete] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Aos.init({ duration: 1000 });
    fetchEstablecimientos();
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

  const fetchEstablecimientos = async () => {
    try {
      setLoading(true);
      const data = await getEstablecimientos();
      setEstablecimientos(data);
      setFilteredEstablecimientos(data); // Inicializa el estado filtrado con todos los datos

      const initialIndices = data.map(() => 0);
      setCurrentIndex(initialIndices);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching establecimientos:", error);
      setError('Error al cargar los establecimientos.');
      setLoading(false);
    }
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = establecimientos.filter(establecimiento =>
      establecimiento.nombre.toLowerCase().includes(query) ||
      establecimiento.direccion.toLowerCase().includes(query)
    );
    setFilteredEstablecimientos(filtered);
  };

  const handleDelete = async () => {
    if (establecimientoToDelete !== null) {
      try {
        await deleteEstablecimiento(establecimientoToDelete);
        setSuccessMessage('Establecimiento eliminado con éxito.');
        fetchEstablecimientos(); // Refetch after deletion
      } catch (error) {
        setError('Error al eliminar el establecimiento.');
      }
      setDeleteDialogOpen(false); // Close the dialog after deletion
      setEstablecimientoToDelete(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setEstablecimientoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handlePrevious = (index: number) => {
    setCurrentIndex((prevIndices) => {
      const newIndices = [...prevIndices];
      newIndices[index] = newIndices[index] > 0 ? newIndices[index] - 1 : newIndices[index];
      return newIndices;
    });
  };

  const handleNext = (index: number, totalFotos: number) => {
    setCurrentIndex((prevIndices) => {
      const newIndices = [...prevIndices];
      newIndices[index] = newIndices[index] < totalFotos - 1 ? newIndices[index] + 1 : newIndices[index];
      return newIndices;
    });
  };

  const openImageModal = (index: number, establecimiento: Establecimiento) => {
    setSelectedImageIndex(currentIndex[index]);
    setCurrentEstablecimiento(establecimiento);
    setModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
    setModalOpen(false);
  };

  const handleModalNext = () => {
    if (selectedImageIndex !== null && currentEstablecimiento) {
      setSelectedImageIndex((prevIndex: any) =>
        prevIndex < currentEstablecimiento.fotosEstablecimiento.length - 1 ? prevIndex + 1 : prevIndex
      );
    }
  };

  const handleModalPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex: any) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    }
  };

  return (
    <Container maxWidth="lg" data-aos="fade-up">
      <Typography variant="h4" gutterBottom>
        Lista de Establecimientos
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2, 
          mb: 4
        }}
      >
        <Link href='/guardar-establecimiento' passHref>
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

      {loading && <Typography variant="h6" color="textSecondary">Cargando establecimientos...</Typography>}

      {!loading && filteredEstablecimientos.length > 0 && (
        <Grid container spacing={3}>
          {filteredEstablecimientos.map((establecimiento, idx) => (
            <Grid item xs={12} md={6} key={establecimiento.idEstablecimiento}>
              <Paper elevation={3} style={{ padding: '20px', position: 'relative' }}>
                <Typography variant="h6">{establecimiento.nombre}</Typography>
                <Typography variant="body2">{establecimiento.direccion}</Typography>
                <Typography variant="body2">
                  Propietario: {establecimiento.propietario.nombre}
                </Typography>
                <Typography variant="body2">
                  Categoría: {establecimiento.categoria.nombre}
                </Typography>

                {establecimiento.fotosEstablecimiento && establecimiento.fotosEstablecimiento.length > 0 ? (
                  <Box position="relative" sx={{ mt: 2 }}>
                    <img
                      src={`data:image/jpeg;base64,${Buffer.from(
                        establecimiento.fotosEstablecimiento[currentIndex[idx] || 0].foto
                      ).toString('base64')}`}
                      alt="Establecimiento"
                      style={{ width: '100%', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => openImageModal(idx, establecimiento)}
                    />
                    <IconButton
                      sx={{ position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)' }}
                      onClick={() => handlePrevious(idx)}
                    >
                      <ArrowBackIos />
                    </IconButton>
                    <IconButton
                      sx={{ position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)' }}
                      onClick={() => handleNext(idx, establecimiento.fotosEstablecimiento.length)}
                    >
                      <ArrowForwardIos />
                    </IconButton>
                  </Box>
                ) : (
                  <Typography variant="body2" mt={2} color="textSecondary">
                    No hay fotos disponibles
                  </Typography>
                )}

                <Link href={`/guardar-establecimiento?id=${establecimiento.idEstablecimiento}`} passHref>
                  <IconButton
                    color="primary"
                    style={{ position: 'absolute', top: '10px', right: '50px' }}
                  >
                    <Edit />
                  </IconButton>
                </Link>
                <IconButton
                  color="secondary"
                  style={{ position: 'absolute', top: '10px', right: '10px' }}
                  onClick={() => openDeleteDialog(establecimiento.idEstablecimiento)}
                >
                  <Delete />
                </IconButton>
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
          {selectedImageIndex !== null && currentEstablecimiento && (
            <>
              <img
                src={`data:image/jpeg;base64,${Buffer.from(
                  currentEstablecimiento.fotosEstablecimiento[selectedImageIndex].foto
                ).toString('base64')}`}
                alt="Establecimiento grande"
                style={{ width: '100%', borderRadius: '8px' }}
              />
              <IconButton
                sx={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)' }}
                onClick={handleModalPrevious}
              >
                <ArrowBackIos />
              </IconButton>
              <IconButton
                sx={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }}
                onClick={handleModalNext}
              >
                <ArrowForwardIos />
              </IconButton>
              <IconButton
                sx={{ position: 'absolute', top: 10, right: 10 }}
                onClick={closeImageModal}
              >
                <Close />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">¿Estás seguro?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar este establecimiento? Esta acción no se puede deshacer.
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

export default EstablecimientosList;
