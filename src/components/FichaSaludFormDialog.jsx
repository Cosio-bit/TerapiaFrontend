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

import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../can";

const FichaSaludFormDialog = ({
  open,
  onClose,
  onSave,
  fichaSalud,
  clientes,
  editing,
  setSnackbar,
}) => {
  const { role } = useAuth();

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
      setFormFichaSalud({ fecha: "", descripcion: "", id_cliente: "" });
    }
    setErrors({});
  }, [fichaSalud]);

  const canEditFecha = canEditField(role, "fichasalud", "fecha");
  const canEditDescripcion = canEditField(role, "fichasalud", "descripcion");
  const canEditCliente = canEditField(role, "fichasalud", "id_cliente");
  const canSave = editing ? can(role, "edit", "fichasalud") : can(role, "create", "fichasalud");

  const validateForm = () => {
    const newErrors = {};
    if (!formFichaSalud.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (!formFichaSalud.descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    if (!formFichaSalud.id_cliente) newErrors.id_cliente = "El cliente es obligatorio.";
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
          onChange={(e) =>
            canEditFecha && setFormFichaSalud({ ...formFichaSalud, fecha: e.target.value })
          }
          error={!!errors.fecha}
          helperText={errors.fecha}
          disabled={!canEditFecha}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formFichaSalud.descripcion}
          onChange={(e) =>
            canEditDescripcion && setFormFichaSalud({ ...formFichaSalud, descripcion: e.target.value })
          }
          error={!!errors.descripcion}
          helperText={errors.descripcion}
          disabled={!canEditDescripcion}
        />
        <FormControl fullWidth margin="dense" disabled={!canEditCliente}>
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formFichaSalud.id_cliente}
            onChange={(e) =>
              canEditCliente && setFormFichaSalud({ ...formFichaSalud, id_cliente: e.target.value })
            }
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
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
          {editing ? "Guardar Cambios" : "Crear Ficha"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FichaSaludFormDialog;
