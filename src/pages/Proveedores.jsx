import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../api/proveedorApi";
import { getAllUsuarios } from "../api/usuarioApi"; // Importa la función para obtener usuarios
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedorFormDialog from "../components/ProveedorFormDialog";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Estado para los usuarios
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchProveedores = async () => {
      try {
        const data = await getAllProveedores();
        setProveedores(data);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar los proveedores.",
          severity: "error",
        });
      }
    };

    const fetchUsuarios = async () => {
      try {
        const usuariosData = await getAllUsuarios();
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    fetchProveedores();
    fetchUsuarios(); // Llama a la función para obtener usuarios
  }, []);

  const handleSaveProveedor = async (proveedor) => {
    try {
      if (editing) {
        await updateProveedor(currentProveedor.id_proveedor, proveedor);
      } else {
        await createProveedor(proveedor);
      }
      setProveedores(await getAllProveedores());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Proveedor actualizado con éxito." : "Proveedor creado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar el proveedor.",
        severity: "error",
      });
    }
  };

  const handleEditProveedor = (proveedor) => {
    setEditing(true);
    setCurrentProveedor(proveedor);
    setOpenDialog(true);
  };

  const handleDeleteProveedor = async (id) => {
    try {
      await deleteProveedor(id);
      setProveedores(await getAllProveedores());
      setSnackbar({
        open: true,
        message: "Proveedor eliminado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar el proveedor.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Proveedores
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentProveedor(null);
          setOpenDialog(true);
        }}
      >
        Crear Proveedor
      </Button>

      <ProveedoresTable
        proveedores={proveedores}
        onEdit={handleEditProveedor}
        onDelete={handleDeleteProveedor}
      />

      <ProveedorFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveProveedor}
        proveedor={currentProveedor}
        usuarios={usuarios} // Aquí pasamos la lista de usuarios
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

export default Proveedores;
