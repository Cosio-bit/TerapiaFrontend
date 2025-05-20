import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from "@mui/material";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../utils/can";

const UsuarioFormDialog = ({ open, onClose, onSave, usuario, editing }) => {
  const { role } = useAuth();

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

  const canNombre = canEditField(role, "usuario", "nombre");
  const canRut = canEditField(role, "usuario", "rut");
  const canEmail = canEditField(role, "usuario", "email");
  const canTelefono = canEditField(role, "usuario", "telefono");
  const canDireccion = canEditField(role, "usuario", "direccion");
  const canSexo = canEditField(role, "usuario", "sexo");
  const canFechaNacimiento = canEditField(role, "usuario", "fecha_nacimiento");
  const canSaldo = canEditField(role, "usuario", "saldo");

  const handleSave = () => {
    onSave(formUsuario);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre"
          fullWidth
          margin="dense"
          value={formUsuario.nombre}
          onChange={(e) => canNombre && setFormUsuario({ ...formUsuario, nombre: e.target.value })}
          disabled={!canNombre}
        />
        <TextField
          label="RUT"
          fullWidth
          margin="dense"
          value={formUsuario.rut}
          onChange={(e) => canRut && setFormUsuario({ ...formUsuario, rut: e.target.value })}
          disabled={!canRut}
        />
        <TextField
          label="Email"
          fullWidth
          margin="dense"
          value={formUsuario.email}
          onChange={(e) => canEmail && setFormUsuario({ ...formUsuario, email: e.target.value })}
          disabled={!canEmail}
        />
        <TextField
          label="Teléfono"
          fullWidth
          margin="dense"
          value={formUsuario.telefono}
          onChange={(e) => canTelefono && setFormUsuario({ ...formUsuario, telefono: e.target.value })}
          disabled={!canTelefono}
        />
        <TextField
          label="Dirección"
          fullWidth
          margin="dense"
          value={formUsuario.direccion}
          onChange={(e) => canDireccion && setFormUsuario({ ...formUsuario, direccion: e.target.value })}
          disabled={!canDireccion}
        />
        <TextField
          label="Sexo"
          fullWidth
          margin="dense"
          value={formUsuario.sexo}
          onChange={(e) => canSexo && setFormUsuario({ ...formUsuario, sexo: e.target.value })}
          disabled={!canSexo}
        />
        <TextField
          label="Fecha de Nacimiento"
          type="date"
          fullWidth
          margin="dense"
          value={formUsuario.fecha_nacimiento}
          onChange={(e) => canFechaNacimiento && setFormUsuario({ ...formUsuario, fecha_nacimiento: e.target.value })}
          disabled={!canFechaNacimiento}
        />
        <TextField
          label="Saldo"
          type="number"
          fullWidth
          margin="dense"
          value={formUsuario.saldo}
          onChange={(e) => canSaldo && setFormUsuario({ ...formUsuario, saldo: e.target.value })}
          disabled={!canSaldo}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={!(canNombre || canRut || canEmail || canTelefono || canDireccion || canSexo || canFechaNacimiento || canSaldo)}
        >
          {editing ? "Guardar Cambios" : "Crear Usuario"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UsuarioFormDialog;
