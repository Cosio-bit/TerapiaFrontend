import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const CategoriaFormDialog = ({ open, onClose, onSave, categoria, editing }) => {
  const [formCategoria, setFormCategoria] = useState({
    nombre: "",
    descripcion: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (categoria) {
      setFormCategoria(categoria);
    } else {
      setFormCategoria({
        nombre: "",
        descripcion: "",
      });
    }
    setErrors({});
  }, [categoria]);

  const validateForm = () => {
    const newErrors = {};
    if (!formCategoria.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formCategoria.descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
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
            setFormCategoria({ ...formCategoria, nombre: e.target.value })
          }
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formCategoria.descripcion}
          onChange={(e) =>
            setFormCategoria({
              ...formCategoria,
              descripcion: e.target.value,
            })
          }
          error={!!errors.descripcion}
          helperText={errors.descripcion}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Categoría"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoriaFormDialog;
