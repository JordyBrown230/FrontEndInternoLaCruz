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
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Interfaz de la atracción
interface Attraction {
    id: number;
    title: string;
    description: string;
    images: string[];
    location: string;
    lat: number;
    lng: number;
    type_attraction: string;
    status: string;
    website: string;
    opening_hours: string;
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    type_attraction: Yup.string().required('Tipo de atracción es obligatorio'),
    location: Yup.string().required('Ubicación es obligatoria'),
    lat: Yup.number().required('Latitud es obligatoria').min(-90).max(90),
    lng: Yup.number().required('Longitud es obligatoria').min(-180).max(180),
    opening_hours: Yup.string().required('Horario de apertura es obligatorio'),
    website: Yup.string().url('Debe ser una URL válida').nullable(),
    status: Yup.string().nullable()
});

const Municipalidad: React.FC = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentAttraction, setCurrentAttraction] = useState<Attraction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (attraction: Attraction | null = null) => {
        setCurrentAttraction(attraction);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = (values: Omit<Attraction, 'id'>) => {
        let updatedAttractions;
        if (currentAttraction) {
            // Update existing attraction
            updatedAttractions = attractions.map(a =>
                a.id === currentAttraction.id ? { ...a, ...values } : a
            );
            toast.success('Atracción actualizada con éxito');
        } else {
            // Add new attraction
            updatedAttractions = [...attractions, { id: Date.now(), ...values }] as Attraction[];
            toast.success('Atracción agregada con éxito');
        }
        setAttractions(updatedAttractions);
        setFilteredAttractions(updatedAttractions); // Actualiza también las atracciones filtradas
        handleCloseDialog(); // Cierra el diálogo después de guardar
    };

    const handleDelete = () => {
        if (currentAttraction) {
            const updatedAttractions = attractions.filter(a => a.id !== currentAttraction.id);
            setAttractions(updatedAttractions);
            setFilteredAttractions(updatedAttractions); // Actualiza también las atracciones filtradas
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

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = attractions.filter(attraction =>
            attraction.title.toLowerCase().includes(query) ||
            attraction.description.toLowerCase().includes(query)
        );
        setFilteredAttractions(filtered);
    };

    return (
        <PageContainer title="Atracciones Turísticas" description="Una página para gestionar atracciones turísticas">
            <DashboardCard>
                <Box>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Atracciones Turísticas</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra las atracciones turísticas del cantón.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Atracción
                        </Button>
                    </Box>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        onChange={handleSearch}
                        value={searchQuery}
                        sx={{ mb: 4 }}
                    />
                    <Grid container spacing={4} justifyContent="center">
                        {filteredAttractions.map((attraction) => (
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
                                            Tipo: {attraction.type_attraction}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ubicación: {attraction.location}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Horario: {attraction.opening_hours}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Estado: {attraction.status}
                                        </Typography>
                                        {attraction.website && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={attraction.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ mt: 2 }}
                                            >
                                                Visitar Sitio Web
                                            </Button>
                                        )}
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
                <Formik
                    initialValues={{
                        title: currentAttraction ? currentAttraction.title : '',
                        description: currentAttraction ? currentAttraction.description : '',
                        type_attraction: currentAttraction ? currentAttraction.type_attraction : '',
                        location: currentAttraction ? currentAttraction.location : '',
                        lat: currentAttraction ? currentAttraction.lat : 0,
                        lng: currentAttraction ? currentAttraction.lng : 0,
                        opening_hours: currentAttraction ? currentAttraction.opening_hours : '',
                        website: currentAttraction ? currentAttraction.website : '',
                        status: currentAttraction ? currentAttraction.status : '',
                        images: currentAttraction ? currentAttraction.images : []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <DialogContent>
                                <Field name="title">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Título"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="description">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Descripción"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="type_attraction">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Tipo de atracción"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="location">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Ubicación"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="lat">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Latitud"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            type="number"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="lng">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Longitud"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            type="number"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="opening_hours">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Horario de apertura"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="status">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Estado"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="website">
                                    {({ field, meta }: any) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                label="Sitio web"
                                                fullWidth
                                                margin="dense"
                                                variant="standard"
                                                error={meta.touched && Boolean(meta.error)}
                                                helperText={meta.touched && meta.error}
                                                sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                            />
                                            {values.website && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    href={values.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ mt: 2 }}
                                                >
                                                    Visitar Sitio Web
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="upload-images"
                                    type="file"
                                    multiple
                                    onChange={(e) => {
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
                                                setFieldValue('images', [...values.images, ...images].slice(0, 5));
                                            });
                                        }
                                    }}
                                />
                                <label htmlFor="upload-images">
                                    <Button variant="contained" component="span" sx={{ mt: 2 }}>
                                        Subir Imágenes (Máximo 5)
                                    </Button>
                                </label>
                                {values.images.length > 0 && (
                                    <Box mt={2}>
                                        {values.images.map((image, index) => (
                                            <Box key={index} display="inline-block" position="relative" mr={1}>
                                                <img src={image} alt={`Previsualización ${index + 1}`} style={{ width: '100px', height: '100px', marginRight: '8px' }} />
                                                <IconButton
                                                    onClick={() => {
                                                        const updatedImages = values.images.filter((_, i) => i !== index);
                                                        setFieldValue('images', updatedImages);
                                                    }}
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
                                <Button type="submit">{currentAttraction ? 'Actualizar' : 'Agregar'}</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
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
