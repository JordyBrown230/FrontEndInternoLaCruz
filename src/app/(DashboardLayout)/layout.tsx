"use client"; // Asegúrate de agregar esta línea

import { styled, Container, Box, AppBar, Toolbar, Stack, IconButton, Badge, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import Login2 from "../authentication/login/page";
import Cookies from "js-cookie";
import { IconBellRinging, IconMenu } from '@tabler/icons-react';
import Profile from '@/app/(DashboardLayout)/layout/header/Profile'; // Importa tu componente de perfil

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

// Estilos personalizados para el AppBar (Header)
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  minHeight: '70px', // Applied globally for clarity
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
}));

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:9000/sit/session/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }
      
      Cookies.remove("authToken");
      setIsLoggedIn(false);
      console.log('Sesión cerrada con éxito');
    } catch (error) {
      console.error('Error en el cierre de sesión:', error);
    }
  };

  if (!isLoggedIn) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100%', // Usar el 100% del ancho de la ventana
          height: '100%', // Asegurar que ocupe todo el alto de la ventana
          overflow: 'hidden', // Evitar el desplazamiento
          margin: 0, // Eliminar márgenes por defecto
          padding: 0, // Eliminar rellenos por defecto
        }}
      >
        <Login2 setIsLoggedIn={setIsLoggedIn} />
      </Box>
    );
  }
  
  return (
    <MainWrapper>
      {/* Sidebar (Menú lateral) */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />

      {/* Contenedor principal */}
      <PageWrapper>
        {/* Header */}
        <AppBarStyled position="sticky" color="default">
          <ToolbarStyled>
            <IconButton
              color="inherit"
              aria-label="open sidebar"
              onClick={() => setMobileSidebarOpen(true)}
              sx={{
                display: { lg: 'none', xs: 'inline' },
              }}
            >
              <IconMenu width={20} height={20} />
            </IconButton>

            <Box flexGrow={1} />

            <IconButton size="large" aria-label="show notifications" color="inherit">
              <Badge variant="dot" color="primary">
                <IconBellRinging size={21} stroke={1.5} />
              </Badge>
            </IconButton>

            <Stack spacing={1} direction="row" alignItems="center">
              <Profile />
              <Button 
                variant="outlined" 
                color="primary" 
                onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </Stack>
          </ToolbarStyled>
        </AppBarStyled>

        {/* Contenido de la página */}
        <Container
          sx={{
            paddingTop: "5px",
            maxWidth: "1200px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            {children}
          </Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
