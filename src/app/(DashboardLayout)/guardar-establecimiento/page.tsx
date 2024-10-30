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
import { getCategorias, Categoria, createCategoria, deleteCategoria } from '@/services/categoria.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { Delete } from '@mui/icons-material';
import { message } from 'antd';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const nameRegex = /^[A-Za-zÀ-ÿñÑ\s]+$/;
const categoriaRegex = /^[A-Za-zÀ-ÿñÑ\s-]+$/;
const telefonoRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,}$/;
const correoRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

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
  const [telefono, setTelefono] = useState('');
  const [urlWaze, setUrlWaze] = useState('');
  const [urlGoogleMaps, setUrlGoogleMaps] = useState('');
  const [website, setWebsite] = useState('');
  const [errors, setErrors] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    categoriaNombre: '',
    urlWaze: '',
    urlGoogleMaps: '',
    website: '',
    telefonoEstablecimiento: ''
  });
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

  const handleDeleteCategoria = async (id: string) => {
    try {
      await deleteCategoria(id);
      await fetchCategorias();
      setCategorias((prevCategorias) =>
        prevCategorias.filter((categoria: any) => categoria.idCategoria !== id)
      );
      message.success('Categoría eliminada correctamente.');
    } catch (error) {
      message.error('Error al eliminar la categoría.');
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

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPropietarioNombre(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      nombre: nameRegex.test(value) ? '' : 'El nombre solo puede contener letras y espacios.',
    }));
  };

  const handleTelefonoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPropietarioTelefono(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      telefono: telefonoRegex.test(value) ? '' : 'Teléfono no es válido.',
    }));
  };


  const handleCorreoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPropietarioCorreo(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      correo: correoRegex.test(value) ? '' : 'Correo no es válido.',
    }));
  };

  const handleCategoriaNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewCategoriaNombre(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      categoriaNombre: categoriaRegex.test(value) ? '' : 'Categoria no es válida.',
    }));
  };

  const HasErrors = () => {
    return Object.values(errors).some((error) => error !== '');
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
        const { nombre, direccion, descripcion, propietario, categoria, fotosEstablecimiento,telefono,urlWaze,urlGoogleMaps,website } = establecimiento;
        setNombre(nombre || '');
        setDireccion(direccion || '');
        setDescripcion(descripcion || '');
        setIdPropietario(propietario?.idPropietario ? propietario.idPropietario.toString() : '');
        setIdCategoria(categoria?.idCategoria ? categoria.idCategoria.toString() : '');
        setTelefono(telefono || '');
        setUrlWaze(urlWaze || '');
        setUrlGoogleMaps(urlGoogleMaps || '');
        setWebsite(website || '');
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
      console.log(telefono)
      await createOrUpdateEstablecimiento({
        nombre,
        direccion,
        descripcion,
        telefono,
        urlWaze,
        urlGoogleMaps,
        website,
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
    setTelefono('');
    setUrlWaze('');
    setUrlGoogleMaps('');
    setWebsite('');
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
              <DialogTitle>Crear nuevo Propietario</DialogTitle>
              <DialogContent>
                <TextField
                  label="Nombre"
                  fullWidth
                  value={newPropietarioNombre}
                  onChange={handleNombreChange}
                  error={Boolean(errors.nombre)}
                  helperText={errors.nombre}
                  required
                />
                <TextField
                  label="Teléfono"
                  fullWidth
                  value={newPropietarioTelefono}
                  onChange={handleTelefonoChange}
                  error={Boolean(errors.telefono)}
                  helperText={errors.telefono}
                  required
                />
                <TextField
                  label="Correo"
                  fullWidth
                  value={newPropietarioCorreo}
                  onChange={handleCorreoChange}
                  error={Boolean(errors.correo)}
                  helperText={errors.correo}
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelCreatePropietario}>Cancelar</Button>
                <Button
                  onClick={handleSubmitNewPropietario}
                  color="primary"
                  disabled={HasErrors() || !newPropietarioNombre || !newPropietarioTelefono || !newPropietarioCorreo}  // Disabled if there are errors or fields are empty
                >
                  Guardar
                </Button>
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
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>{categoria.nombre}</Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => handleDeleteCategoria(categoria.idCategoria.toString())}
                            size="small"
                            color="error" // Coloca el icono en rojo
                          >
                            <Delete />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Modal para Crear Nueva Categoría */}
            <Dialog open={isCreatingCategoria} onClose={handleCancelCreateCategoria}>
              <DialogTitle>Crear nueva Categoría</DialogTitle>
              <DialogContent>
                <TextField
                  label="Nombre de la Categoría"
                  fullWidth
                  value={newCategoriaNombre}
                  onChange={handleCategoriaNombreChange}
                  error={Boolean(errors.categoriaNombre)}
                  helperText={errors.categoriaNombre}
                  required
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCancelCreateCategoria}>Cancelar</Button>
                <Button
                  disabled={HasErrors() || !newCategoriaNombre}
                  onClick={handleSubmitNewCategoria} color="primary">Guardar
                </Button>
              </DialogActions>
            </Dialog>

            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                fullWidth
                value={telefono}
                onChange={handleFieldChange(setTelefono, telefonoRegex, 'telefono')}
                error={Boolean(errors.telefono)}
                helperText={errors.telefono}
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
              <Button type="submit" variant="contained" color="primary" fullWidth 
              disabled={HasErrors() || !nombre || !direccion || !idPropietario || !idCategoria||isCreatingPropietario || isCreatingCategoria}
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

export default EstablecimientoForm;
