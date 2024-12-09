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
  const servicioId = searchParams.get("id");

  useEffect(() => {
    if (servicioId) {
      loadServicioBasicoData(servicioId);
    }
  }, [servicioId]);

  const loadServicioBasicoData = async (id: string) => {
    try {
      const response = await getServiciosBasicos();
      const servicio = response.find((serv) => serv.basicServiceId === parseInt(id));
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
      console.log('Error al cargar el servicio básico.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const totalFiles = fotos.length + newFiles.length;
    if (totalFiles > 5) {
      message.error("Solo puedes subir hasta 5 imágenes.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.values(errors).some((error) => error !== '') || !nombre || !descripcion || !telefono) {
      message.error('Por favor, corrige los errores en el formulario.');
      return;
    }

    try {
      await createOrUpdateServicioBasico({
        name: nombre,
        address: direccion,
        description: descripcion,
        phoneNumber: telefono,
        schedule: horario,
        wazeUrl: urlWaze,
        googleMapsUrl: urlGoogleMaps,
        website,
        basicServiceId: servicioId ? parseInt(servicioId, 10) : undefined,
        files: fotos,
      } as ServicioBasicoData);
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
    setFotos([]);
    setFilePreviews([]);
    setErrors({ nombre: '', descripcion: '', telefono: '', urlWaze: '', urlGoogleMaps: '', website: '' });
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
                onChange={(e) => setNombre(e.target.value)}
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
                onChange={(e) => setDescripcion(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                fullWidth
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
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
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="URL Google Maps"
                fullWidth
                value={urlGoogleMaps}
                onChange={(e) => setUrlGoogleMaps(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Website"
                fullWidth
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </Grid>

            {/* File upload */}
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
