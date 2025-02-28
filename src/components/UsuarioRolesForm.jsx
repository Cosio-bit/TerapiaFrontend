/**import React, { useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";

const UsuarioRolesForm = ({ usuario, roles, onSave }) => {
    const [proveedorData, setProveedorData] = useState({
        rut_empresa: "",
        direccion: "",
        telefono: "",
        email: "",
    });
    const [clienteData, setClienteData] = useState({
        fecha_registro: "",
        saldo: "",
    });
    const [profesionalData, setProfesionalData] = useState({
        especialidad: "",
        certificaciones: "",
        disponibilidad: "",
    });

    const handleSaveRole = async (role) => {
        let data;
        if (role === "Proveedor") {
            data = proveedorData;
        } else if (role === "Cliente") {
            data = clienteData;
        } else if (role === "Profesional") {
            data = profesionalData;
        }

        // Pasar el rol y sus datos al controlador onSave
        onSave(role, { ...data, id_usuario: usuario.id_usuario });
    };

    return (
        <Box>
            
            {roles.proveedor && (
                <Box mb={4}>
                    <Typography variant="h6">Proveedor</Typography>
                    <TextField
                        margin="dense"
                        label="RUT Empresa"
                        fullWidth
                        value={proveedorData.rut_empresa}
                        onChange={(e) =>
                            setProveedorData({ ...proveedorData, rut_empresa: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Dirección"
                        fullWidth
                        value={proveedorData.direccion}
                        onChange={(e) =>
                            setProveedorData({ ...proveedorData, direccion: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Teléfono"
                        fullWidth
                        value={proveedorData.telefono}
                        onChange={(e) =>
                            setProveedorData({ ...proveedorData, telefono: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        type="email"
                        value={proveedorData.email}
                        onChange={(e) =>
                            setProveedorData({ ...proveedorData, email: e.target.value })
                        }
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveRole("Proveedor")}
                    >
                        Guardar Proveedor
                    </Button>
                </Box>
            )}

            {roles.cliente && (
                <Box mb={4}>
                    <Typography variant="h6">Cliente</Typography>
                    <TextField
                        margin="dense"
                        label="Fecha Registro"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={clienteData.fecha_registro}
                        onChange={(e) =>
                            setClienteData({ ...clienteData, fecha_registro: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Saldo"
                        type="number"
                        fullWidth
                        value={clienteData.saldo}
                        onChange={(e) =>
                            setClienteData({ ...clienteData, saldo: e.target.value })
                        }
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveRole("Cliente")}
                    >
                        Guardar Cliente
                    </Button>
                </Box>
            )}


            {roles.profesional && (
                <Box mb={4}>
                    <Typography variant="h6">Profesional</Typography>
                    <TextField
                        margin="dense"
                        label="Especialidad"
                        fullWidth
                        value={profesionalData.especialidad}
                        onChange={(e) =>
                            setProfesionalData({
                                ...profesionalData,
                                especialidad: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Certificaciones"
                        fullWidth
                        multiline
                        value={profesionalData.certificaciones}
                        onChange={(e) =>
                            setProfesionalData({
                                ...profesionalData,
                                certificaciones: e.target.value,
                            })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Disponibilidad"
                        fullWidth
                        value={profesionalData.disponibilidad}
                        onChange={(e) =>
                            setProfesionalData({
                                ...profesionalData,
                                disponibilidad: e.target.value,
                            })
                        }
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveRole("Profesional")}
                    >
                        Guardar Profesional
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default UsuarioRolesForm;
*/
