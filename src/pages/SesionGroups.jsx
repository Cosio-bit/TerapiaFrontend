import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  fetchSesionGroups,
  createSesionGroup,
  updateSesionGroup,
  deleteSesionGroup,
} from "../api/sesionGroupApi";
import { getAllTerapias } from "../api/terapiaApi";
import { getAllClientes } from "../api/clienteApi";
import { fetchVariantes } from "../api/varianteApi";
import SesionGroupsTable from "../components/SesionGroupsTable";
import SesionGroupFormDialog from "../components/SesionGroupFormDialog";

const SesionGroups = () => {
  const [sesionGroups, setSesionGroups] = useState([]);
  const [terapias, setTerapias] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [variantes, setVariantes] = useState([]);
  const [currentSesionGroup, setCurrentSesionGroup] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchSesionGroupsData();
    fetchTerapiasData();
    fetchClientesData();
    fetchVariantesData();
  }, []);

  const fetchSesionGroupsData = async () => {
    try {
      const data = await fetchSesionGroups();
      setSesionGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching session groups:", error);
      setSnackbar({ open: true, message: "Error al cargar los grupos de sesiones.", severity: "error" });
    }
  };

  const fetchTerapiasData = async () => {
    try {
      const data = await getAllTerapias();
      setTerapias(data || []);
    } catch (error) {
      console.error("❌ Error fetching terapias:", error);
      setSnackbar({ open: true, message: "Error al cargar terapias.", severity: "error" });
    }
  };

  const fetchClientesData = async () => {
    try {
      const data = await getAllClientes();
      console.log("📤 API Response from /api/clientes:", JSON.stringify(data, null, 2)); // ✅ Debugging log

      if (Array.isArray(data)) {
        setClientes(data);
      } else {
        console.error("❌ API returned unexpected data structure:", data);
        setClientes([]);
      }
    } catch (error) {
      console.error("❌ Error fetching clientes:", error);
      setSnackbar({ open: true, message: "Error al cargar clientes.", severity: "error" });
    }
  };

  const fetchVariantesData = async () => {
    try {
      const data = await fetchVariantes();
      setVariantes(data || []);
    } catch (error) {
      console.error("❌ Error fetching variantes:", error);
      setSnackbar({ open: true, message: "Error al cargar variantes.", severity: "error" });
    }
  };

  const handleSaveSesionGroup = async (sesionGroup) => {
    try {
        console.log("📤 Saving SesionGroup:", JSON.stringify(sesionGroup, null, 2)); 

        if (editing) {
            if (!currentSesionGroup?.id_sesion_group) {
                console.error("⚠️ No se puede actualizar, falta ID de SesionGroup.");
                setSnackbar({ open: true, message: "Error: No se puede actualizar, falta ID.", severity: "error" });
                return;
            }
            console.log("🛠 Updating SesionGroup with ID:", currentSesionGroup.id_sesion_group);
            await updateSesionGroup(currentSesionGroup.id_sesion_group, sesionGroup);
        } else {
            console.log("🆕 Creating new SesionGroup");
            await createSesionGroup(sesionGroup);
        }

        fetchSesionGroupsData();
        setOpenDialog(false);
        setSnackbar({
            open: true,
            message: editing ? "Grupo de sesiones actualizado con éxito." : "Grupo de sesiones creado con éxito.",
            severity: "success",
        });
    } catch (error) {
        console.error("❌ Error saving session group:", error);
        setSnackbar({ open: true, message: "Error al guardar el grupo de sesiones.", severity: "error" });
    }
};
const handleEditSesionGroup = (sesionGroup) => {
  console.log("✏️ Editing SesionGroup:", sesionGroup);

  if (!sesionGroup.id) {
      console.error("⚠️ Error: No se encontró el ID de SesionGroup.");
      return;
  }

  setEditing(true);
  setCurrentSesionGroup({
      id_sesion_group: sesionGroup.id, 
      terapia: sesionGroup.terapia?.id_terapia || "", // ✅ Asegurar que solo se guarda el ID
      cliente: sesionGroup.cliente?.id_cliente || "", // ✅ Asegurar que solo se guarda el ID
      variante: sesionGroup.variante?.id_variante || "", // ✅ Asegurar que solo se guarda el ID
      descripcion: sesionGroup.descripcion || "", // ✅ Mantener la descripción
      sesiones: sesionGroup.sesiones?.map(sesion => ({
          ...sesion,
          profesional: sesion.profesional?.id_profesional || "" // ✅ Asegurar que se guarde solo el ID
      })) || [],
  });

  console.log("📝 Formulario cargado con datos:", JSON.stringify(sesionGroup, null, 2)); // ✅ Debugging
  setOpenDialog(true);
};



  const handleDeleteSesionGroup = async (id) => {
    try {
      await deleteSesionGroup(id);
      fetchSesionGroupsData();
      setSnackbar({ open: true, message: "Grupo de sesiones eliminado con éxito.", severity: "success" });
    } catch (error) {
      console.error("❌ Error deleting session group:", error);
      setSnackbar({ open: true, message: "Error al eliminar el grupo de sesiones.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Grupos de Sesiones
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditing(false);
          setCurrentSesionGroup(null);
          setOpenDialog(true);
        }}
      >
        Crear Grupo de Sesiones
      </Button>

      <SesionGroupsTable sesionGroups={sesionGroups} onEdit={handleEditSesionGroup} onDelete={handleDeleteSesionGroup} />

      <SesionGroupFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveSesionGroup}
        sesionGroup={currentSesionGroup}
        terapias={terapias}
        clientes={clientes}
        variantes={variantes}
        editing={editing}
        setSnackbar={setSnackbar} // ✅ Ensures notifications work correctly
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

export default SesionGroups;
