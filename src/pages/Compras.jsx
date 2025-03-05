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

const Compras = () => {
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
      console.log("📤 API Response for Compras:", JSON.stringify(data, null, 2));
      setCompras(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching purchases:", error);
      setSnackbar({ open: true, message: "Error al cargar las compras.", severity: "error" });
    }
  };

  const fetchClientesData = async () => {
    try {
      const data = await getAllClientes();
      console.log("📌 Fetched Clientes from API:", JSON.stringify(data, null, 2));
  
      if (Array.isArray(data) && data.length > 0) {
        setClientes(data);
      } else {
        console.warn("⚠️ API returned an empty client list");
        setClientes([]);
      }
    } catch (error) {
      console.error("❌ Error fetching clientes:", error);
      setSnackbar({ open: true, message: "Error al cargar clientes.", severity: "error" });
    }
  };
  

  const fetchProductosData = async () => {
    try {
      const data = await getAllProductos();
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error fetching productos:", error);
      setSnackbar({ open: true, message: "Error al cargar productos.", severity: "error" });
    }
  };

  const handleSaveCompra = async (compra) => {
    try {
      console.log("📤 Saving Compra:", JSON.stringify(compra, null, 2));

      if (editing) {
        await updateCompra(currentCompra.id_compra, compra);
      } else {
        await createCompra(compra);
      }

      fetchComprasData();
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Compra actualizada con éxito." : "Compra creada con éxito.",
        severity: "success",
      });
    } catch (error) {
      console.error("❌ Error saving purchase:", error);
      setSnackbar({ open: true, message: "Error al guardar la compra.", severity: "error" });
    }
  };
  const handleEditCompra = async (compra) => {
    console.log("✏️ Editing Compra (Raw Data):", JSON.stringify(compra, null, 2));
  
    // Ensure `cliente` is an object, not a string
    let clienteSeleccionado = { id_cliente: "" };
  
    if (typeof compra.cliente === "string") {
      console.warn("⚠️ Cliente is a string, trying to match with clientes list...");
      const matchedCliente = clientes.find((c) => c.usuario.nombre === compra.cliente);
      if (matchedCliente) {
        clienteSeleccionado = { id_cliente: matchedCliente.id_cliente };
      } else {
        console.error("❌ No matching cliente found for:", compra.cliente);
      }
    } else if (compra.cliente?.id_cliente) {
      clienteSeleccionado = { id_cliente: compra.cliente.id_cliente };
    }
  
    console.log("👉 Cliente seleccionado (Structured Object):", clienteSeleccionado);
  
    const updatedCompra = {
      id_compra: compra.id_compra,
      cliente: clienteSeleccionado, // ✅ Ensure it's an object
      fecha: compra.fecha ? dayjs(compra.fecha).format("YYYY-MM-DDTHH:mm") : "",
      productosComprados: compra.productosComprados?.map(prod => ({
        id_producto_comprado: prod.id_producto_comprado || null,
        producto: { id_producto: prod.producto?.id_producto || null },
        cantidad: prod.cantidad || 1,
      })) || [],
    };
  
    console.log("📝 Formulario cargado con datos (AFTER FIX):", JSON.stringify(updatedCompra, null, 2));
  
    setCurrentCompra(updatedCompra);
    setEditing(true);
    setTimeout(() => setOpenDialog(true), 100);
  };
  
  
  
  
  const handleDeleteCompra = async (id) => {
    try {
      await deleteCompra(id);
      fetchComprasData();
      setSnackbar({ open: true, message: "Compra eliminada con éxito.", severity: "success" });
    } catch (error) {
      console.error("❌ Error deleting purchase:", error);
      setSnackbar({ open: true, message: "Error al eliminar la compra.", severity: "error" });
    }
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

      <ComprasTable compras={compras} onEdit={handleEditCompra} onDelete={handleDeleteCompra} />

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
        <Alert onClose={() => setSnackbar({ open: false, message: "", severity: "success" })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Compras;
