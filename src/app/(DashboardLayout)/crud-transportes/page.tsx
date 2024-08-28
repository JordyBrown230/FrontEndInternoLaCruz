'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, InputLabel, FormControl, Link } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, DirectionsBus as BusIcon, CarRental as CarIcon, DirectionsBike as BikeIcon, LocationOn as LocationIcon, Launch as LaunchIcon, Search as SearchIcon, LocationOn } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';

// Interfaz de la información de transporte
interface TransportInfo {
    id: number;
    title: string;
    description: string;
    type: string; // Transporte público, alquiler de vehículos, etc.
    website?: string; // Sitio web opcional
    phone?: string; // Número de teléfono opcional
    images: string[]; // Array de imágenes
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    type: Yup.string().required('Tipo es obligatorio'),
    website: Yup.string().url('URL inválida').notRequired(), // Validación opcional para el sitio web
    phone: Yup.string().nullable(), // Validación opcional para el teléfono
});

// Iconos para los tipos de transporte
const transportIcons: Record<string, React.ReactNode> = {
    "Transporte Público": <BusIcon />,
    "Alquiler de Vehículos": <CarIcon />,
    "Bicicletas": <BikeIcon />,
    "Cómo Llegar": <LocationOn />,
};

const Municipalidad = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [transportInfos, setTransportInfos] = useState<TransportInfo[]>([]);
    const [filteredTransportInfos, setFilteredTransportInfos] = useState<TransportInfo[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<TransportInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (info: TransportInfo | null = null) => {
        setCurrentInfo(info);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = (values: Omit<TransportInfo, 'id'>) => {
        let updatedInfos;
        if (currentInfo) {
            // Actualizar información existente
            updatedInfos = transportInfos.map(info =>
                info.id === currentInfo.id ? { ...info, ...values } : info
            );
            toast.success('Información actualizada con éxito'); // Notificación de éxito
        } else {
            // Agregar nueva información
            updatedInfos = [...transportInfos, { id: Date.now(), ...values, images: [] }] as TransportInfo[];
            toast.success('Información agregada con éxito'); // Notificación de éxito
        }
        setTransportInfos(updatedInfos);
        setFilteredTransportInfos(updatedInfos);
        handleCloseDialog();
    };

    const handleDelete = () => {
        if (currentInfo) {
            const updatedInfos = transportInfos.filter(info => info.id !== currentInfo.id);
            setTransportInfos(updatedInfos);
            setFilteredTransportInfos(updatedInfos);
            toast.error('Información eliminada con éxito'); // Notificación de eliminación
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (info: TransportInfo) => {
        setCurrentInfo(info);
        setOpenDeleteDialog(true);
    };

    // Función para manejar la búsqueda
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = transportInfos.filter((info) =>
            info.type.toLowerCase().includes(query)
        );
        setFilteredTransportInfos(filtered);
    };

    return (
        <PageContainer title="Transporte" description="Gestiona la información sobre cómo llegar al cantón, transporte público, alquiler de vehículos, etc.">
            <DashboardCard title="">
                <Box>
                    <Toaster /> {/* Agregar Toaster para mostrar notificaciones */}
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Información de Transporte</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre transporte en el cantón.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Información
                            <AddIcon sx={{ ml: 1 }} />
                        </Button>
                    </Box>

                    {/* Campo de búsqueda */}
                    <TextField
                        label="Buscar por tipo de transporte"
                        variant="outlined"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: <SearchIcon />,
                        }}
                        fullWidth
                        sx={{ 
                            mb: 4,
                            maxWidth: 400
                         }}
                    />

                    <Grid container spacing={4} justifyContent="center">
                        {filteredTransportInfos.map((info) => (
                            <Grid item xs={12} md={6} key={info.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {info.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {info.description}
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            {transportIcons[info.type]}
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                {info.type}
                                            </Typography>
                                        </Box>
                                        {info.phone && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                Teléfono: {info.phone}
                                            </Typography>
                                        )}
                                        {info.images.length > 0 && (
                                            <Box mt={2}>
                                                {info.images.map((image, index) => (
                                                    <img key={index} src={image} alt={`Imagen ${index + 1}`} style={{ width: '100%', height: 'auto', borderRadius: '4px', marginBottom: '8px' }} />
                                                ))}
                                            </Box>
                                        )}
                                        {info.website && (
                                            <Box mt={2}>
                                                <Button
                                                    component={Link}
                                                    href={info.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="outlined"
                                                    startIcon={<LaunchIcon />}
                                                >
                                                    Sitio Web
                                                </Button>
                                            </Box>
                                        )}
                                        <Box mt={2}>
                                            <IconButton onClick={() => handleClickOpen(info)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(info)} aria-label="delete">
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

            {/* Dialog para agregar/editar información */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentInfo ? 'Editar Información' : 'Agregar Nueva Información'}</DialogTitle>
                <Formik
                    initialValues={{
                        title: currentInfo ? currentInfo.title : '',
                        description: currentInfo ? currentInfo.description : '',
                        type: currentInfo ? currentInfo.type : '',
                        website: currentInfo ? currentInfo.website : '',
                        phone: currentInfo ? currentInfo.phone : '', 
                        images: currentInfo ? currentInfo.images : [],
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSave(values);
                    }}
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
                                        />
                                    )}
                                </Field>
                                <FormControl fullWidth margin="dense">
                                    <InputLabel>Tipo</InputLabel>
                                    <Field name="type" as={Select}>
                                        <MenuItem value="Transporte Público">
                                            <BusIcon sx={{ mr: 1 }} /> Transporte Público
                                        </MenuItem>
                                        <MenuItem value="Alquiler de Vehículos">
                                            <CarIcon sx={{ mr: 1 }} /> Alquiler de Vehículos
                                        </MenuItem>
                                        <MenuItem value="Bicicletas">
                                            <BikeIcon sx={{ mr: 1 }} /> Bicicletas
                                        </MenuItem>
                                        <MenuItem value="Cómo Llegar">
                                            <LocationIcon sx={{ mr: 1 }} /> Cómo Llegar
                                        </MenuItem>
                                    </Field>
                                </FormControl>
                                <Field name="website">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Sitio Web (Opcional)"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <Field name="phone">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Número de Teléfono (Opcional)"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
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
                                        Subir Logo de Empresa
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
                                <Button type="submit" color="primary">
                                    {currentInfo ? 'Actualizar' : 'Agregar'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Dialog para confirmar eliminación */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>¿Eliminar Información?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default Municipalidad;
