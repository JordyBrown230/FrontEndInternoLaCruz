"use client";
import { Grid, Box, Card } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";

interface Login2Props {
  setIsLoggedIn: (value: boolean) => void; // Asegúrate de aceptar setIsLoggedIn como prop
}

function Login2({ setIsLoggedIn }: Login2Props) {
  return (
    <PageContainer title="SIT" description="this is Login page">
      <Box className="container">
        <Grid container spacing={0} justifyContent="center" sx={{ height: "100vh" }}>
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
              sx={{
                p: 4,
                zIndex: 1,
                backgroundColor: "#ffffffd6",
                width: "100%",
                maxWidth: "500px",
              }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              {/* Asegúrate de pasar setIsLoggedIn a AuthLogin */}
              <AuthLogin setIsLoggedIn={setIsLoggedIn} />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Login2;
