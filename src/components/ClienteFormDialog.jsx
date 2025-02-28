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

const ClienteFormDialog = ({
  open,
  onClose,
  onSave,
  cliente,
  usuarios,
  editing,
}) => {
  const [formCliente, setFormCliente] = useState({
    usuarioSeleccionado: "",
    fecha_registro: "",
    saldo: 0,
    fichasSalud: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (cliente) {
      setFormCliente({
        usuarioSeleccionado: cliente.usuario?.id_usuario ? String(cliente.usuario.id_usuario) : "", // ✅ Ensure correct user ID
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
        usuario: { id_usuario: Number(formCliente.usuarioSeleccionado) }, // ✅ Ensure correct user ID
        fecha_registro: formCliente.fecha_registro,
        saldo: Number(formCliente.saldo),
        fichasSalud: formCliente.fichasSalud.map((ficha) => ({
          id_fichasalud: ficha.id_fichasalud && ficha.id_fichasalud > 0 ? ficha.id_fichasalud : null, // ✅ Keep existing ID, mark new as null
          fecha: ficha.fecha || new Date().toISOString().split("T")[0], // ✅ Ensure valid date
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Cliente" : "Crear Cliente"}</DialogTitle>
      <DialogContent>
        {/* Select Usuario */}
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

        {/* Fichas Salud Management */}
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
  );
};

export default ClienteFormDialog;
