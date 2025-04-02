import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Box
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllProfesionales } from "../api/profesionalApi";

const SesionGroupFormDialog = ({
  open,
  onClose,
  onSave,
  sesionGroup,
  terapias,
  clientes,
  variantes,
  editing,
  setSnackbar,
}) => {
  const [formSesionGroup, setFormSesionGroup] = useState({
    terapia: "",
    cliente: "",
    variante: "",
    descripcion: "",
    sesiones: [],
  });

  const estadoOpciones = [
    "Pagado y Realizado",
    "Pagado y No Realizado",
    "No Pagado y Realizado",
    "No Pagado y No Realizado"
  ];

  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    getAllProfesionales()
      .then(data => setProfesionales(data))
      .catch(() => setProfesionales([]));
  }, []);

  const handleOpenDialog = () => {
    if (sesionGroup?.id_sesion_group) {
      const terapiaId = terapias.find(t => t.nombre === sesionGroup.terapia)?.id_terapia || "";
      const clienteId = clientes.find(c => c.usuario.nombre === sesionGroup.cliente)?.id_cliente || "";
      const varianteId = variantes.find(v => v.nombre === sesionGroup.variante)?.id_variante || "";

      const updatedState = {
        terapia: terapiaId,
        cliente: clienteId,
        variante: varianteId,
        descripcion: sesionGroup.descripcion ?? "⚠️ Sin descripción",
        sesiones: sesionGroup.sesiones ? [...sesionGroup.sesiones] : [],
      };

      setFormSesionGroup(updatedState);
    }
  };

  useEffect(() => {
    if (open) {
      handleOpenDialog();
    }
  }, [open]);

  const handleSave = async () => {
    if (!formSesionGroup.terapia || !formSesionGroup.cliente || !formSesionGroup.variante || !formSesionGroup.descripcion) {
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const payload = {
      terapia: { id_terapia: formSesionGroup.terapia },
      cliente: { id_cliente: formSesionGroup.cliente },
      variante: { id_variante: formSesionGroup.variante },
      descripcion: formSesionGroup.descripcion,
      sesiones: formSesionGroup.sesiones.map(sesion => ({
        fecha_hora: sesion.fecha_hora,
        precio: Number(sesion.precio) || 0,
        estado: sesion.estado,
        profesional: sesion.profesional ? { id_profesional: sesion.profesional } : null,
      })),
    };

    try {
      await onSave(payload);
      setSnackbar({ open: true, message: "Grupo de sesiones guardado con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar el grupo de sesiones.", severity: "error" });
    }
  };

  const handleAddSesion = () => {
    setFormSesionGroup(prev => ({
      ...prev,
      sesiones: [...prev.sesiones, { fecha_hora: "", precio: "", estado: "", profesional: "" }],
    }));
  };

  const handleSesionChange = (index, field, value) => {
    const updated = [...formSesionGroup.sesiones];
    updated[index][field] = value;
    setFormSesionGroup({ ...formSesionGroup, sesiones: updated });
  };

  const handleDeleteSesion = (index) => {
    const updated = [...formSesionGroup.sesiones];
    updated.splice(index, 1);
    setFormSesionGroup({ ...formSesionGroup, sesiones: updated });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editing ? "Editar Grupo de Sesiones" : "Crear Grupo de Sesiones"}</DialogTitle>
      <DialogContent>

        <FormControl fullWidth margin="dense">
          <InputLabel>Terapia</InputLabel>
          <Select
            value={formSesionGroup.terapia || ""}
            onChange={(e) => setFormSesionGroup({ ...formSesionGroup, terapia: e.target.value })}
          >
            {terapias.map((terapia) => (
              <MenuItem key={terapia.id_terapia} value={terapia.id_terapia}>
                {terapia.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Variante</InputLabel>
          <Select
            value={formSesionGroup.variante}
            onChange={(e) => setFormSesionGroup({ ...formSesionGroup, variante: e.target.value })}
            disabled={!formSesionGroup.terapia}
          >
            {terapias.find(t => t.id_terapia === formSesionGroup.terapia)?.variantes?.map((v) => (
              <MenuItem key={v.id_variante} value={v.id_variante}>
                {v.nombre}
              </MenuItem>
            )) || []}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formSesionGroup.cliente}
            onChange={(e) => setFormSesionGroup({ ...formSesionGroup, cliente: e.target.value })}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.usuario.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          margin="dense"
          label="Descripción"
          fullWidth
          multiline
          value={formSesionGroup.descripcion}
          onChange={(e) => setFormSesionGroup({ ...formSesionGroup, descripcion: e.target.value })}
        />

        {/* Sesiones Management */}
        <div>
          <Typography variant="h6" gutterBottom>
            Sesiones
          </Typography>

          {formSesionGroup.sesiones.map((sesion, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                border: "1px solid #ccc",
                borderRadius: 2,
                p: 2,
                mb: 2,
                backgroundColor: "#f5f5f5",
              }}
            >
              <Typography variant="subtitle2">Sesión #{index + 1}</Typography>

              <TextField
                fullWidth
                label="Fecha y Hora"
                type="datetime-local"
                value={sesion.fecha_hora}
                onChange={(e) => handleSesionChange(index, "fecha_hora", e.target.value)}
              />

              <TextField
                fullWidth
                label="Precio"
                type="number"
                value={sesion.precio}
                onChange={(e) => handleSesionChange(index, "precio", e.target.value)}
              />

              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  value={sesion.estado || ""}
                  onChange={(e) => handleSesionChange(index, "estado", e.target.value)}
                  label="Estado"
                >
                  {estadoOpciones.map((opcion) => (
                    <MenuItem key={opcion} value={opcion}>
                      {opcion}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Profesional</InputLabel>
                <Select
                  value={sesion.profesional || ""}
                  onChange={(e) => handleSesionChange(index, "profesional", e.target.value)}
                  disabled={!formSesionGroup.terapia}
                  label="Profesional"
                >
                  {terapias
                    .find((t) => t.id_terapia === formSesionGroup.terapia)
                    ?.profesionales?.map((profesional) => (
                      <MenuItem key={profesional.id_profesional} value={profesional.id_profesional}>
                        {profesional.usuario.nombre}
                      </MenuItem>
                    )) || []}
                </Select>
              </FormControl>

              <Box textAlign="right">
                <IconButton onClick={() => handleDeleteSesion(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={handleAddSesion}
            variant="outlined"
          >
            Agregar Sesión
          </Button>
        </div>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Grupo de Sesiones"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SesionGroupFormDialog;
