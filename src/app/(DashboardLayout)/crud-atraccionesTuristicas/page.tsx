'use client';
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Typography, Grid, Card, CardContent, Box, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Carousel from 'react-material-ui-carousel';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Delete as DeleteIcon, Edit as EditIcon, Directions as DirectionsIcon } from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface Attraction {
    id: number;
    title: string;
    description: string;
    images: string[];
    location: string;
    lat: number;
    lng: number;
    type_attraction: string;
    status: string;
    website: string;
    opening_hours: string;
    phone?: string;
}


const validationSchema = Yup.object({
    title: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    type_attraction: Yup.string().required('Tipo de atracción es obligatorio'),
    location: Yup.string().required('Ubicación es obligatoria'),
    lat: Yup.number().required('Latitud es obligatoria').min(-90).max(90),
    lng: Yup.number().required('Longitud es obligatoria').min(-180).max(180),
    opening_hours: Yup.string().required('Horario de apertura es obligatorio'),
    website: Yup.string().url('Debe ser una URL válida').nullable(),
    phone: Yup.string().nullable(), 
    status: Yup.string().nullable()
});

interface Props {
    attraction: Attraction;
}

const Municipalidad: React.FC<Props> = ({ attraction }) => {
    useEffect(() => {
        AOS.init();
    }, []);

    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentAttraction, setCurrentAttraction] = useState<Attraction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleClickOpen = (attraction: Attraction | null = null) => {
        setCurrentAttraction(attraction);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = (values: Omit<Attraction, 'id'>) => {
        let updatedAttractions;
        if (currentAttraction) {
           
            updatedAttractions = attractions.map(a =>
                a.id === currentAttraction.id ? { ...a, ...values } : a
            );
            toast.success('Atracción actualizada con éxito');
        } else {
            
            updatedAttractions = [...attractions, { id: Date.now(), ...values }] as Attraction[];
            toast.success('Atracción agregada con éxito');
        }
        setAttractions(updatedAttractions);
        setFilteredAttractions(updatedAttractions); 
        handleCloseDialog(); 
    };

    const handleDelete = () => {
        if (currentAttraction) {
            const updatedAttractions = attractions.filter(a => a.id !== currentAttraction.id);
            setAttractions(updatedAttractions);
            setFilteredAttractions(updatedAttractions); 
            toast.success('Atracción eliminada con éxito');
        }
        handleCloseDialog();
    };

    const handleDeleteConfirmation = (attraction: Attraction) => {
        setCurrentAttraction(attraction);
        setOpenDeleteDialog(true);
    };

    const getWazeUrl = (lat: number, lng: number) => `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    const getGoogleMapsUrl = (lat: number, lng: number) => `https://www.google.com/maps?q=${lat},${lng}`;

    const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = attractions.filter(attraction =>
            attraction.title.toLowerCase().includes(query) ||
            attraction.description.toLowerCase().includes(query)
        );
        setFilteredAttractions(filtered);
    };


    const generatePDF = (attraction: Attraction) => {
        const doc = new jsPDF();
        const imageWidth = 80; 
        const imageHeight = 60; 
        const margin = 10; 
        const imagesPerRow = 2; 
        const xOffset = 10; 
        const yOffset = 140; 
        const borderRadius = 10; 
    
     
        const primaryColor: [number, number, number] = [0, 207, 193]; 
        const RedColor: [number, number, number] = [247, 247, 247]; 
        const secondaryColor: [number, number, number] = [162, 223, 247]; 
        const buttonTextColor: [number, number, number] = [0, 0, 0]; 
        const textColor: [number, number, number] = [51, 51, 51]; 
        const borderColor: [number, number, number] = [0, 0, 0]; 
    
    
        const websiteIconUrl = 'https://cdn-icons-png.flaticon.com/256/8344/8344996.png';
        const googleMapsIconUrl = 'https://cdn-icons-png.flaticon.com/256/2642/2642502.png';
        const wazeIconUrl = 'https://cdn-icons-png.flaticon.com/256/3771/3771526.png';
    
        const iconSize = 8; 
        const buttonWidth = 55; 
        const buttonHeight = 12; 
    
       
        doc.setFontSize(24);
        doc.setFont("Helvetica", "bold");
        doc.setTextColor(...primaryColor);
        doc.text(attraction.title, 105, 20, { align: 'center' });
    
      
        doc.setLineWidth(1);
        doc.setDrawColor(...secondaryColor);
        doc.line(10, 25, 200, 25);
    
        
        doc.setTextColor(...textColor);
        doc.setFontSize(14);
        doc.setFont("Helvetica", "normal");
        const descriptionLines = doc.splitTextToSize(attraction.description, 190);
        const descriptionHeight = descriptionLines.length * 10; // Altura estimada del texto (10px por línea)
        doc.text(descriptionLines, 10, 35, { maxWidth: 190 });
    
        
        let currentY = 35 + descriptionHeight + 10; 
    
       
        doc.setTextColor(...primaryColor);
        doc.setFontSize(12);
        doc.text(`Ubicación: ${attraction.location}`, 10, currentY);
        currentY += 10; 
        doc.text(`Horario: ${attraction.opening_hours}`, 10, currentY);
        currentY += 10; 
        doc.text(`Estado: ${attraction.status}`, 10, currentY);
        currentY += 10; 
    
  
        if (attraction.phone) {
            doc.text(`Teléfono: ${attraction.phone}`, 10, currentY);
            currentY += 10;
        }
    
        
        const drawButtonWithIcon = (text: string, url: string, iconUrl: string, x: number, y: number) => {
          
            doc.setFillColor(...RedColor);
            doc.roundedRect(x, y, buttonWidth, buttonHeight, 5, 5, 'F'); 
    
          
            doc.addImage(iconUrl, 'PNG', x + 5, y + 2, iconSize, iconSize); 
    
           
            doc.setFontSize(10);
            doc.setTextColor(...buttonTextColor);
            doc.textWithLink(text, x + iconSize + 8, y + buttonHeight / 2 + 2, { align: 'left', url });
        };
    
        // Añadir botones horizontalmente
        const buttonSpacing = buttonWidth + 10; // Espacio entre los botones
        let buttonXPosition = 10; // Posición horizontal inicial de los botones
        const buttonYPosition = currentY; // Posición vertical para los botones
    
        // Botón con icono para el sitio web
        drawButtonWithIcon('Visitar Sitio Web', attraction.website, websiteIconUrl, buttonXPosition, buttonYPosition);
    
        // Botón con icono para Google Maps
        buttonXPosition += buttonSpacing; // Mover a la derecha para el siguiente botón
        drawButtonWithIcon('Ver en Google Maps', `https://www.google.com/maps?q=${attraction.lat},${attraction.lng}`, googleMapsIconUrl, buttonXPosition, buttonYPosition);
    
        // Botón con icono para Waze
        buttonXPosition += buttonSpacing; // Mover a la derecha para el siguiente botón
        drawButtonWithIcon('Ver en Waze', `https://www.waze.com/ul?ll=${attraction.lat},${attraction.lng}&navigate=yes`, wazeIconUrl, buttonXPosition, buttonYPosition);
    
        // Ajustar la posición vertical para las imágenes
        let xPosition = xOffset;
        let yPosition = buttonYPosition + buttonHeight + 10; // Aumentar posición vertical después de los botones
    
        // Agregar imágenes con bordes redondeados y sombra
        attraction.images.forEach((imageUrl, index) => {
            if (index % imagesPerRow === 0 && index !== 0) {
                xPosition = xOffset;
                yPosition += imageHeight + margin; // Mover a la siguiente fila
            }
    
            // Verificar si la imagen se sale de la página
            if (yPosition + imageHeight > doc.internal.pageSize.height - 20) {
                // Añadir una nueva página
                doc.addPage();
                yPosition = 20; // Reiniciar posición vertical en la nueva página
            }
    
            // Añadir sombra
            doc.setFillColor(229, 229, 229); // Color de sombra (gris claro)
            doc.rect(xPosition + 2, yPosition + 2, imageWidth, imageHeight, 'F'); // Crear un rectángulo gris para sombra
            doc.setFillColor(...secondaryColor); // Color del fondo del rectángulo (celeste)
            doc.rect(xPosition, yPosition, imageWidth, imageHeight, 'F'); // Crear un rectángulo celeste para el fondo de la imagen
    
            // Añadir imagen con borde redondeado
            doc.addImage(imageUrl, 'JPEG', xPosition, yPosition, imageWidth, imageHeight);
    
            xPosition += imageWidth + margin; // Mover a la siguiente columna
        });
    
        // Pie de página en celeste
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(10);
        doc.text('Generado por Sistema de Información Turística', 105, doc.internal.pageSize.height - 10, { align: 'center' });
    
        // Guardar el PDF
        doc.save('attraction.pdf');
    };
    
    
    return (
        <PageContainer title="Atracciones" description="Una página para gestionar atracciones turísticas">
            <DashboardCard>
                <Box>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Atracciones Turísticas</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra las atracciones turísticas del cantón.</Typography>
                        <Button variant="contained" color="primary" onClick={() => handleClickOpen()} sx={{ mt: 2 }}>
                            Agregar Nueva Atracción
                        </Button>
                    </Box>
                    <TextField
                        label="Buscar"
                        variant="outlined"
                        fullWidth
                        margin="dense"
                        onChange={handleSearch}
                        value={searchQuery}
                        sx={{ mb: 4, maxWidth: 400 }}
                        InputProps={{
                            endAdornment: <SearchIcon />,
                        }}
                    />
                    <Grid container spacing={4} justifyContent="center">
                        {filteredAttractions.map((attraction) => (
                            <Grid item xs={12} md={6} key={attraction.id} data-aos="fade-up">
                                <Card id={`attraction-${attraction.id}`}>
                                    <Carousel>
                                        {attraction.images.map((image, index) => (
                                            <img key={index} src={image} alt={`Imagen ${index + 1}`} height="300" width="100%" />
                                        ))}
                                    </Carousel>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {attraction.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {attraction.description}
                                        </Typography>                 
                                        <Typography variant="body2" color="text.secondary">
                                            Tipo: {attraction.type_attraction}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Ubicación: {attraction.location}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Horario: {attraction.opening_hours}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Estado: {attraction.status}
                                        </Typography>
                                        {attraction.phone && (
                                            <Typography variant="body2" color="text.secondary">
                                                Teléfono: {attraction.phone}
                                            </Typography>
                                        )}
                                        {attraction.website && (
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                href={attraction.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                sx={{ mt: 2 }}
                                            >
                                                Visitar Sitio Web
                                            </Button>
                                        )}
                                        <Box mt={2}>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<DirectionsIcon />}
                                                href={getGoogleMapsUrl(attraction.lat, attraction.lng)}
                                                target="_blank"
                                            >
                                                Ver en Google Maps
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<DirectionsIcon />}
                                                href={getWazeUrl(attraction.lat, attraction.lng)}
                                                target="_blank"
                                            >
                                                Ver en Waze
                                            </Button>
                                            {attraction.phone && (
                                                <Button
                                                    variant="outlined"
                                                    color="success"
                                                    href={`tel:${attraction.phone}`}
                                                    target="_blank"
                                                >
                                                    Llamar
                                                </Button>
                                            )}
                                        </Box>
                                        <br />
                                        <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => generatePDF(attraction)}
                                                
                                            >
                                                Descargar Folleto
                                        </Button>
                                        <br />
                                        <br />
                                        <IconButton onClick={() => handleClickOpen(attraction)} aria-label="edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteConfirmation(attraction)} aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </DashboardCard>

            {/* Dialog para agregar/editar atracción */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{currentAttraction ? 'Editar Atracción' : 'Agregar Nueva Atracción'}</DialogTitle>
                <Formik
                    initialValues={{
                        title: currentAttraction ? currentAttraction.title : '',
                        description: currentAttraction ? currentAttraction.description : '',
                        type_attraction: currentAttraction ? currentAttraction.type_attraction : '',
                        location: currentAttraction ? currentAttraction.location : '',
                        lat: currentAttraction ? currentAttraction.lat : 0,
                        lng: currentAttraction ? currentAttraction.lng : 0,
                        opening_hours: currentAttraction ? currentAttraction.opening_hours : '',
                        website: currentAttraction ? currentAttraction.website : '',
                        phone: currentAttraction ? currentAttraction.phone : '',
                        status: currentAttraction ? currentAttraction.status : '',
                        images: currentAttraction ? currentAttraction.images : []
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
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
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
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
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="type_attraction">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Tipo de atracción"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="location">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Ubicación"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="lat">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Latitud"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            type="number"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="lng">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Longitud"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            type="number"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="opening_hours">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Horario de apertura"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="status">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Estado"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="website">
                                    {({ field, meta }: any) => (
                                        <div>
                                            <TextField
                                                {...field}
                                                label="Sitio web"
                                                fullWidth
                                                margin="dense"
                                                variant="standard"
                                                error={meta.touched && Boolean(meta.error)}
                                                helperText={meta.touched && meta.error}
                                                sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                            />
                                            {values.website && (
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    href={values.website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ mt: 2 }}
                                                >
                                                    Visitar Sitio Web
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <Field name="phone">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Número de Teléfono"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
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
                                        Subir Imágenes (Máximo 5)
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
                                <Button type="submit">{currentAttraction ? 'Actualizar' : 'Agregar'}</Button>
                            </DialogActions>
                        </Form>
                    )}
                </Formik>
            </Dialog>

            {/* Dialog para confirmación de eliminación */}
            <Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
                <DialogTitle>Confirmar Eliminación</DialogTitle>
                <DialogContent>
                    <Typography>¿Estás seguro de que quieres eliminar esta atracción?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleDelete} color="error">Eliminar</Button>
                </DialogActions>
            </Dialog>

            {/* Toast para notificaciones */}
            <Toaster />
        </PageContainer>
    );

};

export default Municipalidad;
