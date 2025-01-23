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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getSesiones,
  createSesion,
  updateSesion,
  deleteSesion,
} from "../api/sesionApi";
import { getTerapias } from "../api/terapiaApi";
import { getProfesionales } from "../api/profesionalApi";
import { getClientes } from "../api/clienteApi";

const Sesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [terapias, setTerapias] = useState([]);
  const [profesionales, setProfesionales] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [newSesion, setNewSesion] = useState({
    id_terapia: "",
    id_profesional: "",
    id_cliente: "",
    fecha_hora: "",
    estado: "",
    precio: "",
  });
  const [editing, setEditing] = useState(false);
  const [currentSesionId, setCurrentSesionId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sesionesData, terapiasData, profesionalesData, clientesData] =
          await Promise.all([
            getSesiones(),
            getTerapias(),
            getProfesionales(),
            getClientes(),
          ]);

        setSesiones(
          sesionesData.map((s) => ({
            ...s,
            id: s.id_sesion, // Map to `id` for DataGrid
          }))
        );
        setTerapias(terapiasData);
        setProfesionales(profesionalesData);
        setClientes(clientesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Save or update a session
  const handleSaveSesion = async () => {
    try {
      if (editing) {
        await updateSesion(currentSesionId, newSesion);
      } else {
        await createSesion(newSesion);
      }
      const updatedSesiones = await getSesiones();
      setSesiones(
        updatedSesiones.map((s) => ({
          ...s,
          id: s.id_sesion, // Map to `id` for DataGrid
        }))
      );
      resetForm();
      showSnackbar("Sesión guardada con éxito.", "success");
    } catch (error) {
      showSnackbar("Error al guardar la sesión.", "error");
    }
  };

  // Edit a session
  const handleEditSesion = (sesion) => {
    setEditing(true);
    setCurrentSesionId(sesion.id_sesion);
    setNewSesion(sesion);
    setOpenDialog(true);
  };

  // Delete a session
  const handleDeleteSesion = async (id) => {
    try {
      await deleteSesion(id);
      const updatedSesiones = await getSesiones();
      setSesiones(
        updatedSesiones.map((s) => ({
          ...s,
          id: s.id_sesion, // Map to `id` for DataGrid
        }))
      );
      showSnackbar("Sesión eliminada con éxito.", "success");
    } catch (error) {
      showSnackbar("Error al eliminar la sesión.", "error");
    }
  };

  // Reset the form
  const resetForm = () => {
    setNewSesion({
      id_terapia: "",
      id_profesional: "",
      id_cliente: "",
      fecha_hora: "",
      estado: "",
      precio: "",
    });
    setEditing(false);
    setOpenDialog(false);
  };

  // Show a snackbar message
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () =>
    setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Sesiones
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          resetForm();
          setOpenDialog(true);
        }}
      >
        Crear Sesión
      </Button>
      <Box mt={3}>
      <DataGrid
  rows={sesiones}
  getRowId={(row) => row.id_sesion}
  columns={[
    {
      field: "id_cliente",
      headerName: "Cliente",
      flex: 1,
      // Mostrará directamente el ID del cliente sin buscar en `clientes`
    },
    {
      field: "id_terapia",
      headerName: "Terapia",
      flex: 1,
      // Mostrará directamente el ID de la terapia sin buscar en `terapias`
    },
    {
      field: "id_profesional",
      headerName: "Profesional",
      flex: 1,
      // Mostrará directamente el ID del profesional sin buscar en `profesionales`
    },

    {
      field: "fecha_hora",
      headerName: "Fecha y Hora",
      flex: 1,
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
    },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleEditSesion(params.row)}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleDeleteSesion(params.row.id_sesion)}
          >
            Eliminar
          </Button>
        </>
      ),
    },
    
  ]}
  pageSize={5}
  autoHeight
  onRowClick={(params) => handleEditSesion(params.row)}
/>


      </Box>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editing ? "Editar Sesión" : "Crear Sesión"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Terapia</InputLabel>
            <Select
              value={newSesion.id_terapia}
              onChange={(e) =>
                setNewSesion({ ...newSesion, id_terapia: e.target.value })
              }
            >
              {terapias.map((terapia) => (
                <MenuItem key={terapia.id_terapia} value={terapia.id_terapia}>
                  {terapia.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Profesional</InputLabel>
            <Select
              value={newSesion.id_profesional}
              onChange={(e) =>
                setNewSesion({ ...newSesion, id_profesional: e.target.value })
              }
            >
              {profesionales.map((profesional) => (
                <MenuItem
                  key={profesional.id_profesional}
                  value={profesional.id_profesional}
                >
                  {profesional.id_profesional}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={newSesion.id_cliente}
              onChange={(e) =>
                setNewSesion({ ...newSesion, id_cliente: e.target.value })
              }
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                  {cliente.id_cliente}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Fecha y Hora"
            type="datetime-local"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={newSesion.fecha_hora}
            onChange={(e) =>
              setNewSesion({ ...newSesion, fecha_hora: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Estado"
            fullWidth
            value={newSesion.estado}
            onChange={(e) =>
              setNewSesion({ ...newSesion, estado: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Precio"
            type="number"
            fullWidth
            value={newSesion.precio}
            onChange={(e) =>
              setNewSesion({ ...newSesion, precio: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleSaveSesion} variant="contained" color="primary">
            {editing ? "Guardar Cambios" : "Crear Sesión"}
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

export default Sesiones;
