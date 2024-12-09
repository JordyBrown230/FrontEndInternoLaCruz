'use client';
import { useState, useEffect, useRef } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  Box,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { createOrUpdateServicioSeguridad, ServicioSeguridadData, getServiciosSeguridad } from '@/services/serviciosseguridad.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { CameraAlt, Delete } from '@mui/icons-material';
import { message } from 'antd';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const nombreRegex = /^[A-Za-zÀ-ÿñÑ\s]+$/;
const telefonoRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/;
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

const ServicioSeguridadForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [horario, setHorario] = useState('');
  const [urlWaze, setUrlWaze] = useState('');
  const [urlGoogleMaps, setUrlGoogleMaps] = useState('');
  const [website, setWebsite] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    telefono: '',
    urlWaze: '',
    urlGoogleMaps: '',
    website: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const servicioId = searchParams.get('id');

  useEffect(() => {
    if (servicioId) {
      loadServicioSeguridadData(servicioId);
    }
  }, [servicioId]);

  const loadServicioSeguridadData = async (id: string) => {
    try {
      const response = await getServiciosSeguridad();
      const servicio = response.find((serv) => serv.securityServiceId === parseInt(id));
      if (servicio) {
        const { name, address, description, phoneNumber, schedule, wazeUrl, googleMapsUrl, website } = servicio;
        setNombre(name || '');
        setDireccion(address || '');
        setDescripcion(description || '');
        setTelefono(phoneNumber || '');
        setHorario(schedule || '');
        setUrlWaze(wazeUrl || '');
        setUrlGoogleMaps(googleMapsUrl || '');
        setWebsite(website || '');
      }
    } catch (error) {
      message.error('Error al cargar el servicio de seguridad.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const totalFiles = fotos.length + newFiles.length;
    if (totalFiles > 5) {
      message.error('Solo puedes subir hasta 5 imágenes.');
      return;
    }
    setFotos((prevFotos) => [...prevFotos, ...newFiles]);
    setFilePreviews((prevPreviews) => [
      ...prevPreviews,
      ...newFiles.map((file) => URL.createObjectURL(file)),
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFoto = (index: number) => {
    setFotos((prevFotos) => prevFotos.filter((_, i) => i !== index));
    setFilePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const isNombreValid = nombreRegex.test(nombre);
    const isDescripcionValid = descripcion.trim() !== '';
    const isTelefonoValid = telefonoRegex.test(telefono);
    const isUrlWazeValid = !urlWaze || urlRegex.test(urlWaze);
    const isUrlGoogleMapsValid = !urlGoogleMaps || urlRegex.test(urlGoogleMaps);
    const isWebsiteValid = !website || urlRegex.test(website);

    return (
      isNombreValid &&
      isDescripcionValid &&
      isTelefonoValid &&
      isUrlWazeValid &&
      isUrlGoogleMapsValid &&
      isWebsiteValid
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      message.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      await createOrUpdateServicioSeguridad({
        name: nombre,
        address: direccion,
        description: descripcion,
        phoneNumber: telefono,
        schedule: horario,
        wazeUrl: urlWaze,
        googleMapsUrl: urlGoogleMaps,
        website,
        securityServiceId: servicioId ? parseInt(servicioId, 10) : undefined,
        files: fotos,
      } as ServicioSeguridadData);
      message.success('Servicio de seguridad guardado correctamente.');
      resetForm();
      router.push('/servicios-seguridad');
    } catch (error: any) {
      message.error(`Ocurrió un error al guardar el servicio de seguridad: ${error.message}`);
    }
  };

  const resetForm = () => {
    setNombre('');
    setDireccion('');
    setDescripcion('');
    setTelefono('');
    setHorario('');
    setUrlWaze('');
    setUrlGoogleMaps('');
    setWebsite('');
    setFotos([]);
    setFilePreviews([]);
    setErrors({ nombre: '', descripcion: '', telefono: '', urlWaze: '', urlGoogleMaps: '', website: '' });
  };

  return (
    <FormContainer maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {servicioId ? 'Editar Servicio de Seguridad' : 'Crear Servicio de Seguridad'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                error={Boolean(errors.nombre)}
                helperText={errors.nombre}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                fullWidth
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Descripción"
                fullWidth
                multiline
                required
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Horario"
                fullWidth
                value={horario}
                onChange={(e) => setHorario(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL Waze"
                fullWidth
                value={urlWaze}
                onChange={(e) => setUrlWaze(e.target.value)}
                error={Boolean(errors.urlWaze)}
                helperText={errors.urlWaze}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL Google Maps"
                fullWidth
                value={urlGoogleMaps}
                onChange={(e) => setUrlGoogleMaps(e.target.value)}
                error={Boolean(errors.urlGoogleMaps)}
                helperText={errors.urlGoogleMaps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                fullWidth
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                error={Boolean(errors.website)}
                helperText={errors.website}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                <CameraAlt sx={{ mr: 1 }} />
                Adjuntar fotos
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  multiple
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </Button>
              {filePreviews.length > 0 && (
                <Grid container spacing={2} mt={2}>
                  {filePreviews.map((src, index) => (
                    <Grid item xs={4} key={index}>
                      <Box position="relative">
                        <img src={src} alt={`preview-${index}`} style={{ width: '100%' }} />
                        <IconButton
                          onClick={() => handleRemoveFoto(index)}
                          style={{ position: 'absolute', top: 0, right: 0 }}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!validateForm()}
              >
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </FormContainer>
  );
};

export default ServicioSeguridadForm;
