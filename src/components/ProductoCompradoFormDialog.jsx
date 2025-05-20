import React, { useState, useEffect } from "react";
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../can";

const ProductoCompradoFormDialog = ({ open, onClose, onSave, productoComprado, productos, editing, setSnackbar }) => {
  const { role } = useAuth();

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
        setFormProductoComprado({
          id_producto_comprado: productoComprado.id_producto_comprado ?? null,
          nombre: productoComprado.nombre ?? "",
          precio: productoComprado.precio ?? "",
          cantidad: productoComprado.cantidad ?? "",
          producto:
            productoComprado.producto && typeof productoComprado.producto === "object"
              ? { id_producto: productoComprado.producto.id_producto }
              : productos.find((p) => p.nombre === productoComprado.producto) || { id_producto: "" },
        });
      } else {
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

  const canEditNombre = canEditField(role, "productocomprado", "nombre");
  const canEditPrecio = canEditField(role, "productocomprado", "precio");
  const canEditCantidad = canEditField(role, "productocomprado", "cantidad");
  const canEditProducto = canEditField(role, "productocomprado", "producto");
  const canSave = editing ? can(role, "edit", "productocomprado") : can(role, "create", "productocomprado");

  const handleSave = () => {
    if (!canSave) {
      setSnackbar?.({
        open: true,
        message: "No tienes permiso para realizar esta acción.",
        severity: "error",
      });
      return;
    }

    const formattedProductoComprado = {
      id_producto_comprado: formProductoComprado.id_producto_comprado,
      nombre: formProductoComprado.nombre.trim(),
      precio: formProductoComprado.precio ? parseFloat(formProductoComprado.precio) : 0,
      cantidad: formProductoComprado.cantidad ? parseInt(formProductoComprado.cantidad, 10) : 1,
      producto: { id_producto: formProductoComprado.producto.id_producto },
    };

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
          onChange={(e) => canEditNombre && setFormProductoComprado({ ...formProductoComprado, nombre: e.target.value })}
          disabled={!canEditNombre}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formProductoComprado.precio}
          onChange={(e) =>
            canEditPrecio && setFormProductoComprado({ ...formProductoComprado, precio: parseFloat(e.target.value) || "" })
          }
          disabled={!canEditPrecio}
        />
        <TextField
          margin="dense"
          label="Cantidad"
          type="number"
          fullWidth
          value={formProductoComprado.cantidad}
          onChange={(e) =>
            canEditCantidad && setFormProductoComprado({ ...formProductoComprado, cantidad: parseInt(e.target.value, 10) || "" })
          }
          disabled={!canEditCantidad}
        />
        <FormControl fullWidth margin="dense" disabled={!canEditProducto}>
          <InputLabel>Producto</InputLabel>
          <Select
            value={formProductoComprado.producto.id_producto || ""}
            onChange={(e) =>
              canEditProducto &&
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
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
          {editing ? "Guardar Cambios" : "Agregar Producto"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductoCompradoFormDialog;
