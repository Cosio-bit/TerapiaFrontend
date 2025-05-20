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
  MenuItem
} from "@mui/material";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../can";

const SalaFormDialog = ({
  open,
  onClose,
  onSave,
  sala,
  proveedores,
  editing,
  setSnackbar
}) => {
  const { role } = useAuth();

  const [formSala, setFormSala] = useState({
    proveedor: "",
    nombre: "",
    capacidad: "",
    precio: "",
    ubicacion: "",
    estado: ""
  });

  useEffect(() => {
    if (sala?.id_sala) {
      const proveedorId = proveedores.find(p => p.usuario.nombre === sala.proveedor)?.id_proveedor || "";
      setFormSala({
        proveedor: proveedorId,
        nombre: sala.nombre || "",
        capacidad: sala.capacidad || 0,
        precio: typeof sala.precio === "string" ? parseFloat(sala.precio.replace(/[^0-9.]/g, "")) || 0 : sala.precio || 0,
        ubicacion: sala.ubicacion || "",
        estado: sala.estado || ""
      });
    } else {
      setFormSala({
        proveedor: "",
        nombre: "",
        capacidad: "",
        precio: "",
        ubicacion: "",
        estado: ""
      });
    }
  }, [sala, open]);

  const handleSave = async () => {
    if (!formSala.proveedor || !formSala.nombre || formSala.precio === "" || formSala.capacidad === "" || !formSala.ubicacion || !formSala.estado) {
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const payload = {
      proveedor: { id_proveedor: formSala.proveedor },
      nombre: formSala.nombre,
      capacidad: Number(formSala.capacidad),
      precio: Number(formSala.precio),
      ubicacion: formSala.ubicacion,
      estado: formSala.estado
    };

    try {
      await onSave(payload);
      setSnackbar({ open: true, message: "Sala guardada con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar la sala.", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Sala" : "Crear Sala"}</DialogTitle>
      <DialogContent>
        {canEditField(role, "sala", "proveedor") && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Proveedor</InputLabel>
            <Select
              value={formSala.proveedor || ""}
              onChange={(e) => setFormSala({ ...formSala, proveedor: e.target.value })}
            >
              {proveedores.map((proveedor) => (
                <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                  {proveedor.usuario?.nombre || "Sin nombre"}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {["nombre", "capacidad", "precio", "ubicacion", "estado"].map((field) => {
          if (!canEditField(role, "sala", field)) return null;
          const isNumber = ["capacidad", "precio"].includes(field);
          const label = field.charAt(0).toUpperCase() + field.slice(1);

          if (field === "estado") {
            return (
              <FormControl fullWidth margin="dense" key={field}>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={formSala.estado}
                  onChange={(e) => setFormSala({ ...formSala, estado: e.target.value })}
                >
                  <MenuItem value="available">Disponible</MenuItem>
                  <MenuItem value="maintenance">Mantenimiento</MenuItem>
                  <MenuItem value="reserved">Reservada</MenuItem>
                </Select>
              </FormControl>
            );
          }

          return (
            <TextField
              key={field}
              margin="dense"
              label={label}
              type={isNumber ? "number" : "text"}
              fullWidth
              value={formSala[field]}
              onChange={(e) => setFormSala({ ...formSala, [field]: isNumber ? Number(e.target.value) : e.target.value })}
            />
          );
        })}
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
