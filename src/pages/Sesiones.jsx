import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import { getAllSesiones, createSesion, updateSesion, deleteSesion } from "../api/sesionApi";
import { getAllProfesionales } from "../api/profesionalApi";
import SesionesTable from "../components/SesionesTable";
import SesionFormDialog from "../components/SesionFormDialog";

const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [currentSesion, setCurrentSesion] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sesionesData, profesionalesData] = await Promise.all([
          getAllSesiones(),
          getAllProfesionales(),
        ]);
  
        setSesiones(Array.isArray(sesionesData) ? sesionesData : []); // Ensure it's an array
        setProfesionales(Array.isArray(profesionalesData) ? profesionalesData : []);
      } catch {
        setSnackbar({ open: true, message: "Error al cargar los datos.", severity: "error" });
      }
    };
  
    fetchData();
  }, []);
  

  const handleSaveSesion = async (sesion) => {
    try {
      if (editing) {
        await updateSesion(currentSesion.id_sesion, sesion);
      } else {
        await createSesion(sesion);
      }
      setSesiones(await getAllSesiones());
      setOpenDialog(false);
      setSnackbar({ open: true, message: editing ? "Sesión actualizada" : "Sesión creada", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al guardar la sesión.", severity: "error" });
    }
  };

  const handleEditSesion = (sesion) => {
    setEditing(true);
    setCurrentSesion(sesion);
    setOpenDialog(true);
  };

  const handleDeleteSesion = async (id) => {
    await deleteSesion(id);
    setSesiones(await getAllSesiones());
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Gestión de Sesiones</Typography>
      {/*<Button variant="contained" color="primary" onClick={() => { setEditing(false); setCurrentSesion(null); setOpenDialog(true); }}>
        Crear Sesión
      </Button>*/}
      <SesionesTable sesiones={sesiones} onEdit={handleEditSesion} onDelete={handleDeleteSesion} />
      <SesionFormDialog open={openDialog} onClose={() => setOpenDialog(false)} onSave={handleSaveSesion} sesion={currentSesion} profesionales={profesionales} editing={editing} />
    </Box>
  );
};
export default Sesiones;
