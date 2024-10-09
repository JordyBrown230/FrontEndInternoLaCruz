"use client";
import React, { useState } from 'react';
import { Box, Card, Typography, Button, Grid } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useRouter } from "next/navigation";
import { fetchData } from "./fetchDataResetPassword.js";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordVerify, setConfirmPassword] = useState('');
    const router = useRouter();

    const handleNewPasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const queryParams = new URLSearchParams(window.location.search);
        const token = queryParams.get('token');
        console.log(token)
        if (token) {

            if (newPassword === newPasswordVerify) {

                try {
                    const response = await fetchData('http://localhost:9000/sit/reset/' + token, { newPassword, newPasswordVerify });

                    if (response.status === 200) {
                        router.push('login');
                    } else {
                        console.error("Credenciales incorrectas");
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.error("Las contraseñas no coinciden");
            }
        }
    };

    return (
        <PageContainer title="Reset Password" description="Create a new password">
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
                <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
                    <Grid item xs={12} sm={12} lg={4} xl={3} display="flex" justifyContent="center" alignItems="center">
                        <Card elevation={9} sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}>
                            <Typography variant="h5" fontWeight="700" textAlign="center" mb={2}>
                             Crear una nueva contraseña
                            </Typography>
                            <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={3}>
                                Asegúrate de que tenga al menos 10 caracteres e incluya un número, una letra minúscula y una letra mayúscula.
                            </Typography>
                            <form onSubmit={handleSubmit}>
                                <Box mb={2}>
                                    <input
                                        type="password"
                                        placeholder="Nueva Contraseña"
                                        value={newPassword}
                                        onChange={handleNewPasswordChange}
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
                                <Box mb={2}>
                                    <input
                                        type="password"
                                        placeholder="Confirmar Contraseña"
                                        value={newPasswordVerify}
                                        onChange={handleConfirmPasswordChange}
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
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Finalizar
                                </Button>
                                <Button type="button" variant="text" color="secondary" fullWidth onClick={() => router.push('login')} sx={{ mt: 2 }}>
                                    Volver
                                </Button>
                            </form>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};

export default ResetPassword;
