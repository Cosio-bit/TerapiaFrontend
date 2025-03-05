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
        id_compra: compra.id_compra ?? null,
        cliente: compra.cliente ? { id_cliente: compra.cliente.id_cliente } : { id_cliente: "" },
        fecha: compra.fecha 
          ? dayjs(compra.fecha).format("YYYY-MM-DDTHH:mm") 
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
  }, [open, compra]);
  
  

  const handleSave = async () => {
    if (!formCompra.cliente.id_cliente || formCompra.productosComprados.length === 0) {
      setSnackbar({ open: true, message: "Debe seleccionar un cliente y al menos un producto.", severity: "error" });
      return;
    }

    const payload = {
      id_compra: editing ? formCompra.id_compra : undefined,
      cliente: { id_cliente: formCompra.cliente.id_cliente },
      fecha: formCompra.fecha ? dayjs(formCompra.fecha).format("YYYY-MM-DDTHH:mm:ss") : null,
      productosComprados: formCompra.productosComprados.map(prod => ({
        id_producto_comprado: prod.id_producto_comprado || null,
        producto: { id_producto: prod.id_producto },
        cantidad: prod.cantidad || 1,
      })),
    };

    console.log("🚀 Saving compra:", JSON.stringify(payload, null, 2));
    onSave(payload);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Compra" : "Crear Compra"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel></InputLabel>
          <FormControl fullWidth margin="dense">
  <InputLabel>Cliente</InputLabel>
  <Select
    value={formCompra.cliente?.id_cliente || ""}
    onChange={(e) =>
      setFormCompra(prevState => ({
        ...prevState,
        cliente: { id_cliente: e.target.value } // ✅ Ensure proper object structure
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

        </FormControl>

        <TextField
          label="Fecha de Compra"
          type="datetime-local"
          fullWidth
          margin="dense"
          value={formCompra.fecha}
          onChange={(e) => setFormCompra({ ...formCompra, fecha: e.target.value })}
        />

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
              <IconButton onClick={() => {
                const updatedProductos = formCompra.productosComprados.filter((_, i) => i !== index);
                setFormCompra({ ...formCompra, productosComprados: updatedProductos });
              }} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
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
