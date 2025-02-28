import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllProfesionales,
  createProfesional,
  updateProfesional,
  deleteProfesional,
} from "../api/profesionalApi";
import { getAllUsuarios } from "../api/usuarioApi"; // Import usuario fetching
import ProfesionalesTable from "../components/ProfesionalesTable";
import ProfesionalFormDialog from "../components/ProfesionalFormDialog";

const Profesionales = () => {
  const [profesionales, setProfesionales] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // State for usuarios
  const [currentProfesional, setCurrentProfesional] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchProfesionales();
    fetchUsuarios(); // Fetch usuarios
  }, []);

  const fetchProfesionales = async () => {
    try {
      const data = await getAllProfesionales();
      setProfesionales(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar los profesionales.", severity: "error" });
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await getAllUsuarios();
      setUsuarios(Array.isArray(data) ? data : []); // Ensure usuarios is an array
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar los usuarios.", severity: "error" });
    }
  };

  const handleSaveProfesional = async (profesional) => {
    console.log("Final Data to be Saved:", profesional); // Debugging log
  
    try {
      if (editing) {
        await updateProfesional(currentProfesional.id_profesional, {
          ...profesional,
          id_usuario: profesional.id_usuario, // Ensure the ID is passed
        });
      } else {
        await createProfesional({
          ...profesional,
          id_usuario: profesional.id_usuario, // Ensure the ID is passed
        });
      }
  
      await fetchProfesionales();
      setOpenDialog(false);
      setCurrentProfesional(null);
  
      setSnackbar({
        open: true,
        message: editing ? "Profesional actualizado con éxito." : "Profesional creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error al guardar el profesional:", error);
      setSnackbar({ open: true, message: "Error al guardar el profesional.", severity: "error" });
    }
  };
  

  const handleEditProfesional = (profesional) => {
    setEditing(true);
    setCurrentProfesional(profesional);
    setOpenDialog(true);
  };

  const handleDeleteProfesional = async (id) => {
    try {
      await deleteProfesional(id);
      await fetchProfesionales();
      setSnackbar({ open: true, message: "Profesional eliminado con éxito.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar el profesional.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Gestión de Profesionales</Typography>
      <Button variant="contained" color="primary" onClick={() => { setEditing(false); setCurrentProfesional(null); setOpenDialog(true); }}>
        Crear Profesional
      </Button>

      <ProfesionalesTable profesionales={profesionales} onEdit={handleEditProfesional} onDelete={handleDeleteProfesional} />

      <ProfesionalFormDialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        onSave={handleSaveProfesional} 
        profesional={currentProfesional} 
        usuarios={usuarios} // Pass usuarios to the form
        editing={editing} 
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}>
        <Alert onClose={() => setSnackbar({ open: false, message: "", severity: "success" })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profesionales;
