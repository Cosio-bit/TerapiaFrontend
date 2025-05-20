import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  fetchSalas,
  createSala,
  updateSala,
  deleteSala,
} from "../api/salaApi";
import { getAllProveedores } from "../api/proveedorApi";
import SalasTable from "../components/SalasTable";
import SalaFormDialog from "../components/SalaFormDialog";
import { useAuth } from "../components/authcontext";
import { can } from "../can"; // ✅ Control de permisos

const Salas = () => {
  const { role } = useAuth();

  const [salas, setSalas] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [currentSala, setCurrentSala] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchSalasData();
    fetchProveedoresData();
  }, []);

  const fetchSalasData = async () => {
    try {
      const data = await fetchSalas();
      setSalas(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar salas.", severity: "error" });
    }
  };

  const fetchProveedoresData = async () => {
    try {
      const data = await getAllProveedores();
      setProveedores(data || []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar proveedores.", severity: "error" });
    }
  };

  const handleSaveSala = async (sala) => {
    try {
      if (editing) {
        if (!currentSala?.id_sala) {
          setSnackbar({ open: true, message: "Error: No se puede actualizar, falta ID.", severity: "error" });
          return;
        }
        await updateSala(currentSala.id_sala, sala);
      } else {
        await createSala(sala);
      }

      fetchSalasData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Sala actualizada con éxito." : "Sala creada con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar la sala.", severity: "error" });
    }
  };

  const handleEditSala = (sala) => {
    const updatedSala = {
      id_sala: sala.id_sala || sala.id,
      proveedor: sala.proveedor || {},
      nombre: sala.nombre || "",
      capacidad: sala.capacidad || 0,
      precio: typeof sala.precio === "string"
        ? parseFloat(sala.precio.replace(/[^0-9.]/g, "")) || 0
        : sala.precio || 0,
      ubicacion: sala.ubicacion || "",
      estado: sala.estado || "",
    };

    setCurrentSala(updatedSala);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteSala = async (id) => {
    try {
      await deleteSala(id);
      fetchSalasData();
      setSnackbar({ open: true, message: "Sala eliminada con éxito.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar la sala.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Salas
      </Typography>

      {can(role, "create", "sala") && (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditing(false);
            setCurrentSala(null);
            setOpenDialog(true);
          }}
        >
          Crear Sala
        </Button>
      )}

      <SalasTable salas={salas} onEdit={handleEditSala} onDelete={handleDeleteSala} />

      <SalaFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveSala}
        sala={currentSala}
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

export default Salas;
