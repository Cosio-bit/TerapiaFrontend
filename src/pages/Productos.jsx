import React, { useState, useEffect } from "react"
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material"
import {
  fetchProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../api/productoApi"
import { getAllProveedores } from "../api/proveedorApi"
import ProductosTable from "../components/ProductosTable"
import ProductoFormDialog from "../components/ProductoFormDialog"
import { useAuth } from "../components/authcontext"
import { can } from "../utils/can"

const Productos = () => {
  const { role } = useAuth()

  const [productos, setProductos] = useState([])
  const [proveedores, setProveedores] = useState([])
  const [currentProducto, setCurrentProducto] = useState(null)
  const [editing, setEditing] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })

  useEffect(() => {
    fetchProductosData()
    fetchProveedoresData()
  }, [])

  const fetchProductosData = async () => {
    try {
      const data = await fetchProductos()
      setProductos(Array.isArray(data) ? data : [])
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar productos.", severity: "error" })
    }
  }

  const fetchProveedoresData = async () => {
    try {
      const data = await getAllProveedores()
      setProveedores(data || [])
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar proveedores.", severity: "error" })
    }
  }

  const handleSaveProducto = async (producto) => {
    if (editing && !can(role, "edit", "producto")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar productos.", severity: "error" })
      return
    }
    if (!editing && !can(role, "create", "producto")) {
      setSnackbar({ open: true, message: "No tienes permiso para crear productos.", severity: "error" })
      return
    }

    try {
      if (editing) {
        if (!currentProducto?.id_producto) {
          setSnackbar({ open: true, message: "Error: Falta ID para actualizar.", severity: "error" })
          return
        }
        await updateProducto(currentProducto.id_producto, producto)
      } else {
        await createProducto(producto)
      }

      fetchProductosData()
      setOpenDialog(false)
      setSnackbar({
        open: true,
        message: editing ? "Producto actualizado con éxito." : "Producto creado con éxito.",
        severity: "success",
      })
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar el producto.", severity: "error" })
    }
  }

  const handleEditProducto = (producto) => {
    if (!can(role, "edit", "producto")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar productos.", severity: "error" })
      return
    }

    const updatedProducto = {
      id_producto: producto.id_producto || producto.id,
      proveedor: producto.proveedor ? producto.proveedor : {},
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: typeof producto.precio === "string"
        ? parseFloat(producto.precio.replace(/[^0-9.]/g, "")) || 0
        : producto.precio || 0,
      stock: typeof producto.stock === "string"
        ? parseInt(producto.stock, 10) || 0
        : producto.stock || 0,
    }

    setCurrentProducto(updatedProducto)
    setEditing(true)
    setTimeout(() => setOpenDialog(true), 100)
  }

  const handleDeleteProducto = async (id) => {
    if (!can(role, "delete", "producto")) {
      setSnackbar({ open: true, message: "No tienes permiso para eliminar productos.", severity: "error" })
      return
    }

    try {
      await deleteProducto(id)
      fetchProductosData()
      setSnackbar({ open: true, message: "Producto eliminado con éxito.", severity: "success" })
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar el producto.", severity: "error" })
    }
  }

  return (
    <Box px={{ xs: 2, md: 4 }} py={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      {can(role, "create", "producto") && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => {
            setEditing(false)
            setCurrentProducto(null)
            setOpenDialog(true)
          }}
        >
          Crear Producto
        </Button>
      )}

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
  )
}

export default Productos
