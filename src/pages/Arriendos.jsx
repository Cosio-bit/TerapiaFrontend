import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
// Asegúrate de que los nombres de los imports sean consistentes con el archivo Axios y los métodos definidos allí.
import { getAllArriendos, createArriendo, updateArriendo, deleteArriendo } from "../api/arriendoApi";
import { getAllSalas } from "../api/salaApi"; // Consistencia en el nombre de la función
import { getAllClientes } from "../api/clienteApi"; // Consistencia en el nombre de la función
import ArriendosTable from "../components/ArriendosTable";
import ArriendoFormDialog from "../components/ArriendoFormDialog";

const Arriendos = () => {
  const [arriendos, setArriendos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentArriendo, setCurrentArriendo] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar datos al iniciar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Nombres de funciones consistentes con los archivos API
        const [arriendosData, salasData, clientesData] = await Promise.all([
          getAllArriendos(),
          getAllSalas(),
          getAllClientes(),
        ]);
        setArriendos(arriendosData);
        setSalas(salasData);
        setClientes(clientesData);
      } catch (err) {
        setError("Error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Guardar o actualizar un arriendo
  const handleSaveArriendo = async (arriendo) => {
    try {
      if (editing) {
        await updateArriendo(currentArriendo.id_arriendo, arriendo);
      } else {
        await createArriendo(arriendo);
      }
      setArriendos(await getAllArriendos());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Arriendo actualizado con éxito." : "Arriendo creado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al guardar el arriendo.",
        severity: "error",
      });
    }
  };

  // Editar un arriendo
  const handleEditArriendo = (arriendo) => {
    setEditing(true);
    setCurrentArriendo(arriendo);
    setOpenDialog(true);
  };

  // Eliminar un arriendo
  const handleDeleteArriendo = async (id) => {
    try {
      await deleteArriendo(id);
      setArriendos(await getAllArriendos());
      setSnackbar({
        open: true,
        message: "Arriendo eliminado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({
        open: true,
        message: "Error al eliminar el arriendo.",
        severity: "error",
      });
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

  if (loading) {
    return <Typography>Cargando...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        {error}
      </Typography>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Arriendos
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditing(false);
            setCurrentArriendo(null);
            setOpenDialog(true);
          }}
        >
          Crear Arriendo
        </Button>
      </Box>

      <ArriendosTable
        arriendos={arriendos}
        salas={salas}
        clientes={clientes}
        onEdit={handleEditArriendo}
        onDelete={handleDeleteArriendo}
      />

      <ArriendoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveArriendo}
        arriendo={currentArriendo}
        salas={salas}
        clientes={clientes}
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

export default Arriendos;
