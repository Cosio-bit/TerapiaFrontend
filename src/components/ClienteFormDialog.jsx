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
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import UsuarioFormDialog from "./UsuarioFormDialog";
import { createUsuario } from "../api/usuarioApi";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../utils/can";


const ClienteFormDialog = ({
  open,
  onClose,
  onSave,
  cliente,
  usuarios,
  setUsuarios,
  editing,
}) => {
  const { role } = useAuth();

  const [formCliente, setFormCliente] = useState({
    usuarioSeleccionado: "",
    fecha_registro: "",
    saldo: 0,
    fichasSalud: [],
  });

  const [errors, setErrors] = useState({});
  const [openUsuarioDialog, setOpenUsuarioDialog] = useState(false);

  useEffect(() => {
    if (cliente) {
      setFormCliente({
        usuarioSeleccionado: cliente.usuario?.id_usuario ? String(cliente.usuario.id_usuario) : "",
        fecha_registro: cliente.fecha_registro || "",
        saldo: cliente.saldo || 0,
        fichasSalud: cliente.fichasSalud || [],
      });
    } else {
      setFormCliente({
        usuarioSeleccionado: "",
        fecha_registro: "",
        saldo: 0,
        fichasSalud: [],
      });
    }
    setErrors({});
  }, [cliente]);

  const validateForm = () => {
    const newErrors = {};
    if (!formCliente.usuarioSeleccionado) newErrors.usuarioSeleccionado = "El usuario es obligatorio.";
    if (!formCliente.fecha_registro) newErrors.fecha_registro = "La fecha de registro es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        usuario: { id_usuario: Number(formCliente.usuarioSeleccionado) },
        fecha_registro: formCliente.fecha_registro,
        saldo: Number(formCliente.saldo),
        fichasSalud: formCliente.fichasSalud.map((ficha) => ({
          id_fichasalud: ficha.id_fichasalud && ficha.id_fichasalud > 0 ? ficha.id_fichasalud : null,
          fecha: ficha.fecha || new Date().toISOString().split("T")[0],
          descripcion: ficha.descripcion || "Sin descripción",
        })),
      });
    }
  };

  const handleAddFichaSalud = () => {
    setFormCliente({
      ...formCliente,
      fichasSalud: [...formCliente.fichasSalud, { fecha: "", descripcion: "" }],
    });
  };

  const handleFichaChange = (index, field, value) => {
    const newFichas = [...formCliente.fichasSalud];
    newFichas[index][field] = value;
    setFormCliente({ ...formCliente, fichasSalud: newFichas });
  };

  const handleDeleteFicha = (index) => {
    const newFichas = [...formCliente.fichasSalud];
    newFichas.splice(index, 1);
    setFormCliente({ ...formCliente, fichasSalud: newFichas });
  };

  // Permisos para editar campos
  const canEditUsuarioSeleccionado = canEditField(role, "cliente", "usuarioSeleccionado");
  const canEditFechaRegistro = canEditField(role, "cliente", "fecha_registro");
  const canEditSaldo = canEditField(role, "cliente", "saldo");
  // Para fichas de salud asumo permisos totales, si quieres puedes añadir validación también

  // Guardar usuario desde formulario cliente
  const handleUsuarioCreado = async (usuarioTemp) => {
    try {
      const nuevoUsuario = await createUsuario(usuarioTemp);
      setUsuarios((prev) => [...prev, nuevoUsuario]);
      setFormCliente((prev) => ({
        ...prev,
        usuarioSeleccionado: String(nuevoUsuario.id_usuario),
      }));
      setOpenUsuarioDialog(false);
    } catch (error) {
      console.error("Error al crear usuario desde ClienteFormDialog:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{editing ? "Editar Cliente" : "Crear Cliente"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" disabled={!canEditUsuarioSeleccionado}>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={formCliente.usuarioSeleccionado}
              onChange={(e) => canEditUsuarioSeleccionado && setFormCliente({ ...formCliente, usuarioSeleccionado: e.target.value })}
              error={!!errors.usuarioSeleccionado}
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={String(usuario.id_usuario)}>
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
            disabled={!canEditUsuarioSeleccionado}
          >
            Crear nuevo usuario
          </Button>

          <TextField
            margin="dense"
            label="Fecha de Registro"
            type="date"
            fullWidth
            value={formCliente.fecha_registro}
            onChange={(e) => canEditFechaRegistro && setFormCliente({ ...formCliente, fecha_registro: e.target.value })}
            error={!!errors.fecha_registro}
            helperText={errors.fecha_registro}
            InputLabelProps={{ shrink: true }}
            disabled={!canEditFechaRegistro}
          />

          <TextField
            margin="dense"
            label="Saldo"
            type="number"
            fullWidth
            value={formCliente.saldo}
            onChange={(e) => canEditSaldo && setFormCliente({ ...formCliente, saldo: e.target.value })}
            disabled={!canEditSaldo}
          />

          <div>
            <h4>Fichas de Salud</h4>
            {formCliente.fichasSalud.map((ficha, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                <TextField
                  label="Fecha"
                  type="date"
                  value={ficha.fecha}
                  onChange={(e) => handleFichaChange(index, "fecha", e.target.value)}
                  // aquí puedes añadir control de permisos si quieres
                />
                <TextField
                  label="Descripción"
                  value={ficha.descripcion}
                  onChange={(e) => handleFichaChange(index, "descripcion", e.target.value)}
                  // aquí puedes añadir control de permisos si quieres
                />
                <IconButton onClick={() => handleDeleteFicha(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddFichaSalud} variant="outlined">
              Agregar Ficha de Salud
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={
            // Deshabilita guardar si no puede editar nada
            !(
              canEditUsuarioSeleccionado ||
              canEditFechaRegistro ||
              canEditSaldo ||
              formCliente.fichasSalud.length > 0
            )
          }>
            {editing ? "Guardar Cambios" : "Crear Cliente"}
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

export default ClienteFormDialog;
