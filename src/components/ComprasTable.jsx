import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Autocomplete } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchComprasBetweenDates } from "../api/compraEstadisticaApi";
import { getAllClientes } from "../api/clienteApi";
import { formatNumber } from '../utils/formatNumber'; // ✅ Añadido

const ComprasTable = ({ compras, onEdit, onDelete }) => {
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("YYYY-MM-DDTHH:mm"));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format("YYYY-MM-DDTHH:mm"));
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);

  const loadCompras = async () => {
    try {
      let data = await fetchComprasBetweenDates(startDate, endDate);

      if (cliente) {
        data = data.filter(compra => compra.cliente.id_cliente === cliente.id_cliente);
      }

      setFilteredCompras(data);

      const amount = data.reduce((acc, compra) => {
        const compraTotal = compra.productosComprados.reduce(
          (prodAcc, prod) => prodAcc + (prod.producto.precio * prod.cantidad),
          0
        );
        return acc + compraTotal;
      }, 0);

      setTotalAmount(amount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const loadClientes = async () => {
    try {
      const data = await getAllClientes();
      setClientes(data);
    } catch (error) {
      console.error("Error fetching clientes:", error);
    }
  };

  useEffect(() => {
    loadCompras();
  }, [startDate, endDate, cliente]);

  useEffect(() => {
    loadClientes();
  }, []);

  const rows = Array.isArray(filteredCompras) ? filteredCompras : [];

  return (
    <Box mt={3}>
      <Box display="flex" gap={2} mb={2} alignItems="center">
        <TextField
          label="Fecha inicio"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Fecha fin"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <Autocomplete
          sx={{ width: 250 }}
          options={clientes}
          getOptionLabel={(option) => option.usuario.nombre}
          renderInput={(params) => <TextField {...params} label="Buscar Cliente" />}
          value={cliente}
          onChange={(event, newValue) => setCliente(newValue)}
          isOptionEqualToValue={(option, value) => option.id_cliente === value.id_cliente}
          clearOnEscape
        />

        <Typography variant="h6" component="span">
          Total: ${formatNumber(totalAmount)} {/* ✅ Formateado */}
        </Typography>
        <Button variant="contained" onClick={loadCompras}>Actualizar</Button>
      </Box>

      <DataGrid
        rows={rows.map((compra) => ({
          id: compra.id_compra,
          fecha: dayjs(compra.fecha).format("DD/MM/YYYY HH:mm"),
          cliente: compra.cliente?.usuario?.nombre || "No especificado",
          productosComprados: Array.isArray(compra.productosComprados) ? compra.productosComprados : [],
          montoCompra: formatNumber(compra.productosComprados.reduce( // ✅ montoCompra formateado
            (prodAcc, prod) => prodAcc + (prod.producto.precio * prod.cantidad), 0
          )),
        }))}
        columns={[
          { field: "fecha", headerName: "Fecha de Compra", flex: 1 },
          { field: "cliente", headerName: "Cliente", flex: 1 },
          {
            field: "productosComprados",
            headerName: "Productos Comprados",
            flex: 2,
            renderCell: (params) => {
              const productos = params.row?.productosComprados || [];
              return productos.length > 0 ? (
                <Box component="ul" sx={{ paddingLeft: "15px", margin: 0 }}>
                  {productos.map((producto, index) => (
                    <Typography component="li" key={index} variant="body2">
                      🏷️ {producto.producto?.nombre || "Desconocido"} | 🔢 {producto.cantidad} | 💰 ${formatNumber(producto.producto.precio * producto.cantidad)} {/* ✅ Formateado */}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sin productos
                </Typography>
              );
            },
          },
          {
            field: "montoCompra", // ✅ columna agregada para el total por compra
            headerName: "Monto Total",
            flex: 1,
            renderCell: (params) => `$${params.row.montoCompra}`
          },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <Button size="small" onClick={() => onEdit(params.row)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>
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
  );
};

export default ComprasTable;
