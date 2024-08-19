'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Delete as DeleteIcon, Edit as EditIcon, Directions as DirectionsIcon } from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';

interface Attraction {
    id: number;
    title: string;
    description: string;
    images: string[];
    location: string;
    lat: number;
    lng: number;
}

const Municipalidad: React.FC = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentAttraction, setCurrentAttraction] = useState<Attraction | null>(null);
    const [formData, setFormData] = useState<Omit<Attraction, 'id'>>({ title: '', description: '', images: [], location: '', lat: 0, lng: 0 });

    const handleClickOpen = (attraction: Attraction | null = null) => {
        setCurrentAttraction(attraction);
        setFormData(attraction || { title: '', description: '', images: [], location: '', lat: 0, lng: 0 });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages = Array.from(files).map(file => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise<string>((resolve) => {
                    reader.onloadend = () => {
                        resolve(reader.result as string);
                    };
                });
            });

            Promise.all(newImages).then(images => {
                setFormData({ ...formData, images: [...formData.images, ...images].slice(0, 5) });
            });
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData({ ...formData, images: updatedImages });
    };

    const handleSave = () => {
        let updatedAttractions;
        if (currentAttraction) {
            // Update existing attraction
            updatedAttractions = attractions.map(a =>
                a.id === currentAttraction.id ? { ...a, ...formData } : a
            );
            toast.success('Atracción actualizada con éxito');
        } else {
            // Add new attraction
            updatedAttractions = [...attractions, { id: Date.now(), ...formData }];
            toast.success('Atracción agregada con éxito');
        }
        setAttractions(updatedAttractions);
        handleCloseDialog(); // Cierra el diálogo después de guardar
    };

    const handleDelete = () => {
        if (currentAttraction) {
            const updatedAttractions = attractions.filter(a => a.id !== currentAttraction.id);
            setAttractions(updatedAttractions);
            toast.success('Atracción eliminada con éxito');
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (attraction: Attraction) => {
        setCurrentAttraction(attraction);
        setOpenDeleteDialog(true);
    };

    const getWazeUrl = (lat: number, lng: number) => `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    const getGoogleMapsUrl = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`;

    return (
        <PageContainer title="Atracciones Turísticas" description="Una página para gestionar atracciones turísticas">
            <DashboardCard title="Gestión de Atracciones Turísticas">
                <Box>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Atracciones Turísticas</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra las atracciones turísticas del cantón.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Atracción
                        </Button>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {attractions.map((attraction) => (
                            <Grid item xs={12} md={6} key={attraction.id} data-aos="fade-up">
                                <Card>
                                    <Carousel>
                                        {attraction.images.map((image, index) => (
                                            <img key={index} src={image} alt={`Imagen ${index + 1}`} height="300" width="100%" />
                                        ))}
                                    </Carousel>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {attraction.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {attraction.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ubicación: {attraction.location}
                                        </Typography>
                                        <Box mt={2}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<DirectionsIcon />}
                                                href={getGoogleMapsUrl(attraction.lat, attraction.lng)}
                                                target="_blank"
                                            >
                                                Ver en Google Maps
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<DirectionsIcon />}
                                                href={getWazeUrl(attraction.lat, attraction.lng)}
                                                target="_blank"
                                            >
                                                Ver en Waze
                                            </Button>
                                            <IconButton onClick={() => handleClickOpen(attraction)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(attraction)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </DashboardCard>

            {/* Dialog para agregar/editar atracción */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentAttraction ? 'Editar Atracción' : 'Agregar Nueva Atracción'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        name="title"
                        fullWidth
                        variant="standard"
                        value={formData.title}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        name="description"
                        fullWidth
                        variant="standard"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Ubicación"
                        name="location"
                        fullWidth
                        variant="standard"
                        value={formData.location}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Latitud"
                        name="lat"
                        fullWidth
                        variant="standard"
                        type="number"
                        value={formData.lat}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        label="Longitud"
                        name="lng"
                        fullWidth
                        variant="standard"
                        type="number"
                        value={formData.lng}
                        onChange={handleChange}
                    />
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="upload-images"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                    />
                    <label htmlFor="upload-images">
                        <Button variant="contained" component="span" sx={{ mt: 2 }}>
                            Subir Imágenes (Máximo 5)
                        </Button>
                    </label>
                    {formData.images.length > 0 && (
                        <Box mt={2}>
                            {formData.images.map((image, index) => (
                                <Box key={index} display="inline-block" position="relative" mr={1}>
                                    <img src={image} alt={`Previsualización ${index + 1}`} style={{ width: '100px', height: '100px', marginRight: '8px' }} />
                                    <IconButton
                                        onClick={() => handleRemoveImage(index)}
                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleSave}>{currentAttraction ? 'Actualizar' : 'Agregar'}</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog para confirmación de eliminación */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que quieres eliminar esta atracción?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Toast para notificaciones */}
            <Toaster />
        </PageContainer>
    );
};

export default Municipalidad;
