'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

// Interfaz de la información de transporte
interface TransportInfo {
    id: number;
    title: string;
    description: string;
    type: string; // Transporte público, alquiler de vehículos, etc.
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    type: Yup.string().required('Tipo es obligatorio'),
});

const Municipalidad = () => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [transportInfos, setTransportInfos] = useState<TransportInfo[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentInfo, setCurrentInfo] = useState<TransportInfo | null>(null);

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
            // Update existing info
            updatedInfos = transportInfos.map(info =>
                info.id === currentInfo.id ? { ...info, ...values } : info
            );
            alert('Información actualizada con éxito');
        } else {
            // Add new info
            updatedInfos = [...transportInfos, { id: Date.now(), ...values }] as TransportInfo[];
            alert('Información agregada con éxito');
        }
        setTransportInfos(updatedInfos);
        handleCloseDialog(); // Cierra el diálogo después de guardar
    };

    const handleDelete = () => {
        if (currentInfo) {
            const updatedInfos = transportInfos.filter(info => info.id !== currentInfo.id);
            setTransportInfos(updatedInfos);
            alert('Información eliminada con éxito');
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (info: TransportInfo) => {
        setCurrentInfo(info);
        setOpenDeleteDialog(true);
    };

    return (
        <PageContainer title="Información de Transporte" description="Gestiona la información sobre cómo llegar al cantón, transporte público, alquiler de vehículos, etc.">
            <DashboardCard title="Gestión de Información de Transporte">
                <Box>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Información de Transporte</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre transporte en el cantón.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Información
                        </Button>
                    </Box>
                    <Grid container spacing={4} justifyContent="center">
                        {transportInfos.map((info) => (
                            <Grid item xs={12} md={6} key={info.id} data-aos="fade-up">
                                <Card>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {info.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {info.description}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Tipo: {info.type}
                                        </Typography>
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
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ values }) => (
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
                                <Field name="type">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Tipo"
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
                                <Button type="submit">{currentInfo ? 'Actualizar' : 'Agregar'}</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Dialog para confirmación de eliminación */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que quieres eliminar esta información?</Typography>
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
