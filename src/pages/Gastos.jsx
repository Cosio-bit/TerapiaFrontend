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
import { useAuth } from "../components/authcontext";
import { can } from "../utils/can";

const Gastos = () => {
  const { role } = useAuth();

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
    if (editing && !can(role, "edit", "gasto")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar gastos.", severity: "error" });
      return;
    }
    if (!editing && !can(role, "create", "gasto")) {
      setSnackbar({ open: true, message: "No tienes permiso para crear gastos.", severity: "error" });
      return;
    }

    try {
      if (editing) {
        if (!currentGasto?.id_gasto) {
          setSnackbar({ open: true, message: "Error: No se puede actualizar, falta ID.", severity: "error" });
          return;
        }
        await updateGasto(currentGasto.id_gasto, gasto);
      } else {
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
    if (!can(role, "edit", "gasto")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar gastos.", severity: "error" });
      return;
    }

    const updatedGasto = {
      id_gasto: gasto.id_gasto || gasto.id,
      proveedor: gasto.proveedor || {},
      nombre: gasto.nombre || "",
      descripcion: gasto.descripcion || "",
      monto: typeof gasto.monto === "string"
        ? parseFloat(gasto.monto.replace(/[^0-9.]/g, "")) || 0
        : gasto.monto || 0,
      fecha: gasto.fecha || "",
    };

    setCurrentGasto(updatedGasto);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteGasto = async (id) => {
    if (!can(role, "delete", "gasto")) {
      setSnackbar({ open: true, message: "No tienes permiso para eliminar gastos.", severity: "error" });
      return;
    }

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

      {can(role, "create", "gasto") && (
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
      )}

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
        <Alert
          onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gastos;
