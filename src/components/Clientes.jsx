import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../api/clienteApi";
import { getUsuarios } from "../api/usuarioApi";

const Clientes = () => {
  const navigate = useNavigate(); // Mover useNavigate dentro del componente
  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [newCliente, setNewCliente] = useState({
    id_usuario: "",
    fecha_registro: "",
    saldo: "",
  });
  const [editing, setEditing] = useState(false);
  const [currentClienteId, setCurrentClienteId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesData, usuariosData] = await Promise.all([
          getClientes(),
          getUsuarios(),
        ]);
        setClientes(clientesData);
        setUsuarios(usuariosData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar los datos.",
          severity: "error",
        });
      }
    };

    fetchData();
  }, []);

  const handleSaveCliente = async () => {
    try {
      if (editing) {
        await updateCliente(currentClienteId, newCliente);
        setEditing(false);
      } else {
        await createCliente(newCliente);
      }

      const updatedClientes = await getClientes();
      setClientes(updatedClientes);
      setNewCliente({ id_usuario: "", fecha_registro: "", saldo: "" });
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: "Cliente guardado con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar el cliente.",
        severity: "error",
      });
    }
  };

  const handleEditCliente = (cliente) => {
    setEditing(true);
    setCurrentClienteId(cliente.id);
    setNewCliente({
      id_usuario: cliente.id_usuario,
      fecha_registro: cliente.fecha_registro,
      saldo: cliente.saldo,
    });
    setOpenDialog(true);
  };

  const handleDeleteCliente = async (id) => {
    try {
      await deleteCliente(id);
      const updatedClientes = await getClientes();
      setClientes(updatedClientes);
      setSnackbar({
        open: true,
        message: "Cliente eliminado con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar el cliente.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
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
          setNewCliente({ id_usuario: "", fecha_registro: "", saldo: "" });
          setOpenDialog(true);
        }}
      >
        Crear Cliente
      </Button>

      <Box mt={3}>
        <DataGrid
          rows={clientes.map((cliente) => ({
            ...cliente,
            id: cliente.id_cliente,
          }))}
          columns={[
            { field: "id", headerName: "ID Cliente", flex: 1 },
            { field: "id_usuario", headerName: "ID Usuario", flex: 1 },
            { field: "fecha_registro", headerName: "Fecha Registro", flex: 1 },
            { field: "saldo", headerName: "Saldo", flex: 1 },
            {
              field: "actions",
              headerName: "Acciones",
              sortable: false,
              flex: 1,
              renderCell: (params) => (
                <Box>
                  <Button
                    size="small"
                    onClick={() => handleEditCliente(params.row)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCliente(params.row.id)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/crearSesiones/${params.row.id}`)}
                  >
                    Añadir Sesiones
                  </Button>
                </Box>
              ),
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          autoHeight
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editing ? "Editar Cliente" : "Crear Cliente"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Usuario</InputLabel>
            <Select
              value={newCliente.id_usuario}
              onChange={(e) =>
                setNewCliente({ ...newCliente, id_usuario: e.target.value })
              }
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre} - {usuario.email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Fecha Registro"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newCliente.fecha_registro}
            onChange={(e) =>
              setNewCliente({ ...newCliente, fecha_registro: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Saldo"
            type="number"
            fullWidth
            value={newCliente.saldo}
            onChange={(e) =>
              setNewCliente({ ...newCliente, saldo: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleSaveCliente}
            variant="contained"
            color="primary"
          >
            {editing ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default Clientes;
