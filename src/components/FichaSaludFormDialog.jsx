import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

const FichaSaludFormDialog = ({
  open,
  onClose,
  onSave,
  fichaSalud,
  clientes,
  editing,
}) => {
  const [formFichaSalud, setFormFichaSalud] = useState({
    fecha: "",
    descripcion: "",
    id_cliente: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (fichaSalud) {
      setFormFichaSalud(fichaSalud);
    } else {
      setFormFichaSalud({
        fecha: "",
        descripcion: "",
        id_cliente: "",
      });
    }
    setErrors({});
  }, [fichaSalud]);

  const validateForm = () => {
    const newErrors = {};
    if (!formFichaSalud.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (!formFichaSalud.descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formFichaSalud.id_cliente) newErrors.id_cliente = "El cliente es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formFichaSalud);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Ficha de Salud" : "Crear Ficha de Salud"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formFichaSalud.fecha}
          onChange={(e) => setFormFichaSalud({ ...formFichaSalud, fecha: e.target.value })}
          error={!!errors.fecha}
          helperText={errors.fecha}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formFichaSalud.descripcion}
          onChange={(e) => setFormFichaSalud({ ...formFichaSalud, descripcion: e.target.value })}
          error={!!errors.descripcion}
          helperText={errors.descripcion}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formFichaSalud.id_cliente}
            onChange={(e) => setFormFichaSalud({ ...formFichaSalud, id_cliente: e.target.value })}
            error={!!errors.id_cliente}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Ficha"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FichaSaludFormDialog;
