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

const ArriendoFormDialog = ({ open, onClose, onSave, arriendo, salas, clientes, editing }) => {
  const [formArriendo, setFormArriendo] = useState({
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    estado: "",
    id_sala: "",
    id_cliente: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (arriendo) {
      setFormArriendo(arriendo);
    } else {
      setFormArriendo({
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        estado: "",
        id_sala: "",
        id_cliente: "",
      });
    }
    setErrors({});
  }, [arriendo]);

  const validateForm = () => {
    const newErrors = {};
    if (!formArriendo.fecha) newErrors.fecha = "La fecha es obligatoria.";
    if (!formArriendo.hora_inicio) newErrors.hora_inicio = "La hora de inicio es obligatoria.";
    if (!formArriendo.hora_fin) newErrors.hora_fin = "La hora de término es obligatoria.";
    if (!formArriendo.id_sala) newErrors.id_sala = "La sala es obligatoria.";
    if (!formArriendo.id_cliente) newErrors.id_cliente = "El cliente es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formArriendo);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Arriendo" : "Crear Arriendo"}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formArriendo.fecha}
          onChange={(e) => setFormArriendo({ ...formArriendo, fecha: e.target.value })}
          error={!!errors.fecha}
          helperText={errors.fecha}
        />
        <TextField
          margin="dense"
          label="Hora Inicio"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formArriendo.hora_inicio}
          onChange={(e) => setFormArriendo({ ...formArriendo, hora_inicio: e.target.value })}
          error={!!errors.hora_inicio}
          helperText={errors.hora_inicio}
        />
        <TextField
          margin="dense"
          label="Hora Fin"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formArriendo.hora_fin}
          onChange={(e) => setFormArriendo({ ...formArriendo, hora_fin: e.target.value })}
          error={!!errors.hora_fin}
          helperText={errors.hora_fin}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Estado</InputLabel>
          <Select
            value={formArriendo.estado}
            onChange={(e) => setFormArriendo({ ...formArriendo, estado: e.target.value })}
          >
            <MenuItem value="activo">Activo</MenuItem>
            <MenuItem value="finalizado">Finalizado</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Sala</InputLabel>
          <Select
            value={formArriendo.id_sala}
            onChange={(e) => setFormArriendo({ ...formArriendo, id_sala: e.target.value })}
          >
            {salas.map((sala) => (
              <MenuItem key={sala.id_sala} value={sala.id_sala}>
                {sala.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formArriendo.id_cliente}
            onChange={(e) => setFormArriendo({ ...formArriendo, id_cliente: e.target.value })}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Arriendo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ArriendoFormDialog;
