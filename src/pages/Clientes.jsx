import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import { getAllClientes, createCliente, updateCliente, deleteCliente } from "../api/clienteApi";
import { getAllUsuarios } from "../api/usuarioApi";
import ClientesTable from "../components/ClientesTable";
import ClienteFormDialog from "../components/ClienteFormDialog";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchClientes();
    fetchUsuarios();
  }, []);

  const fetchClientes = async () => {
    try {
      const clientesData = await getAllClientes();
      setClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar los clientes.", severity: "error" });
    }
  };

  const fetchUsuarios = async () => {
    try {
      const usuariosData = await getAllUsuarios();
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar los usuarios.", severity: "error" });
    }
  };

  const handleSaveCliente = async (cliente) => {
    try {
      if (editing) {
        await updateCliente(currentCliente.id_cliente, cliente);
      } else {
        await createCliente(cliente);
      }
      fetchClientes();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Cliente actualizado con éxito." : "Cliente creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar el cliente.", severity: "error" });
    }
  };

  const handleEditCliente = (cliente) => {
    setEditing(true);
    setCurrentCliente(cliente);
    setOpenDialog(true);
  };

  const handleDeleteCliente = async (id) => {
    try {
      await deleteCliente(id);
      fetchClientes();
      setSnackbar({ open: true, message: "Cliente eliminado con éxito.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar el cliente.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Clientes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentCliente(null);
          setOpenDialog(true);
        }}
      >
        Crear Cliente
      </Button>

      <ClientesTable clientes={clientes} onEdit={handleEditCliente} onDelete={handleDeleteCliente} />

      <ClienteFormDialog open={openDialog} onClose={() => setOpenDialog(false)} onSave={handleSaveCliente} cliente={currentCliente} usuarios={usuarios} editing={editing} />
    </Box>
  );
};

export default Clientes;
