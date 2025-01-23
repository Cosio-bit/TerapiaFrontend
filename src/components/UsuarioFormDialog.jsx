import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Button,
    Typography,
    FormControlLabel,
    Checkbox,
} from "@mui/material";

const UsuarioFormDialog = ({ open, onClose, onSave, usuario, editing }) => {
    const [formUsuario, setFormUsuario] = useState({
        nombre: "",
        rut: "",
        direccion: "",
        email: "",
        telefono: "",
        sexo: "",
        fecha_nacimiento: "",
        saldo: "",
    });

    const [roles, setRoles] = useState({
        proveedor: false,
        cliente: false,
        profesional: false,
    });

    // Cargar datos del usuario si está en modo edición
    useEffect(() => {
        if (usuario) {
            setFormUsuario(usuario);
            setRoles({
                proveedor: usuario.roles?.includes("Proveedor") || false,
                cliente: usuario.roles?.includes("Cliente") || false,
                profesional: usuario.roles?.includes("Profesional") || false,
            });
        } else {
            // Reiniciar el formulario si no hay usuario seleccionado
            setFormUsuario({
                nombre: "",
                rut: "",
                direccion: "",
                email: "",
                telefono: "",
                sexo: "",
                fecha_nacimiento: "",
                saldo: "",
            });
            setRoles({ proveedor: false, cliente: false, profesional: false });
        }
    }, [usuario]);

    const handleSave = () => {
        onSave(formUsuario, roles); // Pasar datos del usuario y roles seleccionados
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{editing ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>
            <DialogContent>
                {/* Nombre */}
                <TextField
                    margin="dense"
                    label="Nombre"
                    fullWidth
                    value={formUsuario.nombre}
                    onChange={(e) => setFormUsuario({ ...formUsuario, nombre: e.target.value })}
                />
                {/* RUT */}
                <TextField
                    margin="dense"
                    label="RUT"
                    fullWidth
                    value={formUsuario.rut}
                    onChange={(e) => setFormUsuario({ ...formUsuario, rut: e.target.value })}
                />
                {/* Dirección */}
                <TextField
                    margin="dense"
                    label="Dirección"
                    fullWidth
                    value={formUsuario.direccion}
                    onChange={(e) =>
                        setFormUsuario({ ...formUsuario, direccion: e.target.value })
                    }
                />
                {/* Email */}
                <TextField
                    margin="dense"
                    label="Email"
                    fullWidth
                    type="email"
                    value={formUsuario.email}
                    onChange={(e) => setFormUsuario({ ...formUsuario, email: e.target.value })}
                />
                {/* Teléfono */}
                <TextField
                    margin="dense"
                    label="Teléfono"
                    fullWidth
                    value={formUsuario.telefono}
                    onChange={(e) =>
                        setFormUsuario({ ...formUsuario, telefono: e.target.value })
                    }
                />
                {/* Sexo */}
                <TextField
                    margin="dense"
                    label="Sexo"
                    fullWidth
                    value={formUsuario.sexo}
                    onChange={(e) => setFormUsuario({ ...formUsuario, sexo: e.target.value })}
                />
                {/* Fecha de Nacimiento */}
                <TextField
                    margin="dense"
                    label="Fecha de Nacimiento"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={formUsuario.fecha_nacimiento}
                    onChange={(e) =>
                        setFormUsuario({ ...formUsuario, fecha_nacimiento: e.target.value })
                    }
                />
                {/* Saldo */}
                <TextField
                    margin="dense"
                    label="Saldo"
                    type="number"
                    fullWidth
                    value={formUsuario.saldo}
                    onChange={(e) => setFormUsuario({ ...formUsuario, saldo: e.target.value })}
                />

                {/* Roles */}
                <Typography variant="h6" gutterBottom>
                    Roles
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={roles.proveedor}
                            onChange={(e) =>
                                setRoles({ ...roles, proveedor: e.target.checked })
                            }
                        />
                    }
                    label="Proveedor"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={roles.cliente}
                            onChange={(e) =>
                                setRoles({ ...roles, cliente: e.target.checked })
                            }
                        />
                    }
                    label="Cliente"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={roles.profesional}
                            onChange={(e) =>
                                setRoles({ ...roles, profesional: e.target.checked })
                            }
                        />
                    }
                    label="Profesional"
                />
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
