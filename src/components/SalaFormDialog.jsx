import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../utils/can";

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
    estado: "",
  });

  useEffect(() => {
    if (sala?.id_sala) {
      const proveedorId = proveedores.find(p => p.usuario.nombre === sala.proveedor)?.id_proveedor || "";

      setFormSala({
        proveedor: proveedorId,
        nombre: sala.nombre || "",
        capacidad: sala.capacidad || 0,
        precio: typeof sala.precio === "string"
          ? parseFloat(sala.precio.replace(/[^0-9.]/g, "")) || 0
          : sala.precio || 0,
        ubicacion: sala.ubicacion || "",
        estado: sala.estado || "",
      });
    } else {
      setFormSala({
        proveedor: "",
        nombre: "",
        capacidad: "",
        precio: "",
        ubicacion: "",
        estado: "",
      });
    }
  }, [sala, open]);

  const canEditProveedor = canEditField(role, "sala", "proveedor");
  const canEditNombre = canEditField(role, "sala", "nombre");
  const canEditCapacidad = canEditField(role, "sala", "capacidad");
  const canEditPrecio = canEditField(role, "sala", "precio");
  const canEditUbicacion = canEditField(role, "sala", "ubicacion");
  const canEditEstado = canEditField(role, "sala", "estado");

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
      estado: formSala.estado,
    };

    try {
      await onSave(payload);
      setSnackbar({ open: true, message: "Sala guardada con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error saving sala:", error);
      setSnackbar({ open: true, message: "Error al guardar la sala.", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Sala" : "Crear Sala"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" disabled={!canEditProveedor}>
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={formSala.proveedor || ""}
            onChange={(e) => canEditProveedor && setFormSala({ ...formSala, proveedor: e.target.value })}
          >
            {proveedores.map((proveedor) => (
              <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                {proveedor.usuario?.nombre || "Sin nombre"}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formSala.nombre}
          onChange={(e) => canEditNombre && setFormSala({ ...formSala, nombre: e.target.value })}
          disabled={!canEditNombre}
        />

        <TextField
          margin="dense"
          label="Capacidad"
          type="number"
          fullWidth
          value={formSala.capacidad}
          onChange={(e) => canEditCapacidad && setFormSala({ 
            ...formSala, 
            capacidad: e.target.value === "" ? "" : Number(e.target.value) 
          })}
          disabled={!canEditCapacidad}
        />

        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formSala.precio}
          onChange={(e) => canEditPrecio && setFormSala({ 
            ...formSala, 
            precio: e.target.value === "" ? "" : Number(e.target.value) 
          })}
          disabled={!canEditPrecio}
        />

        <TextField
          margin="dense"
          label="Ubicación"
          fullWidth
          value={formSala.ubicacion}
          onChange={(e) => canEditUbicacion && setFormSala({ ...formSala, ubicacion: e.target.value })}
          disabled={!canEditUbicacion}
        />

        <FormControl fullWidth margin="dense" disabled={!canEditEstado}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={formSala.estado}
            onChange={(e) => canEditEstado && setFormSala({ ...formSala, estado: e.target.value })}
          >
            <MenuItem value="available">Disponible</MenuItem>
            <MenuItem value="maintenance">Mantenimiento</MenuItem>
            <MenuItem value="reserved">Reservada</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={!(canEditProveedor || canEditNombre || canEditCapacidad || canEditPrecio || canEditUbicacion || canEditEstado)}
        >
          {editing ? "Guardar Cambios" : "Crear Sala"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SalaFormDialog;
