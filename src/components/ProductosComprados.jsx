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
    getProductosComprados,
    createProductoComprado,
    updateProductoComprado,
    deleteProductoComprado,
} from "../api/productoCompradoApi";
import { getProductos } from "../api/productoApi";
import { getCompras } from "../api/compraApi";

const ProductosComprados = () => {
    const [productosComprados, setProductosComprados] = useState([]);
    const [productos, setProductos] = useState([]);
    const [compras, setCompras] = useState([]);
    const [newProductoComprado, setNewProductoComprado] = useState({
        nombre: "",
        precio: "",
        cantidad: "",
        id_producto: "",
        id_compra: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentProductoCompradoId, setCurrentProductoCompradoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productosCompradosData, productosData, comprasData] = await Promise.all([
                    getProductosComprados(),
                    getProductos(),
                    getCompras(),
                ]);
                setProductosComprados(productosCompradosData);
                setProductos(productosData);
                setCompras(comprasData);
            } catch (err) {
                setError("Error al cargar datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveProductoComprado = async () => {
        try {
            if (editing) {
                await updateProductoComprado(currentProductoCompradoId, newProductoComprado);
                setEditing(false);
            } else {
                await createProductoComprado(newProductoComprado);
            }

            setNewProductoComprado({
                nombre: "",
                precio: "",
                cantidad: "",
                id_producto: "",
                id_compra: "",
            });
            const updatedProductosComprados = await getProductosComprados();
            setProductosComprados(updatedProductosComprados);
            setSnackbar({ open: true, message: "Producto comprado guardado con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar el producto comprado.", severity: "error" });
        }
    };

    const handleEditProductoComprado = (productoComprado) => {
        setEditing(true);
        setCurrentProductoCompradoId(productoComprado.id_productocomprado);
        setNewProductoComprado(productoComprado);
        setOpenDialog(true);
    };

    const handleDeleteProductoComprado = async (id) => {
        try {
            await deleteProductoComprado(id);
            const updatedProductosComprados = await getProductosComprados();
            setProductosComprados(updatedProductosComprados);
            setSnackbar({ open: true, message: "Producto comprado eliminado con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar el producto comprado.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Productos Comprados
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewProductoComprado({
                        nombre: "",
                        precio: "",
                        cantidad: "",
                        id_producto: "",
                        id_compra: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Producto Comprado
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={productosComprados}
                    columns={[
                        { field: "nombre", headerName: "Nombre", flex: 1 },
                        { field: "precio", headerName: "Precio", flex: 1 },
                        { field: "cantidad", headerName: "Cantidad", flex: 1 },
                        {
                            field: "id_producto",
                            headerName: "Producto",
                            flex: 1,
                            renderCell: (params) =>
                                productos.find((p) => p.id_producto === params.value)?.nombre ||
                                "No encontrado",
                        },
                        {
                            field: "id_compra",
                            headerName: "Compra",
                            flex: 1,
                            renderCell: (params) =>
                                compras.find((c) => c.id_compra === params.value)?.id_compra ||
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
                                        onClick={() => handleEditProductoComprado(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteProductoComprado(params.row.id_productocomprado)}
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
    <DialogTitle>{editing ? "Editar Producto Comprado" : "Crear Producto Comprado"}</DialogTitle>
    <DialogContent>
        <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={newProductoComprado.nombre}
            onChange={(e) => setNewProductoComprado({ ...newProductoComprado, nombre: e.target.value })}
        />
        <TextField
            margin="dense"
            label="Precio"
            fullWidth
            type="number"
            value={newProductoComprado.precio}
            onChange={(e) => setNewProductoComprado({ ...newProductoComprado, precio: e.target.value })}
        />
        <TextField
            margin="dense"
            label="Cantidad"
            fullWidth
            type="number"
            value={newProductoComprado.cantidad}
            onChange={(e) => setNewProductoComprado({ ...newProductoComprado, cantidad: e.target.value })}
        />
        <FormControl fullWidth margin="dense">
            <InputLabel>Producto</InputLabel>
            <Select
                value={newProductoComprado.id_producto}
                onChange={(e) =>
                    setNewProductoComprado({ ...newProductoComprado, id_producto: e.target.value })
                }
            >
                {productos.map((producto) => (
                    <MenuItem key={producto.id_producto} value={producto.id_producto}>
                        {producto.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
            <InputLabel>Compra</InputLabel>
            <Select
                value={newProductoComprado.id_compra}
                onChange={(e) =>
                    setNewProductoComprado({ ...newProductoComprado, id_compra: e.target.value })
                }
            >
                {compras.map((compra) => (
                    <MenuItem key={compra.id_compra} value={compra.id_compra}>
                        {compra.id_compra} - {compra.fecha_compra}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </DialogContent>
    <DialogActions>
        <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
        <Button onClick={handleSaveProductoComprado} variant="contained" color="primary">
            {editing ? "Guardar Cambios" : "Crear Producto Comprado"}
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

export default ProductosComprados;
