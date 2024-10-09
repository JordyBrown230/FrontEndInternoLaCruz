import React, { useState } from "react";
import "../login/Login.css"
import { fetchData } from "./fetchDataLogin.js";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
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
      if (response.status === 200) { 
        router.push('/');
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleForgotPassword = () => {
     window.location.href ='authEmail';
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
          mb="8px"
        >
          Nombre de Usuario:
        </Typography>
        <br />
        <br />
        <input value={username} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setUsername(e.target.value)} 
        className="input"/>

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
        <input value={password} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
        className="input" type="password"/>

      </Box>
      <Stack
        justifyContent="space-between"
        direction="row"
        alignItems="center"
        my={2}
      >
      </Stack>
    </Stack>
    <Box>
    <Button
          className="btn"
          onClick={handleLogin}  
        >
          Iniciar Sesión
        </Button>
    </Box>

    <Box mt="15px">
        <Button
          type="button" variant="text" color="primary" 
          onClick={handleForgotPassword}  
        >
          ¿Olvidó su contraseña?
        </Button>
      </Box>

    {subtitle}
  </>
  );
};

export default AuthLogin;
