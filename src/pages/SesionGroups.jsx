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
import { useAuth } from "../components/authcontext"; // ✅
import { can } from "../utils/can";

const formatnumber = (number) => {
  return new Intl.NumberFormat("es-CL").format(number);
};

const SesionGroups = () => {
  const { role } = useAuth(); // ✅ obtener rol del usuario

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
    } catch {
      setSnackbar({ open: true, message: "Error al cargar los grupos de sesiones.", severity: "error" });
    }
  };

  const fetchTerapiasData = async () => {
    try {
      const data = await getAllTerapias();
      setTerapias(data || []);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar terapias.", severity: "error" });
    }
  };

  const fetchClientesData = async () => {
    try {
      const data = await getAllClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar clientes.", severity: "error" });
    }
  };

  const fetchVariantesData = async () => {
    try {
      const data = await fetchVariantes();
      setVariantes(data || []);
    } catch {
      setSnackbar({ open: true, message: "Error al cargar variantes.", severity: "error" });
    }
  };

  const handleSaveSesionGroup = async (sesionGroup) => {
    try {
      if (editing) {
        await updateSesionGroup(currentSesionGroup.id_sesion_group, sesionGroup);
      } else {
        await createSesionGroup(sesionGroup);
      }

      fetchSesionGroupsData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Grupo de sesiones actualizado con éxito." : "Grupo de sesiones creado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({ open: true, message: "Error al guardar el grupo de sesiones.", severity: "error" });
    }
  };

  const handleEditSesionGroup = (sesionGroup) => {
    const updatedSesionGroup = {
      id_sesion_group: sesionGroup.id_sesion_group || sesionGroup.id,
      terapia: sesionGroup.terapia?.id_terapia || sesionGroup.terapia || "",
      cliente: sesionGroup.cliente?.id_cliente || sesionGroup.cliente || "",
      variante: sesionGroup.variante?.id_variante || sesionGroup.variante || "",
      descripcion: sesionGroup.descripcion || "",
      sesiones: sesionGroup.sesiones?.map((s) => ({
        ...s,
        profesional: s.profesional?.id_profesional || s.profesional || "",
      })) || [],
    };

    setCurrentSesionGroup(updatedSesionGroup);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteSesionGroup = async (id) => {
    try {
      await deleteSesionGroup(id);
      fetchSesionGroupsData();
      setSnackbar({ open: true, message: "Grupo de sesiones eliminado con éxito.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar el grupo de sesiones.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Grupos de Sesiones
      </Typography>

      {can(role, "create", "sesiongroup") && (
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
      )}

      <SesionGroupsTable
        sesionGroups={sesionGroups.map((sg) => ({
          ...sg,
          cantidad: sg.cantidad ? formatnumber(sg.cantidad) : sg.cantidad,
          costo: sg.costo ? formatnumber(sg.costo) : sg.costo,
        }))}
        onEdit={handleEditSesionGroup}
        onDelete={handleDeleteSesionGroup}
      />

      <SesionGroupFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveSesionGroup}
        sesionGroup={currentSesionGroup}
        terapias={terapias}
        clientes={clientes}
        variantes={variantes}
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

export default SesionGroups;
