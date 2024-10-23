import React, { useState } from "react";
import Cookies from "js-cookie";
import "../login/Login.css";
import { fetchData } from "./fetchDataLogin.js";
import { Box, Typography, Stack, Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
  setIsLoggedIn: (value: boolean) => void; // Agrega esta prop
}

const AuthLogin = ({ title, subtitle, subtext, setIsLoggedIn }: loginType) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await fetchData('http://localhost:9000/sit/login', data);

      console.log('Respuesta completa del servidor:', response);

      if (response.status === 200) {
        const token = response?.token; // Token está en response.token
        if (token) {
          Cookies.set('authToken', token, { expires: 7 }); // Guarda el token en una cookie
          setIsLoggedIn(true); // Actualiza el estado de autenticación en el layout principal
          router.push('/'); // Redirige a la página principal
        } else {
          console.error("Token no encontrado en la respuesta");
        }
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleForgotPassword = () => {
    window.location.href = 'authEmail';
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}
      {subtext}
      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="8px"
          >
            Nombre de Usuario:
          </Typography>
          <br />
          <br />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
          />
        </Box>
        <Box mt="25px">
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="password"
            mb="5px"
          >
            Contraseña:
          </Typography>
          <br />
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            type="password"
          />
        </Box>
      </Stack>
      <Box>
        <Button className="btn" onClick={handleLogin}>
          Iniciar Sesión
        </Button>
      </Box>
      <Box mt="15px">
        <Button type="button" variant="text" color="primary" onClick={handleForgotPassword}>
          ¿Olvidó su contraseña?
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
