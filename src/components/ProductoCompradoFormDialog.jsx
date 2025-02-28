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

const ProductoCompradoFormDialog = ({
  open,
  onClose,
  onSave,
  productoComprado,
  productos,
  compras,
  editing,
}) => {
  const [formProductoComprado, setFormProductoComprado] = useState({
    nombre: "",
    precio: "",
    cantidad: "",
    id_producto: "",
    id_compra: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productoComprado) {
      setFormProductoComprado(productoComprado);
    } else {
      setFormProductoComprado({
        nombre: "",
        precio: "",
        cantidad: "",
        id_producto: "",
        id_compra: "",
      });
    }
    setErrors({});
  }, [productoComprado]);

  const validateForm = () => {
    const newErrors = {};
    if (!formProductoComprado.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formProductoComprado.precio || formProductoComprado.precio <= 0)
      newErrors.precio = "El precio debe ser mayor a 0.";
    if (!formProductoComprado.cantidad || formProductoComprado.cantidad <= 0)
      newErrors.cantidad = "La cantidad debe ser mayor a 0.";
    if (!formProductoComprado.id_producto)
      newErrors.id_producto = "El producto es obligatorio.";
    if (!formProductoComprado.id_compra)
      newErrors.id_compra = "La compra es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formProductoComprado);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editing ? "Editar Producto Comprado" : "Crear Producto Comprado"}
      </DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formProductoComprado.nombre}
          onChange={(e) =>
            setFormProductoComprado({ ...formProductoComprado, nombre: e.target.value })
          }
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formProductoComprado.precio}
          onChange={(e) =>
            setFormProductoComprado({
              ...formProductoComprado,
              precio: parseFloat(e.target.value),
            })
          }
          error={!!errors.precio}
          helperText={errors.precio}
        />
        <TextField
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          value={formProductoComprado.cantidad}
          onChange={(e) =>
            setFormProductoComprado({
              ...formProductoComprado,
              cantidad: parseInt(e.target.value, 10),
            })
          }
          error={!!errors.cantidad}
          helperText={errors.cantidad}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Producto</InputLabel>
          <Select
            value={formProductoComprado.id_producto}
            onChange={(e) =>
              setFormProductoComprado({
                ...formProductoComprado,
                id_producto: e.target.value,
              })
            }
            error={!!errors.id_producto}
          >
            {productos.map((producto) => (
              <MenuItem key={producto.id_producto} value={producto.id_producto}>
                {producto.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Compra</InputLabel>
          <Select
            value={formProductoComprado.id_compra}
            onChange={(e) =>
              setFormProductoComprado({
                ...formProductoComprado,
                id_compra: e.target.value,
              })
            }
            error={!!errors.id_compra}
          >
            {compras.map((compra) => (
              <MenuItem key={compra.id_compra} value={compra.id_compra}>
                Compra ID: {compra.id_compra}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Producto Comprado"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoCompradoFormDialog;
