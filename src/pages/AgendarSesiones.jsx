/**import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { getClientes } from "../api/clienteApi";
import { getProfesionales } from "../api/profesionalApi";
import { createSesion } from "../api/sesionApi";

const AgendarSesiones = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { terapia } = location.state; // Terapia seleccionada
  const [clientes, setClientes] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [profesionalSeleccionado, setProfesionalSeleccionado] = useState("");
  const [cantidadSesiones, setCantidadSesiones] = useState(terapia.cantidad_sesiones || 1);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesData, profesionalesData] = await Promise.all([
          getClientes(),
          getProfesionales(),
        ]);
        console.log("Clientes:", clientesData); // Agrega esto
        console.log("Profesionales:", profesionalesData); // Agrega esto
        setClientes(clientesData);
        setProfesionales(profesionalesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  

  const handleAgendarSesiones = async () => {
    try {
      const sesiones = Array.from({ length: cantidadSesiones }).map((_, index) => ({
        id_terapia: terapia.id_terapia,
        id_cliente: clienteSeleccionado,
        id_profesional: profesionalSeleccionado,
        fecha_hora: new Date().toISOString(), // Fecha de ejemplo
        estado: "Pendiente",
        precio: terapia.precio,
      }));

      await Promise.all(sesiones.map((sesion) => createSesion(sesion)));

      setSnackbar({
        open: true,
        message: "Sesiones creadas con éxito.",
        severity: "success",
      });
      navigate("/terapias");
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al crear las sesiones.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Agendar Sesiones para: {terapia.nombre}
      </Typography>

      <FormControl fullWidth margin="dense">
        <InputLabel>Cliente</InputLabel>
        <Select
          value={clienteSeleccionado}
          onChange={(e) => setClienteSeleccionado(e.target.value)}
        >
          {clientes.map((cliente) => (
            <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
              {cliente.id_cliente}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense">
        <InputLabel>Profesional</InputLabel>
        <Select
          value={profesionalSeleccionado}
          onChange={(e) => setProfesionalSeleccionado(e.target.value)}
        >
          {profesionales.map((profesional) => (
            <MenuItem key={profesional.id_profesional} value={profesional.id_profesional}>
              {profesional.id_profesional}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        margin="dense"
        label="Cantidad de Sesiones"
        type="number"
        fullWidth
        value={cantidadSesiones}
        onChange={(e) => setCantidadSesiones(e.target.value)}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAgendarSesiones}
        disabled={!clienteSeleccionado || !profesionalSeleccionado}
      >
        Agendar Sesiones
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgendarSesiones;*/
