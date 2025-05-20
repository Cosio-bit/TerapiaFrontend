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
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const ProductosComprados = () => {
  const { role } = useAuth();

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
      setProductosComprados(Array.isArray(data) ? data : []);
    } catch (error) {
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
      setSnackbar({
        open: true,
        message: "Error al cargar productos.",
        severity: "error",
      });
    }
  };

  const handleSaveProductoComprado = async (productoComprado) => {
    if (editing && !can(role, "edit", "productocomprado")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar.", severity: "error" });
      return;
    }
    if (!editing && !can(role, "create", "productocomprado")) {
      setSnackbar({ open: true, message: "No tienes permiso para crear.", severity: "error" });
      return;
    }

    try {
      if (editing) {
        if (!currentProductoComprado?.id_producto_comprado) {
          setSnackbar({ open: true, message: "Error: Falta ID para actualizar.", severity: "error" });
          return;
        }
        await updateProductoComprado(currentProductoComprado.id_producto_comprado, productoComprado);
      } else {
        await createProductoComprado(productoComprado);
      }

      fetchProductosCompradosData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Producto actualizado." : "Producto creado.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar el producto.",
        severity: "error",
      });
    }
  };

  const handleEditProductoComprado = (productoComprado) => {
    if (!can(role, "edit", "productocomprado")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar.", severity: "error" });
      return;
    }

    const updatedProductoComprado = {
      id_producto_comprado: productoComprado.id_producto_comprado,
      producto: productoComprado.producto || {},
      nombre: productoComprado.nombre || "",
      precio: productoComprado.precio || 0,
      cantidad: productoComprado.cantidad || 1,
    };

    setCurrentProductoComprado(updatedProductoComprado);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteProductoComprado = async (id) => {
    if (!can(role, "delete", "productocomprado")) {
      setSnackbar({ open: true, message: "No tienes permiso para eliminar.", severity: "error" });
      return;
    }

    try {
      await deleteProductoComprado(id);
      fetchProductosCompradosData();
      setSnackbar({ open: true, message: "Producto eliminado.", severity: "success" });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar el producto.",
        severity: "error",
      });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos Comprados
      </Typography>

      {can(role, "create", "productocomprado") && (
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
      )}

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
        <Alert
          onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductosComprados;
