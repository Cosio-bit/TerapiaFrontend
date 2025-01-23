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
    getProfesionales,
    createProfesional,
    updateProfesional,
    deleteProfesional,
} from "../api/profesionalApi";
import { getUsuarios } from "../api/usuarioApi";

const Profesionales = () => {
    const [profesionales, setProfesionales] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [newProfesional, setNewProfesional] = useState({
        id_usuario: "",
        especialidad: "",
        certificaciones: "",
        disponibilidad: "",
        banco: "",
        nro_cuenta_bancaria: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentProfesionalId, setCurrentProfesionalId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profesionalesData, usuariosData] = await Promise.all([
                    getProfesionales(),
                    getUsuarios(),
                ]);
                setProfesionales(profesionalesData);
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

    const handleSaveProfesional = async () => {
        try {
            if (editing) {
                await updateProfesional(currentProfesionalId, newProfesional);
                setEditing(false);
            } else {
                await createProfesional(newProfesional);
            }

            const updatedProfesionales = await getProfesionales();
            setProfesionales(updatedProfesionales);
            setNewProfesional({
                id_usuario: "",
                especialidad: "",
                certificaciones: "",
                disponibilidad: "",
                banco: "",
                nro_cuenta_bancaria: "",
            });
            setOpenDialog(false);
            setSnackbar({
                open: true,
                message: "Profesional guardado con éxito.",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error al guardar el profesional.",
                severity: "error",
            });
        }
    };

    const handleEditProfesional = (profesional) => {
        setEditing(true);
        setCurrentProfesionalId(profesional.id);
        setNewProfesional({
            id_usuario: profesional.id_usuario,
            especialidad: profesional.especialidad,
            certificaciones: profesional.certificaciones,
            disponibilidad: profesional.disponibilidad,
            banco: profesional.banco,
            nro_cuenta_bancaria: profesional.nro_cuenta_bancaria,
        });
        setOpenDialog(true);
    };

    const handleDeleteProfesional = async (id) => {
        try {
            await deleteProfesional(id);
            const updatedProfesionales = await getProfesionales();
            setProfesionales(updatedProfesionales);
            setSnackbar({
                open: true,
                message: "Profesional eliminado con éxito.",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Error al eliminar el profesional.",
                severity: "error",
            });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Profesionales
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewProfesional({
                        id_usuario: "",
                        especialidad: "",
                        certificaciones: "",
                        disponibilidad: "",
                        banco: "",
                        nro_cuenta_bancaria: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Profesional
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={profesionales.map((profesional) => ({
                        ...profesional,
                        id: profesional.id_profesional,
                    }))}
                    columns={[
                        { field: "id", headerName: "ID Profesional", flex: 1 },
                        { field: "id_usuario", headerName: "ID Usuario", flex: 1 },
                        { field: "especialidad", headerName: "Especialidad", flex: 1 },
                        { field: "certificaciones", headerName: "Certificaciones", flex: 1 },
                        { field: "disponibilidad", headerName: "Disponibilidad", flex: 1 },
                        { field: "banco", headerName: "Banco", flex: 1 },
                        {
                            field: "nro_cuenta_bancaria",
                            headerName: "N° Cuenta Bancaria",
                            flex: 1,
                        },
                        {
                            field: "actions",
                            headerName: "Acciones",
                            sortable: false,
                            flex: 1,
                            renderCell: (params) => (
                                <Box>
                                    <Button
                                        size="small"
                                        onClick={() => handleEditProfesional(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteProfesional(params.row.id)}
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
                <DialogTitle>{editing ? "Editar Profesional" : "Crear Profesional"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Usuario</InputLabel>
                        <Select
                            value={newProfesional.id_usuario}
                            onChange={(e) =>
                                setNewProfesional({ ...newProfesional, id_usuario: e.target.value })
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
                        label="Especialidad"
                        fullWidth
                        value={newProfesional.especialidad}
                        onChange={(e) =>
                            setNewProfesional({ ...newProfesional, especialidad: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Certificaciones"
                        fullWidth
                        multiline
                        value={newProfesional.certificaciones}
                        onChange={(e) =>
                            setNewProfesional({ ...newProfesional, certificaciones: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Disponibilidad"
                        fullWidth
                        value={newProfesional.disponibilidad}
                        onChange={(e) =>
                            setNewProfesional({ ...newProfesional, disponibilidad: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Banco"
                        fullWidth
                        value={newProfesional.banco}
                        onChange={(e) =>
                            setNewProfesional({ ...newProfesional, banco: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="N° Cuenta Bancaria"
                        fullWidth
                        value={newProfesional.nro_cuenta_bancaria}
                        onChange={(e) =>
                            setNewProfesional({
                                ...newProfesional,
                                nro_cuenta_bancaria: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveProfesional} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Profesional"}
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

export default Profesionales;
