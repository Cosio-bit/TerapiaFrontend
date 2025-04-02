import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const GastoFormDialog = ({ 
  open, 
  onClose, 
  onSave, 
  gasto, 
  proveedores = [],  
  editing,
  setSnackbar
}) => {
  const [formGasto, setFormGasto] = useState({
    proveedor: "",
    nombre: "",
    descripcion: "",
    monto: "",
    fecha: "",
  });

  const descripcionOpciones = ["Gastos Fijos", "Insumos", "Productos", "Sueldos"];

  useEffect(() => {
    if (gasto?.id_gasto && open) {
      console.log("Opening dialog with gasto:", gasto);

      const proveedorId = gasto.proveedor?.id_proveedor || "";

      setFormGasto({
        proveedor: proveedorId,
        nombre: gasto.nombre || "",
        descripcion: gasto.descripcion || "",
        monto: gasto.monto || 0,
        fecha: gasto.fecha || "",
      });
    } else if (open) {
      setFormGasto({
        proveedor: "",
        nombre: "",
        descripcion: "",
        monto: "",
        fecha: "",
      });
    }
  }, [gasto, open]);

  const handleSave = async () => {
    if (!formGasto.proveedor || !formGasto.nombre || formGasto.monto === "" || !formGasto.fecha || !formGasto.descripcion) {
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const payload = {
      proveedor: { id_proveedor: formGasto.proveedor }, 
      nombre: formGasto.nombre,
      descripcion: formGasto.descripcion,
      monto: Number(formGasto.monto),
      fecha: formGasto.fecha,
    };
    console.log("Saving gasto:", payload);

    try {
      await onSave(payload);
      setSnackbar({ open: true, message: "Gasto guardado con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error saving gasto:", error);
      setSnackbar({ open: true, message: "Error al guardar el gasto.", severity: "error" });
    }
  };

  const isProveedorLoaded = proveedores.some(
    (p) => p.id_proveedor === formGasto.proveedor
  );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Gasto" : "Crear Gasto"}</DialogTitle>
      <DialogContent>

        {/* Proveedor */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={isProveedorLoaded ? formGasto.proveedor : ""}
            onChange={(e) => setFormGasto({ ...formGasto, proveedor: e.target.value })}
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
          value={formGasto.nombre}
          onChange={(e) => setFormGasto({ ...formGasto, nombre: e.target.value })}
        />

        {/* Descripción - ahora dropdown */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Tipo de Gasto</InputLabel>
          <Select
            value={formGasto.descripcion}
            onChange={(e) => setFormGasto({ ...formGasto, descripcion: e.target.value })}
          >
            {descripcionOpciones.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Monto */}
        <TextField
          margin="dense"
          label="Monto"
          type="number"
          fullWidth
          value={formGasto.monto}
          onChange={(e) => setFormGasto({ 
            ...formGasto, 
            monto: e.target.value === "" ? "" : Number(e.target.value) 
          })}
        />

        {/* Fecha */}
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          value={formGasto.fecha}
          onChange={(e) => setFormGasto({ ...formGasto, fecha: e.target.value })}
          InputLabelProps={{ shrink: true }}
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
