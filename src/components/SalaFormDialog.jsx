import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SalaFormDialog = ({ 
  open, 
  onClose, 
  onSave, 
  sala, 
  proveedores, 
  editing,
  setSnackbar
}) => {
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
      console.log("Opening dialog with sala:", sala);

      // Find `proveedor` by matching name or ID
      const proveedorId = proveedores.find(p => p.usuario.nombre === sala.proveedor)?.id_proveedor || ""; // Match by name or default to empty string

      const updatedForm = {
        proveedor: proveedorId,  // Ensure only the ID is used
        nombre: sala.nombre || "",
        capacidad: sala.capacidad || 0,
        precio: typeof sala.precio === "string"
          ? parseFloat(sala.precio.replace(/[^0-9.]/g, "")) || 0
          : sala.precio || 0,
        ubicacion: sala.ubicacion || "",
        estado: sala.estado || "",
      };

      console.log("📝 Updated formSala (AFTER FIX):", updatedForm);

      setFormSala(updatedForm);
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

  const handleSave = async () => {
    console.log("Saving sala:", formSala);

    if (!formSala.proveedor || !formSala.nombre || formSala.precio === "" || formSala.capacidad === "" || !formSala.ubicacion || !formSala.estado) {
      console.warn("Validation failed: missing required fields.");
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const payload = {
      proveedor: { id_proveedor: formSala.proveedor },  // Pass only the ID of the proveedor as an object
      nombre: formSala.nombre,
      capacidad: Number(formSala.capacidad),
      precio: Number(formSala.precio),
      ubicacion: formSala.ubicacion,
      estado: formSala.estado,
    };

    console.log("Payload to send:", payload);

    try {
      await onSave(payload);
      console.log("Sala saved successfully.");
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
        {/* Proveedor Selection */}
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

        {/* Nombre */}
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formSala.nombre}
          onChange={(e) => setFormSala({ ...formSala, nombre: e.target.value })}
        />

        {/* Capacidad */}
        <TextField
          margin="dense"
          label="Capacidad"
          type="number"
          fullWidth
          value={formSala.capacidad}
          onChange={(e) => setFormSala({ 
            ...formSala, 
            capacidad: e.target.value === "" ? "" : Number(e.target.value) 
          })}
        />

        {/* Precio */}
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formSala.precio}
          onChange={(e) => setFormSala({ 
            ...formSala, 
            precio: e.target.value === "" ? "" : Number(e.target.value) 
          })}
        />

        {/* Ubicación */}
        <TextField
          margin="dense"
          label="Ubicación"
          fullWidth
          value={formSala.ubicacion}
          onChange={(e) => setFormSala({ ...formSala, ubicacion: e.target.value })}
        />

        {/* Estado */}
        <FormControl fullWidth margin="dense">
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
