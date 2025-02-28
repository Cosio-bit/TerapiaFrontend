import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";

const UsuarioFormDialog = ({ open, onClose, onSave, usuario, editing }) => {
  const [formUsuario, setFormUsuario] = useState({
    nombre: "",
    rut: "",
    email: "",
    telefono: "",
    direccion: "",
    sexo: "",
    fecha_nacimiento: "",
    saldo: 0,
  });

  useEffect(() => {
    if (usuario) {
      setFormUsuario(usuario);
    } else {
      setFormUsuario({
        nombre: "",
        rut: "",
        email: "",
        telefono: "",
        direccion: "",
        sexo: "",
        fecha_nacimiento: "",
        saldo: 0,
      });
    }
  }, [usuario]);

  const handleSave = () => {
    onSave(formUsuario);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
      <DialogContent>
        <TextField label="Nombre" fullWidth margin="dense" value={formUsuario.nombre} onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })} />
        <TextField label="RUT" fullWidth margin="dense" value={formUsuario.rut} onChange={(e) => setFormUsuario({ ...formUsuario, rut: e.target.value })} />
        <TextField label="Email" fullWidth margin="dense" value={formUsuario.email} onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })} />
        <TextField label="Teléfono" fullWidth margin="dense" value={formUsuario.telefono} onChange={(e) => setFormUsuario({ ...formUsuario, telefono: e.target.value })} />
        <TextField label="Dirección" fullWidth margin="dense" value={formUsuario.direccion} onChange={(e) => setFormUsuario({ ...formUsuario, direccion: e.target.value })} />
        <TextField label="Sexo" fullWidth margin="dense" value={formUsuario.sexo} onChange={(e) => setFormUsuario({ ...formUsuario, sexo: e.target.value })} />
        <TextField label="Fecha de Nacimiento" type="date" fullWidth margin="dense" value={formUsuario.fecha_nacimiento} onChange={(e) => setFormUsuario({ ...formUsuario, fecha_nacimiento: e.target.value })} />
        <TextField label="Saldo" type="number" fullWidth margin="dense" value={formUsuario.saldo} onChange={(e) => setFormUsuario({ ...formUsuario, saldo: e.target.value })} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioFormDialog;
