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
    FormControl,
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import {
    getArriendos,
    createArriendo,
    updateArriendo,
    deleteArriendo,
} from "../api/arriendoApi";
import { getSalas } from "../api/salaApi";

const Arriendos = () => {
    const [arriendos, setArriendos] = useState([]);
    const [salas, setSalas] = useState([]);
    const [newArriendo, setNewArriendo] = useState({
        fecha_inicio: "",
        fecha_termino: "",
        estado: "",
        id_sala: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentArriendoId, setCurrentArriendoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [arriendosData, salasData] = await Promise.all([
                    getArriendos(),
                    getSalas(),
                ]);
                setArriendos(arriendosData);
                setSalas(salasData);
            } catch (err) {
                setError("Error al cargar datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveArriendo = async () => {
        try {
            if (editing) {
                await updateArriendo(currentArriendoId, newArriendo);
                setEditing(false);
            } else {
                await createArriendo(newArriendo);
            }

            setNewArriendo({
                fecha_inicio: "",
                fecha_termino: "",
                estado: "",
                id_sala: "",
            });
            const updatedArriendos = await getArriendos();
            setArriendos(updatedArriendos);
            setSnackbar({ open: true, message: "Arriendo guardado con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar el arriendo.", severity: "error" });
        }
    };

    const handleEditArriendo = (arriendo) => {
        setEditing(true);
        setCurrentArriendoId(arriendo.id_arriendo);
        setNewArriendo(arriendo);
        setOpenDialog(true);
    };

    const handleDeleteArriendo = async (id) => {
        try {
            await deleteArriendo(id);
            const updatedArriendos = await getArriendos();
            setArriendos(updatedArriendos);
            setSnackbar({ open: true, message: "Arriendo eliminado con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar el arriendo.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Arriendos
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewArriendo({
                        fecha_inicio: "",
                        fecha_termino: "",
                        estado: "",
                        id_sala: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Arriendo
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={arriendos}
                    columns={[
                        { field: "fecha_inicio", headerName: "Fecha Inicio", flex: 1 },
                        { field: "fecha_termino", headerName: "Fecha Término", flex: 1 },
                        { field: "estado", headerName: "Estado", flex: 1 },
                        {
                            field: "id_sala",
                            headerName: "Sala",
                            flex: 1,
                            renderCell: (params) =>
                                salas.find((sala) => sala.id_sala === params.value)?.nombre ||
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
                                        onClick={() => handleEditArriendo(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteArriendo(params.row.id_arriendo)}
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
                <DialogTitle>{editing ? "Editar Arriendo" : "Crear Arriendo"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Fecha Inicio"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newArriendo.fecha_inicio}
                        onChange={(e) => setNewArriendo({ ...newArriendo, fecha_inicio: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Término"
                        fullWidth
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={newArriendo.fecha_termino}
                        onChange={(e) => setNewArriendo({ ...newArriendo, fecha_termino: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Estado"
                        fullWidth
                        value={newArriendo.estado}
                        onChange={(e) => setNewArriendo({ ...newArriendo, estado: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Sala</InputLabel>
                        <Select
                            value={newArriendo.id_sala}
                            onChange={(e) => setNewArriendo({ ...newArriendo, id_sala: e.target.value })}
                        >
                            {salas.map((sala) => (
                                <MenuItem key={sala.id_sala} value={sala.id_sala}>
                                    {sala.nombre} - {sala.ubicacion}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveArriendo} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Arriendo"}
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

export default Arriendos;
