'use client';
import React, { useState, useEffect } from 'react';
import {
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Link
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon, Search as SearchIcon } from '@mui/icons-material';
import { Directions as DirectionsIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast'; 
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface TravelDestination {
    id: number;
    title: string;
    description: string;
    bestTimeToVisit: string;
    travelTips: string;
    latitude: number;
    longitude: number;
}

const validationSchema = Yup.object({
    title: Yup.string().required('El título es obligatorio'),
    description: Yup.string().required('La descripción es obligatoria'),
    bestTimeToVisit: Yup.string().required('La mejor época para visitar es obligatoria'),
    travelTips: Yup.string().required('Los consejos de viaje son obligatorios'),
    latitude: Yup.number().required('Latitud es obligatoria'),
    longitude: Yup.number().required('Longitud es obligatoria'),
});

const TravelGuide = () => {
    const fetchDestinations = async () => {
        try {
            const response = await fetch('http://localhost:9000/sit/guia-viaje/listar', {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            }); 
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            setDestinations(data.data);
            setFilteredDestinations(data.data);
        } catch (error) {
            console.error('Error fetching travel destinations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init(); fetchDestinations();
    }, []);
    
    const [loading, setLoading] = useState(true);
    const [destinations, setDestinations] = useState<TravelDestination[]>([]);
    const [filteredDestinations, setFilteredDestinations] = useState<TravelDestination[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentDestination, setCurrentDestination] = useState<TravelDestination | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (destination: TravelDestination | null = null) => {
        setCurrentDestination(destination);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = async (values: Omit<TravelDestination, 'id'>) => {
        let updatedDestinations;
        if (currentDestination) {

            try {
                const response = await fetch(`http://localhost:9000/sit/guia-viaje/actualizar/${currentDestination.id}`, {
                    method: 'PUT', // o 'PATCH' si prefieres
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                });
    
                if (!response.ok) throw new Error('Error al actualizar el destino turístico');
    
                const updatedDestination = await response.json();
                updatedDestinations = destinations.map(destination =>
                    destination.id === currentDestination.id ? updatedDestination.data : destination
                );
                toast.success('Destino turístico actualizado con éxito');
            } catch (error) {
                console.error('Error actualizando el destino:', error);
                toast.error('Error al actualizar el destino turístico');
                return; // Salir si hay un error
            }

        } else {
            const response = await fetch('http://localhost:9000/sit/guia-viaje/agregar', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
            if (!response.ok) throw new Error('Error al agregar el destino turístico');
            updatedDestinations = [...destinations, { id: Date.now(), ...values }] as TravelDestination[];
            toast.success('Destino turístico agregado con éxito');
        }
        fetchDestinations();
        setDestinations(updatedDestinations);
        setFilteredDestinations(updatedDestinations);
        handleCloseDialog();
    };

    const handleDeleteConfirmation = async (destination: TravelDestination) => {
        if (currentDestination) {
            try {
                const response = await fetch(`http://localhost:9000/sit/guia-viaje/eliminar/${currentDestination.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
    
                if (!response.ok) throw new Error('Error al eliminar el destino turístico');
    
                // Actualizar la lista de destinos después de la eliminación
                fetchDestinations();
                const updatedDestinations = destinations.filter(destination => destination.id !== currentDestination.id);
                setDestinations(updatedDestinations);
                setFilteredDestinations(updatedDestinations);
                toast.success('Destino turístico eliminado con éxito');
            } catch (error) {
                console.error('Error eliminando el destino:', error);
                toast.error('Error al eliminar el destino turístico');
            } finally {
                handleCloseDialog(); // Cerrar el diálogo después de la operación
            }
        }
        setCurrentDestination(destination);
        setOpenDeleteDialog(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = destinations.filter(destination =>
            destination.title.toLowerCase().includes(query)
        );
        setFilteredDestinations(filtered);
    };

    return (
        <PageContainer title="Guía de Viaje" description="Explora destinos y planifica itinerarios">
            <DashboardCard title="">
                <Box>
                    <Toaster />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Destinos Turísticos</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Planifica tus aventuras y descubre consejos útiles.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nuevo Destino
                            <AddIcon sx={{ ml: 1 }} />
                        </Button>
                    </Box>

                    <TextField
                        label="Buscar destino"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{ endAdornment: <SearchIcon /> }}
                        fullWidth
                        sx={{ mb: 4, maxWidth: 400 }}
                    />

                    <Grid container spacing={4} justifyContent="center">
                        {filteredDestinations.map((destination) => (
                            <Grid item xs={12} md={6} key={destination.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">{destination.title}</Typography>
                                        <Box
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: destination.description }}
                                            sx={{ whiteSpace: 'pre-wrap' }}
                                        />
                                        <Typography variant="h5" gutterBottom data-aos="fade-down">Consejos de viaje</Typography>
                                        <Box
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: destination.travelTips }}
                                            sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary', mt: 1 }}
                                        />
                                         <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                            <strong>Mejor época para visitar:</strong> {destination.bestTimeToVisit}
                                        </Typography>
                                        <Box mt={2}>
                                            <Button
                                                component={Link}
                                                href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<DirectionsIcon />}
                                            >
                                                Ver en Google Maps
                                            </Button>
                                            <Button
                                                component={Link}
                                                href={`https://www.google.com/maps?q=${destination.latitude},${destination.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<DirectionsIcon />}
                                                sx={{ ml: 2 }}
                                            >
                                                Ver en Waze
                                            </Button>
                                        </Box>
                                        <Box mt={2}>
                                            <IconButton onClick={() => handleClickOpen(destination)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(destination)} aria-label="delete">
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

            {/* Dialog for adding/editing destinations */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentDestination ? 'Editar Destino Turístico' : 'Agregar Nuevo Destino Turístico'}</DialogTitle>
                <Formik
                    initialValues={{
                        title: currentDestination ? currentDestination.title : '',
                        description: currentDestination ? currentDestination.description : '',
                        bestTimeToVisit: currentDestination ? currentDestination.bestTimeToVisit : '',
                        travelTips: currentDestination ? currentDestination.travelTips : '',
                        latitude: currentDestination ? currentDestination.latitude : 0,
                        longitude: currentDestination ? currentDestination.longitude : 0,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSave(values)}
                >
                    {({ values, setFieldValue }) => (
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
                                        />
                                    )}
                                </Field>
                                <Box mt={2}>
                                    <Typography variant="h6">Descripción</Typography>
                                    <ReactQuill
                                        value={values.description}
                                        onChange={(value) => setFieldValue('description', value)}
                                        theme="snow"
                                    />
                                </Box>
                                <Field name="bestTimeToVisit">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Mejor época para visitar"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Box mt={2}>
                                    <Typography variant="h6">Consejos de viaje</Typography>
                                    <ReactQuill
                                        value={values.travelTips}
                                        onChange={(value) => setFieldValue('travelTips', value)}
                                        theme="snow"
                                    />
                                </Box>
                                <Field name="latitude">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Latitud"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Field name="longitude">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Longitud"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancelar</Button>
                                <Button type="submit" color="primary">
                                    {currentDestination ? 'Actualizar' : 'Agregar'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Dialog for delete confirmation */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>¿Eliminar Destino Turístico?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={() => handleDeleteConfirmation(currentDestination!)} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default TravelGuide;
