import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllProductosComprados,
  createProductoComprado,
  updateProductoComprado,
  deleteProductoComprado,
} from "../api/productoCompradoApi";
import { getAllProductos } from "../api/productoApi";
import { getAllCompras } from "../api/compraApi";
import ProductosCompradosTable from "../components/ProductosCompradosTable";
import ProductoCompradoFormDialog from "../components/ProductoCompradoFormDialog";

const ProductosComprados = () => {
  const [productosComprados, setProductosComprados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [compras, setCompras] = useState([]);
  const [currentProductoComprado, setCurrentProductoComprado] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosCompradosData, productosData, comprasData] = await Promise.all([
          getAllProductosComprados(),
          getProductos(),
          getAllCompras(),
        ]);
        setProductosComprados(productosCompradosData);
        setProductos(productosData);
        setCompras(comprasData);
      } catch {
        setSnackbar({
          open: true,
          message: "Error al cargar los datos.",
          severity: "error",
        });
      }
    };

    fetchData();
  }, []);

  const handleSaveProductoComprado = async (productoComprado) => {
    try {
      if (editing) {
        await updateProductoComprado(
          currentProductoComprado.id_productocomprado,
          productoComprado
        );
      } else {
        await createProductoComprado(productoComprado);
      }
      setProductosComprados(await getAllProductosComprados());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing
          ? "Producto Comprado actualizado con éxito."
          : "Producto Comprado creado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar el producto comprado.",
        severity: "error",
      });
    }
  };

  const handleEditProductoComprado = (productoComprado) => {
    setEditing(true);
    setCurrentProductoComprado(productoComprado);
    setOpenDialog(true);
  };

  const handleDeleteProductoComprado = async (id) => {
    try {
      await deleteProductoComprado(id);
      setProductosComprados(await getAllProductosComprados());
      setSnackbar({
        open: true,
        message: "Producto Comprado eliminado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar el producto comprado.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos Comprados
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentProductoComprado(null);
          setOpenDialog(true);
        }}
      >
        Crear Producto Comprado
      </Button>

      <ProductosCompradosTable
        productosComprados={productosComprados}
        onEdit={handleEditProductoComprado}
        onDelete={handleDeleteProductoComprado}
      />

      <ProductoCompradoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveProductoComprado}
        productoComprado={currentProductoComprado}
        productos={productos}
        compras={compras}
        editing={editing}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductosComprados;
