import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, Autocomplete, MenuItem } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchArriendosFiltrado, fetchTotalArriendosFiltrado } from "../api/arriendoEstadisticasApi";
import { getAllClientes } from "../api/clienteApi";
import { getAllProveedores } from "../api/proveedorApi";
import { formatnumber } from '../utils/formatnumber';
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const estadoOpciones = [
  "Pagado y Realizado",
  "Pagado y No Realizado",
  "No Pagado y Realizado",
  "No Pagado y No Realizado"
];

const ArriendosTable = ({ onEdit, onDelete }) => {
  const { role } = useAuth();

  const [arriendos, setArriendos] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [estado, setEstado] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format("YYYY-MM-DD"));
  const [cliente, setCliente] = useState(null);
  const [proveedor, setProveedor] = useState(null);
  const [clientes, setClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [rows, setRows] = useState([]);

  const loadArriendos = async () => {
    try {
      const data = await fetchArriendosFiltrado(
        startDate,
        endDate,
        estado || null,
        cliente?.id_cliente || null,
        proveedor?.id_proveedor || null
      );

      setArriendos(data);

      const processedRows = data.map((arriendo) => ({
        id: arriendo.id_arriendo,
        sala: arriendo.sala?.nombre || "No especificado",
        cliente: arriendo.cliente?.usuario?.nombre || "No especificado",
        fecha: dayjs(arriendo.fecha).format("DD/MM/YYYY"),
        hora_inicio: arriendo.hora_inicio || "No especificado",
        hora_fin: arriendo.hora_fin || "No especificado",
        estado: arriendo.estado || "No especificado",
        monto_pagado: arriendo.monto_pagado ? `$${formatnumber(arriendo.monto_pagado)}` : "No especificado",
      }));

      setRows(processedRows);

      const total = await fetchTotalArriendosFiltrado(
        startDate,
        endDate,
        estado || null,
        cliente?.id_cliente || null,
        proveedor?.id_proveedor || null
      );

      setTotalAmount(total);
    } catch (error) {
      console.error("❌ Error al cargar arriendos filtrados:", error);
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

  const loadProveedores = async () => {
    try {
      const data = await getAllProveedores();
      setProveedores(data);
    } catch (error) {
      console.error("Error fetching proveedores:", error);
    }
  };

  useEffect(() => {
    loadClientes();
    loadProveedores();
  }, []);

  useEffect(() => {
    loadArriendos();
  }, [startDate, endDate, estado, cliente, proveedor]);

  return (
    <Box mt={3}>
      {/* Filtros arriba del DataGrid */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mb={2}
        alignItems="flex-start"
        sx={{
          overflow: 'visible',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <TextField
          label="Fecha inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          label="Fecha fin"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 160 }}
        />
        <TextField
          select
          label="Estado"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          sx={{ minWidth: 220 }}
          SelectProps={{
            MenuProps: {
              PaperProps: {
                style: {
                  maxHeight: 300,
                  overflowY: 'auto',
                },
              },
            },
          }}
        >
          <MenuItem value="">Todos</MenuItem>
          {estadoOpciones.map((opcion) => (
            <MenuItem key={opcion} value={opcion}>
              {opcion}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          sx={{ minWidth: 250 }}
          options={clientes}
          getOptionLabel={(option) => option.usuario?.nombre || ""}
          renderInput={(params) => <TextField {...params} label="Buscar Cliente" />}
          value={cliente}
          onChange={(event, newValue) => setCliente(newValue)}
          isOptionEqualToValue={(option, value) => option.id_cliente === value.id_cliente}
          clearOnEscape
          PopperProps={{
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'viewport',
                },
              },
            ],
          }}
        />

        <Autocomplete
          sx={{ minWidth: 250 }}
          options={proveedores}
          getOptionLabel={(option) => option.usuario?.nombre || ""}
          renderInput={(params) => <TextField {...params} label="Buscar Proveedor" />}
          value={proveedor}
          onChange={(event, newValue) => setProveedor(newValue)}
          isOptionEqualToValue={(option, value) => option.id_proveedor === value.id_proveedor}
          clearOnEscape
          PopperProps={{
            modifiers: [
              {
                name: 'preventOverflow',
                options: {
                  boundary: 'viewport',
                },
              },
            ],
          }}
        />

        <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 250 }}>
          <Typography variant="h6" sx={{ whiteSpace: 'nowrap' }}>
            Total: ${formatnumber(totalAmount)}
          </Typography>
          <Button variant="contained" onClick={loadArriendos}>
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Tabla de resultados */}
      <DataGrid
        rows={rows}
        columns={[
          { field: "sala", headerName: "Sala", flex: 1 },
          { field: "cliente", headerName: "Cliente", flex: 1 },
          { field: "fecha", headerName: "Fecha", flex: 1 },
          { field: "hora_inicio", headerName: "Hora Inicio", flex: 1 },
          { field: "hora_fin", headerName: "Hora Fin", flex: 1 },
          { field: "estado", headerName: "Estado", flex: 1 },
          { field: "monto_pagado", headerName: "Monto Pagado", flex: 1 },
          {
            field: "actions",
            headerName: "Acciones",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "arriendo") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "arriendo") && (
                  <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>
                    Eliminar
                  </Button>
                )}
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

export default ArriendosTable;
