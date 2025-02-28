import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import createCustomTheme from "./theme";
import axios from "axios";

// Importar todos los componentes
import Usuarios from "./pages/Usuarios";
import Arriendos from "./pages/Arriendos";
import Categorias from "./pages/Categorias";
import Clientes from "./pages/Clientes";
import Compras from "./pages/Compras";
import FichasSalud from "./pages/FichasSalud";
import ProductosComprados from "./pages/ProductosComprados";
import Productos from "./pages/Productos";
import Profesionales from "./pages/Profesionales";
import Salas from "./pages/Salas";
import Sesiones from "./pages/Sesiones";
import Terapias from "./pages/Terapias";
//import UsuarioRoles from "./pages/UsuarioRoles";
import Proveedores from "./pages/Proveedores";
//import CrearSesiones from "./components/CrearSesiones";
//import AgendarSesiones from "./pages/AgendarSesiones"; // Nuevo componente importado
import LandingPage from "./pages/LandingPage";
import SesionGroups from "./pages/SesionGroups";

function App() {
  const [theme, setTheme] = useState(createCustomTheme(""));

  useEffect(() => {
    const fetchUnsplashImage = async () => {
      const UNSPLASH_ACCESS_KEY = "QkjMm1DzbXbkQDPZha7IrUSE_8UYBb-JHMrMbskJgis";
      try {
        const response = await axios.get("https://api.unsplash.com/photos/random", {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          params: { query: "nature", orientation: "landscape" },
        });
        const backgroundImage = response.data.urls.full;
        setTheme(createCustomTheme(backgroundImage));
      } catch (error) {
        console.error("Error fetching Unsplash image:", error);
      }
    };
    fetchUnsplashImage();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Navbar */}
        <AppBar position="sticky" sx={{ background: "rgba(255, 255, 255, 0.9)", boxShadow: "0px 5px 15px rgba(0,0,0,0.2)" }}>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box display="flex" alignItems="center">
              <Link to="/" style={{ textDecoration: "none" }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: "700",
                    fontSize: "1.5rem",
                    color: "black",
                    cursor: "pointer",
                    "&:hover": { color: "rgba(246, 128, 32, 0.9)" },
                  }}
                >
                  Centro Terapia
                </Typography>
              </Link>
            </Box>
            <Box>
              {/* Todos los Links */}
              <Button component={Link} to="/" sx={linkStyle}>
                Inicio
              </Button>
              <Button component={Link} to="/usuarios" sx={linkStyle}>
                Usuarios
              </Button>
              <Button component={Link} to="/arriendos" sx={linkStyle}>
                Arriendos
              </Button>
              <Button component={Link} to="/categorias" sx={linkStyle}>
                Categorias
              </Button>
              <Button component={Link} to="/clientes" sx={linkStyle}>
                Clientes
              </Button>
              <Button component={Link} to="/compras" sx={linkStyle}>
                Compras
              </Button>
              <Button component={Link} to="/fichas-salud" sx={linkStyle}>
                Fichas Salud
              </Button>
              <Button component={Link} to="/productos-comprados" sx={linkStyle}>
                Productos Comprados
              </Button>
              <Button component={Link} to="/productos" sx={linkStyle}>
                Productos
              </Button>
              <Button component={Link} to="/profesionales" sx={linkStyle}>
                Profesionales
              </Button>
              <Button component={Link} to="/salas" sx={linkStyle}>
                Salas
              </Button>
              <Button component={Link} to="/sesiones" sx={linkStyle}>
                Sesiones
              </Button>
              <Button component={Link} to="/terapias" sx={linkStyle}>
                Terapias
              </Button>
              <Button component={Link} to="/proveedores" sx={linkStyle}>
                Proveedores
              </Button>
              <Button component={Link} to="/sesion-groups" sx={linkStyle}>
                Grupos de Sesiones
              </Button>
            </Box>
          </Toolbar>
        </AppBar>

        <div
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "center", // Vertically center the content
    alignItems: "center", // Horizontally center the content
    height: "100vh", // Use full viewport height
    width: "100vw", // Use full viewport width
    padding: "2rem",
    background: "transparent", // Keep it transparent
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "1200px", // Optional: Limit max width for better readability
      padding: "20px",
      background: "rgba(255, 255, 255, 0.8)", // Slight opacity for contrast
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      flexGrow: 1, // Ensures the inner container expands to fill the space
    }}
  >
    {/* Content and Routes */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/arriendos" element={<Arriendos />} />
      <Route path="/categorias" element={<Categorias />} />
      <Route path="/clientes" element={<Clientes />} />
      <Route path="/compras" element={<Compras />} />
      <Route path="/fichas-salud" element={<FichasSalud />} />
      <Route path="/productos-comprados" element={<ProductosComprados />} />
      <Route path="/productos" element={<Productos />} />
      <Route path="/profesionales" element={<Profesionales />} />
      <Route path="/salas" element={<Salas />} />
      <Route path="/sesiones" element={<Sesiones />} />
      <Route path="/terapias" element={<Terapias />} />
      <Route path="/proveedores" element={<Proveedores />} />
      <Route path="/sesion-groups" element={<SesionGroups />} />
    </Routes>
  </div>
</div>

      </Router>
    </ThemeProvider>
  );
}

// Estilo reutilizable para los links
const linkStyle = {
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: "500",
  color: "black",
  margin: "0 10px",
  textTransform: "none",
  position: "relative",
  transition: "color 0.3s ease",
  "&:hover": {
    color: "rgba(255, 98, 0, 0.9)",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-5px",
      left: 0,
      width: "100%",
      height: "3px",
      background: "rgba(220, 105, 33, 0.9)",
      borderRadius: "5px",
    },
  },
};

export default App;
