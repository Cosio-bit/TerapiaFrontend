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
    getFichasSalud,
    createFichaSalud,
    updateFichaSalud,
    deleteFichaSalud,
} from "../api/fichaSaludApi";
import { getClientes } from "../api/clienteApi";

const FichasSalud = () => {
    const [fichasSalud, setFichasSalud] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [newFichaSalud, setNewFichaSalud] = useState({
        fecha: "",
        descripcion: "",
        id_cliente: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentFichaSaludId, setCurrentFichaSaludId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [fichasData, clientesData] = await Promise.all([
                    getFichasSalud(),
                    getClientes(),
                ]);
                setFichasSalud(fichasData);
                setClientes(clientesData);
            } catch (err) {
                setError("Error al cargar datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveFichaSalud = async () => {
        try {
            if (editing) {
                await updateFichaSalud(currentFichaSaludId, newFichaSalud);
                setEditing(false);
            } else {
                await createFichaSalud(newFichaSalud);
            }

            setNewFichaSalud({
                fecha: "",
                descripcion: "",
                id_cliente: "",
            });
            const updatedFichasSalud = await getFichasSalud();
            setFichasSalud(updatedFichasSalud);
            setSnackbar({ open: true, message: "Ficha de salud guardada con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar la ficha de salud.", severity: "error" });
        }
    };

    const handleEditFichaSalud = (ficha) => {
        setEditing(true);
        setCurrentFichaSaludId(ficha.id_fichasalud);
        setNewFichaSalud(ficha);
        setOpenDialog(true);
    };

    const handleDeleteFichaSalud = async (id) => {
        try {
            await deleteFichaSalud(id);
            const updatedFichasSalud = await getFichasSalud();
            setFichasSalud(updatedFichasSalud);
            setSnackbar({ open: true, message: "Ficha de salud eliminada con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar la ficha de salud.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Fichas de Salud
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewFichaSalud({
                        fecha: "",
                        descripcion: "",
                        id_cliente: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Ficha de Salud
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={fichasSalud}
                    columns={[
                        { field: "fecha", headerName: "Fecha", flex: 1 },
                        { field: "descripcion", headerName: "Descripción", flex: 2 },
                        {
                            field: "id_cliente",
                            headerName: "Cliente",
                            flex: 1,
                            renderCell: (params) =>
                                clientes.find((c) => c.id_cliente === params.value)?.id_cliente ||
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
                                        onClick={() => handleEditFichaSalud(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteFichaSalud(params.row.id_fichasalud)}
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
                <DialogTitle>{editing ? "Editar Ficha de Salud" : "Crear Ficha de Salud"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Fecha"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newFichaSalud.fecha}
                        onChange={(e) => setNewFichaSalud({ ...newFichaSalud, fecha: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        value={newFichaSalud.descripcion}
                        onChange={(e) => setNewFichaSalud({ ...newFichaSalud, descripcion: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Cliente</InputLabel>
                        <Select
                            value={newFichaSalud.id_cliente}
                            onChange={(e) => setNewFichaSalud({ ...newFichaSalud, id_cliente: e.target.value })}
                        >
                            {clientes.map((cliente) => (
                                <MenuItem key={cliente.id_cliente} value={cliente.id_cliente}>
                                    {cliente.id_cliente} - {cliente.fecha_registro}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveFichaSalud} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Ficha de Salud"}
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

export default FichasSalud;
