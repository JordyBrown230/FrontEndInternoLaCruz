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
import { fetchData } from "./fetchData.js";
import { fetchDelete } from "./fetchDelete.js";
import { Image as ImageIcon } from '@mui/icons-material';
import { Accordion, AccordionSummary, AccordionDetails, FormControlLabel, Checkbox } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Attraction {
    attraction_id: number;
    name: string;
    urlimg: string[];
    description: string;
    images: string[];
    location: string;
    latitude: number;
    longitude: number;
    type_attraction: string;
    status: string;
    website: string;
    opening_hours: string;
    remarks: string;
    services: string;
    owner: string;
    community: string;
    accessibility: string;
    contact_value: string;
    contact_type: string;
}


const validationSchema = Yup.object({
    name: Yup.string().required('Título es obligatorio'),
    description: Yup.string().required('Descripción es obligatoria'),
    type_attraction: Yup.string().required('Tipo de atracción es obligatorio'),
    location: Yup.string().required('Ubicación es obligatoria'),
    latitude: Yup.number().required('Latitud es obligatoria').min(-90).max(90),
    longitude: Yup.number().required('Longitud es obligatoria').min(-180).max(180),
    opening_hours: Yup.string().required('Horario de apertura es obligatorio'),
    website: Yup.string().url('Debe ser una URL válida').nullable(),
    status: Yup.string().nullable(),
    ramp_access: Yup.boolean(),
});

interface Props {
    attraction: Attraction;
}

