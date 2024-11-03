'use client';
import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  Select,
  InputLabel,
  FormControl,
  MenuItem,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { createOrUpdateEventoTour, EventoTourData, getEventosTours } from '@/services/eventotour.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { message } from 'antd';
import { CameraAlt, Delete } from '@mui/icons-material';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

// Regex definitions for each field
const nameRegex = /^[A-Za-zÀ-ÿñÑ\s]+$/;
const textRegex = /^[A-Za-zÀ-ÿñÑ0-9\s.,-]+$/;
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
const priceRegex = /^\d+(\.\d{1,2})?$/;
const numberRegex = /^\d+$/;
const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const EventoTourForm: React.FC = () => {
  const [tipo, setTipo] = useState('');
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [precio, setPrecio] = useState('');
  const [capacidadMaxima, setCapacidadMaxima] = useState('');
  const [tipoActividad, setTipoActividad] = useState('');
  const [organizador, setOrganizador] = useState('');
  const [requerimientosEspeciales, setRequerimientosEspeciales] = useState('');
  const [duracionEstimada, setDuracionEstimada] = useState('');
  const [puntoEncuentro, setPuntoEncuentro] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fotosParaEliminar, setFotosParaEliminar] = useState<number[]>([]);
  const [urlWaze, setUrlWaze] = useState('');
  const [urlGoogleMaps, setUrlGoogleMaps] = useState('');
  const [website, setWebsite] = useState('');
  const [existingFotos, setExistingFotos] = useState<{ id: number; foto: string }[]>([]);
  const [errors, setErrors] = useState({
    tipo: '',
    nombre: '',
    descripcion: '',
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
    ubicacion: '',
    precio: '',
    capacidadMaxima: '',
    tipoActividad: '',
    organizador: '',
    requerimientosEspeciales: '',
    duracionEstimada: '',
    puntoEncuentro: '',
    urlWaze: '',
    urlGoogleMaps: '',
    website: ''
  });


  //{Fotos}
  const handleRemoveNewFoto = (index: number) => {
    setFotos((prevFotos) => prevFotos.filter((_, i) => i !== index));
    setFilePreview((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExistingFoto = (id: number) => {
    setExistingFotos((prev) => prev.filter((foto) => foto.id !== id));
    setFotosParaEliminar((prev) => [...prev, id]); // Agrega el ID de la foto a eliminar
  };


  const searchParams = useSearchParams();
  const router = useRouter();
  const eventoTourId = searchParams.get("id");

  useEffect(() => {
    if (eventoTourId) {
      loadEventoTourData(eventoTourId);
    }
  }, [eventoTourId]);

  const loadEventoTourData = async (id: string) => {
    try {
      const data = await getEventosTours();
      const eventoTour = data.find(evt => evt.idEventoTour === parseInt(id));
      if (eventoTour) {
        const { tipo, nombre, descripcion, fechaInicio, fechaFin, horaInicio, horaFin, ubicacion, precio, capacidadMaxima, tipoActividad, organizador, requerimientosEspeciales, duracionEstimada, puntoEncuentro, fotosEventoTour, urlWaze, urlGoogleMaps, website } = eventoTour;
        setTipo(tipo || '');
        setNombre(nombre || '');
        setDescripcion(descripcion || '');
        setFechaInicio(fechaInicio ? new Date(fechaInicio).toISOString().substring(0, 10) : '');
        setFechaFin(fechaFin ? new Date(fechaFin).toISOString().substring(0, 10) : '');
        setHoraInicio(horaInicio || '');
        setHoraFin(horaFin || '');
        setUbicacion(ubicacion || '');
        setPrecio(precio?.toString() || '');
        setCapacidadMaxima(capacidadMaxima?.toString() || '');
        setTipoActividad(tipoActividad || '');
        setOrganizador(organizador || '');
        setRequerimientosEspeciales(requerimientosEspeciales || '');
        setDuracionEstimada(duracionEstimada || '');
        setPuntoEncuentro(puntoEncuentro || '');
        setUrlGoogleMaps(urlGoogleMaps || '');
        setUrlWaze(urlWaze || '');
        setWebsite(website || '');
        setExistingFotos(fotosEventoTour.map(foto => ({
          id: foto.idFoto,
          foto: `data:image/jpeg;base64,${Buffer.from(foto.foto).toString('base64')}`,
        })));
      }
    } catch (error) {
      message.error('Error al cargar el evento o tour.');
    }
  };

  const handleFieldChange = (setter: React.Dispatch<React.SetStateAction<string>>, regex: RegExp, key: keyof typeof errors) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        [key]: regex.test(value) ? '' : 'Campo no válido.',
      }));
    };

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>, key: keyof typeof errors) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setter(value);
      if (key === 'fechaFin' && fechaInicio && new Date(value) <= new Date(fechaInicio)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: 'La fecha de fin debe ser posterior a la fecha de inicio.',
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [key]: '',
        }));
      }
    };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    setFotos([...fotos, ...newFiles].slice(0, 5));
    setFilePreview([...filePreview, ...newFiles.map(file => URL.createObjectURL(file))]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !tipo || !fechaInicio || (fechaFin && new Date(fechaFin) <= new Date(fechaInicio))) {
      message.error('Por favor, completa todos los campos obligatorios correctamente.');
      return;
    }

    try {
      await createOrUpdateEventoTour({
        tipo,
        nombre,
        descripcion,
        fechaInicio,
        fechaFin,
        horaInicio,
        horaFin,
        ubicacion,
        precio: parseFloat(precio),
        capacidadMaxima: parseInt(capacidadMaxima, 10),
        tipoActividad,
        organizador,
        requerimientosEspeciales,
        duracionEstimada,
        puntoEncuentro,
        urlWaze,
        urlGoogleMaps,
        website,
        idEventoTour: eventoTourId ? parseInt(eventoTourId, 10) : undefined,
        fotos,
        existingFotosToKeep: existingFotos.map(f => f.id),
        fotosParaEliminar,
      } as EventoTourData);
      message.success('Evento o tour guardado correctamente.');
      router.push('/eventos-tours');
    } catch (error: any) {
      message.error(`Ocurrió un error al guardar el evento o tour: ${error.message}`);
    }
  };

  return (
    <FormContainer maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {eventoTourId ? 'Editar Evento/Tour' : 'Crear Evento/Tour'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth required error={Boolean(errors.tipo)}>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value as string)}
                  label="Tipo"
                >
                  <MenuItem value="Evento">Evento</MenuItem>
                  <MenuItem value="Tour">Tour</MenuItem>
                </Select>
                {errors.tipo && <Typography color="error">{errors.tipo}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                value={nombre}
                onChange={handleFieldChange(setNombre, nameRegex, 'nombre')}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={4}
                value={descripcion}
                onChange={handleFieldChange(setDescripcion, textRegex, 'descripcion')}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha Inicio"
                type="date"
                fullWidth
                value={fechaInicio}
                onChange={handleDateChange(setFechaInicio, 'fechaInicio')}
                error={Boolean(errors.fechaInicio)}
                helperText={errors.fechaInicio}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Fecha Fin"
                type="date"
                fullWidth
                value={fechaFin}
                onChange={handleDateChange(setFechaFin, 'fechaFin')}
                error={Boolean(errors.fechaFin)}
                helperText={errors.fechaFin}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hora Inicio"
                type="time"
                fullWidth
                required
                value={horaInicio}
                onChange={handleFieldChange(setHoraInicio, timeRegex, 'horaInicio')}
                error={Boolean(errors.horaInicio)}
                helperText={errors.horaInicio}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hora Fin"
                type="time"
                fullWidth
                value={horaFin}
                onChange={handleFieldChange(setHoraFin, timeRegex, 'horaFin')}
                error={Boolean(errors.horaFin)}
                helperText={errors.horaFin}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Ubicación"
                fullWidth
                value={ubicacion}
                onChange={handleFieldChange(setUbicacion, textRegex, 'ubicacion')}
                error={Boolean(errors.ubicacion)}
                helperText={errors.ubicacion}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Precio"
                fullWidth
                value={precio}
                onChange={handleFieldChange(setPrecio, priceRegex, 'precio')}
                error={Boolean(errors.precio)}
                helperText={errors.precio}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Capacidad Máxima"
                fullWidth
                value={capacidadMaxima}
                onChange={handleFieldChange(setCapacidadMaxima, numberRegex, 'capacidadMaxima')}
                error={Boolean(errors.capacidadMaxima)}
                helperText={errors.capacidadMaxima}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Tipo de Actividad"
                fullWidth
                value={tipoActividad}
                onChange={handleFieldChange(setTipoActividad, nameRegex, 'tipoActividad')}
                error={Boolean(errors.tipoActividad)}
                helperText={errors.tipoActividad}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Organizador"
                fullWidth
                value={organizador}
                onChange={handleFieldChange(setOrganizador, nameRegex, 'organizador')}
                error={Boolean(errors.organizador)}
                helperText={errors.organizador}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Requerimientos Especiales"
                fullWidth
                value={requerimientosEspeciales}
                onChange={handleFieldChange(setRequerimientosEspeciales, textRegex, 'requerimientosEspeciales')}
                error={Boolean(errors.requerimientosEspeciales)}
                helperText={errors.requerimientosEspeciales}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Duración Estimada"
                fullWidth
                value={duracionEstimada}
                onChange={handleFieldChange(setDuracionEstimada, textRegex, 'duracionEstimada')}
                error={Boolean(errors.duracionEstimada)}
                helperText={errors.duracionEstimada}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Punto de Encuentro"
                fullWidth
                value={puntoEncuentro}
                onChange={handleFieldChange(setPuntoEncuentro, textRegex, 'puntoEncuentro')}
                error={Boolean(errors.puntoEncuentro)}
                helperText={errors.puntoEncuentro}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="URL Waze"
                fullWidth
                value={urlWaze}
                onChange={handleFieldChange(setUrlWaze, urlRegex, 'urlWaze')}
                error={Boolean(errors.urlWaze)}
                helperText={errors.urlWaze}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL Google Maps"
                fullWidth
                value={urlGoogleMaps}
                onChange={handleFieldChange(setUrlGoogleMaps, urlRegex, 'urlGoogleMaps')}
                error={Boolean(errors.urlGoogleMaps)}
                helperText={errors.urlGoogleMaps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                fullWidth
                value={website}
                onChange={handleFieldChange(setWebsite, urlRegex, 'website')}
                error={Boolean(errors.website)}
                helperText={errors.website}
              />
            </Grid>

            {/* File upload */}
            <FormContainer maxWidth="sm">
              <Grid item xs={12}>
                <Button variant="contained" component="label">
                  <CameraAlt sx={{ mr: 1 }} />
                  Adjuntar fotos
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    ref={fileInputRef} // Asocia el ref al input
                  />
                </Button>

                {filePreview.length > 0 && (
                  <Grid container spacing={2} mt={2}>
                    {filePreview.map((src, index) => (
                      <Grid item xs={4} key={index} style={{ position: 'relative' }}>
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          style={{ width: '100%' }} // Sin sombra ni borde
                        />
                        <IconButton
                          onClick={() => handleRemoveNewFoto(index)}
                          style={{ position: 'absolute', top: 0, right: 0 }}
                          color="secondary"
                          size="small"
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Grid>

              {existingFotos.length > 0 && (
                <Grid container spacing={2} mt={2}>
                  {existingFotos.map((foto) => (
                    <Grid item xs={4} key={foto.id} style={{ position: 'relative' }}>
                      <img
                        src={foto.foto}
                        alt={`existing-${foto.id}`}
                        style={{ width: '100%' }} // Sin sombra ni borde
                      />
                      <Button
                        onClick={() => handleRemoveExistingFoto(foto.id)}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                        color="secondary"
                        size="small"
                      >
                        <Delete color="error" />
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              )}
            </FormContainer>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth
                disabled={
                  Object.values(errors).some((error) => error !== '') ||
                  !nombre ||
                  !descripcion ||
                  !ubicacion ||
                  !tipo ||
                  !horaInicio ||
                  !fechaInicio
                }>
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </FormContainer>
  );
};

export default EventoTourForm;
