import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllTerapias,
  createTerapia,
  updateTerapia,
  deleteTerapia,
} from "../api/terapiaApi";
import { getAllProfesionales } from "../api/profesionalApi";
import TerapiasTable from "../components/TerapiasTable";
import TerapiaFormDialog from "../components/TerapiaFormDialog";

const Terapias = () => {
  const [terapias, setTerapias] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [currentTerapia, setCurrentTerapia] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchTerapias();
    fetchProfesionales();
  }, []);

  const fetchTerapias = async () => {
    try {
      const terapiasData = await getAllTerapias();
      setTerapias(Array.isArray(terapiasData) ? terapiasData : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar las terapias.", severity: "error" });
    }
  };

  const fetchProfesionales = async () => {
    try {
      const profesionalesData = await getAllProfesionales();
      setProfesionales(Array.isArray(profesionalesData) ? profesionalesData : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar los profesionales.", severity: "error" });
    }
  };

  const handleSaveTerapia = async (terapia) => {
    try {
      if (editing) {
        await updateTerapia(currentTerapia.id_terapia, terapia);
      } else {
        await createTerapia(terapia);
      }
      fetchTerapias();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Terapia actualizada con éxito." : "Terapia creada con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar la terapia.", severity: "error" });
    }
  };

  const handleEditTerapia = (terapia) => {
    setEditing(true);
    setCurrentTerapia(terapia);
    setOpenDialog(true);
  };

  const handleDeleteTerapia = async (id) => {
    try {
      await deleteTerapia(id);
      fetchTerapias();
      setSnackbar({ open: true, message: "Terapia eliminada con éxito.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar la terapia.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Terapias
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentTerapia(null);
          setOpenDialog(true);
        }}
      >
        Crear Terapia
      </Button>

      <TerapiasTable terapias={terapias} onEdit={handleEditTerapia} onDelete={handleDeleteTerapia} />

      <TerapiaFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveTerapia}
        terapia={currentTerapia}
        profesionales={profesionales}
        editing={editing}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
      >
        <Alert onClose={() => setSnackbar({ open: false, message: "", severity: "success" })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Terapias;
