'use client';
import { Typography, Grid, CardContent, TextField, Button, Box, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { first } from 'lodash';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  cedula: string;
  username: string;
  email: string;
  password: string;
  Person:{
    person_id: number;
    first_name: string,
    last_name: string,
    cedula: string,
  };
}

const Municipalidad: React.FC = () => {
  const fetchAttractions = async () => {
    try {
      const response = await fetch('http://localhost:9000/sit/admin/listar', {
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
      setUsers(data)
     // setFormData(data)
    } catch (error) {
      console.error('Error fetching attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState<User[]>([

  ]);

  const [formData, setFormData] = useState<User>({
    user_id: 0,
    first_name: '',
    last_name: '',
    cedula: '',
    username: '',
    email: '',
    password: '',
    Person: {
      person_id: 0,
      first_name: '',
      last_name: '',
      cedula: '',
    }
  });
  const [loading, setLoading] = useState(true); 
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // Para seleccionar un solo usuario
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Estado para el diálogo de confirmación

  useEffect(() => {
    AOS.init();

    fetchAttractions()
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name in formData.Person) {
      setFormData((prevData) => ({
        ...prevData,
        Person: {
          ...prevData.Person,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const _user = {
      user_id: formData.user_id,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      person: {
        first_name: formData.first_name,
        last_name: formData.last_name,
        cedula: formData.cedula
      }
    }
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing
        ? `http://localhost:9000/sit/admin/actualizar/${_user.user_id}`
        : 'http://localhost:9000/sit/register';
      const response = await fetch(url, {
        method: method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(_user),
      });

      if (response.ok) {
        const user = await response.json();

        if (isEditing) {
          // Update user in the list
          setUsers(users.map((u) => (u.user_id === user.user_id ? user : u)));
          setIsEditing(false);
        } else {
          // Add new user to the list
          setUsers([...users, user]);
        }

        setFormData({
          user_id: 0,
          first_name: '',
          last_name: '',
          cedula: '',
          username: '',
          email: '',
          password: '',
          Person: {
            person_id: 0,
            first_name: '',
            last_name: '',
            cedula: '',
          }
        });
        setSelectedUserId(null); // Limpiar selección
      } else {
        console.error('Error creating or updating user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = () => {
    if (selectedUserId !== null) {
      const user = users.find((u) => u.user_id === selectedUserId);
      if (user) {
        setFormData(user);
        setIsEditing(true);
      }
    }
  };

  const handleDelete = async () => {
    if (selectedUserId !== null) {
      try {
        const response = await fetch(`http://localhost:9000/sit/admin/eliminar/${selectedUserId}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (response.ok) {
          setUsers(users.filter((user) => user.user_id !== selectedUserId));
          setSelectedUserId(null); // Limpiar selección después de borrar
          setOpenConfirmDialog(false); // Cerrar el diálogo de confirmación
        } else {
          console.error('Error deleting user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true); // Abrir el diálogo de confirmación
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false); // Cerrar el diálogo sin eliminar
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedUserId(id === selectedUserId ? null : id);
  };

  return (
    <PageContainer title="CRUD Usuarios" description="Una vista con un CRUD de usuarios">
      <Grid container spacing={3}>
        {/* Formulario para crear o editar usuario */}
        <Grid item xs={12}>
          <Box>
            <Typography variant="h4" gutterBottom align="center">
              Gestión de Usuarios
            </Typography>
            <Typography variant="h6" component="div" mb={2}>
              {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    fullWidth
                    name="first_name"
                    value={formData.Person.first_name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Apellido"
                    variant="outlined"
                    fullWidth
                    name="last_name"
                    value={formData.Person.last_name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Cédula"
                    variant="outlined"
                    fullWidth
                    name="cedula"
                    value={formData.Person.cedula}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Usuario"
                    variant="outlined"
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    type="email"
                    variant="outlined"
                    fullWidth
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Contraseña"
                    type="password"
                    variant="outlined"
                    fullWidth
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    {isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
                  </Button>
                </Grid>
              </Grid>
              <br></br>
              <br></br>
            </form>
            {/* Listado de usuarios existentes */}
            <Grid item xs={12}>
              <br></br>
              <br></br>
              <Typography variant="h6" component="div" mb={2}>
                Usuarios Registrados
              </Typography>
              {/* Botones de Acción */}
              <Grid item xs={12} sx={{ mt: 4, textAlign: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEdit}
                  disabled={selectedUserId === null}
                  sx={{ mr: 2 }}
                >
                  Actualizar
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleDeleteClick} // Cambiado para abrir el diálogo
                  disabled={selectedUserId === null}
                >
                  Eliminar
                </Button>
                <br></br>
                <br></br>
              </Grid>
              <Grid container spacing={3}>
                {users.length > 0 ? (
                  users.map((user) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={user.user_id}>
                      <DashboardCard>
                        <CardContent>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={selectedUserId === user.user_id}
                                onChange={() => handleCheckboxChange(user.user_id)}
                              />
                            }
                            label={`${user.Person.first_name} ${user.Person.last_name}`}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Cédula: {user.Person.cedula}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Usuario: {user.username}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Email: {user.email}
                          </Typography>
                        </CardContent>
                      </DashboardCard>
                    </Grid>
                  ))
                ) : (
                  <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                    No hay usuarios registrados.
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>

      {/* Diálogo de confirmación */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Municipalidad;
