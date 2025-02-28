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
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllProfesionales } from "../api/profesionalApi";
import { getAllTerapias } from "../api/terapiaApi";

const SesionGroupFormDialog = ({ 
  open, 
  onClose, 
  onSave, 
  sesionGroup, 
  terapias, 
  clientes, 
  variantes, 
  editing,
  setSnackbar
}) => {
  const [formSesionGroup, setFormSesionGroup] = useState({
    terapia: "",
    cliente: "",
    variante: "",
    descripcion: "",
    sesiones: [],
  });

  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    console.log("Fetching profesionales...");
    getAllProfesionales()
      .then(data => {
        console.log("Profesionales fetched:", data);
        setProfesionales(data);
      })
      .catch((error) => {
        console.error("Error fetching profesionales:", error);
        setProfesionales([]);
      });
  }, []);

  useEffect(() => {
    console.log("Dialog open:", open, "Editing session group:", sesionGroup);
    if (open && sesionGroup) {
      setFormSesionGroup({
        terapia: sesionGroup.terapia?.id_terapia || "",
        cliente: sesionGroup.cliente?.id_cliente || "",
        variante: sesionGroup.variante?.id_variante || "",
        descripcion: sesionGroup.descripcion || "",
        sesiones: sesionGroup.sesiones || [],
      });
    }
  }, [open, sesionGroup]);

  const handleSave = async () => {
    console.log("Saving session group:", formSesionGroup);
    if (!formSesionGroup.terapia || !formSesionGroup.cliente || !formSesionGroup.variante || !formSesionGroup.descripcion) {
      console.warn("Validation failed: missing required fields.");
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

    console.log("Payload to send:", payload);

    try {
      await onSave(payload);
      console.log("Session group saved successfully.");
      setSnackbar({ open: true, message: "Grupo de sesiones guardado con éxito.", severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error saving session group:", error);
      setSnackbar({ open: true, message: "Error al guardar el grupo de sesiones.", severity: "error" });
    }
  };

  const handleAddSesion = () => {
    console.log("Adding new session...");
    setFormSesionGroup(prevState => ({
      ...prevState,
      sesiones: [...prevState.sesiones, { fecha_hora: "", precio: "", estado: "", profesional: "" }],
    }));
  };

  const handleSesionChange = (index, field, value) => {
    console.log(`Updating session at index ${index}:`, field, value);
    const updatedSesiones = [...formSesionGroup.sesiones];
    updatedSesiones[index][field] = value;
    setFormSesionGroup({ ...formSesionGroup, sesiones: updatedSesiones });
  };

  const handleDeleteSesion = (index) => {
    console.log(`Deleting session at index ${index}`);
    const updatedSesiones = [...formSesionGroup.sesiones];
    updatedSesiones.splice(index, 1);
    setFormSesionGroup({ ...formSesionGroup, sesiones: updatedSesiones });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Grupo de Sesiones" : "Crear Grupo de Sesiones"}</DialogTitle>
      <DialogContent>
        {/* Terapia Selection */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Terapia</InputLabel>
          <Select
            value={formSesionGroup.terapia}
            onChange={(e) => setFormSesionGroup({ ...formSesionGroup, terapia: e.target.value })}
          >
            {terapias.map((terapia) => (
              <MenuItem key={terapia.id_terapia} value={terapia.id_terapia}>
                {terapia.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Variante Selection */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Variante</InputLabel>
          <Select
            value={formSesionGroup.variante}
            onChange={(e) => setFormSesionGroup({ ...formSesionGroup, variante: e.target.value })}
          >
            {variantes.map((variante) => (
              <MenuItem key={variante.id_variante} value={variante.id_variante}>
                {variante.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cliente Selection */}
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

        {/* Descripción */}
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
          <h4>Sesiones</h4>
          {formSesionGroup.sesiones.map((sesion, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <TextField
                label="Fecha y Hora"
                type="datetime-local"
                value={sesion.fecha_hora}
                onChange={(e) => handleSesionChange(index, "fecha_hora", e.target.value)}
              />
              <TextField
                label="Precio"
                type="number"
                value={sesion.precio}
                onChange={(e) => handleSesionChange(index, "precio", e.target.value)}
              />
              <TextField
                label="Estado"
                value={sesion.estado}
                onChange={(e) => handleSesionChange(index, "estado", e.target.value)}
              />
              {/* Profesional Selection */}
              <FormControl fullWidth>
                <InputLabel>Profesional</InputLabel>
                <Select
                  value={sesion.profesional || ""}
                  onChange={(e) => handleSesionChange(index, "profesional", e.target.value)}
                >
                  {profesionales.map((profesional) => (
                    <MenuItem key={profesional.id_profesional} value={profesional.id_profesional}>
                      {profesional.usuario.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton onClick={() => handleDeleteSesion(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
          <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddSesion} variant="outlined">
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
