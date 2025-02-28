import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllCategorias, // Nombre estandarizado
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../api/categoriaApi";
import CategoriasTable from "../components/CategoriasTable";
import CategoriaFormDialog from "../components/CategoriaFormDialog";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const data = await getAllCategorias(); // Nombre actualizado
        setCategorias(data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar las categorías.",
          severity: "error",
        });
      }
    };

    fetchCategorias();
  }, []);

  const handleSaveCategoria = async (categoria) => {
    try {
      if (editing) {
        await updateCategoria(currentCategoria.id_categoria, categoria);
      } else {
        await createCategoria(categoria);
      }
      setCategorias(await getAllCategorias()); // Nombre actualizado
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Categoría actualizada con éxito." : "Categoría creada con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar la categoría.",
        severity: "error",
      });
    }
  };

  const handleEditCategoria = (categoria) => {
    setEditing(true);
    setCurrentCategoria(categoria);
    setOpenDialog(true);
  };

  const handleDeleteCategoria = async (id) => {
    try {
      await deleteCategoria(id);
      setCategorias(await getAllCategorias()); // Nombre actualizado
      setSnackbar({
        open: true,
        message: "Categoría eliminada con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar la categoría.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Categorías
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentCategoria(null);
          setOpenDialog(true);
        }}
      >
        Crear Categoría
      </Button>

      <CategoriasTable
        categorias={categorias}
        onEdit={handleEditCategoria}
        onDelete={handleDeleteCategoria}
      />

      <CategoriaFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveCategoria}
        categoria={currentCategoria}
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

export default Categorias;
