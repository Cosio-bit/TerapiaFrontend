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
    getCompras,
    createCompra,
    updateCompra,
    deleteCompra,
} from "../api/compraApi";
import { getClientes } from "../api/clienteApi";

const Compras = () => {
    const [compras, setCompras] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [newCompra, setNewCompra] = useState({
        fecha_compra: "",
        total: "",
        id_cliente: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentCompraId, setCurrentCompraId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [comprasData, clientesData] = await Promise.all([
                    getCompras(),
                    getClientes(),
                ]);
                setCompras(comprasData);
                setClientes(clientesData);
            } catch (err) {
                setError("Error al cargar datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveCompra = async () => {
        try {
            if (editing) {
                await updateCompra(currentCompraId, newCompra);
                setEditing(false);
            } else {
                await createCompra(newCompra);
            }

            setNewCompra({
                fecha_compra: "",
                total: "",
                id_cliente: "",
            });
            const updatedCompras = await getCompras();
            setCompras(updatedCompras);
            setSnackbar({ open: true, message: "Compra guardada con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar la compra.", severity: "error" });
        }
    };

    const handleEditCompra = (compra) => {
        setEditing(true);
        setCurrentCompraId(compra.id_compra);
        setNewCompra(compra);
        setOpenDialog(true);
    };

    const handleDeleteCompra = async (id) => {
        try {
            await deleteCompra(id);
            const updatedCompras = await getCompras();
            setCompras(updatedCompras);
            setSnackbar({ open: true, message: "Compra eliminada con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar la compra.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Compras
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewCompra({
                        fecha_compra: "",
                        total: "",
                        id_cliente: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Compra
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={compras}
                    columns={[
                        { field: "fecha_compra", headerName: "Fecha Compra", flex: 1 },
                        { field: "total", headerName: "Total", flex: 1 },
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
                                        onClick={() => handleEditCompra(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteCompra(params.row.id_compra)}
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
                <DialogTitle>{editing ? "Editar Compra" : "Crear Compra"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Fecha y Hora de Compra"
                        fullWidth
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={newCompra.fecha_compra}
                        onChange={(e) => setNewCompra({ ...newCompra, fecha_compra: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Total"
                        fullWidth
                        type="number"
                        value={newCompra.total}
                        onChange={(e) => setNewCompra({ ...newCompra, total: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Cliente</InputLabel>
                        <Select
                            value={newCompra.id_cliente}
                            onChange={(e) => setNewCompra({ ...newCompra, id_cliente: e.target.value })}
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
                    <Button onClick={handleSaveCompra} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Compra"}
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

export default Compras;
