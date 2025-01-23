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
    Switch,
    FormControlLabel
} from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';

import {
    getCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
} from "../api/categoriaApi";

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [newCategoria, setNewCategoria] = useState({
        nombre: "",
        descripcion: "",
        fecha_creacion: "",
        fecha_modificacion: "",
        activa: true,
        orden: 1,
    });
    const [editing, setEditing] = useState(false);
    const [currentCategoriaId, setCurrentCategoriaId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchCategorias = async () => {
            try {
                setLoading(true);
                const data = await getCategorias();
                setCategorias(data);
            } catch (err) {
                setError("Error al cargar las categorías.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategorias();
    }, []);

    const handleSaveCategoria = async () => {
        try {
            if (editing) {
                await updateCategoria(currentCategoriaId, newCategoria);
                setEditing(false);
            } else {
                await createCategoria(newCategoria);
            }

            setNewCategoria({
                nombre: "",
                descripcion: "",
                fecha_creacion: "",
                fecha_modificacion: "",
                activa: true,
                orden: 1,
            });
            const updatedCategorias = await getCategorias();
            setCategorias(updatedCategorias);
            setSnackbar({ open: true, message: "Categoría guardada con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar la categoría.", severity: "error" });
        }
    };

    const handleEditCategoria = (categoria) => {
        setEditing(true);
        setCurrentCategoriaId(categoria.id_categoria);
        setNewCategoria(categoria);
        setOpenDialog(true);
    };

    const handleDeleteCategoria = async (id) => {
        try {
            await deleteCategoria(id);
            const updatedCategorias = await getCategorias();
            setCategorias(updatedCategorias);
            setSnackbar({ open: true, message: "Categoría eliminada con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar la categoría.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Categorías
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewCategoria({
                        nombre: "",
                        descripcion: "",
                        fecha_creacion: "",
                        fecha_modificacion: "",
                        activa: true,
                        orden: 1,
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Categoría
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={categorias}
                    columns={[
                        { field: "nombre", headerName: "Nombre", flex: 1 },
                        { field: "descripcion", headerName: "Descripción", flex: 2 },
                        { field: "activa", headerName: "Activa", flex: 1, renderCell: (params) => (params.value ? "Sí" : "No") },
                        { field: "orden", headerName: "Orden", flex: 1 },
                        {
                            field: "actions",
                            headerName: "Acciones",
                            sortable: false,
                            renderCell: (params) => (
                                <Box>
                                    <Button
                                        size="small"
                                        onClick={() => handleEditCategoria(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteCategoria(params.row.id_categoria)}
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
                <DialogTitle>{editing ? "Editar Categoría" : "Crear Categoría"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={newCategoria.nombre}
                        onChange={(e) => setNewCategoria({ ...newCategoria, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        value={newCategoria.descripcion}
                        onChange={(e) => setNewCategoria({ ...newCategoria, descripcion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Orden"
                        fullWidth
                        type="number"
                        value={newCategoria.orden}
                        onChange={(e) => setNewCategoria({ ...newCategoria, orden: e.target.value })}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newCategoria.activa}
                                onChange={(e) => setNewCategoria({ ...newCategoria, activa: e.target.checked })}
                            />
                        }
                        label="Activa"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveCategoria} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Categoría"}
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

export default Categorias;
