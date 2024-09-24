'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Link, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon, Search as SearchIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface AccessibilityInfo {
    id: number;
    title: string;
    description: string;
    website?: string;
    disabilities: string[]; // Array para los tipos de discapacidades
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    website: Yup.string().url('URL inválida').notRequired(),
});

const disabilitiesOptions = [
    { label: 'Accesibilidad Física', value: 'Accesibilidad_fisica' },
    { label: 'Accesibilidad Cognitiva', value: 'Accesibilidad_cognitiva' },
    { label: 'Accesibilidad Sensorial', value: 'Accesibilidad_sensorial' },
    { label: 'Accesibilidad Tecnológica', value: 'Accesibilidad_tecnologica' },
    { label: 'Accesibilidad en el Transporte', value: 'Accesibilidad_en_el_transporte' },
];

const Municipalidad = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [accessibilityInfos, setAccessibilityInfos] = useState<AccessibilityInfo[]>([]);
    const [filteredAccessibilityInfos, setFilteredAccessibilityInfos] = useState<AccessibilityInfo[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<AccessibilityInfo | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (info: AccessibilityInfo | null = null) => {
        setCurrentInfo(info);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = (values: Omit<AccessibilityInfo, 'id'>) => {
        let updatedInfos;
        if (currentInfo) {
            updatedInfos = accessibilityInfos.map(info =>
                info.id === currentInfo.id ? { ...info, ...values } : info
            );
            toast.success('Información actualizada con éxito');
        } else {
            updatedInfos = [...accessibilityInfos, { id: Date.now(), ...values }] as AccessibilityInfo[];
            toast.success('Información agregada con éxito');
        }
        setAccessibilityInfos(updatedInfos);
        setFilteredAccessibilityInfos(updatedInfos);
        handleCloseDialog();
    };

    const handleDelete = () => {
        if (currentInfo) {
            const updatedInfos = accessibilityInfos.filter(info => info.id !== currentInfo.id);
            setAccessibilityInfos(updatedInfos);
            setFilteredAccessibilityInfos(updatedInfos);
            toast.error('Información eliminada con éxito');
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (info: AccessibilityInfo) => {
        setCurrentInfo(info);
        setOpenDeleteDialog(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = accessibilityInfos.filter((info) =>
            info.title.toLowerCase().includes(query)
        );
        setFilteredAccessibilityInfos(filtered);
    };

    return (
        <PageContainer title="Información de Accesibilidad" description="Informa sobre la accesibilidad en atracciones turísticas.">
            <DashboardCard title="">
                <Box>
                    <Toaster />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Información de Accesibilidad</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre la accesibilidad en las atracciones.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Información
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
                        {filteredAccessibilityInfos.map((info) => (
                            <Grid item xs={12} md={6} key={info.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {info.title}
                                        </Typography>
                                        <Box component="div" dangerouslySetInnerHTML={{ __html: info.description }} sx={{ whiteSpace: 'pre-wrap' }} />
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
                                            <Typography variant="subtitle1" component="div"><strong>Tipos de Discapacidad:</strong></Typography>
                                            <Box mt={1}>
                                                {info.disabilities.length > 0 ? (
                                                    info.disabilities.map((disability) => (
                                                        <Chip key={disability} label={disability.replace(/_/g, ' ')} sx={{ margin: 0.5 }} />
                                                    ))
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">No se especificaron discapacidades.</Typography>
                                                )}
                                            </Box>
                                        </Box>
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

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentInfo ? 'Editar Información' : 'Agregar Nueva Información'}</DialogTitle>
                <Formik
                    initialValues={{
                        title: currentInfo ? currentInfo.title : '',
                        description: currentInfo ? currentInfo.description : '',
                        website: currentInfo ? currentInfo.website : '',
                        disabilities: currentInfo ? currentInfo.disabilities : [],
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
                                <Box mt={2}>
                                    <Typography variant="h6">Tipos de Discapacidad</Typography>
                                    {disabilitiesOptions.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            control={
                                                <Checkbox
                                                    checked={values.disabilities.includes(option.value)}
                                                    onChange={(event) => {
                                                        const { checked } = event.target;
                                                        if (checked) {
                                                            setFieldValue('disabilities', [...values.disabilities, option.value]);
                                                        } else {
                                                            setFieldValue('disabilities', values.disabilities.filter((d: string) => d !== option.value));
                                                        }
                                                    }}
                                                />
                                            }
                                            label={option.label}
                                        />
                                    ))}
                                </Box>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancelar</Button>
                                <Button type="submit" color="primary">Guardar</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar esta información?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default Municipalidad;
