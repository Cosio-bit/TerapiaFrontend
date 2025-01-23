import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import createCustomTheme from "./theme";
import axios from "axios";

// Importar todos los componentes
import Usuarios from "./pages/Usuarios";
import Arriendos from "./components/Arriendos";
import Categorias from "./components/Categorias";
import Clientes from "./components/Clientes";
import Compras from "./components/Compras";
import FichasSalud from "./components/FichasSalud";
import ProductosComprados from "./components/ProductosComprados";
import Productos from "./components/Productos";
import Profesionales from "./components/Profesionales";
import Salas from "./components/Salas";
import Sesiones from "./components/Sesiones";
import Terapias from "./components/Terapias";
import UsuarioRoles from "./pages/UsuarioRoles";
import Proveedores from "./components/Proveedores";
import CrearSesiones from "./components/CrearSesiones";
import LandingPage from "./components/LandingPage";

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
                    "&:hover": { color: "rgba(0, 123, 255, 0.9)" },
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
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minHeight: "100vh",
            padding: "2rem",
            background: theme.palette.background.default,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "1200px",
              padding: "20px",
              background: "rgba(255, 255, 255, 0.8)",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            {/* Todas las rutas */}
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
              <Route path="/usuario-roles" element={<UsuarioRoles />} />
              <Route path="/crearSesiones/:clienteId" element={<CrearSesiones />} />
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
    color: "rgba(0, 123, 255, 0.9)",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-5px",
      left: 0,
      width: "100%",
      height: "3px",
      background: "rgba(0, 123, 255, 0.9)",
      borderRadius: "5px",
    },
  },
};

export default App;
