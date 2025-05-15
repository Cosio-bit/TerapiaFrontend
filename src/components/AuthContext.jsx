import React, { createContext, useContext, useState, useEffect } from "react";
import { getSession } from "../api/loginApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    async function fetchSession() {
      try {
        const session = await getSession();
        if (isMounted) {
          if (session.role && typeof session.role === 'string' && session.role.trim() !== '') {
            setRole(session.role);
          } else {
            navigate("/login");
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Session check failed:", error);
          navigate("/login");
        }
      }
    }
    fetchSession();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
