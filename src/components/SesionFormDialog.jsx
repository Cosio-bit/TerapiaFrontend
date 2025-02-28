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

dayjs.extend(customParseFormat);

const SesionFormDialog = ({ open, onClose, onSave, sesion, profesionales, editing }) => {
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
        console.log("🔄 Loading session:", sesion);

        const parsedDate = sesion.fecha_hora
          ? dayjs(sesion.fecha_hora, "DD/MM/YYYY HH:mm").isValid()
            ? dayjs(sesion.fecha_hora, "DD/MM/YYYY HH:mm").format("YYYY-MM-DDTHH:mm")
            : ""
          : "";

        // Convert professional name back to ID
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
        console.log("🆕 Resetting form for new session");
        setFormSesion({
          id_sesion: null,
          fecha_hora: "",
          precio: "",
          estado: "",
          profesional: { id_profesional: "" },
        });
      }
    }
  }, [open, sesion, editing, profesionales]); // ✅ Now triggers when `profesionales` list updates

  const handleSave = () => {
    const formattedSesion = {
      id_sesion: formSesion.id_sesion,
      fecha_hora: formSesion.fecha_hora ? new Date(formSesion.fecha_hora).toISOString() : null,
      precio: formSesion.precio ? parseFloat(formSesion.precio) : 0,
      estado: formSesion.estado.trim(),
      profesional: { id_profesional: formSesion.profesional.id_profesional },
    };

    console.log("🚀 Saving session:", JSON.stringify(formattedSesion, null, 2));
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
          onChange={(e) => setFormSesion({ ...formSesion, fecha_hora: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Precio"
          type="number"
          fullWidth
          value={formSesion.precio}
          onChange={(e) => setFormSesion({ ...formSesion, precio: parseFloat(e.target.value) || "" })}
        />
        <TextField
          margin="dense"
          label="Estado"
          fullWidth
          value={formSesion.estado}
          onChange={(e) => setFormSesion({ ...formSesion, estado: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Profesional</InputLabel>
          <Select
            value={formSesion.profesional.id_profesional || ""}
            onChange={(e) =>
              setFormSesion({
                ...formSesion,
                profesional: { id_profesional: e.target.value },
              })
            }
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
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Sesión"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SesionFormDialog;
