import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, getSession } from "../api/loginApi"
import { useAuth } from "../components/authcontext"
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material"
import loginBackground from "../assets/landing-bg.jpg" // imagen fija local

function LoginPage() {
  const { setRole } = useAuth()
  const [nombre, setNombre] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(nombre, password)
      const session = await getSession()
      if (session.role && typeof session.role === "string" && session.role.trim() !== "") {
        setRole(session.role)
        navigate("/")
      } else {
        setError("Nombre o contraseña incorrecta.")
      }
    } catch (err) {
      setError(err.response?.data || "Nombre o contraseña incorrecta.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url(${loginBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          width: "100%",
          maxWidth: 400,
          borderRadius: 3,
        }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          textAlign="center"
          sx={{ color: "#2E3A59" }}
        >
          Iniciar Sesión
        </Typography>

        <TextField
          label="Nombre de Rol"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          fullWidth
          margin="normal"
          required
          autoFocus
        />

        <TextField
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 2, py: 1.5 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Entrar"}
        </Button>

        {error && (
          <Typography
            variant="body2"
            color="error"
            textAlign="center"
            mt={2}
            aria-live="assertive"
          >
            {error}
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default LoginPage
