import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import dayjs from "dayjs";
import {
  fetchCompras,
  createCompra,
  updateCompra,
  deleteCompra,
} from "../api/compraApi";
import { getAllClientes } from "../api/clienteApi";
import { getAllProductos } from "../api/productoApi";
import ComprasTable from "../components/ComprasTable";
import CompraFormDialog from "../components/CompraFormDialog";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const Compras = () => {
  const { role } = useAuth();

  const [compras, setCompras] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [currentCompra, setCurrentCompra] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchComprasData();
    fetchClientesData();
    fetchProductosData();
  }, []);

  const fetchComprasData = async () => {
    try {
      const data = await fetchCompras();
      setCompras(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar las compras.", severity: "error" });
    }
  };

  const fetchClientesData = async () => {
    try {
      const data = await getAllClientes();
      setClientes(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar clientes.", severity: "error" });
    }
  };

  const fetchProductosData = async () => {
    try {
      const data = await getAllProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      setSnackbar({ open: true, message: "Error al cargar productos.", severity: "error" });
    }
  };

  const handleSaveCompra = async (compra) => {
    if (editing && !can(role, "edit", "compra")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar compras.", severity: "error" });
      return;
    }
    if (!editing && !can(role, "create", "compra")) {
      setSnackbar({ open: true, message: "No tienes permiso para crear compras.", severity: "error" });
      return;
    }

    try {
      if (editing) {
        if (!currentCompra?.id_compra) {
          setSnackbar({ open: true, message: "Error: No se puede actualizar sin ID", severity: "error" });
          return;
        }
        await updateCompra(currentCompra.id_compra, compra);
      } else {
        await createCompra(compra);
      }

      fetchComprasData();
      setOpenDialog(false);
      setSnackbar({ open: true, message: editing ? "Compra actualizada con éxito." : "Compra creada con éxito.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al guardar la compra.", severity: "error" });
    }
  };

  const handleEditCompra = (compra) => {
    if (!can(role, "edit", "compra")) {
      setSnackbar({ open: true, message: "No tienes permiso para editar compras.", severity: "error" });
      return;
    }

    const clienteEstructurado = typeof compra.cliente === "string"
      ? clientes.find((c) => c.usuario.nombre === compra.cliente) || { id_cliente: "" }
      : compra.cliente;

    const parsedDate = dayjs(compra.fecha, ["DD/MM/YYYY HH:mm", "YYYY-MM-DDTHH:mm:ss", "YYYY-MM-DDTHH:mm"]);
    const fechaValida = parsedDate.isValid() ? parsedDate.format("YYYY-MM-DDTHH:mm") : dayjs().format("YYYY-MM-DDTHH:mm");

    const updatedCompra = {
      id_compra: compra.id_compra ?? compra.id ?? null,
      cliente: clienteEstructurado?.id_cliente ? { id_cliente: clienteEstructurado.id_cliente } : { id_cliente: "" },
      fecha: fechaValida,
      productosComprados: Array.isArray(compra.productosComprados) ? compra.productosComprados.map(prod => ({
        id_producto_comprado: prod.id_producto_comprado || null,
        producto: { id_producto: prod.producto?.id_producto || null },
        cantidad: prod.cantidad || 1,
      })) : [],
    };

    setCurrentCompra(updatedCompra);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };

  const handleDeleteCompra = async (id) => {
    if (!can(role, "delete", "compra")) {
      setSnackbar({ open: true, message: "No tienes permiso para eliminar compras.", severity: "error" });
      return;
    }

    try {
      await deleteCompra(id);
      fetchComprasData();
      setSnackbar({ open: true, message: "Compra eliminada con éxito.", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error al eliminar la compra.", severity: "error" });
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Compras
      </Typography>

      {can(role, "create", "compra") && (
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
      )}

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
        setSnackbar={setSnackbar}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
      >
        <Alert
          onClose={() => setSnackbar({ open: false, message: "", severity: "success" })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Compras;
