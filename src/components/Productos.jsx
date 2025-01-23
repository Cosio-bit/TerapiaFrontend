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
    getProductos,
    createProducto,
    updateProducto,
    deleteProducto,
} from "../api/productoApi";
import { getProveedores } from "../api/proveedorApi";
import { getCategorias } from "../api/categoriaApi";

const Productos = () => {
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [newProducto, setNewProducto] = useState({
        nombre: "",
        fecha_creacion: "",
        precio: "",
        stock: "",
        id_proveedor: "",
        id_categoria: "",
    });
    const [editing, setEditing] = useState(false);
    const [currentProductoId, setCurrentProductoId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productosData, proveedoresData, categoriasData] = await Promise.all([
                    getProductos(),
                    getProveedores(),
                    getCategorias(),
                ]);
                setProductos(productosData);
                setProveedores(proveedoresData);
                setCategorias(categoriasData);
            } catch (err) {
                setError("Error al cargar datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSaveProducto = async () => {
        try {
            if (editing) {
                await updateProducto(currentProductoId, newProducto);
                setEditing(false);
            } else {
                await createProducto(newProducto);
            }

            setNewProducto({
                nombre: "",
                fecha_creacion: "",
                precio: "",
                stock: "",
                id_proveedor: "",
                id_categoria: "",
            });
            const updatedProductos = await getProductos();
            setProductos(updatedProductos);
            setSnackbar({ open: true, message: "Producto guardado con éxito.", severity: "success" });
            setOpenDialog(false);
        } catch (err) {
            setSnackbar({ open: true, message: "Error al guardar el producto.", severity: "error" });
        }
    };

    const handleEditProducto = (producto) => {
        setEditing(true);
        setCurrentProductoId(producto.id_producto);
        setNewProducto(producto);
        setOpenDialog(true);
    };

    const handleDeleteProducto = async (id) => {
        try {
            await deleteProducto(id);
            const updatedProductos = await getProductos();
            setProductos(updatedProductos);
            setSnackbar({ open: true, message: "Producto eliminado con éxito.", severity: "success" });
        } catch (err) {
            setSnackbar({ open: true, message: "Error al eliminar el producto.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Productos
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setNewProducto({
                        nombre: "",
                        fecha_creacion: "",
                        precio: "",
                        stock: "",
                        id_proveedor: "",
                        id_categoria: "",
                    });
                    setOpenDialog(true);
                }}
            >
                Crear Producto
            </Button>

            <Box mt={3}>
                <DataGrid
                    rows={productos}
                    columns={[
                        { field: "nombre", headerName: "Nombre", flex: 1 },
                        { field: "fecha_creacion", headerName: "Fecha Creación", flex: 1 },
                        { field: "precio", headerName: "Precio", flex: 1 },
                        { field: "stock", headerName: "Stock", flex: 1 },
                        {
                            field: "id_proveedor",
                            headerName: "Proveedor",
                            flex: 1,
                            renderCell: (params) =>
                                proveedores.find((p) => p.id_proveedor === params.value)?.nombre ||
                                "No encontrado",
                        },
                        {
                            field: "id_categoria",
                            headerName: "Categoría",
                            flex: 1,
                            renderCell: (params) =>
                                categorias.find((c) => c.id_categoria === params.value)?.nombre ||
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
                                        onClick={() => handleEditProducto(params.row)}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleDeleteProducto(params.row.id_producto)}
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
                <DialogTitle>{editing ? "Editar Producto" : "Crear Producto"}</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Nombre"
                        fullWidth
                        value={newProducto.nombre}
                        onChange={(e) => setNewProducto({ ...newProducto, nombre: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Fecha Creación"
                        fullWidth
                        type="datetime-local"
                        InputLabelProps={{ shrink: true }}
                        value={newProducto.fecha_creacion}
                        onChange={(e) => setNewProducto({ ...newProducto, fecha_creacion: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Precio"
                        fullWidth
                        type="number"
                        value={newProducto.precio}
                        onChange={(e) => setNewProducto({ ...newProducto, precio: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Stock"
                        fullWidth
                        type="number"
                        value={newProducto.stock}
                        onChange={(e) => setNewProducto({ ...newProducto, stock: e.target.value })}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Proveedor</InputLabel>
                        <Select
                            value={newProducto.id_proveedor}
                            onChange={(e) => setNewProducto({ ...newProducto, id_proveedor: e.target.value })}
                        >
                            {proveedores.map((proveedor) => (
                                <MenuItem key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                                    {proveedor.nombre || `Proveedor ${proveedor.id_proveedor}`}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Categoría</InputLabel>
                        <Select
                            value={newProducto.id_categoria}
                            onChange={(e) => setNewProducto({ ...newProducto, id_categoria: e.target.value })}
                        >
                            {categorias.map((categoria) => (
                                <MenuItem key={categoria.id_categoria} value={categoria.id_categoria}>
                                    {categoria.nombre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                    <Button onClick={handleSaveProducto} variant="contained" color="primary">
                        {editing ? "Guardar Cambios" : "Crear Producto"}
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

export default Productos;
