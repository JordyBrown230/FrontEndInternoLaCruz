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
import { createOrUpdateServicioBasico, ServicioBasicoData, getServiciosBasicos } from '@/services/serviciosbasicos.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { CameraAlt, Delete } from '@mui/icons-material';
import { message } from 'antd';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

// Expresiones regulares para validaciones
const nombreRegex = /^[A-Za-zÀ-ÿñÑ\s]+$/;
const telefonoRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/;
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

const ServicioBasicoForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [horario, setHorario] = useState('');
  const [urlWaze, setUrlWaze] = useState('');
  const [urlGoogleMaps, setUrlGoogleMaps] = useState('');
  const [website, setWebsite] = useState('');
  const [foto, setFoto] = useState<File | undefined>(undefined);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean | undefined>(undefined);
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
  const servicioId = searchParams.get("id");

  useEffect(() => {
    if (servicioId) {
      loadServicioBasicoData(servicioId);
    }
  }, [servicioId]);

  const loadServicioBasicoData = async (id: string) => {
    try {
      const response = await getServiciosBasicos();
      const servicio = response.find((serv) => serv.idServicioBasico === parseInt(id));
      if (servicio) {
        const { nombre, direccion, descripcion, telefono, horario, urlWaze, urlGoogleMaps, website, foto } = servicio;
        setNombre(nombre || '');
        setDireccion(direccion || '');
        setDescripcion(descripcion || '');
        setTelefono(telefono || '');
        setHorario(horario || '');
        setUrlWaze(urlWaze || '');
        setUrlGoogleMaps(urlGoogleMaps || '');
        setWebsite(website || '');
        setFilePreview(foto ? `data:image/jpeg;base64,${Buffer.from(foto).toString('base64')}` : null);
      }
    } catch (error) {
      console.log('Error al cargar el servicio básico.');
    }
  };

  // Validaciones individuales
  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNombre(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      nombre: nombreRegex.test(value) ? '' : 'El nombre solo puede contener letras y espacios.',
    }));
  };

  const handleDescripcionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescripcion(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      descripcion: value.trim() !== '' ? '' : 'La descripción es obligatoria.',
    }));
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTelefono(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      telefono: telefonoRegex.test(value) ? '' : 'El teléfono no es válido.',
    }));
  };

  const handleUrlWazeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlWaze(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      urlWaze: value === '' || urlRegex.test(value) ? '' : 'URL de Waze no válida.',
    }));
  };

  const handleUrlGoogleMapsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUrlGoogleMaps(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      urlGoogleMaps: value === '' || urlRegex.test(value) ? '' : 'URL de Google Maps no válida.',
    }));
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWebsite(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      website: value === '' || urlRegex.test(value) ? '' : 'URL de Website no válida.',
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFoto(file);
    setFilePreview(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== '') || !nombre || !descripcion || !telefono) {
      message.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      const servicioData: ServicioBasicoData = {
        nombre,
        direccion,
        descripcion,
        telefono,
        horario,
        urlWaze,
        urlGoogleMaps,
        website,
        idServicioBasico: servicioId ? parseInt(servicioId, 10) : undefined,
        foto,
        eliminarFoto: servicioId && removeImage ? true : undefined,
      };

      await createOrUpdateServicioBasico(servicioData);
      message.success('Servicio básico guardado correctamente.');
      resetForm();
      router.push('/servicios-basicos');
    } catch (error: any) {
      message.error(`Ocurrió un error al guardar el servicio básico: ${error.message}`);
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
    setFoto(undefined);
    setFilePreview(null);
    setErrors({ nombre: '', descripcion: '', telefono: '', urlWaze: '', urlGoogleMaps: '', website: '' });
    setRemoveImage(undefined);
  };

  const handleRemoveFoto = () => {
    setFoto(undefined);
    setFilePreview(null);
    setRemoveImage(true);
  };

  return (
    <FormContainer maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {servicioId ? 'Editar Servicio Básico' : 'Crear Servicio Básico'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                fullWidth
                value={nombre}
                onChange={handleNombreChange}
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
                rows={4}
                value={descripcion}
                onChange={handleDescripcionChange}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                fullWidth
                value={telefono}
                onChange={handleTelefonoChange}
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
                onChange={handleUrlWazeChange}
                error={Boolean(errors.urlWaze)}
                helperText={errors.urlWaze}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL Google Maps"
                fullWidth
                value={urlGoogleMaps}
                onChange={handleUrlGoogleMapsChange}
                error={Boolean(errors.urlGoogleMaps)}
                helperText={errors.urlGoogleMaps}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                fullWidth
                value={website}
                onChange={handleWebsiteChange}
                error={Boolean(errors.website)}
                helperText={errors.website}
              />
            </Grid>

            {/* File upload */}
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                <CameraAlt sx={{ mr: 1 }} />
                Adjuntar foto
                <input type="file" accept="image/*"
                  hidden onChange={handleFileChange} ref={fileInputRef} />
              </Button>
              {filePreview && (
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={4}>
                    <Box position="relative">
                      <img src={filePreview} alt="preview" style={{ width: '100%' }} />
                      <IconButton
                        onClick={handleRemoveFoto}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>

            {/* Botón para Enviar el Formulario */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={Object.values(errors).some((error) => error !== '') || !nombre || !descripcion || !telefono}
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

export default ServicioBasicoForm;
