import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllProductosComprados,
  createProductoComprado,
  updateProductoComprado,
  deleteProductoComprado,
} from "../api/productoCompradoApi";
import { getAllProductos } from "../api/productoApi";
import ProductosCompradosTable from "../components/ProductosCompradosTable";
import ProductoCompradoFormDialog from "../components/ProductoCompradoFormDialog";

const ProductosComprados = () => {
  const [productosComprados, setProductosComprados] = useState([]);
  const [productos, setProductos] = useState([]);
  const [currentProductoComprado, setCurrentProductoComprado] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchProductosCompradosData();
    fetchProductosData();
  }, []);

  const fetchProductosCompradosData = async () => {
    try {
      const data = await getAllProductosComprados();
      console.log("📤 API Response for Productos Comprados:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setProductosComprados(data);
      } else {
        console.error("❌ Unexpected data structure:", data);
        setProductosComprados([]);
      }
    } catch (error) {
      console.error("❌ Error fetching productos comprados:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar productos comprados.",
        severity: "error",
      });
    }
  };

  const fetchProductosData = async () => {
    try {
      const data = await getAllProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching productos:", error);
      setSnackbar({
        open: true,
        message: "Error al cargar productos.",
        severity: "error",
      });
    }
  };

  const handleSaveProductoComprado = async (productoComprado) => {
    try {
      console.log("📤 Saving Producto Comprado:", JSON.stringify(productoComprado, null, 2));

      if (editing) {
        if (!currentProductoComprado?.id_producto_comprado) {
          console.error("⚠️ Missing ID for update.");
          setSnackbar({
            open: true,
            message: "Error: Falta ID para actualizar.",
            severity: "error",
          });
          return;
        }
        console.log("🛠 Updating Producto Comprado ID:", currentProductoComprado.id_producto_comprado);
        await updateProductoComprado(currentProductoComprado.id_producto_comprado, productoComprado);
      } else {
        console.log("🆕 Creating new Producto Comprado");
        await createProductoComprado(productoComprado);
      }

      fetchProductosCompradosData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Producto comprado actualizado con éxito." : "Producto comprado creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error saving producto comprado:", error);
      setSnackbar({
        open: true,
        message: "Error al guardar el producto comprado.",
        severity: "error",
      });
    }
  };

  const handleEditProductoComprado = (productoComprado) => {
    console.log("✏️ Editing Producto Comprado:", JSON.stringify(productoComprado, null, 2));

    if (!productoComprado.id_producto_comprado) {
      console.error("⚠️ Error: No se encontró el ID de Producto Comprado.");
      return;
    }

    const updatedProductoComprado = {
      id_producto_comprado: productoComprado.id_producto_comprado,
      producto: productoComprado.producto || {}, // Ensure producto is an object
      nombre: productoComprado.nombre || "",
      precio: productoComprado.precio || 0,
      cantidad: productoComprado.cantidad || 1,
    };

    console.log("📝 Formulario cargado con datos:", JSON.stringify(updatedProductoComprado, null, 2));

    setCurrentProductoComprado(updatedProductoComprado);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteProductoComprado = async (id) => {
    try {
      await deleteProductoComprado(id);
      fetchProductosCompradosData();
      setSnackbar({
        open: true,
        message: "Producto comprado eliminado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error deleting producto comprado:", error);
      setSnackbar({
        open: true,
        message: "Error al eliminar el producto comprado.",
        severity: "error",
      });
    }
  };

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
        editing={editing}
        setSnackbar={setSnackbar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
      >
        <Alert onClose={() => setSnackbar({ open: false, message: "", severity: "success" })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductosComprados;
