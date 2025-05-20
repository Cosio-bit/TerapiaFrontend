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
} from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../utils/can";

dayjs.extend(customParseFormat);

const SesionFormDialog = ({ open, onClose, onSave, sesion, profesionales, editing }) => {
  const { role } = useAuth();

  const [formSesion, setFormSesion] = useState({
    id_sesion: null,
    fecha_hora: "",
    precio: "",
    estado: "",
    profesional: { id_profesional: "" },
  });

  useEffect(() => {
    if (open) {
      if (editing && sesion) {
        const parsedDate = sesion.fecha_hora
          ? dayjs(sesion.fecha_hora, "DD/MM/YYYY HH:mm").isValid()
            ? dayjs(sesion.fecha_hora, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm")
            : ""
          : "";

        const profesionalData =
          typeof sesion.profesional === "string"
            ? profesionales.find((p) => p.usuario.nombre === sesion.profesional)
            : sesion.profesional;

        setFormSesion({
          id_sesion: sesion.id_sesion ?? null,
          fecha_hora: parsedDate,
          precio: sesion.precio ?? "",
          estado: sesion.estado ?? "",
          profesional: profesionalData
            ? { id_profesional: profesionalData.id_profesional }
            : { id_profesional: "" },
        });
      } else {
        setFormSesion({
          id_sesion: null,
          fecha_hora: "",
          precio: "",
          estado: "",
          profesional: { id_profesional: "" },
        });
      }
    }
  }, [open, sesion, editing, profesionales]);

  const canEditFecha = canEditField(role, "sesion", "fecha_hora");
  const canEditPrecio = canEditField(role, "sesion", "precio");
  const canEditEstado = canEditField(role, "sesion", "estado");
  const canEditProfesional = canEditField(role, "sesion", "profesional");

  const handleSave = () => {
    const formattedSesion = {
      id_sesion: formSesion.id_sesion,
      fecha_hora: formSesion.fecha_hora ? new Date(formSesion.fecha_hora).toISOString() : null,
      precio: formSesion.precio ? parseFloat(formSesion.precio) : 0,
      estado: formSesion.estado.trim(),
      profesional: { id_profesional: formSesion.profesional.id_profesional },
    };

    onSave(formattedSesion);
  };

  return (
    <Dialog open={open} onClose={onClose} key={formSesion.id_sesion || "new"}>
      <DialogTitle>{editing ? "Editar Sesión" : "Crear Sesión"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Fecha y Hora"
          type="datetime-local"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formSesion.fecha_hora}
          onChange={(e) => canEditFecha && setFormSesion({ ...formSesion, fecha_hora: e.target.value })}
          disabled={!canEditFecha}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formSesion.precio}
          onChange={(e) => canEditPrecio && setFormSesion({ ...formSesion, precio: parseFloat(e.target.value) || "" })}
          disabled={!canEditPrecio}
        />
        <TextField
          margin="dense"
          label="Estado"
          fullWidth
          value={formSesion.estado}
          onChange={(e) => canEditEstado && setFormSesion({ ...formSesion, estado: e.target.value })}
          disabled={!canEditEstado}
        />
        <FormControl fullWidth margin="dense" disabled={!canEditProfesional}>
          <InputLabel>Profesional</InputLabel>
          <Select
            value={formSesion.profesional.id_profesional || ""}
            onChange={(e) => canEditProfesional && setFormSesion({
              ...formSesion,
              profesional: { id_profesional: e.target.value },
            })}
          >
            {profesionales.map((profesional) => (
              <MenuItem key={profesional.id_profesional} value={profesional.id_profesional}>
                {profesional.usuario.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!(canEditFecha || canEditPrecio || canEditEstado || canEditProfesional)}
        >
          {editing ? "Guardar Cambios" : "Crear Sesión"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SesionFormDialog;
