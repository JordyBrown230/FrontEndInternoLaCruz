'use client';
import { useState, useEffect } from 'react';
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
import { Delete } from '@mui/icons-material';
import { message } from 'antd';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const ServicioSeguridadForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [horario, setHorario] = useState('');
  const [urlWaze, setUrlWaze] = useState('');
  const [urlGoogleMaps, setUrlGoogleMaps] = useState('');
  const [website, setWebsite] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFoto(file);
    if (file) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !descripcion || !telefono) {
      message.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      await createOrUpdateServicioSeguridad({
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
    setFoto(null);
    setFilePreview(null);
  };

  const handleRemoveFoto = () => {
    setFoto(null);
    setFilePreview(null);
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
                Subir Foto
                <input type="file" hidden onChange={handleFileChange} />
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
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              )}
            </Grid>

            {/* Botón para Enviar el Formulario */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
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
