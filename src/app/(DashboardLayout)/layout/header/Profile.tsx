import React, { useState, MouseEvent } from 'react';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  List,
  ListItem,
  DialogActions,
  TextField,
} from '@mui/material';
import { IconMail, IconUser } from '@tabler/icons-react';

const Perfil = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [abrirDialogoPerfil, setAbrirDialogoPerfil] = useState(false);
  const [abrirDialogoCuenta, setAbrirDialogoCuenta] = useState(false);
  const [editarPerfil, setEditarPerfil] = useState(false);
  const [nombre, setNombre] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAbrirDialogoPerfil = () => {
    setAbrirDialogoPerfil(true);
    handleClose();
  };

  const handleAbrirDialogoCuenta = () => {
    setAbrirDialogoCuenta(true);
    handleClose();
  };

  const handleCerrarDialogos = () => {
    setAbrirDialogoPerfil(false);
    setAbrirDialogoCuenta(false);
    setEditarPerfil(false);
  };

  const handleEditarPerfil = () => {
    setEditarPerfil(true);
  };

  const handleGuardarCambios = () => {
    // Aquí puedes manejar la lógica para guardar los cambios
    console.log('Cambios guardados:', { nombre, email });
    setEditarPerfil(false); // Cerrar el formulario de edición
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="abrir menú de perfil"
        color="inherit"
        aria-controls="menu-perfil"
        aria-haspopup="true"
        sx={{
          ...(anchorEl && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick}
      >
        <Avatar
          src="/images/profile/foto.png"
          alt="Avatar de usuario"
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>

      {/* Menú desplegable */}
      <Menu
        id="menu-perfil"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem onClick={handleAbrirDialogoPerfil}>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>Mi Perfil</ListItemText>
        </MenuItem>
       {/* <MenuItem onClick={handleAbrirDialogoCuenta}>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>Mi Cuenta</ListItemText>
        </MenuItem>
        */}
        
      </Menu>

      {/* Diálogo de Perfil */}
      <Dialog open={abrirDialogoPerfil} onClose={handleCerrarDialogos} maxWidth="sm" fullWidth>
        <DialogTitle>Mi Perfil</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 3,
            }}
          >
            <Avatar
              src="/images/profile/foto.png"
              alt="Avatar de usuario"
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            {!editarPerfil ? (
              <>
                <Typography variant="h6">{nombre}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {email}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={handleEditarPerfil}
                >
                  Editar Perfil
                </Button>
              </>
            ) : (
              <Box
                component="form"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                }}
              >
                <TextField
                  label="Nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  margin="normal"
                  fullWidth
                />
                <TextField
                  label="Correo Electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3 }}
                  onClick={handleGuardarCambios}
                >
                  Guardar Cambios
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialogos} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Cuenta */}
      <Dialog open={abrirDialogoCuenta} onClose={handleCerrarDialogos} maxWidth="sm" fullWidth>
        <DialogTitle>Mi Cuenta</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Configuración de la Cuenta
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Cambiar Contraseña" />
              <Button variant="outlined" color="primary">Actualizar</Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Configuración de Seguridad" />
              <Button variant="outlined" color="primary">Configurar</Button>
            </ListItem>
            <ListItem>
              <ListItemText primary="Detalles de Facturación" />
              <Button variant="outlined" color="primary">Ver</Button>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialogos} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Perfil;
