'use client';
import { useState, useEffect, useRef } from 'react';
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
import { getPropietarios, createPropietario, Owner } from '@/services/propietario.service';
import { getCategorias, Category, createCategoria, deleteCategoria } from '@/services/categoria.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { CameraAlt, Delete } from '@mui/icons-material';
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
  const [propietarios, setPropietarios] = useState<Owner[]>([]);
  const [categorias, setCategorias] = useState<Category[]>([]);
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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [fotosParaEliminar, setFotosParaEliminar] = useState<number[]>([]);
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
      console.error('Error al cargar propietarios:', error);
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

  const handleRemoveNewFoto = (index: number) => {
    setFotos((prevFotos) => prevFotos.filter((_, i) => i !== index));
    setFilePreview((prevPreviews) => prevPreviews.filter((_, i) => i !== index));

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

    // Calcula el total de fotos nuevas y existentes
    const totalFiles = [...existingFotos, ...fotos, ...newFiles];
    if (totalFiles.length > 5) {
      message.error("Solo puedes subir hasta 5 fotos en total.");
      return;
    }

    setFotos((prevFotos) => [...prevFotos, ...newFiles]);
    setFilePreview((prevPreviews) => [...prevPreviews, ...newFiles.map((file) => URL.createObjectURL(file))]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveExistingFoto = (id: number) => {
    setExistingFotos((prev) => prev.filter((foto) => foto.id !== id));
    setFotosParaEliminar((prev) => [...prev, id]); // Agrega el ID de la foto a eliminar
  };

  const handleSubmitNewPropietario = async () => {
    if (!newPropietarioNombre || !newPropietarioTelefono || !newPropietarioCorreo) {
      message.error('Por favor, completa todos los campos del nuevo propietario.');
      return;
    }

    try {
      const newPropietario = await createPropietario({
        name: newPropietarioNombre,
        phoneNumber: newPropietarioTelefono,
        email: newPropietarioCorreo,
      });
      setPropietarios((prev) => [...prev, newPropietario]);
      setIdPropietario(newPropietario.ownerId.toString());
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
      const newCategoria = await createCategoria({ name: newCategoriaNombre });
      setCategorias((prev) => [...prev, newCategoria]);
      setIdCategoria(newCategoria.categoryId.toString());

      message.success('Categoría creada correctamente.');
      handleCancelCreateCategoria();
    } catch (error) {
      message.error('Error al crear la categoría.');
    }
  };

  const loadEstablecimientoData = async (id: string) => {
    try {
      const response = await getEstablecimientos();
      const establecimiento = response.find((est) => est.establishmentId === parseInt(id));
      if (establecimiento) {
        const { name, address, description, owner, category, Images, phoneNumber, wazeUrl, googleMapsUrl, website } = establecimiento;
        setNombre(name || '');
        setDireccion(address || '');
        setDescripcion(description || '');
        setIdPropietario(owner?.ownerId ? owner.ownerId.toString() : '');
        setIdCategoria(category?.categoryId ? category.categoryId.toString() : '');
        setTelefono(phoneNumber || '');
        setUrlWaze(wazeUrl || '');
        setUrlGoogleMaps(googleMapsUrl || '');
        setWebsite(website || '');
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
        name: nombre,
        address: direccion,
        description: descripcion,
        phoneNumber: telefono,
        wazeUrl: urlWaze,
        googleMapsUrl: urlGoogleMaps,
        website,
        ownerId: parseInt(idPropietario, 10),
        categoryId: parseInt(idCategoria, 10),
        establishmentId: establecimientoId ? parseInt(establecimientoId, 10) : undefined,
        files: fotos, // Pasa los archivos seleccionados
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
                  {Array.isArray(propietarios) && propietarios.map((propietario) => (
                    <MenuItem key={propietario.ownerId} value={propietario.ownerId}>
                      {propietario.name}
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
                    <MenuItem key={categoria.categoryId} value={categoria.categoryId}>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item>{categoria.name}</Grid>
                        <Grid item>
                          <IconButton
                            onClick={() => handleDeleteCategoria(categoria.categoryId.toString())}
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

            {/* Botón para Enviar el Formulario */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" fullWidth
                disabled={HasErrors() || !nombre || !direccion || !idPropietario || !idCategoria || isCreatingPropietario || isCreatingCategoria}
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
