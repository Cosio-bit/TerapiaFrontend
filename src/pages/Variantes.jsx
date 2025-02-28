import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getVariantesByTerapiaId,
  createVariante,
  deleteVariante,
} from "../api/varianteApi";
import VariantesTable from "../components/VariantesTable";
import VarianteFormDialog from "../components/VarianteFormDialog";

const Variantes = ({ idTerapia }) => {
  const [variantes, setVariantes] = useState([]);
  const [currentVariante, setCurrentVariante] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar las variantes al montar el componente o al cambiar el idTerapia
  useEffect(() => {
    const fetchVariantes = async () => {
      try {
        const data = await getVariantesByTerapiaId(idTerapia);
        setVariantes(data);
      } catch {
        setSnackbar({
          open: true,
          message: "Error al cargar las variantes.",
          severity: "error",
        });
      }
    };

    if (idTerapia) fetchVariantes();
  }, [idTerapia]);

  // Guardar o crear una variante
  const handleSaveVariante = async (variante) => {
    try {
      await createVariante({ ...variante, idTerapia });
      setVariantes(await getVariantesByTerapiaId(idTerapia));
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Variante actualizada con éxito." : "Variante creada con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar la variante.",
        severity: "error",
      });
    }
  };

  // Editar variante
  const handleEditVariante = (variante) => {
    setEditing(true);
    setCurrentVariante(variante);
    setOpenDialog(true);
  };

  // Eliminar variante
  const handleDeleteVariante = async (idVariante) => {
    try {
      await deleteVariante(idVariante);
      setVariantes(await getVariantesByTerapiaId(idTerapia));
      setSnackbar({
        open: true,
        message: "Variante eliminada con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar la variante.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Variantes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentVariante(null);
          setOpenDialog(true);
        }}
      >
        Crear Variante
      </Button>

      <VariantesTable variantes={variantes} onEdit={handleEditVariante} onDelete={handleDeleteVariante} />

      <VarianteFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveVariante}
        variante={currentVariante}
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

export default Variantes;
