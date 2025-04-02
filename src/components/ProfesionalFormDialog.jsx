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
import { createUsuario } from "../api/usuarioApi"; // ✅ Importar para guardar

const ProfesionalFormDialog = ({
  open,
  onClose,
  onSave,
  profesional,
  usuarios,
  setUsuarios, // ✅ Para actualizar la lista
  editing,
}) => {
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

  const handleSave = () => {
    if (!formProfesional.id_usuario) {
      console.error("Error: Usuario no seleccionado.");
      return;
    }
    onSave(formProfesional);
  };

  const handleUsuarioCreado = async (usuarioTemp) => {
    try {
      const nuevoUsuario = await createUsuario(usuarioTemp); // ✅ Guarda en base de datos
      setUsuarios((prev) => [...prev, nuevoUsuario]);        // ✅ Actualiza lista
      setFormProfesional((prev) => ({
        ...prev,
        id_usuario: String(nuevoUsuario.id_usuario),          // ✅ Lo selecciona
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
          <FormControl fullWidth margin="dense">
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

          <Button
            onClick={() => setOpenUsuarioDialog(true)}
            variant="outlined"
            size="small"
            style={{ marginTop: 6, marginBottom: 12 }}
          >
            Crear nuevo usuario
          </Button>

          <TextField
            label="Especialidad"
            fullWidth
            margin="dense"
            value={formProfesional.especialidad}
            onChange={(e) =>
              setFormProfesional({ ...formProfesional, especialidad: e.target.value })
            }
          />
          <TextField
            label="Certificaciones"
            fullWidth
            margin="dense"
            value={formProfesional.certificaciones}
            onChange={(e) =>
              setFormProfesional({ ...formProfesional, certificaciones: e.target.value })
            }
          />
          <TextField
            label="Disponibilidad"
            fullWidth
            margin="dense"
            value={formProfesional.disponibilidad}
            onChange={(e) =>
              setFormProfesional({ ...formProfesional, disponibilidad: e.target.value })
            }
          />
          <TextField
            label="Banco"
            fullWidth
            margin="dense"
            value={formProfesional.banco}
            onChange={(e) =>
              setFormProfesional({ ...formProfesional, banco: e.target.value })
            }
          />
          <TextField
            label="Número de Cuenta Bancaria"
            fullWidth
            margin="dense"
            value={formProfesional.nro_cuenta_bancaria}
            onChange={(e) =>
              setFormProfesional({
                ...formProfesional,
                nro_cuenta_bancaria: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
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
