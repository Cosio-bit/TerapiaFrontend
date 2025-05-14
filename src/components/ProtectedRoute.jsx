// ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./authcontext"; // Adjust the import path as necessary

function ProtectedRoute({ children }) {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute; // <-- this line is important
