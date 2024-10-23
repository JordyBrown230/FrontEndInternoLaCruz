"use client"; // Asegúrate de agregar esta línea

import { styled, Container, Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import Login2 from "../authentication/login/page";
import Cookies from "js-cookie";

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

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      // Realiza la solicitud de cierre de sesión a tu API
      const response = await fetch('http://localhost:9000/sit/cerrar-sesion', {
        method: 'POST', // Cambia esto si tu API utiliza otro método
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          // Agrega el token de autenticación si es necesario
          'Authorization': `Bearer ${Cookies.get("authToken")}` // Opcional, según tu implementación
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }
  
      // Si la respuesta es exitosa, elimina el token de las cookies y actualiza el estado
      Cookies.remove("authToken");
      setIsLoggedIn(false);
  
      // Aquí puedes redirigir al usuario a la página de inicio o mostrar un mensaje de éxito
      console.log('Sesión cerrada con éxito');
    } catch (error) {
      console.error('Error en el cierre de sesión:', error);
      // Manejo de errores: puedes mostrar un mensaje al usuario si lo deseas
    }
  };

  if (!isLoggedIn) {
    return <Login2 setIsLoggedIn={setIsLoggedIn} />;
  }

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <PageWrapper className="page-wrapper">
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            {children}
            <Button variant="contained" color="secondary" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
