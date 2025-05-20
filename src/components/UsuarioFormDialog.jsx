import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button
} from "@mui/material";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../can";

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

  const handleSave = () => {
    onSave(formUsuario);
  };

  const renderField = (name, label, type = "text") =>
    canEditField(role, "usuario", name) && (
      <TextField
        label={label}
        type={type}
        fullWidth
        margin="dense"
        value={formUsuario[name]}
        onChange={(e) => setFormUsuario({ ...formUsuario, [name]: e.target.value })}
      />
    );

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
      <DialogContent>
        {renderField("nombre", "Nombre")}
        {renderField("rut", "RUT")}
        {renderField("email", "Email")}
        {renderField("telefono", "Teléfono")}
        {renderField("direccion", "Dirección")}
        {renderField("sexo", "Sexo")}
        {renderField("fecha_nacimiento", "Fecha de Nacimiento", "date")}
        {renderField("saldo", "Saldo", "number")}
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
