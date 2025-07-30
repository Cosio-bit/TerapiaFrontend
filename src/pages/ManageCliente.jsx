// src/pages/Clientes.jsx
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Snackbar, 
  Alert, 
  Typography, 
  Paper,
  CircularProgress,
  Container
} from "@mui/material";
import { Add as AddIcon, Man } from "@mui/icons-material";

// API imports
import { getAllClientes, createCliente, updateCliente, deleteCliente } from "../api/clienteApi";
import { getAllUsuarios } from "../api/usuarioApi";
import { fetchProveedores } from "../api/proveedorApi";

// Component imports
import ClientesTable from "../components/ClientesTable2";
import ClienteFormDialog from "../components/ClienteFormDialog";
import { useAuth } from "../components/authcontext";
import { can } from "../utils/can";

const ManageCliente = () => {
  const { role } = useAuth();

  // Estados principales
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchClientes(),
          fetchUsuarios(),
          fetchProveedores()
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
        setSnackbar({ 
          open: true, 
          message: "Error al cargar los datos iniciales.", 
          severity: "error" 
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Función para cargar clientes
  const fetchClientes = async () => {
    try {
      const clientesData = await getAllClientes();
      setClientes(Array.isArray(clientesData) ? clientesData : []);
    } catch (error) {
      console.error("Error fetching clientes:", error);
      setSnackbar({ 
        open: true, 
        message: "Error al cargar los clientes.", 
        severity: "error" 
      });
    }
  };

  // Función para cargar usuarios
  const fetchUsuarios = async () => {
    try {
      const usuariosData = await getAllUsuarios();
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : []);
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      setSnackbar({ 
        open: true, 
        message: "Error al cargar los usuarios.", 
        severity: "error" 
      });
    }
  };

  // Función para cargar proveedores
  const fetchProveedores = async () => {
    try {
      const proveedoresData = await fetchProveedores();
      setProveedores(Array.isArray(proveedoresData) ? proveedoresData : []);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
      // No mostramos error para proveedores ya que es opcional
    }
  };

  // Manejar guardado de cliente
  const handleSaveCliente = async (cliente) => {
    // Verificar permisos
    if (editing && !can(role, "edit", "cliente")) {
      setSnackbar({ 
        open: true, 
        message: "No tiene permiso para editar clientes.", 
        severity: "error" 
      });
      return;
    }

    if (!editing && !can(role, "create", "cliente")) {
      setSnackbar({ 
        open: true, 
        message: "No tiene permiso para crear clientes.", 
        severity: "error" 
      });
      return;
    }

    try {
      if (editing) {
        await updateCliente(currentCliente.id_cliente, cliente);
      } else {
        await createCliente(cliente);
      }

      await fetchClientes();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing 
          ? "Cliente actualizado con éxito." 
          : "Cliente creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("Error saving cliente:", error);
      setSnackbar({ 
        open: true, 
        message: "Error al guardar el cliente.", 
        severity: "error" 
      });
    }
  };

  // Manejar edición de cliente
  const handleEditCliente = (cliente) => {
    if (!can(role, "edit", "cliente")) {
      setSnackbar({ 
        open: true, 
        message: "No tiene permiso para editar clientes.", 
        severity: "error" 
      });
      return;
    }

    setEditing(true);
    setCurrentCliente(cliente);
    setOpenDialog(true);
  };

  // Manejar eliminación de cliente
  const handleDeleteCliente = async (id) => {
    if (!can(role, "delete", "cliente")) {
      setSnackbar({ 
        open: true, 
        message: "No tiene permiso para eliminar clientes.", 
        severity: "error" 
      });
      return;
    }

    if (!window.confirm("¿Está seguro de que desea eliminar este cliente?")) {
      return;
    }

    try {
      await deleteCliente(id);
      await fetchClientes();
      setSnackbar({ 
        open: true, 
        message: "Cliente eliminado con éxito.", 
        severity: "success" 
      });
    } catch (error) {
      console.error("Error deleting cliente:", error);
      setSnackbar({ 
        open: true, 
        message: "Error al eliminar el cliente.", 
        severity: "error" 
      });
    }
  };

  // Manejar apertura del diálogo para crear cliente
  const handleCreateCliente = () => {
    if (!can(role, "create", "cliente")) {
      setSnackbar({ 
        open: true, 
        message: "No tiene permiso para crear clientes.", 
        severity: "error" 
      });
      return;
    }

    setEditing(false);
    setCurrentCliente(null);
    setOpenDialog(true);
  };

  // Manejar cierre del snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={40} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Gestión de Clientes
          </Typography>

          {can(role, "create", "cliente") && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateCliente}
              size="large"
            >
              Crear Cliente
            </Button>
          )}
        </Box>

        {/* Estadísticas rápidas */}
        <Box display="flex" gap={2} mb={3}>
          <Paper sx={{ p: 2, flex: 1 }} elevation={1}>
            <Typography variant="h6" color="primary" fontWeight="bold">
              {clientes.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Clientes
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }} elevation={1}>
            <Typography variant="h6" color="success.main" fontWeight="bold">
              {clientes.filter(c => c.saldo >= 0).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saldo Positivo
            </Typography>
          </Paper>
          <Paper sx={{ p: 2, flex: 1 }} elevation={1}>
            <Typography variant="h6" color="warning.main" fontWeight="bold">
              {clientes.filter(c => c.saldo < 0).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saldo Negativo
            </Typography>
          </Paper>
        </Box>

        {/* Tabla de clientes */}
        <ClientesTable
          clientes={clientes}
          onEdit={handleEditCliente}
          onDelete={handleDeleteCliente}
          proveedores={proveedores}
        />

        {/* Diálogo de formulario */}
        <ClienteFormDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onSave={handleSaveCliente}
          cliente={currentCliente}
          usuarios={usuarios}
          setUsuarios={setUsuarios}
          editing={editing}
        />

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ManageCliente;