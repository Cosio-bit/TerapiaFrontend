import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../can";

const GastoFormDialog = ({
  open,
  onClose,
  onSave,
  gasto,
  proveedores = [],
  editing,
  setSnackbar,
}) => {
  const { role } = useAuth();

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

  const canEditProveedor = canEditField(role, "gasto", "proveedor");
  const canEditNombre = canEditField(role, "gasto", "nombre");
  const canEditDescripcion = canEditField(role, "gasto", "descripcion");
  const canEditMonto = canEditField(role, "gasto", "monto");
  const canEditFecha = canEditField(role, "gasto", "fecha");
  const canSave = editing ? can(role, "edit", "gasto") : can(role, "create", "gasto");

  const handleSave = async () => {
    if (!canSave) {
      setSnackbar({ open: true, message: "No tienes permiso para esta acción.", severity: "error" });
      return;
    }

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

    try {
      await onSave(payload);
      setSnackbar({ open: true, message: "Gasto guardado con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error saving gasto:", error);
      setSnackbar({ open: true, message: "Error al guardar el gasto.", severity: "error" });
    }
  };

  const isProveedorLoaded = proveedores.some((p) => p.id_proveedor === formGasto.proveedor);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Gasto" : "Crear Gasto"}</DialogTitle>
      <DialogContent>

        <FormControl fullWidth margin="dense" disabled={!canEditProveedor}>
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={isProveedorLoaded ? formGasto.proveedor : ""}
            onChange={(e) =>
              canEditProveedor &&
              setFormGasto({ ...formGasto, proveedor: e.target.value })
            }
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
          value={formGasto.nombre}
          onChange={(e) => canEditNombre && setFormGasto({ ...formGasto, nombre: e.target.value })}
          disabled={!canEditNombre}
        />

        <FormControl fullWidth margin="dense" disabled={!canEditDescripcion}>
          <InputLabel>Tipo de Gasto</InputLabel>
          <Select
            value={formGasto.descripcion}
            onChange={(e) => canEditDescripcion && setFormGasto({ ...formGasto, descripcion: e.target.value })}
          >
            {descripcionOpciones.map((opcion) => (
              <MenuItem key={opcion} value={opcion}>
                {opcion}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Monto"
          type="number"
          fullWidth
          value={formGasto.monto}
          onChange={(e) =>
            canEditMonto &&
            setFormGasto({ ...formGasto, monto: e.target.value === "" ? "" : Number(e.target.value) })
          }
          disabled={!canEditMonto}
        />

        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          value={formGasto.fecha}
          onChange={(e) => canEditFecha && setFormGasto({ ...formGasto, fecha: e.target.value })}
          InputLabelProps={{ shrink: true }}
          disabled={!canEditFecha}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
          {editing ? "Guardar Cambios" : "Crear Gasto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GastoFormDialog;
