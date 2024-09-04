'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Select, InputLabel, FormControl, Link } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon, Search as SearchIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';

// Interfaz para los recursos educativos
interface EducationalResource {
    id: number;
    title: string;
    description: string;
    link?: string;
    category: string;
    format: string;
    publicationDate: string;
    difficulty: string;
    authors: string[];
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    link: Yup.string().url('URL inválida').notRequired(),
    category: Yup.string().required('Categoría es obligatoria'),
    format: Yup.string().required('Formato es obligatorio'),
    publicationDate: Yup.date().required('Fecha de publicación es obligatoria').nullable(),
    difficulty: Yup.string().required('Nivel de dificultad es obligatorio'),
    authors: Yup.array().of(Yup.string().required('Nombre del autor es obligatorio')).min(1, 'Debe haber al menos un autor'),
});

const EducationTourism = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [educationalResources, setEducationalResources] = useState<EducationalResource[]>([]);
    const [filteredResources, setFilteredResources] = useState<EducationalResource[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentResource, setCurrentResource] = useState<EducationalResource | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (resource: EducationalResource | null = null) => {
        setCurrentResource(resource);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = (values: Omit<EducationalResource, 'id'>) => {
        let updatedResources;
        if (currentResource) {
            updatedResources = educationalResources.map(resource =>
                resource.id === currentResource.id ? { ...resource, ...values } : resource
            );
            toast.success('Recurso actualizado con éxito');
        } else {
            updatedResources = [...educationalResources, { id: Date.now(), ...values }] as EducationalResource[];
            toast.success('Recurso agregado con éxito');
        }
        setEducationalResources(updatedResources);
        setFilteredResources(updatedResources);
        handleCloseDialog();
    };

    const handleDelete = () => {
        if (currentResource) {
            const updatedResources = educationalResources.filter(resource => resource.id !== currentResource.id);
            setEducationalResources(updatedResources);
            setFilteredResources(updatedResources);
            toast.error('Recurso eliminado con éxito');
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (resource: EducationalResource) => {
        setCurrentResource(resource);
        setOpenDeleteDialog(true);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filtered = educationalResources.filter((resource) =>
            resource.title.toLowerCase().includes(query)
        );
        setFilteredResources(filtered);
    };

    return (
        <PageContainer title="Educación Turística" description="Crea y administra recursos educativos sobre turismo sostenible y responsable.">
            <DashboardCard title="">
                <Box>
                    <Toaster />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Educación Turística</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Crea y administra recursos educativos sobre turismo sostenible y responsable.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nuevo Recurso
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
                        {filteredResources.map((resource) => (
                            <Grid item xs={12} md={6} key={resource.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {resource.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {resource.description}
                                        </Typography>
                                        {resource.link && (
                                            <Box mt={2}>
                                                <Button
                                                    component={Link}
                                                    href={resource.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    variant="outlined"
                                                    startIcon={<LaunchIcon />}
                                                >
                                                    Ver Recurso
                                                </Button>
                                            </Box>
                                        )}
                                        <Box mt={2}>
                                            <IconButton onClick={() => handleClickOpen(resource)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(resource)} aria-label="delete">
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
                <DialogTitle>{currentResource ? 'Editar Recurso' : 'Agregar Nuevo Recurso'}</DialogTitle>
                <Formik
                    initialValues={{
                        title: currentResource ? currentResource.title : '',
                        description: currentResource ? currentResource.description : '',
                        link: currentResource ? currentResource.link : '',
                        category: currentResource ? currentResource.category : '',
                        format: currentResource ? currentResource.format : '',
                        publicationDate: currentResource ? currentResource.publicationDate : '',
                        difficulty: currentResource ? currentResource.difficulty : '',
                        authors: currentResource ? currentResource.authors : [''],
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
                                <Field name="link">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Enlace (Opcional)"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <FormControl fullWidth margin="dense" variant="standard">
                                    <InputLabel>Categoria</InputLabel>
                                    <Field name="category" as={Select}>
                                        <MenuItem value="Manual">Manual</MenuItem>
                                        <MenuItem value="Guía">Guía</MenuItem>
                                        <MenuItem value="Artículo">Artículo</MenuItem>
                                        {/* Agregar más categorías si es necesario */}
                                    </Field>
                                </FormControl>
                                <FormControl fullWidth margin="dense" variant="standard">
                                    <InputLabel>Formato</InputLabel>
                                    <Field name="format" as={Select}>
                                        <MenuItem value="PDF">PDF</MenuItem>
                                        <MenuItem value="Video">Video</MenuItem>
                                        <MenuItem value="Infografía">Infografía</MenuItem>
                                        {/* Agregar más formatos si es necesario */}
                                    </Field>
                                </FormControl>
                                <Field name="publicationDate">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            type="date"
                                            label="Fecha de Publicación"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            InputLabelProps={{ shrink: true }}
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                        />
                                    )}
                                </Field>
                                <FormControl fullWidth margin="dense" variant="standard">
                                    <InputLabel>Nivel de Dificultad</InputLabel>
                                    <Field name="difficulty" as={Select}>
                                        <MenuItem value="Principiante">Principiante</MenuItem>
                                        <MenuItem value="Intermedio">Intermedio</MenuItem>
                                        <MenuItem value="Avanzado">Avanzado</MenuItem>
                                        {/* Agregar más niveles si es necesario */}
                                    </Field>
                                </FormControl>
                                <FieldArray name="authors">
                                    {({ remove, push }: any) => (
                                        <>
                                            {values.authors.map((author: string, index: number) => (
                                                <Field name={`authors[${index}]`} key={index}>
                                                    {({ field, meta }: any) => (
                                                        <TextField
                                                            {...field}
                                                            label={`Autor ${index + 1}`}
                                                            fullWidth
                                                            margin="dense"
                                                            variant="standard"
                                                            error={meta.touched && Boolean(meta.error)}
                                                            helperText={meta.touched && meta.error}
                                                            InputProps={{
                                                                endAdornment: (
                                                                    <IconButton
                                                                        onClick={() => remove(index)}
                                                                        aria-label="delete"
                                                                    >
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                ),
                                                            }}
                                                        />
                                                    )}
                                                </Field>
                                            ))}
                                            <Button
                                                type="button"
                                                onClick={() => push('')}
                                                variant="outlined"
                                                sx={{ mt: 2 }}
                                            >
                                                Agregar Autor
                                            </Button>
                                        </>
                                    )}
                                </FieldArray>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseDialog}>Cancelar</Button>
                                <Button type="submit">Guardar</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que deseas eliminar el recurso "{currentResource?.title}"?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>
        </PageContainer>
    );
};

export default EducationTourism;
