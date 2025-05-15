import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authcontext";

function ProtectedRoute({ children }) {
  const { role } = useAuth();

  // Mientras verificamos la sesión mostramos null o loader
  if (role === null) {
    return null; // O un spinner: <LoadingSpinner />
  }

  // Si no hay rol válido, redirigimos a login
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  // Si hay rol, renderizamos la ruta protegida
  return children;
}

export default ProtectedRoute;
