"use client";
import React, { useState } from 'react';
import { Grid, Box, Card, Typography, Button } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { fetchData } from "./fetchDataEmail.js";
import { useRouter } from "next/navigation"; 


const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleEmailChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      const response = await fetchData('http://localhost:9000/sit/send-email', {email});

      if (response.status === 200) { 
        console.log(response.message);

      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  
  return (
    <PageContainer title="Forgot Password" description="Reset your password">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Typography
                variant="h5"
                fontWeight="700"
                textAlign="center"
                mb={2}
              >
                ¿Olvidaste tu contraseña?
              </Typography>
              <Typography
                variant="subtitle1"
                textAlign="center"
                color="textSecondary"
                mb={3}
              >
                Ingresa tu dirección de correo electrónico para restablecer tu contraseña
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box mb={2}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '5px',
                      border: '1px solid #d0dbe7',
                      outline: 'none',
                    }}
                  />
                </Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Continuar
                </Button>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default ForgotPassword;
