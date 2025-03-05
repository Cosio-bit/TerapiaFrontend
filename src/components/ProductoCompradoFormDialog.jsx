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

const ProductoCompradoFormDialog = ({ open, onClose, onSave, productoComprado, productos, editing }) => {
  const [formProductoComprado, setFormProductoComprado] = useState({
    id_producto_comprado: null,
    nombre: "",
    precio: "",
    cantidad: "",
    producto: { id_producto: "" },
  });

  useEffect(() => {
    if (open) {
      if (editing && productoComprado) {
        console.log("🔄 Loading purchased product:", productoComprado);
  
        setFormProductoComprado({
          id_producto_comprado: productoComprado.id_producto_comprado ?? null,
          nombre: productoComprado.nombre ?? "",
          precio: productoComprado.precio ?? "",
          cantidad: productoComprado.cantidad ?? "",
          producto: productoComprado.producto && typeof productoComprado.producto === "object"
            ? { id_producto: productoComprado.producto.id_producto }
            : productos.find((p) => p.nombre === productoComprado.producto) || { id_producto: "" },
        });
      } else {
        console.log("🆕 Resetting form for new purchased product");
        setFormProductoComprado({
          id_producto_comprado: null,
          nombre: "",
          precio: "",
          cantidad: "",
          producto: { id_producto: "" },
        });
      }
    }
  }, [open, productoComprado, editing, productos]);
  

  const handleSave = () => {
    const formattedProductoComprado = {
      id_producto_comprado: formProductoComprado.id_producto_comprado,
      nombre: formProductoComprado.nombre.trim(),
      precio: formProductoComprado.precio ? parseFloat(formProductoComprado.precio) : 0,
      cantidad: formProductoComprado.cantidad ? parseInt(formProductoComprado.cantidad, 10) : 1,
      producto: { id_producto: formProductoComprado.producto.id_producto },
    };

    console.log("🚀 Saving purchased product:", JSON.stringify(formattedProductoComprado, null, 2));
    onSave(formattedProductoComprado);
  };

  return (
    <Dialog open={open} onClose={onClose} key={formProductoComprado.id_producto_comprado || "new"}>
      <DialogTitle>{editing ? "Editar Producto Comprado" : "Agregar Producto Comprado"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Nombre"
          fullWidth
          value={formProductoComprado.nombre}
          onChange={(e) => setFormProductoComprado({ ...formProductoComprado, nombre: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formProductoComprado.precio}
          onChange={(e) => setFormProductoComprado({ ...formProductoComprado, precio: parseFloat(e.target.value) || "" })}
        />
        <TextField
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          value={formProductoComprado.cantidad}
          onChange={(e) => setFormProductoComprado({ ...formProductoComprado, cantidad: parseInt(e.target.value, 10) || "" })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Producto</InputLabel>
          <Select
            value={formProductoComprado.producto.id_producto || ""}
            onChange={(e) =>
              setFormProductoComprado({
                ...formProductoComprado,
                producto: { id_producto: e.target.value },
              })
            }
          >
            {productos.map((producto) => (
              <MenuItem key={producto.id_producto} value={producto.id_producto}>
                {producto.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Agregar Producto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoCompradoFormDialog;
