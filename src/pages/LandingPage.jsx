import React from "react"
import { Typography, Button, Box, Container, Grid } from "@mui/material"
import { Link } from "react-router-dom"
import fondoLanding from "../assets/landing-bg.jpg" // imagen estática local

function LandingPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${fondoLanding})`,
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
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 700,
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
                fontFamily: "'Noto Sans', sans-serif",
                fontWeight: 400,
                color: "rgba(255, 255, 255, 0.85)",
                marginBottom: "30px",
              }}
            >
              Manejador de centro terapéutico para gestionar clientes, profesionales, terapias y sesiones.
            </Typography>
            <Button
              component={Link}
              to="/terapias"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px 24px",
                borderRadius: "50px",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1.1rem",
                "&:hover": {
                  backgroundColor: "#0056b3",
                },
              }}
            >
              Ver Terapias
            </Button>
          </Grid>

          {/* Imagen fija decorativa */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={fondoLanding}
              alt="Centro Terapia"
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
  )
}

export default LandingPage
