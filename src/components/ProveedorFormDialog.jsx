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
  FormHelperText,
} from "@mui/material";
import UsuarioFormDialog from "./UsuarioFormDialog";
import { createUsuario } from "../api/usuarioApi"; // ✅ importar función para guardar usuario

const ProveedorFormDialog = ({
  open,
  onClose,
  onSave,
  proveedor,
  usuarios,
  setUsuarios, // ✅ necesario para actualizar lista
  editing,
}) => {
  const [formProveedor, setFormProveedor] = useState({
    id_usuario: "",
    rut_empresa: "",
    direccion: "",
    telefono: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [openUsuarioDialog, setOpenUsuarioDialog] = useState(false);

  useEffect(() => {
    if (proveedor) {
      setFormProveedor({
        id_usuario: proveedor.usuario?.id_usuario || "",
        rut_empresa: proveedor.rut_empresa || "",
        direccion: proveedor.direccion || "",
        telefono: proveedor.telefono || "",
        email: proveedor.email || "",
      });
    } else {
      setFormProveedor({
        id_usuario: "",
        rut_empresa: "",
        direccion: "",
        telefono: "",
        email: "",
      });
    }
    setErrors({});
  }, [proveedor]);

  const validateForm = () => {
    const newErrors = {};
    if (!formProveedor.id_usuario) newErrors.id_usuario = "El usuario es obligatorio.";
    if (!formProveedor.rut_empresa) newErrors.rut_empresa = "El RUT de la empresa es obligatorio.";
    if (!formProveedor.direccion) newErrors.direccion = "La dirección es obligatoria.";
    if (!formProveedor.telefono) newErrors.telefono = "El teléfono es obligatorio.";
    if (!formProveedor.email) newErrors.email = "El correo electrónico es obligatorio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formProveedor);
    }
  };

  const handleUsuarioCreado = async (usuarioTemp) => {
    try {
      const nuevoUsuario = await createUsuario(usuarioTemp); // ✅ Guardar en backend
      setUsuarios((prev) => [...prev, nuevoUsuario]);        // ✅ Agregar a la lista local
      setFormProveedor((prev) => ({
        ...prev,
        id_usuario: String(nuevoUsuario.id_usuario),          // ✅ Seleccionar automáticamente
      }));
      setOpenUsuarioDialog(false);
    } catch (error) {
      console.error("Error al crear usuario desde ProveedorFormDialog:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{editing ? "Editar Proveedor" : "Crear Proveedor"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense" error={!!errors.id_usuario}>
            <InputLabel>Usuario</InputLabel>
            <Select
              value={formProveedor.id_usuario}
              onChange={(e) => setFormProveedor({ ...formProveedor, id_usuario: e.target.value })}
            >
              {usuarios.map((usuario) => (
                <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                  {usuario.nombre} ({usuario.email})
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>{errors.id_usuario}</FormHelperText>
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
            margin="dense"
            label="RUT Empresa"
            fullWidth
            value={formProveedor.rut_empresa}
            onChange={(e) => setFormProveedor({ ...formProveedor, rut_empresa: e.target.value })}
            error={!!errors.rut_empresa}
            helperText={errors.rut_empresa}
          />
          <TextField
            margin="dense"
            label="Dirección"
            fullWidth
            value={formProveedor.direccion}
            onChange={(e) => setFormProveedor({ ...formProveedor, direccion: e.target.value })}
            error={!!errors.direccion}
            helperText={errors.direccion}
          />
          <TextField
            margin="dense"
            label="Teléfono"
            fullWidth
            value={formProveedor.telefono}
            onChange={(e) => setFormProveedor({ ...formProveedor, telefono: e.target.value })}
            error={!!errors.telefono}
            helperText={errors.telefono}
          />
          <TextField
            margin="dense"
            label="Correo Electrónico"
            fullWidth
            value={formProveedor.email}
            onChange={(e) => setFormProveedor({ ...formProveedor, email: e.target.value })}
            error={!!errors.email}
            helperText={errors.email}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editing ? "Guardar Cambios" : "Crear Proveedor"}
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

export default ProveedorFormDialog;
