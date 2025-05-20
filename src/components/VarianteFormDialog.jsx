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
import { canEditField } from "../utils/can";

const VarianteFormDialog = ({ open, onClose, onSave, variante, editing }) => {
  const { role } = useAuth();

  const [formVariante, setFormVariante] = useState({
    nombreVariante: "",
    precio: "",
    duracionMinutos: "",
    cantidadSesiones: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (variante) {
      setFormVariante(variante);
    } else {
      setFormVariante({
        nombreVariante: "",
        precio: "",
        duracionMinutos: "",
        cantidadSesiones: "",
      });
    }
    setErrors({});
  }, [variante]);

  const canNombre = canEditField(role, "variante", "nombreVariante");
  const canPrecio = canEditField(role, "variante", "precio");
  const canDuracion = canEditField(role, "variante", "duracionMinutos");
  const canCantidad = canEditField(role, "variante", "cantidadSesiones");

  const validateForm = () => {
    const newErrors = {};
    if (!formVariante.nombreVariante) newErrors.nombreVariante = "El nombre es obligatorio.";
    if (!formVariante.precio || formVariante.precio <= 0)
      newErrors.precio = "El precio debe ser mayor a 0.";
    if (!formVariante.duracionMinutos || formVariante.duracionMinutos <= 0)
      newErrors.duracionMinutos = "La duración debe ser mayor a 0.";
    if (!formVariante.cantidadSesiones || formVariante.cantidadSesiones <= 0)
      newErrors.cantidadSesiones = "La cantidad de sesiones debe ser mayor a 0.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formVariante);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Variante" : "Crear Variante"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre de la Variante"
          fullWidth
          value={formVariante.nombreVariante}
          onChange={(e) => canNombre && setFormVariante({ ...formVariante, nombreVariante: e.target.value })}
          error={!!errors.nombreVariante}
          helperText={errors.nombreVariante}
          disabled={!canNombre}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formVariante.precio}
          onChange={(e) => canPrecio && setFormVariante({ ...formVariante, precio: parseFloat(e.target.value) })}
          error={!!errors.precio}
          helperText={errors.precio}
          disabled={!canPrecio}
        />
        <TextField
          margin="dense"
          label="Duración (minutos)"
          type="number"
          fullWidth
          value={formVariante.duracionMinutos}
          onChange={(e) => canDuracion && setFormVariante({ ...formVariante, duracionMinutos: parseInt(e.target.value, 10) })}
          error={!!errors.duracionMinutos}
          helperText={errors.duracionMinutos}
          disabled={!canDuracion}
        />
        <TextField
          margin="dense"
          label="Cantidad de Sesiones"
          type="number"
          fullWidth
          value={formVariante.cantidadSesiones}
          onChange={(e) => canCantidad && setFormVariante({ ...formVariante, cantidadSesiones: parseInt(e.target.value, 10) })}
          error={!!errors.cantidadSesiones}
          helperText={errors.cantidadSesiones}
          disabled={!canCantidad}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!(canNombre || canPrecio || canDuracion || canCantidad)}
        >
          {editing ? "Guardar Cambios" : "Crear Variante"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VarianteFormDialog;
