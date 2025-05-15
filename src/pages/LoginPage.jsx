import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getSession } from "../api/loginApi";
import { useAuth } from "../components/authcontext";

function LoginPage() {
  const { setRole } = useAuth();
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(nombre, password);
      const session = await getSession();
      if (session.role && typeof session.role === "string" && session.role.trim() !== "") {
        setRole(session.role);
        navigate("/");
      } else {
        setError("Nombre o contraseña incorrecta.");
      }
    } catch (err) {
      setError(err.response?.data || "Nombre o contraseña incorrecta.");
    } finally {
      setIsLoading(false);
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
          autoFocus
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
          {isLoading ? "Cargando..." : "Entrar"}
        </button>

        {error && (
          <p style={styles.error} aria-live="assertive">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

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
