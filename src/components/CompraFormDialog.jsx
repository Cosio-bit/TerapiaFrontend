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
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import { createCompra, updateCompra } from "../api/compraApi";

const CompraFormDialog = ({ 
  open, 
  onClose, 
  onSave, 
  compra, 
  clientes = [], 
  productos = [], 
  editing,
  setSnackbar 
}) => {
  const [formCompra, setFormCompra] = useState({
    id_compra: null,
    cliente: { id_cliente: "" },
    fecha: dayjs().format("YYYY-MM-DDTHH:mm"),
    productosComprados: [{ id_producto: "", cantidad: 1 }],
  });

  useEffect(() => {
    if (!open) return;

    if (editing && compra) {
      console.log("✏️ Editing compra:", compra);

      setFormCompra({
        id_compra: (compra.id || compra.id_compra) ?? null, // ✅ Corregido
        cliente: typeof compra.cliente === "string"
          ? { id_cliente: clientes.find(c => c.usuario.nombre === compra.cliente)?.id_cliente || "" }
          : { id_cliente: compra.cliente?.id_cliente || "" },
        fecha: compra.fecha
          ? dayjs(compra.fecha, ["DD/MM/YYYY HH:mm", "YYYY-MM-DDTHH:mm:ss"]).format("YYYY-MM-DDTHH:mm") 
          : dayjs().format("YYYY-MM-DDTHH:mm"),
        productosComprados: compra.productosComprados?.map(prod => ({
          id_producto_comprado: prod.id_producto_comprado || null,
          id_producto: prod.producto?.id_producto || "",
          cantidad: prod.cantidad || 1,
        })) || [{ id_producto: "", cantidad: 1 }],
      });
      
    } else {
      console.log("🆕 Creating new compra");
      setFormCompra({
        id_compra: null,
        cliente: { id_cliente: "" },
        fecha: dayjs().format("YYYY-MM-DDTHH:mm"),
        productosComprados: [{ id_producto: "", cantidad: 1 }],
      });
    }
  }, [open, compra, clientes]);
  const handleSave = async () => {
    if (!formCompra.cliente.id_cliente || formCompra.productosComprados.length === 0) {
      setSnackbar({ open: true, message: "Debe seleccionar un cliente y al menos un producto.", severity: "error" });
      return;
    }
  
    const payload = {
      id_compra: editing ? formCompra.id_compra : undefined, // ✅ Asegurar que `id_compra` solo se envíe en edición
      cliente: { id_cliente: formCompra.cliente.id_cliente }, // ✅ Cliente como objeto
      fecha: dayjs(formCompra.fecha).format("YYYY-MM-DDTHH:mm:ss"), // ✅ Formato correcto
      productosComprados: formCompra.productosComprados.map(prod => ({
        id_producto_comprado: prod.id_producto_comprado || null,
        producto: { id_producto: prod.id_producto },
        cantidad: prod.cantidad || 1,
      })),
    };
  
    console.log("🚀 Saving compra:", JSON.stringify(payload, null, 2));

    const handleSave = async () => {
  try {
    console.log("🚀 Saving compra:", JSON.stringify(formCompra, null, 2));

    if (editing) {
      if (!formCompra.id_compra) {
        console.error("❌ Error: id_compra es undefined en edición");
        setSnackbar({ open: true, message: "Error: No se puede actualizar sin ID", severity: "error" });
        return;
      }
      await updateCompra(formCompra.id_compra, formCompra);
    } else {
      await createCompra(formCompra);
    }

    onClose();
    setSnackbar({ open: true, message: editing ? "Compra actualizada con éxito." : "Compra creada con éxito.", severity: "success" });
  } catch (error) {
    console.error("❌ Error guardando compra:", error);
    setSnackbar({ open: true, message: "Error al guardar la compra.", severity: "error" });
  }
};

  
    try {
      if (editing) {
        if (!formCompra.id_compra) {
          console.error("❌ Error: id_compra es undefined en edición");
          setSnackbar({ open: true, message: "Error: No se puede actualizar sin ID", severity: "error" });
          return;
        }
        await updateCompra(formCompra.id_compra, payload); // ✅ Asegurar que `id_compra` no es undefined
      } else {
        await createCompra(payload);
      }
      onClose(); // Cerrar modal al guardar
    } catch (error) {
      console.error("❌ Error guardando compra:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Error guardando compra", severity: "error" });
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Compra" : "Crear Compra"}</DialogTitle>
      <DialogContent>
        {/* Selección de Cliente */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formCompra.cliente?.id_cliente || ""}
            onChange={(e) =>
              setFormCompra(prevState => ({
                ...prevState,
                cliente: { id_cliente: e.target.value }
              }))
            }
          >
            {clientes.length > 0 ? (
              clientes.map((cliente) => (
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.usuario.nombre}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No hay clientes disponibles</MenuItem>
            )}
          </Select>
        </FormControl>

        {/* Fecha de Compra */}
        <TextField
          label="Fecha de Compra"
          type="datetime-local"
          fullWidth
          margin="dense"
          value={formCompra.fecha}
          onChange={(e) => setFormCompra({ ...formCompra, fecha: e.target.value })}
        />

        {/* Productos Comprados */}
        <div>
          <h4>Productos Comprados</h4>
          {formCompra.productosComprados.map((producto, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <FormControl fullWidth>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={producto.id_producto || ""}
                  onChange={(e) => {
                    const updatedProductos = [...formCompra.productosComprados];
                    updatedProductos[index].id_producto = e.target.value;
                    setFormCompra({ ...formCompra, productosComprados: updatedProductos });
                  }}
                >
                  {productos.length > 0 ? (
                    productos.map((prod) => (
                      <MenuItem key={prod.id_producto} value={prod.id_producto}>
                        {prod.nombre}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No hay productos disponibles</MenuItem>
                  )}
                </Select>
              </FormControl>

              {/* Cantidad */}
              <TextField
                label="Cantidad"
                type="number"
                value={producto.cantidad || 1}
                onChange={(e) => {
                  const updatedProductos = [...formCompra.productosComprados];
                  updatedProductos[index].cantidad = e.target.value;
                  setFormCompra({ ...formCompra, productosComprados: updatedProductos });
                }}
                inputProps={{ min: 1 }}
              />

              {/* Botón para eliminar producto */}
              <IconButton onClick={() => {
                const updatedProductos = formCompra.productosComprados.filter((_, i) => i !== index);
                setFormCompra({ ...formCompra, productosComprados: updatedProductos });
              }} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          ))}

          {/* Botón para agregar otro producto */}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={() => {
            setFormCompra(prevState => ({
              ...prevState,
              productosComprados: [...prevState.productosComprados, { id_producto: "", cantidad: 1 }],
            }));
          }} variant="outlined">
            Agregar Producto
          </Button>
        </div>
      </DialogContent>

      {/* Botones de acción */}
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Compra"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompraFormDialog;
