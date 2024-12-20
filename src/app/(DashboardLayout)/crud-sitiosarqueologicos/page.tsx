'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Link, Tooltip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Directions as DirectionsIcon, PhotoCamera, Clear as ClearIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Interfaz de la información de sitios arqueológicos
interface ArchaeologicalSite {
    id: number;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    images: string[]; // Cambiado a un arreglo de strings
}

// Validación con Yup
const validationSchema = Yup.object({
    name: Yup.string().required('Nombre es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    latitude: Yup.number().required('Latitud es obligatoria'),
    longitude: Yup.number().required('Longitud es obligatoria'),
});

const Municipalidad = () => {
    const fetchGetAll = async () => {
        try {
            const response = await fetch('http://localhost:9000/sit/sitio-arqueologico/listar', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok'); // Manejo de errores de red
            }
            const data = await response.json();
            console.log(data)
            setArchaeologicalSites(data.data)
            setFilteredSites(data.data)

        } catch (error) {
            console.error('Error fetching attractions:', error);
        } finally {

        }
    };

    const [loading, setLoading] = useState(true);
    const [archaeologicalSites, setArchaeologicalSites] = useState<ArchaeologicalSite[]>([]);
    const [filteredSites, setFilteredSites] = useState<ArchaeologicalSite[]>(archaeologicalSites);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentSite, setCurrentSite] = useState<ArchaeologicalSite | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleClickOpen = (site: ArchaeologicalSite | null = null) => {
        setCurrentSite(site);
        setPreviewImage(site?.images[0] || null); // Asumimos que siempre muestra la primera imagen
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
        setSelectedImage(null);
        setPreviewImage(null);
    };

    const handleSave = async (values: Omit<ArchaeologicalSite, 'id'>) => {
        let updatedSites;
        const imageUrls = values.images;
        console.log(values.images)

        console.log(selectedImage)
        if (currentSite) {
            updatedSites = archaeologicalSites.map(site =>
                site.id === currentSite.id ? { ...site, ...values, images: imageUrls } : site
            );
            toast.success('Sitio arqueológico actualizado con éxito');

        } else {
            try {
                const addResponse = await fetch('http://localhost:9000/sit/sitio-arqueologico/agregar', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (!addResponse.ok) {
                    throw new Error('Error al agregar el sitio arqueológico');
                }

                const newResponse = await addResponse.json();
                console.log(newResponse)
                if (selectedImage) {
                    const formData = new FormData();
                    formData.append('images', selectedImage); // 'images' es la clave que espera en el backend


                    const imageUploadResponse = await fetch('http://localhost:9000/sit/sitio-arqueologico/agregar-imagenes/' + newResponse.data.id, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                    });

                    console.log(imageUploadResponse)
                    if (!imageUploadResponse.ok) {
                        console.log(imageUploadResponse)
                        await fetch('http://localhost:9000/sit/sitio-arqueologico/eliminar/' + newResponse.data.id, {
                            method: 'DELETE',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        const errorData = await imageUploadResponse.json();
                        throw new Error(`Error al subir imágenes: ${errorData.message || 'Error desconocido'}`);
                    }
                }

                updatedSites = [...archaeologicalSites, { id: Date.now(), ...values, images: imageUrls }] as ArchaeologicalSite[];
                toast.success('Sitio arqueológico agregado con éxito');
            } catch (error) {
                toast.error('Error al agregar la información');
                console.error('Error:', error);
                return;
            }
        }
        fetchGetAll()
        setArchaeologicalSites(updatedSites);
        setFilteredSites(updatedSites);
        handleCloseDialog();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            const newImages = files.map(file => URL.createObjectURL(file));
            setSelectedImage(event.target.files[0]);
            setPreviewImage(newImages[0]); // Previsualiza la primera imagen seleccionada
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewImage(null);
    };

    const handleDelete = async () => {
        if (currentSite) {

            try {
                const response = await fetch(`http://localhost:9000/sit/sitio-arqueologico/eliminar/${currentSite.id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar el archivo');
                }
                fetchGetAll();
                const updatedSites = archaeologicalSites.filter(site => site.id !== currentSite.id);
                setArchaeologicalSites(updatedSites);
                setFilteredSites(updatedSites);
                toast.error('Sitio arqueológico eliminado con éxito');
            } catch (error) {
                console.error('Error deleting file:', error);
                toast.error('Error al eliminar el archivo');
            }
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (site: ArchaeologicalSite) => {
        setCurrentSite(site);
        setOpenDeleteDialog(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = archaeologicalSites.filter((site) =>
            site.name.toLowerCase().includes(query)
        );
        setFilteredSites(filtered);
    };

    useEffect(() => {
        AOS.init();
        fetchGetAll();
        setLoading(false);
    }, []);

    return (
        <PageContainer title="Sitios Arqueológicos" description="Documentar puntos y ubicaciones de sitios arqueológicos registrados.">
            <DashboardCard title="">
                <Box>
                    <Toaster />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Sitios Arqueológicos</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre sitios arqueológicos registrados.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nuevo Sitio Arqueológico
                            <AddIcon sx={{ ml: 1 }} />
                        </Button>
                    </Box>

                    <TextField
                        label="Buscar por nombre"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: <SearchIcon />,
                        }}
                        fullWidth
                        sx={{ mb: 4, maxWidth: 400 }}
                    />

                    <Grid container spacing={4} justifyContent="center">
                        {filteredSites.map((site) => (
                            <Grid item xs={12} md={6} key={site.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {site.name}
                                        </Typography>
                                        <Box
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: site.description }}
                                            sx={{ whiteSpace: 'pre-wrap' }}
                                        />
                                        {site.Images && site.Images.length > 0 && (
                                            <Box mt={2}>
                                                <img
                                                    src={site.Images[0].url} // Muestra la primera imagen
                                                    alt={site.name}
                                                    style={{ maxWidth: '100%', borderRadius: '8px' }} // Estilo opcional
                                                />
                                            </Box>
                                        )}
                                        <Box mt={2}>
                                            <Button
                                                component={Link}
                                                href={`https://www.google.com/maps?q=${site.latitude},${site.longitude}`}
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
                                                href={`https://www.waze.com/ul?ll=${site.latitude},${site.longitude}&navigate=yes`}
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
                                            <IconButton onClick={() => handleClickOpen(site)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(site)} aria-label="delete">
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

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentSite ? 'Editar Sitio Arqueológico' : 'Agregar Nuevo Sitio Arqueológico'}</DialogTitle>
                <Formik
                    initialValues={{
                        name: currentSite ? currentSite.name : '',
                        description: currentSite ? currentSite.description : '',
                        latitude: currentSite ? currentSite.latitude : 0,
                        longitude: currentSite ? currentSite.longitude : 0,
                        images: currentSite ? currentSite.images : [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSave(values);
                    }}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <DialogContent>
                                <Field name="name">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Nombre"
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
                                <Box mt={2}>
                                    <Typography variant="h6">Imágenes</Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            startIcon={<PhotoCamera />}
                                        >
                                            Seleccionar Imagen
                                            <input type="file" accept="image/*" hidden onChange={handleImageChange} multiple />
                                        </Button>
                                        {previewImage && (
                                            <Box ml={2} position="relative">
                                                <img src={previewImage} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px', borderRadius: 8 }} />
                                                <Tooltip title="Eliminar Imagen">
                                                    <IconButton
                                                        color="error"
                                                        size="small"
                                                        style={{ position: 'absolute', top: 0, right: 0 }}
                                                        onClick={handleRemoveImage}
                                                    >
                                                        <ClearIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancelar</Button>
                                <Button type="submit" color="primary">
                                    {currentSite ? 'Actualizar' : 'Agregar'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>¿Eliminar Sitio Arqueológico?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default Municipalidad;
