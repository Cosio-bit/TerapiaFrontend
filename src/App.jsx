import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout'
import { AuthProvider } from './components/authcontext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import { QueryProvider } from './providers/QueryProvider';

// Páginas
import Usuarios from './pages/Usuarios'
import Arriendos from './pages/Arriendos'
import Categorias from './pages/Categorias'
import Clientes from './pages/Clientes'
import Compras from './pages/Compras'
import FichasSalud from './pages/FichasSalud'
import ProductosComprados from './pages/ProductosComprados'
import Productos from './pages/Productos'
import Profesionales from './pages/Profesionales'
import Salas from './pages/Salas'
import Sesiones from './pages/Sesiones'
import Terapias from './pages/Terapias'
import Gastos from './pages/Gastos'
import Resumen from './pages/Resumen'
import Proveedores from './pages/Proveedores'
import LandingPage from './pages/LandingPage'
import SesionGroups from './pages/SesionGroups'
import ManageCliente from './pages/ManageCliente'

const App = () => (
  <QueryProvider>
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
          <Route path="usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
          <Route path="arriendos" element={<ProtectedRoute><Arriendos /></ProtectedRoute>} />
          <Route path="categorias" element={<ProtectedRoute><Categorias /></ProtectedRoute>} />
          <Route path="clientes" element={<ProtectedRoute><Clientes /></ProtectedRoute>} />
          <Route path="compras" element={<ProtectedRoute><Compras /></ProtectedRoute>} />
          <Route path="fichas-salud" element={<ProtectedRoute><FichasSalud /></ProtectedRoute>} />
          <Route path="productos-comprados" element={<ProtectedRoute><ProductosComprados /></ProtectedRoute>} />
          <Route path="productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
          <Route path="profesionales" element={<ProtectedRoute><Profesionales /></ProtectedRoute>} />
          <Route path="salas" element={<ProtectedRoute><Salas /></ProtectedRoute>} />
          <Route path="sesiones" element={<ProtectedRoute><Sesiones /></ProtectedRoute>} />
          <Route path="terapias" element={<ProtectedRoute><Terapias /></ProtectedRoute>} />
          <Route path="proveedores" element={<ProtectedRoute><Proveedores /></ProtectedRoute>} />
          <Route path="sesion-groups" element={<ProtectedRoute><SesionGroups /></ProtectedRoute>} />
          <Route path="gastos" element={<ProtectedRoute><Gastos /></ProtectedRoute>} />
          <Route path="resumen" element={<ProtectedRoute><Resumen /></ProtectedRoute>} />
          <Route path="manage-cliente" element={<ProtectedRoute><ManageCliente /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  </QueryProvider>
)

export default App
