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

const ProductoFormDialog = ({
  open,
  onClose,
  onSave,
  producto,
  proveedores,
  categorias,
  editing,
}) => {
  const [formProducto, setFormProducto] = useState({
    nombre: "",
    descripcion: "",
    fecha_creacion: "",
    precio: "",
    stock: "",
    id_proveedor: "",
    id_categoria: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (producto) {
      setFormProducto(producto);
    } else {
      setFormProducto({
        nombre: "",
        descripcion: "",
        fecha_creacion: "",
        precio: "",
        stock: "",
        id_proveedor: "",
        id_categoria: "",
      });
    }
    setErrors({});
  }, [producto]);

  const validateForm = () => {
    const newErrors = {};
    if (!formProducto.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formProducto.precio || formProducto.precio <= 0)
      newErrors.precio = "El precio debe ser mayor a 0.";
    if (!formProducto.stock || formProducto.stock < 0)
      newErrors.stock = "El stock no puede ser negativo.";
    if (!formProducto.fecha_creacion)
      newErrors.fecha_creacion = "La fecha de creación es obligatoria.";
    if (!formProducto.id_proveedor)
      newErrors.id_proveedor = "El proveedor es obligatorio.";
    if (!formProducto.id_categoria)
      newErrors.id_categoria = "La categoría es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formProducto);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Producto" : "Crear Producto"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formProducto.nombre}
          onChange={(e) =>
            setFormProducto({ ...formProducto, nombre: e.target.value })
          }
          error={!!errors.nombre}
          helperText={errors.nombre}
        />
        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formProducto.descripcion}
          onChange={(e) =>
            setFormProducto({ ...formProducto, descripcion: e.target.value })
          }
        />
        <TextField
          margin="dense"
          label="Fecha de Creación"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formProducto.fecha_creacion}
          onChange={(e) =>
            setFormProducto({
              ...formProducto,
              fecha_creacion: e.target.value,
            })
          }
          error={!!errors.fecha_creacion}
          helperText={errors.fecha_creacion}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formProducto.precio}
          onChange={(e) =>
            setFormProducto({ ...formProducto, precio: parseFloat(e.target.value) })
          }
          error={!!errors.precio}
          helperText={errors.precio}
        />
        <TextField
          margin="dense"
          label="Stock"
          type="number"
          fullWidth
          value={formProducto.stock}
          onChange={(e) =>
            setFormProducto({ ...formProducto, stock: parseInt(e.target.value, 10) })
          }
          error={!!errors.stock}
          helperText={errors.stock}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Proveedor</InputLabel>
          <Select
            value={formProducto.id_proveedor}
            onChange={(e) =>
              setFormProducto({ ...formProducto, id_proveedor: e.target.value })
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
        <FormControl fullWidth margin="dense">
          <InputLabel>Categoría</InputLabel>
          <Select
            value={formProducto.id_categoria}
            onChange={(e) =>
              setFormProducto({ ...formProducto, id_categoria: e.target.value })
            }
            error={!!errors.id_categoria}
          >
            {categorias.map((categoria) => (
              <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
