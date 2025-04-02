import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import axios from "axios"

import createCustomTheme from "./theme"
import Sidebar from "./components/Sidebar"
import Navbar from "./components/Navbar"

// Page components
import Usuarios from "./pages/Usuarios"
import Arriendos from "./pages/Arriendos"
import Categorias from "./pages/Categorias"
import Clientes from "./pages/Clientes"
import Compras from "./pages/Compras"
import FichasSalud from "./pages/FichasSalud"
import ProductosComprados from "./pages/ProductosComprados"
import Productos from "./pages/Productos"
import Profesionales from "./pages/Profesionales"
import Salas from "./pages/Salas"
import Sesiones from "./pages/Sesiones"
import Terapias from "./pages/Terapias"
import Gastos from "./pages/Gastos"
import Resumen from "./pages/Resumen"
import Proveedores from "./pages/Proveedores"
import LandingPage from "./pages/LandingPage"
import SesionGroups from "./pages/SesionGroups"
import ManageCliente from "./pages/ManageCliente"

function App() {
  const [theme, setTheme] = useState(createCustomTheme(""))
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen')
    return saved ? JSON.parse(saved) : window.innerWidth >= 768
  })

  useEffect(() => {
    const fetchUnsplashImage = async () => {
      const UNSPLASH_ACCESS_KEY = "QkjMm1DzbXbkQDPZha7IrUSE_8UYBb-JHMrMbskJgis"
      try {
        const response = await axios.get("https://api.unsplash.com/photos/random", {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
          params: { query: "nature", orientation: "landscape" },
        })
        const backgroundImage = response.data.urls.full
        setTheme(createCustomTheme(backgroundImage))
      } catch (error) {
        console.error("Error fetching Unsplash image:", error)
      }
    }
    fetchUnsplashImage()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

        <main
          style={{
            flex: 1,
            marginTop: '2.6rem',
            marginLeft: isSidebarOpen ? '260px' : '0px',
            padding: '2rem',
            transition: 'margin 0.3s ease',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            minHeight: 'calc(100vh - 2.6rem)',
            boxSizing: 'border-box',
            overflowX: 'hidden'
          }}
        >
          <div
            style={{
              width: '100%',
              padding: '20px',
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: '10px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              flex: 1,
            }}
          >
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
              <Route path="/gastos" element={<Gastos />} />
              <Route path="/resumen" element={<Resumen />} />
              <Route path="/manage-cliente" element={<ManageCliente />} />
            </Routes>
          </div>
        </main>
      </Router>
    </ThemeProvider>
  )
}

export default App