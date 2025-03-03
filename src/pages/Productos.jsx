import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  fetchProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../api/productoApi";
import { getAllProveedores } from "../api/proveedorApi";
import ProductosTable from "../components/ProductosTable";
import ProductoFormDialog from "../components/ProductoFormDialog";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [currentProducto, setCurrentProducto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchProductosData();
    fetchProveedoresData();
  }, []);

  const fetchProductosData = async () => {
    try {
      const data = await fetchProductos();
      console.log("📤 API Response for Productos:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setProductos(data);
      } else {
        console.error("❌ API returned unexpected data structure:", data);
        setProductos([]);
      }
    } catch (error) {
      console.error("❌ Error fetching productos:", error);
      setSnackbar({ open: true, message: "Error al cargar productos.", severity: "error" });
    }
  };

  const fetchProveedoresData = async () => {
    try {
      const data = await getAllProveedores();
      setProveedores(data || []);
    } catch (error) {
      console.error("❌ Error fetching proveedores:", error);
      setSnackbar({ open: true, message: "Error al cargar proveedores.", severity: "error" });
    }
  };

  const handleSaveProducto = async (producto) => {
    try {
      console.log("📤 Saving Producto:", JSON.stringify(producto, null, 2));

      if (editing) {
        if (!currentProducto?.id_producto) {
          console.error("⚠️ No se puede actualizar, falta ID de Producto.");
          setSnackbar({ open: true, message: "Error: No se puede actualizar, falta ID.", severity: "error" });
          return;
        }
        console.log("🛠 Updating Producto with ID:", currentProducto.id_producto);
        await updateProducto(currentProducto.id_producto, producto);
      } else {
        console.log("🆕 Creating new Producto");
        await createProducto(producto);
      }

      fetchProductosData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Producto actualizado con éxito." : "Producto creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error saving producto:", error);
      setSnackbar({ open: true, message: "Error al guardar el producto.", severity: "error" });
    }
  };

  const handleEditProducto = (producto) => {
    console.log("✏️ Editing Producto:", JSON.stringify(producto, null, 2));

    if (!producto.id && !producto.id_producto) {
      console.error("⚠️ Error: No se encontró el ID de Producto.");
      return;
    }

    const updatedProducto = {
      id_producto: producto.id_producto || producto.id,
      proveedor: producto.proveedor ? producto.proveedor : {}, // ✅ Ensure proveedor is an object, even if it's just an empty object
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: typeof producto.precio === "string"
        ? parseFloat(producto.precio.replace(/[^0-9.]/g, "")) || 0
        : producto.precio || 0,
      stock: typeof producto.stock === "string"
        ? parseInt(producto.stock, 10) || 0
        : producto.stock || 0,
    };

    console.log("📝 Formulario cargado con datos (AFTER FIX):", JSON.stringify(updatedProducto, null, 2));

    setCurrentProducto(updatedProducto);
    setEditing(true);

    setTimeout(() => setOpenDialog(true), 100);
};

  const handleDeleteProducto = async (id) => {
    try {
      await deleteProducto(id);
      fetchProductosData();
      setSnackbar({ open: true, message: "Producto eliminado con éxito.", severity: "success" });
    } catch (error) {
      console.error("❌ Error deleting producto:", error);
      setSnackbar({ open: true, message: "Error al eliminar el producto.", severity: "error" });
    }
  };

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

      <ProductosTable productos={productos} onEdit={handleEditProducto} onDelete={handleDeleteProducto} />

      <ProductoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveProducto}
        producto={currentProducto}
        proveedores={proveedores}
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

export default Productos;
