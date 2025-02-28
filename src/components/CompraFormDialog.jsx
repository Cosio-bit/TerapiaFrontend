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

const CompraFormDialog = ({
  open,
  onClose,
  onSave,
  compra,
  clientes,
  productos,
  editing,
}) => {
  const [formCompra, setFormCompra] = useState({
    id_cliente: "",
    fecha: "",
    total: 0,
    productosComprados: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (compra) {
      setFormCompra(compra);
    } else {
      setFormCompra({
        id_cliente: "",
        fecha: "",
        total: 0,
        productosComprados: [],
      });
    }
    setErrors({});
  }, [compra]);

  const validateForm = () => {
    const newErrors = {};
    if (!formCompra.id_cliente) newErrors.id_cliente = "El cliente es obligatorio.";
    if (!formCompra.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (formCompra.productosComprados.length === 0)
      newErrors.productosComprados = "Debe agregar al menos un producto.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formCompra);
    }
  };

  const handleAddProducto = () => {
    setFormCompra((prevState) => ({
      ...prevState,
      productosComprados: [
        ...prevState.productosComprados,
        { id_producto: "", cantidad: 1 },
      ],
    }));
  };

  const handleRemoveProducto = (index) => {
    const updatedProductos = [...formCompra.productosComprados];
    updatedProductos.splice(index, 1);
    setFormCompra((prevState) => ({
      ...prevState,
      productosComprados: updatedProductos,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Compra" : "Crear Compra"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formCompra.id_cliente}
            onChange={(e) =>
              setFormCompra({ ...formCompra, id_cliente: e.target.value })
            }
            error={!!errors.id_cliente}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          margin="dense"
          label="Fecha"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formCompra.fecha}
          onChange={(e) => setFormCompra({ ...formCompra, fecha: e.target.value })}
          error={!!errors.fecha}
          helperText={errors.fecha}
        />
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddProducto}
        >
          Agregar Producto
        </Button>
        {formCompra.productosComprados.map((producto, index) => (
          <div key={index}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Producto</InputLabel>
              <Select
                value={producto.id_producto}
                onChange={(e) => {
                  const updatedProductos = [...formCompra.productosComprados];
                  updatedProductos[index].id_producto = e.target.value;
                  setFormCompra({ ...formCompra, productosComprados: updatedProductos });
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
              margin="dense"
              label="Cantidad"
              type="number"
              fullWidth
              value={producto.cantidad}
              onChange={(e) => {
                const updatedProductos = [...formCompra.productosComprados];
                updatedProductos[index].cantidad = e.target.value;
                setFormCompra({ ...formCompra, productosComprados: updatedProductos });
              }}
            />
            <Button
              color="error"
              onClick={() => handleRemoveProducto(index)}
            >
              Eliminar
            </Button>
          </div>
        ))}
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
