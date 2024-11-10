"use client";
import { Grid, Box, Card } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";

interface Login2Props {
  setIsLoggedIn: (value: boolean) => void;
}

function Login2({ setIsLoggedIn }: Login2Props) {
  return (
      <Box className="container" sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden"
      }}>
        <Grid container spacing={0} justifyContent="center" sx={{ minHeight: "100vh" }}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
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
              <AuthLogin setIsLoggedIn={setIsLoggedIn} />
            </Card>
          </Grid>
        </Grid>
      </Box>
  );
}

export default Login2;
