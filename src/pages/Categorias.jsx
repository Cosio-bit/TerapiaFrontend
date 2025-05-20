import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllCategorias,
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from "../api/categoriaApi";
import CategoriasTable from "../components/CategoriasTable";
import CategoriaFormDialog from "../components/CategoriaFormDialog";

import { useAuth } from "../components/authcontext";
import { can } from "../can";

const Categorias = () => {
  const { role } = useAuth();

  const [categorias, setCategorias] = useState([]);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const fetchCategorias = async () => {
    try {
      const data = await getAllCategorias();
      setCategorias(data);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al cargar las categorías.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSaveCategoria = async (categoria) => {
    if (editing && !can(role, "edit", "categoria")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar categorías.", severity: "error" });
      return;
    }
    if (!editing && !can(role, "create", "categoria")) {
      setSnackbar({ open: true, message: "No tienes permiso para crear categorías.", severity: "error" });
      return;
    }

    try {
      if (editing) {
        await updateCategoria(currentCategoria.id_categoria, categoria);
      } else {
        await createCategoria(categoria);
      }
      fetchCategorias();
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
    if (!can(role, "edit", "categoria")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar categorías.", severity: "error" });
      return;
    }

    setEditing(true);
    setCurrentCategoria(categoria);
    setOpenDialog(true);
  };

  const handleDeleteCategoria = async (id) => {
    if (!can(role, "delete", "categoria")) {
      setSnackbar({ open: true, message: "No tienes permiso para eliminar categorías.", severity: "error" });
      return;
    }

    try {
      await deleteCategoria(id);
      fetchCategorias();
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

      {can(role, "create", "categoria") && (
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
      )}

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
        setSnackbar={setSnackbar}
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
