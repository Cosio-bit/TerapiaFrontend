import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../api/productoApi";
import { getAllProveedores } from "../api/proveedorApi";
import { getAllCategorias } from "../api/categoriaApi";
import ProductosTable from "../components/ProductosTable";
import ProductoFormDialog from "../components/ProductoFormDialog";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productosData, proveedoresData, categoriasData] = await Promise.all([
          getAllProductos(),
          getAllProveedores(),
          getAllCategorias(),
        ]);
        setProductos(productosData);
        setProveedores(proveedoresData);
        setCategorias(categoriasData);
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

  // Guardar o actualizar producto
  const handleSaveProducto = async (producto) => {
    try {
      if (editing) {
        await updateProducto(currentProducto.id_producto, producto);
      } else {
        await createProducto(producto);
      }
      setProductos(await getAllProductos());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Producto actualizado con éxito." : "Producto creado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar el producto.",
        severity: "error",
      });
    }
  };

  // Editar producto
  const handleEditProducto = (producto) => {
    setEditing(true);
    setCurrentProducto(producto);
    setOpenDialog(true);
  };

  // Eliminar producto
  const handleDeleteProducto = async (id) => {
    try {
      await deleteProducto(id);
      setProductos(await getAllProductos());
      setSnackbar({
        open: true,
        message: "Producto eliminado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar el producto.",
        severity: "error",
      });
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentProducto(null);
          setOpenDialog(true);
        }}
      >
        Crear Producto
      </Button>

      <ProductosTable
        productos={productos}
        onEdit={handleEditProducto}
        onDelete={handleDeleteProducto}
      />

      <ProductoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveProducto}
        producto={currentProducto}
        proveedores={proveedores}
        categorias={categorias}
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

export default Productos;
