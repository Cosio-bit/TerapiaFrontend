import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "../api/loginApi"; // Asegúrate de que esta función esté correctamente implementada
import { useNavigate } from "react-router-dom";

// Crear el contexto
const AuthContext = createContext();

// Proveedor de contexto
export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSession() {
      try {
        const session = await getSession();
        if (session.role) {
          setRole(session.role); // Si hay role, se guarda
        } else {
          navigate("/login"); // Si no está autenticado, redirige a login
        }
      } catch (error) {
        console.error("Session check failed:", error);
        navigate("/login"); // Si ocurre un error, redirige a login
      }
    }

    // Solo hacer la verificación cuando el componente se monte
    fetchSession();
  }, [navigate]); // El hook useEffect depende de `navigate`

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children} {/* Proporcionamos el contexto a los componentes hijos */}
    </AuthContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export function useAuth() {
  return useContext(AuthContext);
}
