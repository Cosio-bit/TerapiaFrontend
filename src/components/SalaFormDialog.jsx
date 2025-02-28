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

const SalaFormDialog = ({ open, onClose, onSave, sala, proveedores, editing }) => {
  const [formSala, setFormSala] = useState({
    nombre: "",
    capacidad: "",
    precio: "",
    ubicacion: "",
    estado: "",
    id_proveedor: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sala) {
      setFormSala(sala);
    } else {
      setFormSala({
        nombre: "",
        capacidad: "",
        precio: "",
        ubicacion: "",
        estado: "",
        id_proveedor: "",
      });
    }
    setErrors({});
  }, [sala]);

  const validateForm = () => {
    const newErrors = {};
    if (!formSala.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formSala.capacidad || formSala.capacidad <= 0)
      newErrors.capacidad = "La capacidad debe ser mayor a 0.";
    if (!formSala.precio || formSala.precio <= 0)
      newErrors.precio = "El precio debe ser mayor a 0.";
    if (!formSala.ubicacion) newErrors.ubicacion = "La ubicación es obligatoria.";
    if (!formSala.estado) newErrors.estado = "El estado es obligatorio.";
    if (!formSala.id_proveedor) newErrors.id_proveedor = "El proveedor es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formSala);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Sala" : "Crear Sala"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formSala.nombre}
          onChange={(e) =>
            setFormSala({ ...formSala, nombre: e.target.value })
          }
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          margin="dense"
          label="Capacidad"
          type="number"
          fullWidth
          value={formSala.capacidad}
          onChange={(e) =>
            setFormSala({ ...formSala, capacidad: parseInt(e.target.value, 10) })
          }
          error={!!errors.capacidad}
          helperText={errors.capacidad}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formSala.precio}
          onChange={(e) =>
            setFormSala({ ...formSala, precio: parseInt(e.target.value, 10) })
          }
          error={!!errors.precio}
          helperText={errors.precio}
        />
        <TextField
          margin="dense"
          label="Ubicación"
          fullWidth
          value={formSala.ubicacion}
          onChange={(e) =>
            setFormSala({ ...formSala, ubicacion: e.target.value })
          }
          error={!!errors.ubicacion}
          helperText={errors.ubicacion}
        />
        <TextField
          margin="dense"
          label="Estado"
          fullWidth
          value={formSala.estado}
          onChange={(e) =>
            setFormSala({ ...formSala, estado: e.target.value })
          }
          error={!!errors.estado}
          helperText={errors.estado}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={formSala.id_proveedor}
            onChange={(e) =>
              setFormSala({ ...formSala, id_proveedor: e.target.value })
            }
            error={!!errors.id_proveedor}
          >
            {proveedores.map((proveedor) => (
              <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                {proveedor.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Sala"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalaFormDialog;