const Municipalidad: React.FC<Props> = ({ attraction }) => {

    const fetchAttractions = async () => {
        try {
            const response = await fetch('http://localhost:9000/sit/atraccion/listar', {
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
            console.log(data)
            setAttractions(data)
            setFilteredAttractions(data)
        } catch (error) {
            console.error('Error fetching attractions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        AOS.init(); fetchAttractions();
    }, []);

    const [loading, setLoading] = useState(true); // Estado de carga
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [attractions, setAttractions] = useState<Attraction[]>([]);
    const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [currentAttraction, setCurrentAttraction] = useState<Attraction | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [contactos, setContactos] = useState<{ contact_value: string; contact_type: string }[]>([]);
    const [contact_value, setValor] = useState('');
    const [contact_type, setTipo] = useState('phone'); // 'telefono' o 'gmail'

    const handleAddContact = () => {
        if (contact_value) {
            setContactos([...contactos, { contact_value, contact_type }]);
            setValor(''); // Limpiar el campo de valor
        }
    };
    const data = searchQuery ? filteredAttractions : attractions;

    const handleDeleteContact = (index: number) => {
        const updatedContacts = contactos.filter((_, i) => i !== index);
        setContactos(updatedContacts);
    };

    const handleClickOpen = (attraction: Attraction | null = null) => {
        setCurrentAttraction(attraction);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenDeleteDialog(false);
    };

    const handleSave = async (values: Omit<Attraction, 'attraction_id'>) => {

        const attractionData = {
            name: values.name,
            description: values.description,
            type_attraction: values.type_attraction,
            website: values.website,
            status: values.status,
            location: values.location,
            opening_hours: values.opening_hours,
            latitude: values.latitude,
            longitude: values.longitude,
            remarks: values.remarks,
            services: values.services,
            owner: values.owner,
            community: values.community,
            accessibility: values.accessibility,
            images: values.images,
            contacts: contactos,
        };
        console.log(attractionData)

        try {
            const response = await fetchData('http://localhost:9000/sit/atraccion/agregar', attractionData);
            console.log(response)
            fetchAttractions()
        } catch (error) {
            console.error('Error:', error);
        }


        let updatedAttractions;
        if (currentAttraction) {

            updatedAttractions = attractions.map(a =>
                a.attraction_id === currentAttraction.attraction_id ? { ...a, ...values } : a
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

    const handleDelete = async () => {
        if (currentAttraction) {

            if (currentAttraction) {
                try {
                    const response = await fetchDelete('http://localhost:9000/sit/atraccion/eliminar/', currentAttraction.attraction_id);
                    const updatedAttractions = attractions.filter(a => a.attraction_id !== currentAttraction.attraction_id);
                    setAttractions(updatedAttractions);
                    setFilteredAttractions(updatedAttractions); // Actualiza también las atracciones filtradas
                    toast.success('Atracción eliminada con éxito');
                    handleCloseDialog();
                } catch (error) {
                    console.error('Error:', error);
                }

            }


            const updatedAttractions = attractions.filter(a => a.attraction_id !== currentAttraction.attraction_id);
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
            attraction.name.toLowerCase().includes(query) ||
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
        doc.text(attraction.name, 105, 20, { align: 'center' });


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
        drawButtonWithIcon('Ver en Google Maps', `https://www.google.com/maps?q=${attraction.latitude},${attraction.longitude}`, googleMapsIconUrl, buttonXPosition, buttonYPosition);

        // Botón con icono para Waze
        buttonXPosition += buttonSpacing; // Mover a la derecha para el siguiente botón
        drawButtonWithIcon('Ver en Waze', `https://www.waze.com/ul?ll=${attraction.latitude},${attraction.longitude}&navigate=yes`, wazeIconUrl, buttonXPosition, buttonYPosition);

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
                            <Grid item xs={12} md={6} key={attraction.attraction_id} data-aos="fade-up">
                                <Card id={`attraction-${attraction.attraction_id}`} sx={{ boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
                                    <Carousel>
                                        {attraction.Images && attraction.Images.length > 0 ? (
                                            attraction.Images.map((Images, index) => (
                                                <img key={index} src={Images.url} alt={`Imagen ${index + 1}`} height="300" width="100%" />
                                            ))
                                        ) : (
                                            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="300px">
                                                <ImageIcon style={{ fontSize: '50px', color: 'gray' }} />
                                                <Typography variant="body2" color="text.secondary">No hay imágenes disponibles</Typography>
                                            </Box>
                                        )}
                                    </Carousel>
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" fontWeight="bold" color="primary">
                                            {attraction.name}
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" gutterBottom>
                                            {attraction.description}
                                        </Typography>

                                        {/* Datos principales */}
                                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="textPrimary">
                                            Detalles
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Ubicación:</strong> {attraction.location}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Horario:</strong> {attraction.opening_hours}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <strong>Estado:</strong> {attraction.status || 'No especificado'}
                                        </Typography>

                                        {/* Mostrar el teléfono si está disponible */}
                                        {attraction.contact_value && (
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Teléfono:</strong> {attraction.contact_value}
                                            </Typography>
                                        )}

                                        {/* Sección de Servicios y Propietario */}
                                        <Box my={2}>
                                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="textPrimary">
                                                Servicios y Comunidad
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Comunidad:</strong> {attraction.community || 'No especificado'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Propietario:</strong> {attraction.owner || 'No especificado'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Servicios:</strong> {attraction.services || 'No especificados'}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                <strong>Accesibilidad:</strong> {attraction.accessibility || 'No especificados'}
                                            </Typography>
                                        </Box>                   

                                        <Box mt={2}>
                                            {attraction.website && (
                                                <Button
                                                    variant="outlined"
                                                    color="primary"
                                                    startIcon={<DirectionsIcon />}
                                                    href={attraction.website}
                                                    target="_blank"
                                                    sx={{ mr: 1 }}
                                                >
                                                    Visitar Sitio Web

                                                </Button>

                                            )}
                                            <br></br>
                                            <br></br>
                                            <Button
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<DirectionsIcon />}
                                                href={getGoogleMapsUrl(attraction.latitude, attraction.longitude)}
                                                target="_blank"
                                                sx={{ mr: 1 }}
                                            >
                                                Ver en Google Maps
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                startIcon={<DirectionsIcon />}
                                                href={getWazeUrl(attraction.latitude, attraction.longitude)}
                                                target="_blank"
                                            >
                                                Ver en Waze
                                            </Button>
                                        </Box>

                                        {/* Botones de acciones */}
                                        <Box mt={3} display="flex" justifyContent="space-between">
                                            <Box>
                                                <IconButton onClick={() => handleClickOpen(attraction)} aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteConfirmation(attraction)} aria-label="delete" color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
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
                        name: currentAttraction ? currentAttraction.name : '',
                        urlimg: currentAttraction ? currentAttraction.urlimg : [],
                        description: currentAttraction ? currentAttraction.description : '',
                        type_attraction: currentAttraction ? currentAttraction.type_attraction : '',
                        location: currentAttraction ? currentAttraction.location : '',
                        latitude: currentAttraction ? currentAttraction.latitude : 0,
                        longitude: currentAttraction ? currentAttraction.longitude : 0,
                        opening_hours: currentAttraction ? currentAttraction.opening_hours : '',
                        website: currentAttraction ? currentAttraction.website : '',
                        status: currentAttraction ? currentAttraction.status : '',
                        images: currentAttraction ? currentAttraction.images : [],
                        remarks: currentAttraction ? currentAttraction.remarks : '',
                        services: currentAttraction ? currentAttraction.services : '',
                        owner: currentAttraction ? currentAttraction.owner : '',
                        community: currentAttraction ? currentAttraction.community : '',
                        contact_value: currentAttraction ? currentAttraction.contact_value : '',
                        contact_type: currentAttraction ? currentAttraction.contact_type : '',
                        accessibility: currentAttraction ? currentAttraction.accessibility : '',

                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSave}
                >
                    {({ setFieldValue, values }) => (
                        <Form>
                            <DialogContent>
                                <Field name="name">
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
                                <Field name="latitude">
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
                                <Field name="longitude">
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
                                <Field name="services">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Servicios"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="owner">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Propietario"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="community">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Comunidad"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>
                                <Field name="remarks">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Observaciones"
                                            fullWidth
                                            margin="dense"
                                            variant="standard"
                                            error={meta.touched && Boolean(meta.error)}
                                            helperText={meta.touched && meta.error}
                                            sx={{ '& .MuiInputBase-input': { '&:hover': { color: 'blue' } } }}
                                        />
                                    )}
                                </Field>

                                <Field name="accessibility">
                                    {({ field, meta }: any) => (
                                        <TextField
                                            {...field}
                                            label="Accesibilidad"
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
                                            const newFiles = Array.from(files);
                                            const newImages = newFiles.map(file => URL.createObjectURL(file));
                                            setFieldValue('images', [...values.images, ...newFiles].slice(0, 5)); // Envía archivos directamente para el backend

                                            setFieldValue('urlimg', [...values.urlimg, ...newImages].slice(0, 5));
                                        }
                                    }}
                                />
                                <label htmlFor="upload-images">
                                    <Button variant="contained" component="span" sx={{ mt: 2 }}>
                                        Subir Imágenes (Máximo 5)
                                    </Button>
                                </label>
                                {values.urlimg.length > 0 && (
                                    <Box mt={2}>
                                        {values.urlimg.map((urlimg, index) => (
                                            <Box key={index} display="inline-block" position="relative" mr={1}>
                                                <img src={urlimg} alt={`Previsualización ${index + 1}`} style={{ width: '100px', height: '100px', marginRight: '8px' }} />
                                                <IconButton
                                                    onClick={() => {
                                                        const updatedImages = values.urlimg.filter((_, i) => i !== index);
                                                        setFieldValue('urlimg', updatedImages);
                                                    }}
                                                    sx={{ position: 'absolute', top: 0, right: 0 }}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>
                                )}

                                <br />
                                <br />
                                <Box>
                                    <Typography variant="h6">Agregar Contactos</Typography>
                                    <br />
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <TextField
                                            label="Valor"
                                            variant="outlined"
                                            value={contact_value}
                                            onChange={(e) => setValor(e.target.value)}
                                            sx={{ mr: 2 }}
                                        />
                                        <select value={contact_type} onChange={(e) => setTipo(e.target.value)} style={{ marginRight: '16px' }}>
                                            <option value="phone">Teléfono</option>
                                            <option value="email">Correo</option>
                                        </select>
                                        <Button variant="contained" color="primary" onClick={handleAddContact}>
                                            Agregar
                                        </Button>
                                    </Box>

                                    <Typography variant="h6">Lista de Contactos</Typography>
                                    <ul>
                                        {contactos.map((contacto, index) => (
                                            <li key={index}>
                                                {`${contacto.contact_type === 'phone' ? 'Teléfono' : 'Correo'}: ${contacto.contact_value}`}
                                                <Button onClick={() => handleDeleteContact(index)} color="secondary" sx={{ ml: 2 }}>
                                                    Eliminar
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </Box>
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
