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
import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../can";

const CompraFormDialog = ({
  open,
  onClose,
  onSave,
  compra,
  clientes = [],
  productos = [],
  editing,
  setSnackbar,
}) => {
  const { role } = useAuth();

  const [formCompra, setFormCompra] = useState({
    id_compra: null,
    cliente: { id_cliente: "" },
    fecha: dayjs().format("YYYY-MM-DDTHH:mm"),
    productosComprados: [{ id_producto: "", cantidad: 1 }],
  });

  useEffect(() => {
    if (!open) return;

    if (editing && compra) {
      setFormCompra({
        id_compra: compra.id_compra ?? null,
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
      setFormCompra({
        id_compra: null,
        cliente: { id_cliente: "" },
        fecha: dayjs().format("YYYY-MM-DDTHH:mm"),
        productosComprados: [{ id_producto: "", cantidad: 1 }],
      });
    }
  }, [open, compra, clientes]);

  const canEditCliente = canEditField(role, "compra", "cliente");
  const canEditFecha = canEditField(role, "compra", "fecha");
  const canEditProductos = canEditField(role, "compra", "productosComprados");
  const canSave = editing ? can(role, "edit", "compra") : can(role, "create", "compra");

  const handleSave = async () => {
    if (!canSave) {
      setSnackbar({ open: true, message: "No tienes permiso para esta acción.", severity: "error" });
      return;
    }

    if (!formCompra.cliente.id_cliente || formCompra.productosComprados.length === 0) {
      setSnackbar({ open: true, message: "Debe seleccionar un cliente y al menos un producto.", severity: "error" });
      return;
    }

    const payload = {
      id_compra: editing ? formCompra.id_compra : undefined,
      cliente: { id_cliente: formCompra.cliente.id_cliente },
      fecha: dayjs(formCompra.fecha).format("YYYY-MM-DDTHH:mm:ss"),
      productosComprados: formCompra.productosComprados.map(prod => ({
        id_producto_comprado: prod.id_producto_comprado || null,
        producto: { id_producto: prod.id_producto },
        cantidad: prod.cantidad || 1,
      })),
    };

    try {
      if (editing) {
        await updateCompra(formCompra.id_compra, payload);
      } else {
        await createCompra(payload);
      }
      onClose();
      setSnackbar({ open: true, message: editing ? "Compra actualizada con éxito." : "Compra creada con éxito.", severity: "success" });
    } catch (error) {
      console.error("❌ Error guardando compra:", error.response?.data || error.message);
      setSnackbar({ open: true, message: "Error guardando compra", severity: "error" });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Compra" : "Crear Compra"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense" disabled={!canEditCliente}>
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formCompra.cliente?.id_cliente || ""}
            onChange={(e) => {
              if (canEditCliente) {
                setFormCompra(prev => ({ ...prev, cliente: { id_cliente: e.target.value } }));
              }
            }}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.usuario.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Fecha de Compra"
          type="datetime-local"
          fullWidth
          margin="dense"
          value={formCompra.fecha}
          onChange={(e) => canEditFecha && setFormCompra({ ...formCompra, fecha: e.target.value })}
          disabled={!canEditFecha}
        />

        <div>
          <h4>Productos Comprados</h4>
          {formCompra.productosComprados.map((producto, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <FormControl fullWidth disabled={!canEditProductos}>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={producto.id_producto || ""}
                  onChange={(e) => {
                    if (canEditProductos) {
                      const updated = [...formCompra.productosComprados];
                      updated[index].id_producto = e.target.value;
                      setFormCompra({ ...formCompra, productosComprados: updated });
                    }
                  }}
                >
                  {productos.map((prod) => (
                    <MenuItem key={prod.id_producto} value={prod.id_producto}>
                      {prod.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Cantidad"
                type="number"
                value={producto.cantidad || 1}
                onChange={(e) => {
                  if (canEditProductos) {
                    const updated = [...formCompra.productosComprados];
                    updated[index].cantidad = e.target.value;
                    setFormCompra({ ...formCompra, productosComprados: updated });
                  }
                }}
                inputProps={{ min: 1 }}
                disabled={!canEditProductos}
              />

              {canEditProductos && (
                <IconButton onClick={() => {
                  const updated = formCompra.productosComprados.filter((_, i) => i !== index);
                  setFormCompra({ ...formCompra, productosComprados: updated });
                }} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </div>
          ))}

          {canEditProductos && (
            <Button startIcon={<AddCircleOutlineIcon />} onClick={() => {
              setFormCompra(prev => ({
                ...prev,
                productosComprados: [...prev.productosComprados, { id_producto: "", cantidad: 1 }],
              }));
            }} variant="outlined">
              Agregar Producto
            </Button>
          )}
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
          {editing ? "Guardar Cambios" : "Crear Compra"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompraFormDialog;
