import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllProfesionales,
  createProfesional,
  updateProfesional,
  deleteProfesional,
} from "../api/profesionalApi";
import { getAllUsuarios } from "../api/usuarioApi";
import ProfesionalesTable from "../components/ProfesionalesTable";
import ProfesionalFormDialog from "../components/ProfesionalFormDialog";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const Profesionales = () => {
  const { role } = useAuth();
  const [profesionales, setProfesionales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [currentProfesional, setCurrentProfesional] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchProfesionales();
    fetchUsuarios();
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
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar los usuarios.", severity: "error" });
    }
  };

  const handleSaveProfesional = async (profesional) => {
    try {
      if (editing) {
        if (!can(role, "edit", "profesional")) {
          setSnackbar({ open: true, message: "No tienes permiso para editar profesionales.", severity: "error" });
          return;
        }
        await updateProfesional(currentProfesional.id_profesional, profesional);
      } else {
        if (!can(role, "create", "profesional")) {
          setSnackbar({ open: true, message: "No tienes permiso para crear profesionales.", severity: "error" });
          return;
        }
        await createProfesional(profesional);
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
    if (!can(role, "edit", "profesional")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar profesionales.", severity: "error" });
      return;
    }
    setEditing(true);
    setCurrentProfesional(profesional);
    setOpenDialog(true);
  };

  const handleDeleteProfesional = async (id) => {
    if (!can(role, "delete", "profesional")) {
      setSnackbar({ open: true, message: "No tienes permiso para eliminar profesionales.", severity: "error" });
      return;
    }
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

      {can(role, "create", "profesional") && (
        <Button variant="contained" color="primary" onClick={() => {
          setEditing(false);
          setCurrentProfesional(null);
          setOpenDialog(true);
        }}>
          Crear Profesional
        </Button>
      )}

      <ProfesionalesTable profesionales={profesionales} onEdit={handleEditProfesional} onDelete={handleDeleteProfesional} />

      <ProfesionalFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveProfesional}
        profesional={currentProfesional}
        usuarios={usuarios}
        setUsuarios={setUsuarios}
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
