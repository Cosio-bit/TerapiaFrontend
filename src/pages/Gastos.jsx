import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllGastos,
  createGasto,
  updateGasto,
  deleteGasto,
} from "../api/gastoApi";
import GastosTable from "../components/GastosTable";
import GastoFormDialog from "../components/GastoFormDialog";

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [currentGasto, setCurrentGasto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const data = await getAllGastos();
        setGastos(data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar los gastos.",
          severity: "error",
        });
      }
    };

    fetchGastos();
  }, []);

  // Guardar o actualizar gasto
  const handleSaveGasto = async (gasto) => {
    try {
      if (editing) {
        await updateGasto(currentGasto.id_gasto, gasto);
      } else {
        await createGasto(gasto);
      }
      setGastos(await getAllGastos());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Gasto actualizado con éxito." : "Gasto creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al guardar el gasto: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Editar gasto
  const handleEditGasto = (gasto) => {
    setEditing(true);
    setCurrentGasto(gasto);
    setOpenDialog(true);
  };

  // Eliminar gasto
  const handleDeleteGasto = async (id) => {
    try {
      await deleteGasto(id);
      setGastos(await getAllGastos());
      setSnackbar({
        open: true,
        message: "Gasto eliminado con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al eliminar el gasto: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Gastos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentGasto(null);
          setOpenDialog(true);
        }}
      >
        Crear Gasto
      </Button>

      <GastosTable
        gastos={gastos}
        onEdit={handleEditGasto}
        onDelete={handleDeleteGasto}
      />

      <GastoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveGasto}
        gasto={currentGasto}
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

export default Gastos;
