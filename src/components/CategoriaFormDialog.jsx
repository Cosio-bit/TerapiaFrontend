import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../utils/can";

const CategoriaFormDialog = ({ open, onClose, onSave, categoria, editing, setSnackbar }) => {
  const { role } = useAuth();

  const [formCategoria, setFormCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoria) {
      setFormCategoria(categoria);
    } else {
      setFormCategoria({ nombre: "", descripcion: "" });
    }
    setErrors({});
  }, [categoria]);

  const canEditNombre = canEditField(role, "categoria", "nombre");
  const canEditDescripcion = canEditField(role, "categoria", "descripcion");
  const canSave = editing
    ? can(role, "edit", "categoria")
    : can(role, "create", "categoria");

  const validateForm = () => {
    const newErrors = {};
    if (!formCategoria.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formCategoria.descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!canSave) {
      setSnackbar?.({
        open: true,
        message: "No tienes permiso para realizar esta acción.",
        severity: "error",
      });
      return;
    }

    if (validateForm()) {
      onSave(formCategoria);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Categoría" : "Crear Categoría"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formCategoria.nombre}
          onChange={(e) =>
            canEditNombre &&
            setFormCategoria({ ...formCategoria, nombre: e.target.value })
          }
          error={!!errors.nombre}
          helperText={errors.nombre}
          disabled={!canEditNombre}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formCategoria.descripcion}
          onChange={(e) =>
            canEditDescripcion &&
            setFormCategoria({ ...formCategoria, descripcion: e.target.value })
          }
          error={!!errors.descripcion}
          helperText={errors.descripcion}
          disabled={!canEditDescripcion}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!canSave}
        >
          {editing ? "Guardar Cambios" : "Crear Categoría"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriaFormDialog;
