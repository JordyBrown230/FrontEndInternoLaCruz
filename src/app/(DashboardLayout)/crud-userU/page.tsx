'use client';
import { Typography, Grid, CardContent, TextField, Button, Box, Checkbox, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, SxProps } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  cedula: string;
  username: string;
  email: string;
  password: string;
  Person: {
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
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error('Error fetching attractions:', error);
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState<User[]>([]);
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
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState(false); // Formulario emergente
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Diálogo de confirmación

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchAttractions();
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
        first_name: formData.Person.first_name,
        last_name: formData.Person.last_name,
        cedula: formData.Person.cedula
      }
    };

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
          setUsers(users.map((u) => (u.user_id === user.user_id ? user : u)));
          setIsEditing(false);
        } else {
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
        setSelectedUserId(null);
        fetchAttractions();
      } else {
        console.error('Error creating or updating user');
      }
      setOpenFormDialog(false); // Cerrar el formulario emergente después de guardar
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
        setOpenFormDialog(true); // Abrir formulario emergente para editar
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
          setSelectedUserId(null);
          setOpenConfirmDialog(false);
        } else {
          console.error('Error deleting user');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleDeleteClick = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedUserId(id === selectedUserId ? null : id);
  };

  return (
    <PageContainer title="CRUD Usuarios" description="Una vista con un CRUD de usuarios">
      <Box textAlign="center" mb={4}>
                        <Typography variant="h2" gutterBottom data-aos="fade-down">Gestión de Usuarios</Typography>
                        <Typography variant="h6" color="text.secondary" data-aos="fade-down">Administra los usuarios que entran al Sistema SIT.</Typography>           
      </Box>
      <Grid container spacing={3}>
        {/* Botones de acción */}
        <Grid item xs={12} sx={{ textAlign: 'center', mb: 4 }} data-aos="fade-up">
          <Button
            variant="contained"
            color="primary"
            onClick={() => { setOpenFormDialog(true); setIsEditing(false); }}
          >
            Crear Nuevo Usuario
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleEdit}
            disabled={selectedUserId === null}
            sx={{ mx: 2 }}
          >
            Actualizar Usuario
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteClick}
            disabled={selectedUserId === null}
          >
            Eliminar Usuario
          </Button>
        </Grid>

        {/* Listado de usuarios existentes */}
        <Grid item xs={12} data-aos="fade-up">
          <Typography variant="h6" component="div" mb={2} color="primary">
            Usuarios Registrados
          </Typography>
          <Grid container spacing={3}>
            {users.length > 0 ? (
              users.map((user) => {
                const person = user.Person || {};
                return (
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
                          label={`${person.first_name || 'N/A'} ${person.last_name || 'N/A'}`}
                        />
                        <Typography variant="body2" color="text.secondary">
                          Cédula: {person.cedula || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Usuario: {user.username || 'N/A'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {user.email || 'N/A'}
                        </Typography>
                      </CardContent>
                    </DashboardCard>
                  </Grid>
                );
              })
            ) : (
              <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                No hay usuarios registrados.
              </Typography>
            )}
          </Grid>
        </Grid>

        {/* Formulario emergente para crear/editar usuario */}
        <Dialog open={openFormDialog} onClose={() => setOpenFormDialog(false)}>
          <DialogTitle>{isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</DialogTitle>
          <DialogContent>
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
                    disabled={isEditing}
                    required={!isEditing}
                  />
                </Grid>
              </Grid>
            </form>
          </DialogContent>
          <form onSubmit={handleSubmit}>
            {/* Resto del formulario */}
            <DialogActions>
              <Button onClick={() => setOpenFormDialog(false)} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                {isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </DialogActions>
          </form>

        </Dialog>

        {/* Diálogo de confirmación */}
        <Dialog open={openConfirmDialog} onClose={handleCloseDialog}>
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
      </Grid>
    </PageContainer>
  );
};

export default Municipalidad;
