import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllFichasSalud,
  createFichaSalud,
  updateFichaSalud,
  deleteFichaSalud,
} from "../api/fichaSaludApi";
import { getAllClientes } from "../api/clienteApi";
import FichasSaludTable from "../components/FichasSaludTable";
import FichaSaludFormDialog from "../components/FichaSaludFormDialog";

const FichasSalud = () => {
  const [fichasSalud, setFichasSalud] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentFicha, setCurrentFicha] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fichasData, clientesData] = await Promise.all([
          getAllFichasSalud(),
          getAllClientes(),
        ]);
        setFichasSalud(fichasData);
        setClientes(clientesData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: `Error al cargar los datos: ${error.message}`,
          severity: "error",
        });
      }
    };

    fetchData();
  }, []);

  // Guardar o actualizar ficha
  const handleSaveFicha = async (ficha) => {
    try {
      if (editing) {
        await updateFichaSalud(currentFicha.id_fichasalud, ficha);
      } else {
        await createFichaSalud(ficha);
      }
      setFichasSalud(await getAllFichasSalud());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Ficha actualizada con éxito." : "Ficha creada con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al guardar la ficha: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Editar ficha
  const handleEditFicha = (ficha) => {
    setEditing(true);
    setCurrentFicha(ficha);
    setOpenDialog(true);
  };

  // Eliminar ficha
  const handleDeleteFicha = async (id) => {
    try {
      await deleteFichaSalud(id);
      setFichasSalud(await getAllFichasSalud());
      setSnackbar({
        open: true,
        message: "Ficha eliminada con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error al eliminar la ficha: ${error.message}`,
        severity: "error",
      });
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Fichas de Salud
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentFicha(null);
          setOpenDialog(true);
        }}
      >
        Crear Ficha
      </Button>

      <FichasSaludTable
        fichasSalud={fichasSalud}
        onEdit={handleEditFicha}
        onDelete={handleDeleteFicha}
      />

      <FichaSaludFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveFicha}
        fichaSalud={currentFicha}
        clientes={clientes}
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

export default FichasSalud;
