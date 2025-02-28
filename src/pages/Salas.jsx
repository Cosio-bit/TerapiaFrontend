import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import { getAllSalas, createSala, updateSala, deleteSala } from "../api/salaApi";
import { getAllProveedores } from "../api/proveedorApi";
import SalasTable from "../components/SalasTable";
import SalaFormDialog from "../components/SalaFormDialog";

const Salas = () => {
  const [salas, setSalas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [currentSala, setCurrentSala] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salasData, proveedoresData] = await Promise.all([
          getAllSalas(),
          getAllProveedores(),
        ]);
        setSalas(salasData);
        setProveedores(proveedoresData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar los datos.",
          severity: "error",
        });
      }
    };

    fetchData();
  }, []);

  // Guardar o actualizar sala
  const handleSaveSala = async (sala) => {
    try {
      if (editing) {
        await updateSala(currentSala.id_sala, sala);
      } else {
        await createSala(sala);
      }
      setSalas(await getAllSalas());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Sala actualizada con éxito." : "Sala creada con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar la sala.",
        severity: "error",
      });
    }
  };

  // Editar sala
  const handleEditSala = (sala) => {
    setEditing(true);
    setCurrentSala(sala);
    setOpenDialog(true);
  };

  // Eliminar sala
  const handleDeleteSala = async (id) => {
    try {
      await deleteSala(id);
      setSalas(await getSalas());
      setSnackbar({
        open: true,
        message: "Sala eliminada con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar la sala.",
        severity: "error",
      });
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Salas
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentSala(null);
          setOpenDialog(true);
        }}
      >
        Crear Sala
      </Button>

      <SalasTable
        salas={salas}
        onEdit={handleEditSala}
        onDelete={handleDeleteSala}
      />

      <SalaFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveSala}
        sala={currentSala}
        proveedores={proveedores}
        editing={editing}
      />

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

export default Salas;
