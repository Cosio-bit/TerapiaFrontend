import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  fetchGastos,
  createGasto,
  updateGasto,
  deleteGasto,
} from "../api/gastoApi";
import { getAllProveedores } from "../api/proveedorApi";
import GastosTable from "../components/GastosTable";
import GastoFormDialog from "../components/GastoFormDialog";

const Gastos = () => {
  const [gastos, setGastos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [currentGasto, setCurrentGasto] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchGastosData();
    fetchProveedoresData();
  }, []);

  const fetchGastosData = async () => {
    try {
      const data = await fetchGastos();
      console.log("📤 API Response for Gastos:", JSON.stringify(data, null, 2));

      if (Array.isArray(data)) {
        setGastos(data);
      } else {
        console.error("❌ API returned unexpected data structure:", data);
        setGastos([]);
      }
    } catch (error) {
      console.error("❌ Error fetching gastos:", error);
      setSnackbar({ open: true, message: "Error al cargar gastos.", severity: "error" });
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

  const handleSaveGasto = async (gasto) => {
    try {
      console.log("📤 Saving Gasto:", JSON.stringify(gasto, null, 2));

      if (editing) {
        if (!currentGasto?.id_gasto) {
          console.error("⚠️ No se puede actualizar, falta ID de Gasto.");
          setSnackbar({ open: true, message: "Error: No se puede actualizar, falta ID.", severity: "error" });
          return;
        }
        console.log("🛠 Updating Gasto with ID:", currentGasto.id_gasto);
        await updateGasto(currentGasto.id_gasto, gasto);
      } else {
        console.log("🆕 Creating new Gasto");
        await createGasto(gasto);
      }

      fetchGastosData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Gasto actualizado con éxito." : "Gasto creado con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error saving gasto:", error);
      setSnackbar({ open: true, message: "Error al guardar el gasto.", severity: "error" });
    }
  };

  const handleEditGasto = (gasto) => {
    console.log("✏️ Editing Gasto:", JSON.stringify(gasto, null, 2));

    if (!gasto.id && !gasto.id_gasto) {
      console.error("⚠️ Error: No se encontró el ID de Gasto.");
      return;
    }

    const updatedGasto = {
      id_gasto: gasto.id_gasto || gasto.id,
      proveedor: gasto.proveedor ? gasto.proveedor : {}, // Siempre dejamos el objeto proveedor para mantenerlo consistente
      nombre: gasto.nombre || "",
      descripcion: gasto.descripcion || "",
      monto: typeof gasto.monto === "string"
        ? parseFloat(gasto.monto.replace(/[^0-9.]/g, "")) || 0
        : gasto.monto || 0,
      fecha: gasto.fecha || "",
    };

    console.log("📝 Formulario cargado con datos (AFTER FIX):", JSON.stringify(updatedGasto, null, 2));

    setCurrentGasto(updatedGasto);
    setEditing(true);

    setTimeout(() => setOpenDialog(true), 100); // Esperamos que proveedores estén cargados
  };

  const handleDeleteGasto = async (id) => {
    try {
      await deleteGasto(id);
      fetchGastosData();
      setSnackbar({ open: true, message: "Gasto eliminado con éxito.", severity: "success" });
    } catch (error) {
      console.error("❌ Error deleting gasto:", error);
      setSnackbar({ open: true, message: "Error al eliminar el gasto.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Gastos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentGasto(null);
          setOpenDialog(true);
        }}
      >
        Crear Gasto
      </Button>

      <GastosTable gastos={gastos} onEdit={handleEditGasto} onDelete={handleDeleteGasto} />

      <GastoFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveGasto}
        gasto={currentGasto}
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

export default Gastos;
