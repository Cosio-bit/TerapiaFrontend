import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import {
    getProveedores,
    createProveedor,
    updateProveedor,
    deleteProveedor,
} from "../api/proveedorApi";
import { getUsuarios } from "../api/usuarioApi";

const Proveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [newProveedor, setNewProveedor] = useState({
        id_usuario: "",
        rut_empresa: "",
        direccion: "",
        telefono: "",
        email: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentProveedorId, setCurrentProveedorId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [proveedoresData, usuariosData] = await Promise.all([
                    getProveedores(),
                    getUsuarios(),
                ]);
                setProveedores(proveedoresData);
                setUsuarios(usuariosData);
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: "Error al cargar los datos.",
                    severity: "error",
                });
            }
        };

        fetchData();
    }, []);

    const handleSaveProveedor = async () => {
        try {
            if (editing) {
                await updateProveedor(currentProveedorId, newProveedor);
                setEditing(false);
            } else {
                await createProveedor(newProveedor);
            }

            const updatedProveedores = await getProveedores();
            setProveedores(updatedProveedores);
            setNewProveedor({
                id_usuario: "",
                rut_empresa: "",
                direccion: "",
                telefono: "",
                email: "",
            });
            setOpenDialog(false);
            setSnackbar({
                open: true,
                message: "Proveedor guardado con éxito.",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error al guardar el proveedor.",
                severity: "error",
            });
        }
    };

    const handleEditProveedor = (proveedor) => {
        setEditing(true);
        setCurrentProveedorId(proveedor.id);
        setNewProveedor({
            id_usuario: proveedor.id_usuario,
            rut_empresa: proveedor.rut_empresa,
            direccion: proveedor.direccion,
            telefono: proveedor.telefono,
            email: proveedor.email,
        });
        setOpenDialog(true);
    };

    const handleDeleteProveedor = async (id) => {
        try {
            await deleteProveedor(id);
            const updatedProveedores = await getProveedores();
            setProveedores(updatedProveedores);
            setSnackbar({
                open: true,
                message: "Proveedor eliminado con éxito.",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error al eliminar el proveedor.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Proveedores
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewProveedor({
                        id_usuario: "",
                        rut_empresa: "",
                        direccion: "",
                        telefono: "",
                        email: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Proveedor
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={proveedores.map((proveedor) => ({ ...proveedor, id: proveedor.id_proveedor }))}
                    columns={[
                        { field: "id", headerName: "ID Proveedor", flex: 1 },
                        { field: "id_usuario", headerName: "ID Usuario", flex: 1 },
                        { field: "rut_empresa", headerName: "RUT Empresa", flex: 1 },
                        { field: "direccion", headerName: "Dirección", flex: 1 },
                        { field: "telefono", headerName: "Teléfono", flex: 1 },
                        { field: "email", headerName: "Email", flex: 1 },
                        {
                            field: "actions",
                            headerName: "Acciones",
                            sortable: false,
                            flex: 1,
                            renderCell: (params) => (
                                <Box>
                                    <Button
                                        size="small"
                                        onClick={() => handleEditProveedor(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteProveedor(params.row.id)}
                                    >
                                        Eliminar
                                    </Button>
                                </Box>
                            ),
                        },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                />
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>{editing ? "Editar Proveedor" : "Crear Proveedor"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Usuario</InputLabel>
                        <Select
                            value={newProveedor.id_usuario}
                            onChange={(e) =>
                                setNewProveedor({ ...newProveedor, id_usuario: e.target.value })
                            }
                        >
                            {usuarios.map((usuario) => (
                                <MenuItem key={usuario.id_usuario} value={usuario.id_usuario}>
                                    {usuario.nombre} - {usuario.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="RUT Empresa"
                        fullWidth
                        value={newProveedor.rut_empresa}
                        onChange={(e) =>
                            setNewProveedor({ ...newProveedor, rut_empresa: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Dirección"
                        fullWidth
                        value={newProveedor.direccion}
                        onChange={(e) =>
                            setNewProveedor({ ...newProveedor, direccion: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Teléfono"
                        fullWidth
                        value={newProveedor.telefono}
                        onChange={(e) =>
                            setNewProveedor({ ...newProveedor, telefono: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        fullWidth
                        value={newProveedor.email}
                        onChange={(e) => setNewProveedor({ ...newProveedor, email: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveProveedor} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Proveedor"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Proveedores;
