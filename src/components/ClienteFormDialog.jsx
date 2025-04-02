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
import { createUsuario } from "../api/usuarioApi"; // ✅ Importar para guardar nuevo usuario

const ClienteFormDialog = ({
  open,
  onClose,
  onSave,
  cliente,
  usuarios,
  setUsuarios,
  editing,
}) => {
  const [formCliente, setFormCliente] = useState({
    usuarioSeleccionado: "",
    fecha_registro: "",
    saldo: 0,
    fichasSalud: [],
  });

  const [errors, setErrors] = useState({});
  const [openUsuarioDialog, setOpenUsuarioDialog] = useState(false);
  const [nuevoUsuarioTemp, setNuevoUsuarioTemp] = useState(null); // ⚠️ Para pasar datos del nuevo usuario

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

  // ✅ Guardar el usuario directamente desde el formulario del cliente
  const handleUsuarioCreado = async (usuarioTemp) => {
    try {
      const nuevoUsuario = await createUsuario(usuarioTemp); // 🔁 Guardar realmente en la base de datos
      setUsuarios((prev) => [...prev, nuevoUsuario]);        // ✅ Agregar a lista local
      setFormCliente((prev) => ({
        ...prev,
        usuarioSeleccionado: String(nuevoUsuario.id_usuario), // ✅ Seleccionar automáticamente
      }));
      setOpenUsuarioDialog(false);                            // ✅ Cerrar modal
    } catch (error) {
      console.error("Error al crear usuario desde ClienteFormDialog:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{editing ? "Editar Cliente" : "Crear Cliente"}</DialogTitle>
        <DialogContent>
          {/* Select de usuario existente */}
          <FormControl fullWidth margin="dense">
            <InputLabel>Usuario</InputLabel>
            <Select
              value={formCliente.usuarioSeleccionado}
              onChange={(e) => setFormCliente({ ...formCliente, usuarioSeleccionado: e.target.value })}
              error={!!errors.usuarioSeleccionado}
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={String(usuario.id_usuario)}>
                  {usuario.nombre} ({usuario.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Botón para abrir el formulario de usuario */}
          <Button
            onClick={() => setOpenUsuarioDialog(true)}
            variant="outlined"
            size="small"
            style={{ marginTop: 6, marginBottom: 12 }}
          >
            Crear nuevo usuario
          </Button>

          <TextField
            margin="dense"
            label="Fecha de Registro"
            type="date"
            fullWidth
            value={formCliente.fecha_registro}
            onChange={(e) => setFormCliente({ ...formCliente, fecha_registro: e.target.value })}
            error={!!errors.fecha_registro}
            helperText={errors.fecha_registro}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            margin="dense"
            label="Saldo"
            type="number"
            fullWidth
            value={formCliente.saldo}
            onChange={(e) => setFormCliente({ ...formCliente, saldo: e.target.value })}
          />

          {/* Fichas Salud */}
          <div>
            <h4>Fichas de Salud</h4>
            {formCliente.fichasSalud.map((ficha, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                <TextField
                  label="Fecha"
                  type="date"
                  value={ficha.fecha}
                  onChange={(e) => handleFichaChange(index, "fecha", e.target.value)}
                />
                <TextField
                  label="Descripción"
                  value={ficha.descripcion}
                  onChange={(e) => handleFichaChange(index, "descripcion", e.target.value)}
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
          <Button onClick={handleSave} variant="contained" color="primary">
            {editing ? "Guardar Cambios" : "Crear Cliente"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de creación de usuario */}
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
