import React, { useEffect, useState } from "react";
import { Typography, Button, Box, Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import { fetchImage } from "../utils/unsplash"; // Importa la función desde utils

function LandingPage() {
  const [unsplashImage, setUnsplashImage] = useState(""); // Estado para la imagen dinámica

  useEffect(() => {
    const loadImage = async () => {
      try {
        // Puedes cambiar "therapy" por otro término relevante para buscar imágenes
        const imageUrl = await fetchImage("random"); 
        setUnsplashImage(imageUrl);
      } catch (error) {
        console.error("Error fetching Unsplash image:", error);
      }
    };

    loadImage();
  }, []);

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

          {/* Imagen dinámica de Unsplash */}
          <Grid item xs={12} md={6}>
            {unsplashImage ? (
              <Box
                component="img"
                src={unsplashImage}
                alt="Terapias"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  borderRadius: "20px",
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.3)",
                }}
              />
            ) : (
              <Typography
                variant="h6"
                color="white"
                sx={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: "400",
                  textAlign: "center",
                }}
              >
                Cargando imagen...
              </Typography>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
