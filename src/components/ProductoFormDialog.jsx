import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../can";

const ProductoFormDialog = ({
  open,
  onClose,
  onSave,
  producto,
  proveedores,
  editing,
  setSnackbar
}) => {
  const { role } = useAuth();

  const [formProducto, setFormProducto] = useState({
    proveedor: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    if (producto?.id_producto) {
      const proveedorId = proveedores.find(p => p.usuario.nombre === producto.proveedor)?.id_proveedor || "";
      setFormProducto({
        proveedor: proveedorId,
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: typeof producto.precio === "string"
          ? parseFloat(producto.precio.replace(/[^0-9.]/g, "")) || 0
          : producto.precio || 0,
        stock: typeof producto.stock === "string"
          ? parseInt(producto.stock, 10) || 0
          : producto.stock || 0,
      });
    } else {
      setFormProducto({
        proveedor: "",
        nombre: "",
        descripcion: "",
        precio: "",
        stock: "",
      });
    }
  }, [producto, open]);

  const canEditProveedor = canEditField(role, "producto", "proveedor");
  const canEditNombre = canEditField(role, "producto", "nombre");
  const canEditDescripcion = canEditField(role, "producto", "descripcion");
  const canEditPrecio = canEditField(role, "producto", "precio");
  const canEditStock = canEditField(role, "producto", "stock");
  const canSave = editing ? can(role, "edit", "producto") : can(role, "create", "producto");

  const handleSave = async () => {
    if (!canSave) {
      setSnackbar({ open: true, message: "No tienes permiso para realizar esta acción.", severity: "error" });
      return;
    }

    if (!formProducto.proveedor || !formProducto.nombre || formProducto.precio === "" || formProducto.stock === "") {
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const payload = {
      proveedor: { id_proveedor: formProducto.proveedor },
      nombre: formProducto.nombre,
      descripcion: formProducto.descripcion,
      precio: Number(formProducto.precio),
      stock: Number(formProducto.stock),
    };

    try {
      await onSave(payload);
      setSnackbar({ open: true, message: "Producto guardado con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error saving producto:", error);
      setSnackbar({ open: true, message: "Error al guardar el producto.", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Producto" : "Crear Producto"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" disabled={!canEditProveedor}>
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={formProducto.proveedor || ""}
            onChange={(e) => canEditProveedor && setFormProducto({ ...formProducto, proveedor: e.target.value })}
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
          value={formProducto.nombre}
          onChange={(e) => canEditNombre && setFormProducto({ ...formProducto, nombre: e.target.value })}
          disabled={!canEditNombre}
        />

        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formProducto.descripcion}
          onChange={(e) => canEditDescripcion && setFormProducto({ ...formProducto, descripcion: e.target.value })}
          disabled={!canEditDescripcion}
        />

        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formProducto.precio}
          onChange={(e) => canEditPrecio && setFormProducto({ ...formProducto, precio: e.target.value === "" ? "" : Number(e.target.value) })}
          disabled={!canEditPrecio}
        />

        <TextField
          margin="dense"
          label="Stock"
          type="number"
          fullWidth
          value={formProducto.stock}
          onChange={(e) => canEditStock && setFormProducto({ ...formProducto, stock: e.target.value === "" ? "" : Number(e.target.value) })}
          disabled={!canEditStock}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
          {editing ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoFormDialog;
