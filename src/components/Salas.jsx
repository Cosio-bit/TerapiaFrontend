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
    CircularProgress,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from "@mui/material";

import { DataGrid } from '@mui/x-data-grid';
import {
    getSalas,
    createSala,
    updateSala,
    deleteSala,
} from "../api/salaApi";
import { getProveedores } from "../api/proveedorApi";

const Salas = () => {
    const [salas, setSalas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [newSala, setNewSala] = useState({
        nombre: "",
        capacidad: "",
        precio: "",
        ubicacion: "",
        estado: "",
        id_proveedor: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentSalaId, setCurrentSalaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [salasData, proveedoresData] = await Promise.all([
                    getSalas(),
                    getProveedores(),
                ]);
                setSalas(salasData);
                setProveedores(proveedoresData);
            } catch (err) {
                setError("Error al cargar datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveSala = async () => {
        try {
            if (editing) {
                await updateSala(currentSalaId, newSala);
                setEditing(false);
            } else {
                await createSala(newSala);
            }

            setNewSala({
                nombre: "",
                capacidad: "",
                precio: "",
                ubicacion: "",
                estado: "",
                id_proveedor: "",
            });
            const updatedSalas = await getSalas();
            setSalas(updatedSalas);
            setSnackbar({ open: true, message: "Sala guardada con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar la sala.", severity: "error" });
        }
    };

    const handleEditSala = (sala) => {
        setEditing(true);
        setCurrentSalaId(sala.id_sala);
        setNewSala(sala);
        setOpenDialog(true);
    };
    const handleDeleteSala = async (id) => {
        try {
            await deleteSala(id);
            const updatedSalas = await getSalas();
            setSalas(updatedSalas);
            setSnackbar({ open: true, message: "Sala eliminada con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar la sala.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Salas
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewSala({
                        nombre: "",
                        capacidad: "",
                        precio: "",
                        ubicacion: "",
                        estado: "",
                        id_proveedor: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Sala
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={salas}
                    columns={[
                        { field: "nombre", headerName: "Nombre", flex: 1 },
                        { field: "capacidad", headerName: "Capacidad", flex: 1 },
                        { field: "precio", headerName: "Precio", flex: 1 },
                        { field: "ubicacion", headerName: "Ubicación", flex: 1 },
                        { field: "estado", headerName: "Estado", flex: 1 },
                        {
                            field: "id_proveedor",
                            headerName: "Proveedor",
                            flex: 1,
                            renderCell: (params) =>
                                proveedores.find((p) => p.id_proveedor === params.value)?.rut_empresa ||
                                "No encontrado",
                        },
                        {
                            field: "actions",
                            headerName: "Acciones",
                            sortable: false,
                            renderCell: (params) => (
                                <Box>
                                    <Button
                                        size="small"
                                        onClick={() => handleEditSala(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteSala(params.row.id_sala)}
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
                <DialogTitle>{editing ? "Editar Sala" : "Crear Sala"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={newSala.nombre}
                        onChange={(e) => setNewSala({ ...newSala, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Capacidad"
                        type="number"
                        fullWidth
                        value={newSala.capacidad}
                        onChange={(e) => setNewSala({ ...newSala, capacidad: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Precio"
                        type="number"
                        fullWidth
                        value={newSala.precio}
                        onChange={(e) => setNewSala({ ...newSala, precio: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Ubicación"
                        fullWidth
                        value={newSala.ubicacion}
                        onChange={(e) => setNewSala({ ...newSala, ubicacion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Estado"
                        fullWidth
                        value={newSala.estado}
                        onChange={(e) => setNewSala({ ...newSala, estado: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Proveedor</InputLabel>
                        <Select
                            value={newSala.id_proveedor}
                            onChange={(e) => setNewSala({ ...newSala, id_proveedor: e.target.value })}
                        >
                            {proveedores.map((proveedor) => (
                                <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.rut_empresa} - {proveedor.email}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveSala} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Sala"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Salas;
