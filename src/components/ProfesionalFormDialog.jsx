import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import UsuarioFormDialog from "./UsuarioFormDialog";
import { createUsuario } from "../api/usuarioApi";
import { useAuth } from "../components/authcontext";
import { can, canEditField } from "../can";

const ProfesionalFormDialog = ({
  open,
  onClose,
  onSave,
  profesional,
  usuarios,
  setUsuarios,
  editing,
  setSnackbar,
}) => {
  const { role } = useAuth();

  const [formProfesional, setFormProfesional] = useState({
    id_usuario: "",
    especialidad: "",
    certificaciones: "",
    disponibilidad: "",
    banco: "",
    nro_cuenta_bancaria: "",
  });

  const [openUsuarioDialog, setOpenUsuarioDialog] = useState(false);

  useEffect(() => {
    if (profesional) {
      setFormProfesional({
        id_usuario: profesional.usuario?.id_usuario || "",
        especialidad: profesional.especialidad || "",
        certificaciones: profesional.certificaciones || "",
        disponibilidad: profesional.disponibilidad || "",
        banco: profesional.banco || "",
        nro_cuenta_bancaria: profesional.nro_cuenta_bancaria || "",
      });
    } else {
      setFormProfesional({
        id_usuario: "",
        especialidad: "",
        certificaciones: "",
        disponibilidad: "",
        banco: "",
        nro_cuenta_bancaria: "",
      });
    }
  }, [profesional]);

  const canSave = editing ? can(role, "edit", "profesional") : can(role, "create", "profesional");

  const handleSave = () => {
    if (!canSave) {
      setSnackbar?.({
        open: true,
        message: "No tienes permiso para realizar esta acción.",
        severity: "error",
      });
      return;
    }

    if (!formProfesional.id_usuario) {
      setSnackbar?.({
        open: true,
        message: "Debe seleccionar un usuario.",
        severity: "error",
      });
      return;
    }

    onSave(formProfesional);
  };

  const handleUsuarioCreado = async (usuarioTemp) => {
    try {
      const nuevoUsuario = await createUsuario(usuarioTemp);
      setUsuarios((prev) => [...prev, nuevoUsuario]);
      setFormProfesional((prev) => ({
        ...prev,
        id_usuario: String(nuevoUsuario.id_usuario),
      }));
      setOpenUsuarioDialog(false);
    } catch (error) {
      console.error("Error al crear usuario:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{editing ? "Editar Profesional" : "Crear Profesional"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" disabled={!canEditField(role, "profesional", "id_usuario")}>
            <InputLabel id="usuario-label">Usuario</InputLabel>
            <Select
              labelId="usuario-label"
              value={formProfesional.id_usuario}
              onChange={(e) =>
                setFormProfesional({ ...formProfesional, id_usuario: e.target.value })
              }
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre} ({usuario.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {canEditField(role, "profesional", "id_usuario") && (
            <Button
              onClick={() => setOpenUsuarioDialog(true)}
              variant="outlined"
              size="small"
              style={{ marginTop: 6, marginBottom: 12 }}
            >
              Crear nuevo usuario
            </Button>
          )}

          {["especialidad", "certificaciones", "disponibilidad", "banco", "nro_cuenta_bancaria"].map((field) => (
            <TextField
              key={field}
              label={field[0].toUpperCase() + field.slice(1).replace(/_/g, " ")}
              fullWidth
              margin="dense"
              value={formProfesional[field]}
              onChange={(e) =>
                setFormProfesional({ ...formProfesional, [field]: e.target.value })
              }
              disabled={!canEditField(role, "profesional", field)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={!canSave}>
            {editing ? "Guardar Cambios" : "Crear Profesional"}
          </Button>
        </DialogActions>
      </Dialog>

      <UsuarioFormDialog
        open={openUsuarioDialog}
        onClose={() => setOpenUsuarioDialog(false)}
        onSave={handleUsuarioCreado}
        usuario={null}
        editing={false}
      />
    </>
  );
};

export default ProfesionalFormDialog;
