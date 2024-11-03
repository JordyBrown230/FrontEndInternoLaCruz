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

// Expresiones regulares para validaciones
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
  const [foto, setFoto] = useState<File | undefined>(undefined); // Cambiado a File | undefined
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean | undefined>(undefined); // Cambiado a boolean | undefined
  const fileInputRef = useRef<HTMLInputElement | null>(null); // Ref para el input de archivo
  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
    telefono: '',
    urlWaze: '',
    urlGoogleMaps: '',
    website: ''
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const servicioId = searchParams.get("id");

  useEffect(() => {
    if (servicioId) {
      loadServicioSeguridadData(servicioId);
    }
  }, [servicioId]);

  const loadServicioSeguridadData = async (id: string) => {
    try {
      const response = await getServiciosSeguridad();
      const servicio = response.find((serv) => serv.idServicioSeguridad === parseInt(id));
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
      message.error('Error al cargar el servicio de seguridad.');
    }
  };

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
    setFoto(file); // Ahora permite File | undefined
    setFilePreview(file ? URL.createObjectURL(file) : null);
    setRemoveImage(false); // Reinicia la eliminación de imagen cuando se adjunta una nueva
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
      const servicioData: ServicioSeguridadData = {
        nombre,
        direccion,
        descripcion,
        telefono,
        horario,
        urlWaze,
        urlGoogleMaps,
        website,
        idServicioSeguridad: servicioId ? parseInt(servicioId, 10) : undefined,
        foto,
        eliminarFoto: servicioId && removeImage ? true : undefined, // Ajuste para eliminarFoto
      };

      await createOrUpdateServicioSeguridad(servicioData);
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
    setFoto(undefined); // Cambiado a undefined
    setFilePreview(null);
    setErrors({ nombre: '', descripcion: '', telefono: '', urlWaze: '', urlGoogleMaps: '', website: '' });
    setRemoveImage(undefined); // Reinicia la eliminación de imagen
  };

  const handleRemoveFoto = () => {
    setFoto(undefined); // Cambiado a undefined
    setFilePreview(null);
    setRemoveImage(true); // Marca la imagen para eliminación
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
                required
                rows={4}
                value={descripcion}
                onChange={handleDescripcionChange}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion}
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
            <Grid item xs={12}>
              <Button variant="contained" component="label">
              <CameraAlt sx={{ mr: 1 }} /> 
                Adjutar foto
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

export default ServicioSeguridadForm;
