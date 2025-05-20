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
import { canEditField } from "../utils/can";

const ProfesionalFormDialog = ({
  open,
  onClose,
  onSave,
  profesional,
  usuarios,
  setUsuarios,
  editing,
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

  const canEditUsuario = canEditField(role, "profesional", "id_usuario");
  const canEditEspecialidad = canEditField(role, "profesional", "especialidad");
  const canEditCertificaciones = canEditField(role, "profesional", "certificaciones");
  const canEditDisponibilidad = canEditField(role, "profesional", "disponibilidad");
  const canEditBanco = canEditField(role, "profesional", "banco");
  const canEditCuenta = canEditField(role, "profesional", "nro_cuenta_bancaria");

  const handleSave = () => {
    if (!formProfesional.id_usuario) {
      console.error("Error: Usuario no seleccionado.");
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
      console.error("Error al crear usuario desde ProfesionalFormDialog:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{editing ? "Editar Profesional" : "Crear Profesional"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" disabled={!canEditUsuario}>
            <InputLabel id="usuario-label">Usuario</InputLabel>
            <Select
              labelId="usuario-label"
              value={formProfesional.id_usuario}
              onChange={(e) => canEditUsuario && setFormProfesional({ ...formProfesional, id_usuario: e.target.value })}
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre} ({usuario.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            onClick={() => setOpenUsuarioDialog(true)}
            variant="outlined"
            size="small"
            style={{ marginTop: 6, marginBottom: 12 }}
            disabled={!canEditUsuario}
          >
            Crear nuevo usuario
          </Button>

          <TextField
            label="Especialidad"
            fullWidth
            margin="dense"
            value={formProfesional.especialidad}
            onChange={(e) => canEditEspecialidad && setFormProfesional({ ...formProfesional, especialidad: e.target.value })}
            disabled={!canEditEspecialidad}
          />
          <TextField
            label="Certificaciones"
            fullWidth
            margin="dense"
            value={formProfesional.certificaciones}
            onChange={(e) => canEditCertificaciones && setFormProfesional({ ...formProfesional, certificaciones: e.target.value })}
            disabled={!canEditCertificaciones}
          />
          <TextField
            label="Disponibilidad"
            fullWidth
            margin="dense"
            value={formProfesional.disponibilidad}
            onChange={(e) => canEditDisponibilidad && setFormProfesional({ ...formProfesional, disponibilidad: e.target.value })}
            disabled={!canEditDisponibilidad}
          />
          <TextField
            label="Banco"
            fullWidth
            margin="dense"
            value={formProfesional.banco}
            onChange={(e) => canEditBanco && setFormProfesional({ ...formProfesional, banco: e.target.value })}
            disabled={!canEditBanco}
          />
          <TextField
            label="Número de Cuenta Bancaria"
            fullWidth
            margin="dense"
            value={formProfesional.nro_cuenta_bancaria}
            onChange={(e) => canEditCuenta && setFormProfesional({
              ...formProfesional,
              nro_cuenta_bancaria: e.target.value,
            })}
            disabled={!canEditCuenta}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={!(canEditUsuario || canEditEspecialidad || canEditCertificaciones || canEditDisponibilidad || canEditBanco || canEditCuenta)}
          >
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
