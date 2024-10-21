'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Link } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon, Search as SearchIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa el estilo de Quill

// Interfaz de la información de zonas de riesgo
interface RiskZone {
    id: number;
    title: string;
    description: string;
    latitude: number;
    longitude: number;
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    latitude: Yup.number().required('Latitud es obligatoria'),
    longitude: Yup.number().required('Longitud es obligatoria'),
});

const Municipalidad = () => {
    const fetchRiskZones = async () => {
        try {
            const response = await fetch('http://localhost:9000/sit/zona-riesgo/listar', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }); 
            if (!response.ok) {
                throw new Error('Network response was not ok'); 
            }
            const data = await response.json(); 
            console.log(data)
            setRiskZones(data.data);
            setFilteredRiskZones(data.data);
        } catch (error) {
            console.error('Error fetching risk zones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init(); fetchRiskZones();
    }, []);
    const [loading, setLoading] = useState(true);
    const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
    const [filteredRiskZones, setFilteredRiskZones] = useState<RiskZone[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentZone, setCurrentZone] = useState<RiskZone | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (zone: RiskZone | null = null) => {
        setCurrentZone(zone);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = async (values: Omit<RiskZone, 'id'>) => {
        let updatedZones;
        if (currentZone) {
            // Actualizar zona existente
            updatedZones = riskZones.map(zone =>
                zone.id === currentZone.id ? { ...zone, ...values } : zone
            );
            toast.success('Zona de riesgo actualizada con éxito');
        } else {
            // Agregar nueva zona
            const response = await fetch('http://localhost:9000/sit/zona-riesgo/agregar', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Error al agregar la zona de riesgo');
            }

            updatedZones = [...riskZones, { id: Date.now(), ...values }] as RiskZone[];
            toast.success('Zona de riesgo agregada con éxito');
        }
        setRiskZones(updatedZones);
        setFilteredRiskZones(updatedZones);
        handleCloseDialog();
    };

    const handleDelete = async () => {
        if (currentZone) {
            try {
                const response = await fetch('http://localhost:9000/sit/zona-riesgo/eliminar/' + currentZone.id, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al eliminar la zona de riesgo');
                }
                const updatedZones = riskZones.filter(zone => zone.id !== currentZone.id);
                setRiskZones(updatedZones);
                setFilteredRiskZones(updatedZones);
                toast.error('Zona de riesgo eliminada con éxito');
            } catch (error) {
                console.error('Error al eliminar la zona de riesgo:', error);
                toast.error('Hubo un problema al eliminar la zona de riesgo');
            }
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (zone: RiskZone) => {
        setCurrentZone(zone);
        setOpenDeleteDialog(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = riskZones.filter((zone) =>
            zone.title.toLowerCase().includes(query)
        );
        setFilteredRiskZones(filtered);
    };

    return (
        <PageContainer title="Zonas de Riesgo" description="Informar sobre zonas de riesgos naturales y antrópicos.">
            <DashboardCard title="">
                <Box>
                    <Toaster />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Zonas de Riesgo</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre zonas de riesgos naturales y antrópicos.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Zona de Riesgo
                            <AddIcon sx={{ ml: 1 }} />
                        </Button>
                    </Box>

                    <TextField
                        label="Buscar por título"
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
                        {filteredRiskZones.map((zone) => (
                            <Grid item xs={12} md={6} key={zone.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {zone.title}
                                        </Typography>
                                        <Box
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: zone.description }}
                                            sx={{ whiteSpace: 'pre-wrap' }}
                                        />
                                        <Box mt={2}>
                                            <Button
                                                component={Link}
                                                href={`https://www.google.com/maps?q=${zone.latitude},${zone.longitude}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="outlined"
                                                startIcon={<LaunchIcon />}
                                            >
                                                Ver en Google Maps
                                            </Button>
                                            <Button
                                                component={Link}
                                                href={`https://www.waze.com/ul?ll=${zone.latitude},${zone.longitude}&navigate=yes`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variant="outlined"
                                                startIcon={<LaunchIcon />}
                                                sx={{ ml: 2 }}
                                            >
                                                Ver en Waze
                                            </Button>
                                        </Box>
                                        <Box mt={2}>
                                            <IconButton onClick={() => handleClickOpen(zone)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(zone)} aria-label="delete">
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
                <DialogTitle>{currentZone ? 'Editar Zona de Riesgo' : 'Agregar Nueva Zona de Riesgo'}</DialogTitle>
                <Formik
                    initialValues={{
                        title: currentZone ? currentZone.title : '',
                        description: currentZone ? currentZone.description : '',
                        latitude: currentZone ? currentZone.latitude : 0,
                        longitude: currentZone ? currentZone.longitude : 0,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => {
                        handleSave(values);
                    }}
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
                                    {currentZone ? 'Actualizar' : 'Agregar'}
                                </Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>¿Eliminar Zona de Riesgo?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default Municipalidad;
