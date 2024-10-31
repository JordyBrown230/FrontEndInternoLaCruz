'use client';
import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Link } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Launch as LaunchIcon, Search as SearchIcon, AttachFile as AttachFileIcon } from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast, Toaster } from 'react-hot-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Importa el estilo de Quill
import { Close as CloseIcon } from '@mui/icons-material';

// Interfaz de la información legal y regulatoria
interface LegalInfo {
    id: number;
    title: string;
    description: string;
    website?: string;
    fileUrl?: string; // URL del archivo adjunto
}

// Validación con Yup
const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    website: Yup.string().url('URL inválida').notRequired(),
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
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data)
            setLegalInfos(data.data);
            setFilteredLegalInfos(data.data);
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
    const [file, setFile] = useState<File | null>(null);

    const handleClickOpen = (info: LegalInfo | null = null) => {
        setCurrentInfo(info);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleSave = async (values: Omit<LegalInfo, 'id'>) => {
        let updatedInfos;
        if (currentInfo) {
            
            try {
                // Actualizar información existente
                const response = await fetch(`http://localhost:9000/sit/info-legal-regulatoria/actualizar/${currentInfo.id}`, {
                    method: 'PUT', // o 'PATCH' si prefieres
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });
    
                if (!response.ok) {
                    throw new Error('Error al actualizar la información');
                }
    
                const updatedData = await response.json();
                updatedInfos = legalInfos.map(info =>
                    info.id === currentInfo.id ? updatedData.data : info
                );
                toast.success('Información actualizada con éxito');
            } catch (error) {
                console.error('Error actualizando la información:', error);
                toast.error('Hubo un problema al actualizar la información');
                return; // Salir si hay un error
            }

        } else {
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
            const newResponse = await response.json();
            // Simulando carga de archivo
            if (file) {
                const formData = new FormData();
                formData.append('file', file);

                const imageUploadResponse = await fetch('http://localhost:9000/sit/info-legal-regulatoria/agregar-archivo/' + newResponse.data.id, {
                    method: 'POST',
                    credentials: 'include',
                    body: formData,
                });

                // Si la subida de imágenes falla, se elimina el transporte previamente agregado
                if (!imageUploadResponse.ok) {
                    await fetch('http://localhost:9000/sit/info-legal-regulatoria/eliminar/' + newResponse.data.id, {
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

            updatedInfos = [...legalInfos, { id: Date.now(), ...values }] as LegalInfo[];
            toast.success('Información agregada con éxito');
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

                if (!response.ok) {
                    throw new Error('Error al eliminar la información');
                }
                const updatedInfos = legalInfos.filter(info => info.id !== currentInfo.id);
                setLegalInfos(updatedInfos);
                setFilteredLegalInfos(updatedInfos);
                toast.error('Información eliminada con éxito');
            } catch (error) {
                console.error('Error al eliminar la información:', error);
                toast.error('Hubo un problema al eliminar la información');
            }
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (info: LegalInfo) => {
        setCurrentInfo(info);
        setOpenDeleteDialog(true);
    };

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
                    <Toaster />
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Información Legal y Regulatoria</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra la información sobre normativas locales relacionadas con el turismo.</Typography>
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
                                            sx={{ whiteSpace: 'pre-wrap' }}
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
                                        {info.document_files && info.document_files.length > 0 && (
                                            <Box mt={2}>
                                                {info.document_files.map((file) => (
                                                    <Button
                                                        key={file.id}
                                                        component={Link}
                                                        href={`http://localhost:9000/${file.filePath}`} // Asegúrate de que la ruta sea correcta
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        variant="outlined"
                                                        startIcon={<AttachFileIcon />}
                                                    >
                                                        Ver Documento: {file.filename}
                                                    </Button>
                                                ))}
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

                                <Box mt={2}>
                                    <Typography variant="h6" color="text.secondary" gutterBottom>
                                        Subir Documento
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<AttachFileIcon />}
                                        sx={{
                                            borderColor: 'primary.main',
                                            color: 'primary.main',
                                            '&:hover': {
                                                borderColor: 'primary.dark',
                                                color: 'primary.dark',
                                            },
                                        }}
                                    >
                                        Seleccionar Archivo
                                        <input
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            type="file"
                                            hidden
                                            onChange={handleFileChange}
                                        />
                                    </Button>

                                    {file && (
                                        <>
                                            <Box display="flex" alignItems="center" mt={2}>
                                                <Typography variant="body2" color="text.secondary" mr={2}>
                                                    {file.name}
                                                </Typography>
                                                <IconButton onClick={() => setFile(null)} aria-label="delete">
                                                    <CloseIcon />
                                                </IconButton>
                                            </Box>

                                            {/* Mostrar vista previa solo para PDFs */}
                                            {file.type === 'application/pdf' && (
                                                <Box mt={2} sx={{ border: '1px solid #ddd', borderRadius: 2 }}>
                                                    <iframe
                                                        src={URL.createObjectURL(file)}
                                                        width="100%"
                                                        height="500px"
                                                        title="Vista previa del documento"
                                                    />
                                                </Box>
                                            )}

                                            {/* Para otros archivos, simplemente muestra el nombre */}
                                            {file.type !== 'application/pdf' && (
                                                <Typography variant="body2" color="text.primary" mt={2}>
                                                    No se puede previsualizar el archivo, pero se puede subir: {file.name}
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </Box>

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
