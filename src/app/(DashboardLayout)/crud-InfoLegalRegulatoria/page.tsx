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

// Interfaz de la información legal y regulatoria
interface LegalInfo {
    id: number;
    title: string;
    description: string;
    website?: string; // Sitio web opcional
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    website: Yup.string().url('URL inválida').notRequired(), // Validación opcional para el sitio web
});

const Municipalidad = () => {
    const fetchAttractions = async () => {
        try {
            const response = await fetch('http://localhost:9000/sit/info-legal-regulatoria/listar', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            }); // Reemplaza con la URL de tu API
            //console.log(await response.json())
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Manejo de errores de red
            }
            const data = await response.json(); // Asume que la API devuelve un JSON
            //setData(data); // Asigna los datos de la API al estado
            setLegalInfos(data.data)
            setFilteredLegalInfos(data.data)
        } catch (error) {
            console.error('Error fetching attractions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init(); fetchAttractions();
    }, []);
    const [loading, setLoading] = useState(true);
    const [legalInfos, setLegalInfos] = useState<LegalInfo[]>([]);
    const [filteredLegalInfos, setFilteredLegalInfos] = useState<LegalInfo[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<LegalInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (info: LegalInfo | null = null) => {
        setCurrentInfo(info);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = async (values: Omit<LegalInfo, 'id'>) => {
        let updatedInfos;
        if (currentInfo) {
            // Actualizar información existente
            updatedInfos = legalInfos.map(info =>
                info.id === currentInfo.id ? { ...info, ...values } : info
            );
            toast.success('Información actualizada con éxito'); // Notificación de éxito
        } else {
            console.log('hola')
            // Agregar nueva información
            const response = await fetch('http://localhost:9000/sit/info-legal-regulatoria/agregar', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                throw new Error('Error al agregar el recurso');
            }

            updatedInfos = [...legalInfos, { id: Date.now(), ...values }] as LegalInfo[];
            toast.success('Información agregada con éxito'); // Notificación de éxito
        }
        setLegalInfos(updatedInfos);
        setFilteredLegalInfos(updatedInfos);
        handleCloseDialog();
    };

    const handleDelete = async () => {
        if (currentInfo) {
            try {
                const response = await fetch('http://localhost:9000/sit/info-legal-regulatoria/eliminar/' + currentInfo.id, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                // Verifica si la respuesta fue exitosa
                if (!response.ok) {
                    throw new Error('Error al eliminar la información');
                }
                const updatedInfos = legalInfos.filter(info => info.id !== currentInfo.id);
                setLegalInfos(updatedInfos);
                setFilteredLegalInfos(updatedInfos);
                toast.error('Información eliminada con éxito'); // Notificación de eliminación
            } catch (error) {
                console.error('Error al eliminar la información:', error);
                toast.error('Hubo un problema al eliminar la información'); // Manejo del error
            }


        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (info: LegalInfo) => {
        setCurrentInfo(info);
        setOpenDeleteDialog(true);
    };

    // Función para manejar la búsqueda
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = legalInfos.filter((info) =>
            info.title.toLowerCase().includes(query)
        );
        setFilteredLegalInfos(filtered);
    };

    return (
        <PageContainer title="Información Legal y Regulatoria" description="Proveer información sobre normativas locales relacionadas con el turismo.">
            <DashboardCard title="">
                <Box>
                    <Toaster /> {/* Agregar Toaster para mostrar notificaciones */}
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Información Legal y Regulatoria</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre normativas locales relacionadas con el turismo.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Información
                            <AddIcon sx={{ ml: 1 }} />
                        </Button>
                    </Box>

                    {/* Campo de búsqueda */}
                    <TextField
                        label="Buscar por título"
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
                        {filteredLegalInfos.map((info) => (
                            <Grid item xs={12} md={6} key={info.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {info.title}
                                        </Typography>
                                        <Box
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: info.description }}
                                            sx={{ whiteSpace: 'pre-wrap' }} // Mantiene los saltos de línea y el formato
                                        />
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
                        website: currentInfo ? currentInfo.website : '',
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
