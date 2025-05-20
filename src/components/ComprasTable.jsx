import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  Stack,
  Paper,
  ButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchComprasBetweenDates } from "../api/compraEstadisticaApi";
import { getAllClientes } from "../api/clienteApi";
import { formatnumber } from "../utils/formatnumber";
import { useAuth } from "../components/authcontext";
import { can } from "../utils/can";

const ComprasTable = ({ compras, onEdit, onDelete }) => {
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla");

  const [startDate, setStartDate] = useState(dayjs().startOf("month").format("YYYY-MM-DDTHH:mm"));
  const [endDate, setEndDate] = useState(dayjs().endOf("month").format("YYYY-MM-DDTHH:mm"));
  const [filteredCompras, setFilteredCompras] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [cliente, setCliente] = useState(null);
  const [clientes, setClientes] = useState([]);

  const loadCompras = async () => {
    try {
      let data = await fetchComprasBetweenDates(startDate, endDate);

      if (cliente) {
        data = data.filter((compra) => compra.cliente.id_cliente === cliente.id_cliente);
      }

      setFilteredCompras(data);

      const amount = data.reduce((acc, compra) => {
        const compraTotal = compra.productosComprados.reduce(
          (prodAcc, prod) => prodAcc + prod.producto.precio * prod.cantidad,
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

  const rows = Array.isArray(filteredCompras)
    ? filteredCompras.map((compra) => ({
        id: compra.id_compra,
        fecha: dayjs(compra.fecha).format("DD/MM/YYYY HH:mm"),
        cliente: compra.cliente?.usuario?.nombre || "No especificado",
        productosComprados: Array.isArray(compra.productosComprados) ? compra.productosComprados : [],
        montoCompra: compra.productosComprados.reduce(
          (prodAcc, prod) => prodAcc + prod.producto.precio * prod.cantidad,
          0
        ),
      }))
    : [];

  const columnas = [
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
                🏷️ {producto.producto?.nombre || "Desconocido"} | 🔢 {producto.cantidad} | 💰 $
                {formatnumber(producto.producto.precio * producto.cantidad)}
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
      field: "montoCompra",
      headerName: "Monto Total",
      flex: 1,
      renderCell: (params) => `$${formatnumber(params.row.montoCompra)}`,
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "compra") && (
            <Button size="small" onClick={() => onEdit(params.row)}>
              Editar
            </Button>
          )}
          {can(role, "delete", "compra") && (
            <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>
              Eliminar
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box mt={3}>
      <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
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
          Total: ${formatnumber(totalAmount)}
        </Typography>
        <Button variant="contained" onClick={loadCompras}>
          Actualizar
        </Button>

        <ButtonGroup variant="outlined" size="small">
          <Button onClick={() => setModo("tabla")} disabled={modo === "tabla"}>
            Tabla
          </Button>
          <Button onClick={() => setModo("tarjeta")} disabled={modo === "tarjeta"}>
            Tarjetas
          </Button>
        </ButtonGroup>
      </Box>

      {modo === "tabla" ? (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: "800px" }}>
            <DataGrid
              rows={rows}
              columns={columnas}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {rows.map((compra) => (
            <Paper key={compra.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography>
                <strong>Fecha:</strong> {compra.fecha}
              </Typography>
              <Typography>
                <strong>Cliente:</strong> {compra.cliente}
              </Typography>
              <Typography>
                <strong>Productos:</strong>
              </Typography>
              <Box component="ul" sx={{ paddingLeft: "15px", margin: 0 }}>
                {compra.productosComprados.length > 0 ? (
                  compra.productosComprados.map((producto, index) => (
                    <Typography component="li" key={index} variant="body2">
                      🏷️ {producto.producto?.nombre || "Desconocido"} | 🔢 {producto.cantidad} | 💰 $
                      {formatnumber(producto.producto.precio * producto.cantidad)}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Sin productos
                  </Typography>
                )}
              </Box>
              <Typography>
                <strong>Monto Total:</strong> ${formatnumber(compra.montoCompra)}
              </Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "compra") && (
                  <Button size="small" onClick={() => onEdit(compra)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "compra") && (
                  <Button size="small" color="error" onClick={() => onDelete(compra.id)}>
                    Eliminar
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default ComprasTable;
