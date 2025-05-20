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
  Checkbox,
  ListItemText,
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "../components/authcontext";
import { canEditField } from "../can";

const TerapiaFormDialog = ({
  open,
  onClose,
  onSave,
  terapia,
  profesionales,
  editing,
}) => {
  const { role } = useAuth();

  const [formTerapia, setFormTerapia] = useState({
    nombre: "",
    descripcion: "",
    presencial: false,
    profesionalesSeleccionados: [],
    variantes: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (terapia) {
      setFormTerapia({
        ...terapia,
        profesionalesSeleccionados: terapia.profesionales.map((p) => p.id_profesional) || [],
        variantes: terapia.variantes || [],
      });
    } else {
      setFormTerapia({
        nombre: "",
        descripcion: "",
        presencial: false,
        profesionalesSeleccionados: [],
        variantes: [],
      });
    }
    setErrors({});
  }, [terapia]);

  const validateForm = () => {
    const newErrors = {};
    if (!formTerapia.nombre) newErrors.nombre = "El nombre es obligatorio.";
    if (!formTerapia.descripcion) newErrors.descripcion = "La descripción es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...formTerapia,
        profesionales: formTerapia.profesionalesSeleccionados,
      });
    }
  };

  const handleAddVariante = () => {
    setFormTerapia({
      ...formTerapia,
      variantes: [
        ...formTerapia.variantes,
        { nombre: "", precio: 0, duracion: 0, cantidad: 1 },
      ],
    });
  };

  const handleVarianteChange = (index, field, value) => {
    const newVariantes = [...formTerapia.variantes];

    newVariantes[index][field] = ["precio", "duracion", "cantidad"].includes(field)
      ? value === "" ? 0 : Number(value)
      : value;

    setFormTerapia({ ...formTerapia, variantes: newVariantes });
  };

  const handleDeleteVariante = (index) => {
    const newVariantes = [...formTerapia.variantes];
    newVariantes.splice(index, 1);
    setFormTerapia({ ...formTerapia, variantes: newVariantes });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editing ? "Editar Terapia" : "Crear Terapia"}</DialogTitle>
      <DialogContent>
        {canEditField(role, "terapia", "nombre") && (
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={formTerapia.nombre}
            onChange={(e) => setFormTerapia({ ...formTerapia, nombre: e.target.value })}
            error={!!errors.nombre}
            helperText={errors.nombre}
          />
        )}
        {canEditField(role, "terapia", "descripcion") && (
          <TextField
            margin="dense"
            label="Descripción"
            fullWidth
            multiline
            value={formTerapia.descripcion}
            onChange={(e) => setFormTerapia({ ...formTerapia, descripcion: e.target.value })}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
          />
        )}
        {canEditField(role, "terapia", "profesionales") && (
          <FormControl fullWidth margin="dense">
            <InputLabel>Profesionales</InputLabel>
            <Select
              multiple
              value={formTerapia.profesionalesSeleccionados}
              onChange={(e) =>
                setFormTerapia({
                  ...formTerapia,
                  profesionalesSeleccionados: e.target.value,
                })
              }
              renderValue={(selected) =>
                selected
                  .map(
                    (id) =>
                      profesionales.find((p) => p.id_profesional === id)?.usuario?.nombre || "Desconocido"
                  )
                  .join(", ")
              }
            >
              {profesionales.map((profesional) => (
                <MenuItem key={profesional.id_profesional} value={profesional.id_profesional}>
                  <Checkbox
                    checked={formTerapia.profesionalesSeleccionados.includes(profesional.id_profesional)}
                  />
                  <ListItemText primary={profesional.usuario?.nombre || "Sin nombre"} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Variantes */}
        {canEditField(role, "terapia", "variantes") && (
          <div>
            <h4>Variantes</h4>
            {formTerapia.variantes.map((variante, index) => (
              <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                <TextField
                  label="Nombre"
                  value={variante.nombre}
                  onChange={(e) => handleVarianteChange(index, "nombre", e.target.value)}
                />
                <TextField
                  label="Precio"
                  type="number"
                  value={variante.precio}
                  onChange={(e) => handleVarianteChange(index, "precio", e.target.value)}
                />
                <TextField
                  label="Duración (min)"
                  type="number"
                  value={variante.duracion}
                  onChange={(e) => handleVarianteChange(index, "duracion", e.target.value)}
                />
                <TextField
                  label="Cantidad"
                  type="number"
                  value={variante.cantidad}
                  onChange={(e) => handleVarianteChange(index, "cantidad", e.target.value)}
                />
                <IconButton onClick={() => handleDeleteVariante(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
            <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddVariante} variant="outlined">
              Agregar Variante
            </Button>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {editing ? "Guardar Cambios" : "Crear Terapia"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TerapiaFormDialog;
