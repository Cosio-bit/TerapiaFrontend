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

const ArriendoFormDialog = ({ 
  open, 
  onClose, 
  onSave, 
  arriendo, 
  salas, 
  clientes, 
  editing,
  setSnackbar
}) => {
  const [formArriendo, setFormArriendo] = useState({
    id_arriendo: null,
    sala: { id_sala: "" },
    cliente: { id_cliente: "" },
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    estado: "active",
    monto_pagado: "",
  });

  useEffect(() => {
    if (open) {
      if (editing && arriendo) {
        console.log("🔄 Loading arriendo:", arriendo);

        // Persist `sala` and `cliente` correctly
        const salaData =
          typeof arriendo.sala === "string"
            ? salas.find((s) => s.nombre === arriendo.sala)
            : arriendo.sala;

        const clienteData =
          typeof arriendo.cliente === "string"
            ? clientes.find((c) => c.usuario.nombre === arriendo.cliente)
            : arriendo.cliente;

        setFormArriendo({
          id_arriendo: arriendo.id_arriendo ?? null,
          sala: salaData ? { id_sala: salaData.id_sala } : { id_sala: "" },
          cliente: clienteData ? { id_cliente: clienteData.id_cliente } : { id_cliente: "" },
          fecha: arriendo.fecha || "",
          hora_inicio: arriendo.hora_inicio || "",
          hora_fin: arriendo.hora_fin || "",
          estado: arriendo.estado || "active",
          monto_pagado: typeof arriendo.monto_pagado === "string"
            ? parseFloat(arriendo.monto_pagado.replace(/[^0-9.]/g, "")) || 0
            : arriendo.monto_pagado || 0,
        });
      } else {
        console.log("🆕 Resetting form for new arriendo");
        setFormArriendo({
          id_arriendo: null,
          sala: { id_sala: "" },
          cliente: { id_cliente: "" },
          fecha: "",
          hora_inicio: "",
          hora_fin: "",
          estado: "active",
          monto_pagado: "",
        });
      }
    }
  }, [open, arriendo, editing, salas, clientes]);

  const handleSave = () => {
    if (!formArriendo.sala.id_sala || !formArriendo.cliente.id_cliente || !formArriendo.fecha || !formArriendo.hora_inicio || !formArriendo.hora_fin) {
      console.warn("Validation failed: missing required fields.");
      setSnackbar({ open: true, message: "Complete todos los campos obligatorios.", severity: "error" });
      return;
    }

    const formattedArriendo = {
      id_arriendo: formArriendo.id_arriendo,
      sala: { id_sala: formArriendo.sala.id_sala },
      cliente: { id_cliente: formArriendo.cliente.id_cliente },
      fecha: formArriendo.fecha,
      hora_inicio: formArriendo.hora_inicio,
      hora_fin: formArriendo.hora_fin,
      estado: formArriendo.estado,
      monto_pagado: Number(formArriendo.monto_pagado),
    };

    console.log("🚀 Saving arriendo:", JSON.stringify(formattedArriendo, null, 2));
    onSave(formattedArriendo);
  };

  return (
    <Dialog open={open} onClose={onClose} key={formArriendo.id_arriendo || "new"}>
      <DialogTitle>{editing ? "Editar Arriendo" : "Crear Arriendo"}</DialogTitle>
      <DialogContent>
        {/* Sala Selection */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Sala</InputLabel>
          <Select
            value={formArriendo.sala.id_sala || ""}
            onChange={(e) => setFormArriendo({ ...formArriendo, sala: { id_sala: e.target.value } })}
          >
            {salas.map((sala) => (
              <MenuItem key={sala.id_sala} value={sala.id_sala}>
                {sala.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Cliente Selection */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Cliente</InputLabel>
          <Select
            value={formArriendo.cliente.id_cliente || ""}
            onChange={(e) => setFormArriendo({ ...formArriendo, cliente: { id_cliente: e.target.value } })}
          >
            {clientes.map((cliente) => (
              <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.usuario?.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Fecha */}
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formArriendo.fecha}
          onChange={(e) => setFormArriendo({ ...formArriendo, fecha: e.target.value })}
        />

        {/* Hora Inicio */}
        <TextField
          margin="dense"
          label="Hora Inicio"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formArriendo.hora_inicio}
          onChange={(e) => setFormArriendo({ ...formArriendo, hora_inicio: e.target.value })}
        />

        {/* Hora Fin */}
        <TextField
          margin="dense"
          label="Hora Fin"
          type="time"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={formArriendo.hora_fin}
          onChange={(e) => setFormArriendo({ ...formArriendo, hora_fin: e.target.value })}
        />

        {/* Estado */}
        <FormControl fullWidth margin="dense">
          <InputLabel>Estado</InputLabel>
          <Select
            value={formArriendo.estado}
            onChange={(e) => setFormArriendo({ ...formArriendo, estado: e.target.value })}
          >
            <MenuItem value="active">Activo</MenuItem>
            <MenuItem value="completed">Completado</MenuItem>
            <MenuItem value="canceled">Cancelado</MenuItem>
          </Select>
        </FormControl>

        {/* Monto Pagado */}
        <TextField
          margin="dense"
          label="Monto Pagado"
          type="number"
          fullWidth
          value={formArriendo.monto_pagado}
          onChange={(e) => setFormArriendo({ 
            ...formArriendo, 
            monto_pagado: e.target.value === "" ? "" : Number(e.target.value) 
          })}
        />
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
