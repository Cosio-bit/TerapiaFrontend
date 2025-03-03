import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ProductoFormDialog = ({ 
  open, 
  onClose, 
  onSave, 
  producto, 
  proveedores, 
  editing,
  setSnackbar
}) => {
  const [formProducto, setFormProducto] = useState({
    proveedor: "",
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
  });

  useEffect(() => {
    if (producto?.id_producto) {
      console.log("Opening dialog with producto:", producto);

      // Find `proveedor` by matching name or ID
      const proveedorId = proveedores.find(p => p.usuario.nombre === producto.proveedor)?.id_proveedor || ""; // Match by name or default to empty string

      const updatedForm = {
        proveedor: proveedorId,  // Ensure only the ID is used
        nombre: producto.nombre || "",
        descripcion: producto.descripcion || "",
        precio: typeof producto.precio === "string"
          ? parseFloat(producto.precio.replace(/[^0-9.]/g, "")) || 0
          : producto.precio || 0,
        stock: typeof producto.stock === "string"
          ? parseInt(producto.stock, 10) || 0
          : producto.stock || 0,
      };

      console.log("📝 Updated formProducto (AFTER FIX):", updatedForm);

      setFormProducto(updatedForm);
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

  const handleSave = async () => {
    console.log("Saving producto:", formProducto);

    if (!formProducto.proveedor || !formProducto.nombre || formProducto.precio === "" || formProducto.stock === "") {
      console.warn("Validation failed: missing required fields.");
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const payload = {
      proveedor: { id_proveedor: formProducto.proveedor },  // Pass only the ID of the proveedor as an object
      nombre: formProducto.nombre,
      descripcion: formProducto.descripcion,
      precio: Number(formProducto.precio),
      stock: Number(formProducto.stock),
    };

    console.log("Payload to send:", payload);

    try {
      await onSave(payload);
      console.log("Producto saved successfully.");
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
        {/* Proveedor Selection */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={formProducto.proveedor || ""}
            onChange={(e) => setFormProducto({ ...formProducto, proveedor: e.target.value })}
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
          value={formProducto.nombre}
          onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
        />

        {/* Descripción */}
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formProducto.descripcion}
          onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
        />

        {/* Precio */}
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formProducto.precio}
          onChange={(e) => setFormProducto({ 
            ...formProducto, 
            precio: e.target.value === "" ? "" : Number(e.target.value) 
          })}
        />

        {/* Stock */}
        <TextField
          margin="dense"
          label="Stock"
          type="number"
          fullWidth
          value={formProducto.stock}
          onChange={(e) => setFormProducto({ 
            ...formProducto, 
            stock: e.target.value === "" ? "" : Number(e.target.value)
          })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Producto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoFormDialog;
