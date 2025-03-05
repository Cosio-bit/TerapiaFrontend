import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  fetchArriendos,
  createArriendo,
  updateArriendo,
  deleteArriendo,
} from "../api/arriendoApi";
import { getAllSalas } from "../api/salaApi";
import { getAllClientes } from "../api/clienteApi";
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

  useEffect(() => {
    fetchArriendosData();
    fetchSalasData();
    fetchClientesData();
  }, []);

  const fetchArriendosData = async () => {
    try {
      const data = await fetchArriendos();
      console.log("📤 API Response for Arriendos:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setArriendos(data);
      } else {
        console.error("❌ API returned unexpected data structure:", data);
        setArriendos([]);
      }
    } catch (error) {
      console.error("❌ Error fetching arriendos:", error);
      setSnackbar({ open: true, message: "Error al cargar arriendos.", severity: "error" });
    }
  };

  const fetchSalasData = async () => {
    try {
      const data = await getAllSalas();
      setSalas(data || []);
    } catch (error) {
      console.error("❌ Error fetching salas:", error);
      setSnackbar({ open: true, message: "Error al cargar salas.", severity: "error" });
    }
  };

  const fetchClientesData = async () => {
    try {
      const data = await getAllClientes();
      setClientes(data || []);
    } catch (error) {
      console.error("❌ Error fetching clientes:", error);
      setSnackbar({ open: true, message: "Error al cargar clientes.", severity: "error" });
    }
  };

  const handleSaveArriendo = async (arriendo) => {
    try {
      console.log("📤 Saving Arriendo:", JSON.stringify(arriendo, null, 2));

      if (editing) {
        if (!currentArriendo?.id_arriendo) {
          console.error("⚠️ No se puede actualizar, falta ID de Arriendo.");
          setSnackbar({ open: true, message: "Error: No se puede actualizar, falta ID.", severity: "error" });
          return;
        }
        console.log("🛠 Updating Arriendo with ID:", currentArriendo.id_arriendo);
        await updateArriendo(currentArriendo.id_arriendo, arriendo);
      } else {
        console.log("🆕 Creating new Arriendo");
        await createArriendo(arriendo);
      }

      fetchArriendosData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Arriendo actualizado con éxito." : "Arriendo creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error saving arriendo:", error);
      setSnackbar({ open: true, message: "Error al guardar el arriendo.", severity: "error" });
    }
  };

  const handleEditArriendo = (arriendo) => {
    console.log("✏️ Editing Arriendo:", JSON.stringify(arriendo, null, 2));

    if (!arriendo.id && !arriendo.id_arriendo) {
      console.error("⚠️ Error: No se encontró el ID de Arriendo.");
      return;
    }

    const updatedArriendo = {
      id_arriendo: arriendo.id_arriendo || arriendo.id,
      sala: arriendo.sala ? arriendo.sala : {}, // ✅ Ensure sala is an object
      cliente: arriendo.cliente ? arriendo.cliente : {}, // ✅ Ensure cliente is an object
      fecha: arriendo.fecha || "",
      hora_inicio: arriendo.hora_inicio || "",
      hora_fin: arriendo.hora_fin || "",
      estado: arriendo.estado || "active",
      monto_pagado: typeof arriendo.monto_pagado === "string"
        ? parseFloat(arriendo.monto_pagado.replace(/[^0-9.]/g, "")) || 0
        : arriendo.monto_pagado || 0,
    };

    console.log("📝 Formulario cargado con datos (AFTER FIX):", JSON.stringify(updatedArriendo, null, 2));

    setCurrentArriendo(updatedArriendo);
    setEditing(true);

    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteArriendo = async (id) => {
    try {
      await deleteArriendo(id);
      fetchArriendosData();
      setSnackbar({ open: true, message: "Arriendo eliminado con éxito.", severity: "success" });
    } catch (error) {
      console.error("❌ Error deleting arriendo:", error);
      setSnackbar({ open: true, message: "Error al eliminar el arriendo.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Arriendos
      </Typography>
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

      <ArriendosTable arriendos={arriendos} onEdit={handleEditArriendo} onDelete={handleDeleteArriendo} />

      <ArriendoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveArriendo}
        arriendo={currentArriendo}
        salas={salas}
        clientes={clientes}
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

export default Arriendos;
