import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { getTerapias } from "../api/terapiaApi";
import { getProfesionales } from "../api/profesionalApi";
import { createSesion } from "../api/sesionApi";

const CrearSesiones = () => {
  const { clienteId } = useParams();
  const [terapias, setTerapias] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [selectedTerapia, setSelectedTerapia] = useState("");
  const [selectedProfesional, setSelectedProfesional] = useState("");
  const [cantidadSesiones, setCantidadSesiones] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [terapiasData, profesionalesData] = await Promise.all([
          getTerapias(),
          getProfesionales(),
        ]);
        setTerapias(terapiasData);
        setProfesionales(profesionalesData);
      } catch (error) {
        setSnackbar({ open: true, message: "Error al cargar los datos.", severity: "error" });
      }
    };

    fetchData();
  }, []);

  const handleCrearSesiones = async () => {
    if (!selectedTerapia || !selectedProfesional) {
      setSnackbar({ open: true, message: "Seleccione una terapia y un profesional.", severity: "warning" });
      return;
    }

    try {
      const sesiones = Array.from({ length: cantidadSesiones }).map(() => ({
        id_cliente: clienteId,
        id_terapia: selectedTerapia,
        id_profesional: selectedProfesional,
      }));

      await Promise.all(sesiones.map((sesion) => createSesion(sesion)));
      setSnackbar({ open: true, message: "Sesiones creadas con éxito.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al crear las sesiones.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5">Crear Sesiones para Cliente {clienteId}</Typography>
      <FormControl fullWidth margin="dense">
        <InputLabel>Terapia</InputLabel>
        <Select
          value={selectedTerapia}
          onChange={(e) => {
            const terapiaId = e.target.value;
            const terapia = terapias.find((t) => t.id_terapia === terapiaId);
            setSelectedTerapia(terapiaId);
            setCantidadSesiones(terapia ? terapia.cantidad_sesiones : 0);
          }}
        >
          {terapias.map((terapia) => (
            <MenuItem key={terapia.id_terapia} value={terapia.id_terapia}>
              {terapia.nombre}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="dense">
  <InputLabel id="profesional-label">Profesional</InputLabel>
  <Select
    labelId="profesional-label"
    value={selectedProfesional || ""}
    onChange={(e) => setSelectedProfesional(e.target.value)}
  >
    {profesionales.map((profesional) => (
      <MenuItem
        key={profesional.id_profesional}
        value={profesional.id_profesional}
      >
        {profesional.especialidad} - {profesional.id_usuario}
      </MenuItem>
    ))}
  </Select>
</FormControl>


      <Typography variant="body1" mt={2}>
        Cantidad de Sesiones: {cantidadSesiones}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleCrearSesiones}
        sx={{ mt: 2 }}
      >
        Crear Sesiones
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CrearSesiones;
