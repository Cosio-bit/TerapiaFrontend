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
import { canEditField } from "../can";

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
        {canEditField(role, "variante", "nombreVariante") && (
          <TextField
            margin="dense"
            label="Nombre de la Variante"
            fullWidth
            value={formVariante.nombreVariante}
            onChange={(e) => setFormVariante({ ...formVariante, nombreVariante: e.target.value })}
            error={!!errors.nombreVariante}
            helperText={errors.nombreVariante}
          />
        )}
        {canEditField(role, "variante", "precio") && (
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={formVariante.precio}
            onChange={(e) => setFormVariante({ ...formVariante, precio: parseFloat(e.target.value) })}
            error={!!errors.precio}
            helperText={errors.precio}
          />
        )}
        {canEditField(role, "variante", "duracionMinutos") && (
          <TextField
            margin="dense"
            label="Duración (minutos)"
            type="number"
            fullWidth
            value={formVariante.duracionMinutos}
            onChange={(e) =>
              setFormVariante({ ...formVariante, duracionMinutos: parseInt(e.target.value, 10) })
            }
            error={!!errors.duracionMinutos}
            helperText={errors.duracionMinutos}
          />
        )}
        {canEditField(role, "variante", "cantidadSesiones") && (
          <TextField
            margin="dense"
            label="Cantidad de Sesiones"
            type="number"
            fullWidth
            value={formVariante.cantidadSesiones}
            onChange={(e) =>
              setFormVariante({ ...formVariante, cantidadSesiones: parseInt(e.target.value, 10) })
            }
            error={!!errors.cantidadSesiones}
            helperText={errors.cantidadSesiones}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Variante"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VarianteFormDialog;
