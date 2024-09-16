import React, { useState } from "react";
import { fetchData } from "../fetchDataLogin.js";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const data = {
      username: username,
      password: password,
    };
    try {
      const response = fetchData('http://localhost:9000/sit/login', data);
      console.log(response);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Stack>
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            component="label"
            htmlFor="username"
            mb="5px"
          >
            Nombre de Usuario:
          </Typography>
          <CustomTextField
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsername(e.target.value)}  // Actualiza el estado al cambiar el valor
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
          <CustomTextField
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}  // Actualiza el estado al cambiar el valor
          />
        </Box>
      </Stack>
      <Box mt="25px">
        <Button
          className="btn"
          onClick={handleLogin}  // Llama a la función handleLogin al hacer clic en el botón
        >
          Iniciar Sesión
        </Button>
      </Box>
      {subtitle}
    </>
  );
};

export default AuthLogin;
