import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/loginApi"; // Ajusta si tu path es distinto
import { getSession } from "../api/loginApi"; // Asegúrate de que esta función esté correctamente implementada

function LoginPage() {
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);  // Indicador de carga
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);  // Iniciar la carga
    setError(null);  // Limpiar cualquier error previo
    try {
      await login(nombre, password);
      // Verifica que la sesión esté activa
      const session = await getSession(); // Este paso es crucial para obtener la información de la sesión
      if (session.role) {
        navigate("/"); // Si el role está disponible, redirigir a Home o Dashboard
      } else {
        setError("Nombre o contraseña incorrecta.");
      }
    } catch (err) {
      setError("Nombre o contraseña incorrecta.");
    } finally {
      setIsLoading(false);  // Finalizar la carga
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Nombre de Rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Cargando..." : "Entrar"}  {/* Mostrar 'Cargando...' mientras se realiza el login */}
        </button>

        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
}

// Estilos en JS para no preocuparse por CSS externo
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: "url('https://source.unsplash.com/1600x900/?nature')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  form: {
    background: "rgba(255,255,255,0.9)",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    width: "300px",
  },
  title: {
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.8rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  error: {
    marginTop: "1rem",
    color: "red",
    textAlign: "center",
  },
};

export default LoginPage;
