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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getTerapias, createTerapia } from "../api/terapiaApi";

const Terapias = () => {
    const [terapias, setTerapias] = useState([]);
    const [newTerapia, setNewTerapia] = useState({
        nombre: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_fin: "",
        precio: "",
        cantidad_sesiones: "",
        estado: "",
    });
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchTerapias = async () => {
            try {
                setLoading(true);
                const data = await getTerapias();
                // Mapear los datos para agregar la propiedad `id` requerida por DataGrid
                setTerapias(data.map((terapia) => ({ ...terapia, id: terapia.id_terapia })));
            } catch (err) {
                setSnackbar({ open: true, message: "Error al cargar terapias.", severity: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchTerapias();
    }, []);

    const handleCreateTerapia = async () => {
        try {
            await createTerapia(newTerapia);
            setNewTerapia({
                nombre: "",
                descripcion: "",
                fecha_inicio: "",
                fecha_fin: "",
                precio: "",
                cantidad_sesiones: "",
                estado: "",
            });
            const updatedTerapias = await getTerapias();
            setTerapias(updatedTerapias.map((terapia) => ({ ...terapia, id: terapia.id_terapia })));
            setSnackbar({ open: true, message: "Terapia creada con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al crear la terapia.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Terapias
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDialog(true)}
            >
                Crear Terapia
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={terapias}
                    columns={[
                        { field: "nombre", headerName: "Nombre", flex: 1 },
                        { field: "descripcion", headerName: "Descripción", flex: 1 },
                        { field: "fecha_inicio", headerName: "Fecha Inicio", flex: 1 },
                        { field: "fecha_fin", headerName: "Fecha Fin", flex: 1 },
                        { field: "precio", headerName: "Precio", flex: 1 },
                        { field: "cantidad_sesiones", headerName: "Sesiones", flex: 1 },
                        { field: "estado", headerName: "Estado", flex: 1 },
                    ]}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    autoHeight
                />
            </Box>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Crear Terapia</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={newTerapia.nombre}
                        onChange={(e) => setNewTerapia({ ...newTerapia, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Descripción"
                        fullWidth
                        multiline
                        value={newTerapia.descripcion}
                        onChange={(e) =>
                            setNewTerapia({ ...newTerapia, descripcion: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Inicio"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newTerapia.fecha_inicio}
                        onChange={(e) =>
                            setNewTerapia({ ...newTerapia, fecha_inicio: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Fin"
                        type="date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={newTerapia.fecha_fin}
                        onChange={(e) =>
                            setNewTerapia({ ...newTerapia, fecha_fin: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Precio"
                        type="number"
                        fullWidth
                        value={newTerapia.precio}
                        onChange={(e) => setNewTerapia({ ...newTerapia, precio: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Cantidad de Sesiones"
                        type="number"
                        fullWidth
                        value={newTerapia.cantidad_sesiones}
                        onChange={(e) =>
                            setNewTerapia({ ...newTerapia, cantidad_sesiones: e.target.value })
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Estado"
                        fullWidth
                        value={newTerapia.estado}
                        onChange={(e) => setNewTerapia({ ...newTerapia, estado: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleCreateTerapia} variant="contained" color="primary">
                        Guardar Terapia
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

export default Terapias;
