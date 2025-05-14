import React, { useState, useEffect } from "react";
import { Box, Button, Typography, TextField, MenuItem, Autocomplete } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchSesionesIndividuales, fetchTotalSesionesIndividuales } from "../api/sesionEstadisticasApi";
import { getAllProfesionales } from "../api/profesionalApi";
import { formatnumber } from '../utils/formatnumber'; // ✅ Import añadido

const estadoOpciones = [
  "Pagado y Realizado",
  "Pagado y No Realizado",
  "No Pagado y Realizado",
  "No Pagado y No Realizado"
];

const SesionesTable = ({ onEdit, onDelete }) => {
  const [sesiones, setSesiones] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [estado, setEstado] = useState("");
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("YYYY-MM-DDTHH:mm"));
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format("YYYY-MM-DDTHH:mm"));
  const [profesional, setProfesional] = useState(null);
  const [profesionales, setProfesionales] = useState([]);

  const loadSesiones = async () => {
    try {
      const data = await fetchSesionesIndividuales(
        startDate,
        endDate,
        estado || null,
        profesional?.id_profesional || null
      );
      setSesiones(data);

      const total = await fetchTotalSesionesIndividuales(
        startDate,
        endDate,
        estado || null,
        profesional?.id_profesional || null
      );
      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching sesiones individuales:", error);
    }
  };

  const loadProfesionales = async () => {
    try {
      const data = await getAllProfesionales();
      setProfesionales(data);
    } catch (error) {
      console.error("Error fetching profesionales:", error);
    }
  };

  useEffect(() => {
    loadProfesionales();
  }, []);

  useEffect(() => {
    loadSesiones();
  }, [startDate, endDate, estado, profesional]);

  const rows = Array.isArray(sesiones)
    ? sesiones.map((sesion) => ({
        ...sesion,
        id: sesion.id_sesion,
        fecha_hora: dayjs(sesion.fecha_hora).format("DD/MM/YYYY HH:mm"),
        profesional: sesion.profesional?.usuario?.nombre || "Sin profesional",
        precioFormateado: formatnumber(sesion.precio || 0),
      }))
    : [];

  return (
    <Box mt={3}>
      {/* 🔧 Filtros arriba de la tabla */}
      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        mb={2}
        alignItems="flex-start"
        sx={{
          overflow: "visible",
          position: "relative",
          zIndex: 1,
        }}
      >
        <TextField
          label="Fecha inicio"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 220 }}
        />
        <TextField
          label="Fecha fin"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ minWidth: 220 }}
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
                  overflowY: "auto",
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
          options={profesionales}
          getOptionLabel={(option) => option.usuario?.nombre || ""}
          renderInput={(params) => <TextField {...params} label="Buscar Profesional" />}
          value={profesional}
          onChange={(event, newValue) => setProfesional(newValue)}
          isOptionEqualToValue={(option, value) => option.id_profesional === value.id_profesional}
          clearOnEscape
          PopperProps={{
            modifiers: [
              {
                name: "preventOverflow",
                options: {
                  boundary: "viewport",
                },
              },
            ],
          }}
        />

        <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 250 }}>
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Total: ${formatnumber(totalAmount)}
          </Typography>
          <Button variant="contained" onClick={loadSesiones}>
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* 🔧 Tabla */}
      <DataGrid
        rows={rows}
        columns={[
          { field: "fecha_hora", headerName: "Fecha y Hora", flex: 1 },
          {
            field: "precio",
            headerName: "Precio",
            flex: 1,
            renderCell: (params) => `$${params.row.precioFormateado}`
          },
          { field: "estado", headerName: "Estado", flex: 1 },
          { field: "profesional", headerName: "Profesional", flex: 1 },
          {
            field: "actions",
            headerName: "Acciones",
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

export default SesionesTable;
