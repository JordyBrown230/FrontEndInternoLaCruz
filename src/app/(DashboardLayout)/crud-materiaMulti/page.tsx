'use client';
import { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, Button, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl, DialogContentText } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import toast, { Toaster } from 'react-hot-toast';

interface FileType {
    file: File;
    url: string;
    name: string;
    title: string;
    description: string;
    type: string;
}

const Municipalidad: React.FC = () => {
    const [files, setFiles] = useState<FileType[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [currentFileIndex, setCurrentFileIndex] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newName, setNewName] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            setSelectedFile(selectedFiles[0]);
            setOpenDialog(true);
        }
    };

    const handleAddFile = () => {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile);
            const newFile = {
                file: selectedFile,
                url,
                name: newName || selectedFile.name,
                title: newTitle,
                description: newDescription,
                type: selectedFile.type,
            };
            setFiles((prevFiles) => [...prevFiles, newFile]);
            resetForm();
            toast.success('Archivo agregado exitosamente!');
        }
    };

    const resetForm = () => {
        setNewTitle('');
        setNewDescription('');
        setNewName('');
        setSelectedFile(null);
        setOpenDialog(false);
    };

    const downloadFile = (file: FileType) => {
        const link = document.createElement('a');
        link.href = file.url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const deleteFile = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
        setOpenConfirmDialog(false);
        toast.success('Archivo eliminado exitosamente!');
    };

    const openEditDialog = (index: number) => {
        setCurrentFileIndex(index);
        setNewTitle(files[index].title);
        setNewDescription(files[index].description);
        setNewName(files[index].name);
        setOpenDialog(true);
    };

    const handleEdit = () => {
        if (currentFileIndex !== null) {
            const updatedFiles = [...files];
            updatedFiles[currentFileIndex] = {
                ...updatedFiles[currentFileIndex],
                title: newTitle,
                description: newDescription,
                name: newName,
            };
            setFiles(updatedFiles);
            resetForm();
            toast.success('Archivo actualizado exitosamente!');
        }
    };

    useEffect(() => {
        AOS.init();
    }, []);

    const filteredFiles = files.filter((file) => {
        if (filter === 'images') return file.type.startsWith('image/');
        if (filter === 'videos') return file.type.startsWith('video/');
        return true; // 'all' filter
    });

    return (
        <PageContainer title="Multimedia" description="">
            {/* Título de la vista */}
            <Typography variant="h4" gutterBottom align="center">
                Gestión de Archivos Multimedia
            </Typography>

            {/* Filtros para mostrar solo imágenes, videos o ambos */}
            <Box textAlign="center" mt={2}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel>Filtro</InputLabel>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'all' | 'images' | 'videos')}
                        label="Filtro"
                    >
                        <MenuItem value="all">Todos</MenuItem>
                        <MenuItem value="images">Imágenes</MenuItem>
                        <MenuItem value="videos">Videos</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Botón para agregar archivos */}
            <Box textAlign="center" mt={2}>
                <input
                    type="file"
                    id="file-input"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    Agregar Archivos
                </Button>
            </Box>

            {/* Lista de archivos */}
            <Grid container spacing={2} mt={2}>
                {filteredFiles.map((file, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            {file.type.startsWith('image/') ? (
                                <CardMedia
                                    component="img"
                                    alt={file.name}
                                    height="140"
                                    image={file.url}
                                    title={file.name}
                                />
                            ) : (
                                <CardMedia
                                    component="video"
                                    height="140"
                                    controls
                                    src={file.url}
                                    title={file.name}
                                />
                            )}
                            <CardContent>
                                <Typography variant="h6">{file.title || file.name}</Typography>
                                <Typography variant="body2">{file.description}</Typography>
                                <Button variant="contained" color="primary" onClick={() => downloadFile(file)}>
                                    Descargar
                                </Button>
                                <Button variant="contained" color="secondary" onClick={() => openEditDialog(index)} sx={{ ml: 1 }}>
                                    Editar
                                </Button>
                                <Button variant="contained" color="error" onClick={() => {
                                    setCurrentFileIndex(index);
                                    setOpenConfirmDialog(true);
                                }} sx={{ ml: 1 }}>
                                    Eliminar
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialogo para agregar/editar archivo */}
            <Dialog open={openDialog} onClose={resetForm}>
                <DialogTitle>{currentFileIndex !== null ? 'Editar Archivo' : 'Agregar Archivo'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Título"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Nombre del Archivo"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={2}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={resetForm} color="primary">
                        Cancelar
                    </Button>
                    <Button onClick={currentFileIndex !== null ? handleEdit : handleAddFile} color="primary">
                        {currentFileIndex !== null ? 'Guardar' : 'Agregar'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialogo de confirmación para eliminar archivo */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        ¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="primary">
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => {
                            if (currentFileIndex !== null) deleteFile(currentFileIndex);
                        }}
                        color="error"
                    >
                        Eliminar
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toaster para mostrar notificaciones */}
            <Toaster />
        </PageContainer>
    );
};

export default Municipalidad;
