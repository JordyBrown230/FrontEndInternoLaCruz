'use client';
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Paper,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/system';
import { createOrUpdateEstablecimiento, EstablecimientoData, getEstablecimientos } from '@/services/establecimiento.service';
import { getPropietarios, createPropietario, Propietario } from '@/services/propietario.service';
import { getCategorias, Categoria, createCategoria } from '@/services/categoria.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { Delete } from '@mui/icons-material';
import { message } from 'antd';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const EstablecimientoForm: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [idPropietario, setIdPropietario] = useState('');
  const [idCategoria, setIdCategoria] = useState('');
  const [fotos, setFotos] = useState<File[]>([]);
  const [filePreview, setFilePreview] = useState<string[]>([]);
  const [existingFotos, setExistingFotos] = useState<{ id: number; foto: string }[]>([]);
  const [propietarios, setPropietarios] = useState<Propietario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isCreatingPropietario, setIsCreatingPropietario] = useState(false);
  const [newPropietarioNombre, setNewPropietarioNombre] = useState('');
  const [newPropietarioTelefono, setNewPropietarioTelefono] = useState('');
  const [newPropietarioCorreo, setNewPropietarioCorreo] = useState('');
  const [isCreatingCategoria, setIsCreatingCategoria] = useState(false);
  const [newCategoriaNombre, setNewCategoriaNombre] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const establecimientoId = searchParams.get("id");

  useEffect(() => {
    fetchPropietarios();
    fetchCategorias();
    if (establecimientoId) {
      loadEstablecimientoData(establecimientoId);
    }
  }, [establecimientoId]);

  const fetchPropietarios = async () => {
    try {
      const data = await getPropietarios();
      setPropietarios(data);
    } catch (error) {
      message.error('Error al cargar propietarios.');
    }
  };

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      message.error('Error al cargar categorías.');
    }
  };

  const handleCreatePropietario = () => {
    setIsCreatingPropietario(true);
  };

  const handleCancelCreatePropietario = () => {
    setIsCreatingPropietario(false);
    setNewPropietarioNombre('');
    setNewPropietarioTelefono('');
    setNewPropietarioCorreo('');
  };

  const handleCreateCategoria = () => {
    setIsCreatingCategoria(true);
  };

  const handleCancelCreateCategoria = () => {
    setIsCreatingCategoria(false);
    setNewCategoriaNombre('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const allFiles = [...fotos, ...newFiles].slice(0, 5);
    setFotos(allFiles);
    const newPreviews = allFiles.map((file) => URL.createObjectURL(file));
    setFilePreview(newPreviews);
  };

  const handleRemoveExistingFoto = (id: number) => {
    setExistingFotos((prev) => prev.filter((foto) => foto.id !== id));
  };

  const handleSubmitNewPropietario = async () => {
    if (!newPropietarioNombre || !newPropietarioTelefono || !newPropietarioCorreo) {
      message.error('Por favor, completa todos los campos del nuevo propietario.');
      return;
    }

    try {
      const newPropietario = await createPropietario({
        nombre: newPropietarioNombre,
        telefono: newPropietarioTelefono,
        correo: newPropietarioCorreo,
      });
      setPropietarios((prev) => [...prev, newPropietario]);
      setIdPropietario(newPropietario.idPropietario.toString());
      message.success('Propietario creado correctamente.');
      handleCancelCreatePropietario();
    } catch (error) {
      message.error('Error al crear el propietario.');
    }
  };

  const handleSubmitNewCategoria = async () => {
    if (!newCategoriaNombre) {
      message.error('El nombre de la categoría no puede estar vacío.');
      return;
    }

    try {
      const newCategoria = await createCategoria({ nombre: newCategoriaNombre });
      setCategorias((prev) => [...prev, newCategoria]);
      setIdCategoria(newCategoria.idCategoria.toString());
      message.success('Categoría creada correctamente.');
      handleCancelCreateCategoria();
    } catch (error) {
      message.error('Error al crear la categoría.');
    }
  };

  const loadEstablecimientoData = async (id: string) => {
    try {
      const response = await getEstablecimientos();
      const establecimiento = response.find((est) => est.idEstablecimiento === parseInt(id));
      if (establecimiento) {
        const { nombre, direccion, descripcion, propietario, categoria, fotosEstablecimiento } = establecimiento;
        setNombre(nombre || '');
        setDireccion(direccion || '');
        setDescripcion(descripcion || '');
        setIdPropietario(propietario?.idPropietario ? propietario.idPropietario.toString() : '');
        setIdCategoria(categoria?.idCategoria ? categoria.idCategoria.toString() : '');
        setExistingFotos(fotosEstablecimiento.map((foto) => ({
          id: foto.idFoto,
          foto: `data:image/jpeg;base64,${Buffer.from(foto.foto).toString('base64')}`,
        })));
      }
    } catch (error) {
      message.error('Error al cargar el establecimiento.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !direccion || !idPropietario || !idCategoria) {
      message.error('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      await createOrUpdateEstablecimiento({
        nombre,
        direccion,
        descripcion,
        idPropietario: parseInt(idPropietario, 10),
        idCategoria: parseInt(idCategoria, 10),
        idEstablecimiento: establecimientoId ? parseInt(establecimientoId, 10) : undefined,
        fotos,
        existingFotosToKeep: existingFotos.map(f => f.id),
      } as EstablecimientoData);
      message.success('Establecimiento guardado correctamente.');
      resetForm();
      router.push('/establecimientos');
    } catch (error: any) {
      message.error(`Ocurrió un error al guardar el establecimiento: ${error.message}`);
    }
  };

  const resetForm = () => {
    setNombre('');
    setDireccion('');
    setDescripcion('');
    setIdPropietario('');
    setIdCategoria('');
    setFotos([]);
    setFilePreview([]);
    setExistingFotos([]);
  };

  return (
    <FormContainer maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {establecimientoId ? 'Editar Establecimiento' : 'Crear Establecimiento'}
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
                disabled={isCreatingPropietario || isCreatingCategoria}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Dirección"
                fullWidth
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                disabled={isCreatingPropietario || isCreatingCategoria}
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
                disabled={isCreatingPropietario || isCreatingCategoria}
              />
            </Grid>

            {/* Select para Propietario */}
            <Grid item xs={12}>
              <FormControl fullWidth required disabled={isCreatingPropietario || isCreatingCategoria}>
                <InputLabel>Propietario</InputLabel>
                <Select
                  value={idPropietario}
                  onChange={(e) => {
                    if (e.target.value === 'create') {
                      handleCreatePropietario();
                    } else {
                      setIdPropietario(e.target.value as string);
                    }
                  }}
                >
                  <MenuItem value="create">+ Crear nuevo propietario</MenuItem>
                  {propietarios.map((propietario) => (
                    <MenuItem key={propietario.idPropietario} value={propietario.idPropietario}>
                      {propietario.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Modal para Crear Nuevo Propietario */}
            <Dialog open={isCreatingPropietario} onClose={handleCancelCreatePropietario}>
              <DialogTitle>Crear Nuevo Propietario</DialogTitle>
              <DialogContent>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={newPropietarioNombre}
                  onChange={(e) => setNewPropietarioNombre(e.target.value)}
                  required
                />
                <TextField
                  label="Teléfono"
                  fullWidth
                  value={newPropietarioTelefono}
                  onChange={(e) => setNewPropietarioTelefono(e.target.value)}
                  required
                />
                <TextField
                  label="Correo"
                  fullWidth
                  value={newPropietarioCorreo}
                  onChange={(e) => setNewPropietarioCorreo(e.target.value)}
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelCreatePropietario}>Cancelar</Button>
                <Button onClick={handleSubmitNewPropietario} color="primary">Guardar</Button>
              </DialogActions>
            </Dialog>

            {/* Select para Categoría */}
            <Grid item xs={12}>
              <FormControl fullWidth required disabled={isCreatingPropietario || isCreatingCategoria}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={idCategoria}
                  onChange={(e) => {
                    if (e.target.value === 'create') {
                      handleCreateCategoria();
                    } else {
                      setIdCategoria(e.target.value as string);
                    }
                  }}
                >
                  <MenuItem value="create">+ Crear nueva categoría</MenuItem>
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.idCategoria} value={categoria.idCategoria}>
                      {categoria.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Modal para Crear Nueva Categoría */}
            <Dialog open={isCreatingCategoria} onClose={handleCancelCreateCategoria}>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogContent>
                <TextField
                  label="Nombre de la Categoría"
                  fullWidth
                  value={newCategoriaNombre}
                  onChange={(e) => setNewCategoriaNombre(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelCreateCategoria}>Cancelar</Button>
                <Button onClick={handleSubmitNewCategoria} color="primary">Guardar</Button>
              </DialogActions>
            </Dialog>

            {/* File upload */}
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Subir Fotos ({fotos ? fotos.length : 0} archivos seleccionados)
                <input type="file" hidden multiple onChange={handleFileChange} />
              </Button>
              {filePreview.length > 0 && (
                <Grid container spacing={2} mt={2}>
                  {filePreview.map((src, index) => (
                    <Grid item xs={4} key={index}>
                      <img src={src} alt={`preview-${index}`} style={{ width: '100%' }} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Existing Photos */}
            <Grid item xs={12}>
              {existingFotos.length > 0 && (
                <Grid container spacing={2} mt={2}>
                  {existingFotos.map((foto) => (
                    <Grid item xs={4} key={foto.id} style={{ position: 'relative' }}>
                      <img src={foto.foto} alt={`existing-${foto.id}`} style={{ width: '100%' }} />
                      <IconButton
                        onClick={() => handleRemoveExistingFoto(foto.id)}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        <Delete />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>

            {/* Botón para Enviar el Formulario */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth disabled={isCreatingPropietario || isCreatingCategoria}>
                Guardar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </FormContainer>
  );
};

export default EstablecimientoForm;
