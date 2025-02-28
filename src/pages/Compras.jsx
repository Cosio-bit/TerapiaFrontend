import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllCompras,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../api/compraApi";
import { getAllClientes } from "../api/clienteApi";
import { getAllProductos } from "../api/productoApi";
import ComprasTable from "../components/ComprasTable";
import CompraFormDialog from "../components/CompraFormDialog";

const Compras = () => {
  const [compras, setCompras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [currentCompra, setCurrentCompra] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comprasData, clientesData, productosData] = await Promise.all([
          getAllCompras(),
          getAllClientes(),
          getAllProductos(),
        ]);
        setCompras(comprasData);
        setClientes(clientesData);
        setProductos(productosData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Error al cargar los datos: " + error.message,
          severity: "error",
        });
      }
    };

    fetchData();
  }, []);

  // Guardar o actualizar compra
  const handleSaveCompra = async (compra) => {
    try {
      if (editing) {
        await updateCompra(currentCompra.id_compra, compra);
      } else {
        await createCompra(compra);
      }
      setCompras(await getAllCompras());
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Compra actualizada con éxito." : "Compra creada con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al guardar la compra: " + error.message,
        severity: "error",
      });
    }
  };

  // Editar compra
  const handleEditCompra = (compra) => {
    setEditing(true);
    setCurrentCompra(compra);
    setOpenDialog(true);
  };

  // Eliminar compra
  const handleDeleteCompra = async (id) => {
    try {
      await deleteCompra(id);
      setCompras(await getAllCompras());
      setSnackbar({
        open: true,
        message: "Compra eliminada con éxito.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Error al eliminar la compra: " + error.message,
        severity: "error",
      });
    }
  };

  // Cerrar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "", severity: "success" });
  };

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
          setCurrentCompra(null);
          setOpenDialog(true);
        }}
      >
        Crear Compra
      </Button>

      <ComprasTable
        compras={compras}
        onEdit={handleEditCompra}
        onDelete={handleDeleteCompra}
      />

      <CompraFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveCompra}
        compra={currentCompra}
        clientes={clientes}
        productos={productos}
        editing={editing}
      />

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
