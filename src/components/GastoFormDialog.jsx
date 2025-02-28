import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

const GastoFormDialog = ({ open, onClose, onSave, gasto, editing }) => {
  const [formGasto, setFormGasto] = useState({
    nombre: "",
    descripcion: "",
    monto: "",
    fecha: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (gasto) {
      setFormGasto(gasto);
    } else {
      setFormGasto({
        nombre: "",
        descripcion: "",
        monto: "",
        fecha: "",
      });
    }
    setErrors({});
  }, [gasto]);

  const validateForm = () => {
    const newErrors = {};
    if (!formGasto.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formGasto.monto || formGasto.monto <= 0)
      newErrors.monto = "El monto debe ser mayor a 0.";
    if (!formGasto.fecha) newErrors.fecha = "La fecha es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formGasto);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Gasto" : "Crear Gasto"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formGasto.nombre}
          onChange={(e) => setFormGasto({ ...formGasto, nombre: e.target.value })}
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formGasto.descripcion}
          onChange={(e) => setFormGasto({ ...formGasto, descripcion: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Monto"
          type="number"
          fullWidth
          value={formGasto.monto}
          onChange={(e) => setFormGasto({ ...formGasto, monto: parseFloat(e.target.value) })}
          error={!!errors.monto}
          helperText={errors.monto}
        />
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formGasto.fecha}
          onChange={(e) => setFormGasto({ ...formGasto, fecha: e.target.value })}
          error={!!errors.fecha}
          helperText={errors.fecha}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Gasto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GastoFormDialog;
