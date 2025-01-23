import React from "react";
import { Typography, Button, Box, Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/landing-bg.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Texto principal */}
          <Grid item xs={12} md={6}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "700",
                color: "white",
                marginBottom: "20px",
              }}
            >
              Bienvenido a Centro Terapia
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "400",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "30px",
              }}
            >
              Manejador de centro terapia para gestionar clientes, profesionales, terapias y sesiones.
            </Typography>
            <Button
              component={Link}
              to="/terapias"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "rgba(0, 123, 255, 0.9)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "50px",
                textTransform: "none",
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: "600",
                fontSize: "1.2rem",
                "&:hover": {
                  backgroundColor: "rgba(0, 123, 255, 0.7)",
                },
              }}
            >
              Ver Terapias
            </Button>
          </Grid>

          {/* Imagen o visual llamativo */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/therapy-illustration.png"
              alt="Terapias"
              sx={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "20px",
                boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
