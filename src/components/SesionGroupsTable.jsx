import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { fetchSesionesByEstadoAndFecha } from "../api/sesionGroupEstadisticasApi";
import { getAllTerapias } from "../api/terapiaApi";
import { formatnumber } from "../utils/formatnumber";
import { useAuth } from "../components/authcontext"; // ✅ Importa contexto de autenticación
import { can } from "../can"; // ✅ Función para validar permisos

const estadoOpciones = [
  "Pagado y Realizado",
  "Pagado y No Realizado",
  "No Pagado y Realizado",
  "No Pagado y No Realizado",
];

const SesionGroupsTable = ({ onEdit, onDelete }) => {
  const { role } = useAuth(); // ✅ Obtener rol actual
  const [sesionGroups, setSesionGroups] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [estado, setEstado] = useState(estadoOpciones[0]);
  const [startDate, setStartDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DDTHH:mm")
  );
  const [endDate, setEndDate] = useState(
    dayjs().endOf("month").format("YYYY-MM-DDTHH:mm")
  );
  const [terapia, setTerapia] = useState(null);
  const [terapias, setTerapias] = useState([]);
  const [selectedRowForDetail, setSelectedRowForDetail] = useState(null);

  const loadSesiones = async () => {
    try {
      let data = await fetchSesionesByEstadoAndFecha(startDate, endDate, estado);
      if (terapia) {
        data = data.filter(
          (sesionGroup) => sesionGroup?.terapia?.id_terapia === terapia.id_terapia
        );
      }
      setSesionGroups(data);

      const total = data.reduce((acc, group) => {
        const groupTotal = group.sesiones.reduce(
          (sesionAcc, sesion) => sesionAcc + (sesion.precio || 0),
          0
        );
        return acc + groupTotal;
      }, 0);

      setTotalAmount(total);
    } catch (error) {
      console.error("Error fetching sesiones:", error);
    }
  };

  const loadTerapias = async () => {
    try {
      const data = await getAllTerapias();
      setTerapias(data);
    } catch (error) {
      console.error("Error fetching terapias:", error);
    }
  };

  useEffect(() => {
    loadSesiones();
  }, [startDate, endDate, estado, terapia]);

  useEffect(() => {
    loadTerapias();
  }, []);

  return (
    <Box mt={3}>
      <Box display="flex" flexWrap="wrap" gap={2} mb={2} alignItems="flex-start">
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
        >
          {estadoOpciones.map((opcion) => (
            <MenuItem key={opcion} value={opcion}>
              {opcion}
            </MenuItem>
          ))}
        </TextField>

        <Autocomplete
          sx={{ minWidth: 250 }}
          options={terapias}
          getOptionLabel={(option) => option.nombre}
          renderInput={(params) => <TextField {...params} label="Buscar Terapia" />}
          value={terapia}
          onChange={(event, newValue) => setTerapia(newValue)}
          isOptionEqualToValue={(option, value) => option.id_terapia === value.id_terapia}
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

      <DataGrid
        rows={sesionGroups.map((sesionGroup) => ({
          id: sesionGroup?.id_sesion_group,
          terapia: sesionGroup?.terapia?.nombre || "No especificado",
          variante: sesionGroup?.variante?.nombre || "No especificado",
          cliente: sesionGroup?.cliente?.usuario?.nombre || "No especificado",
          sesiones: Array.isArray(sesionGroup?.sesiones) ? sesionGroup.sesiones : [],
        }))}
        columns={[
          { field: "terapia", headerName: "Terapia", flex: 1 },
          { field: "variante", headerName: "Variante", flex: 1 },
          { field: "cliente", headerName: "Cliente", flex: 1 },
          {
            field: "ver",
            headerName: "Ver Sesiones",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
              <Button
                variant="outlined"
                size="small"
                onClick={() => setSelectedRowForDetail(params.row)}
              >
                Ver ({params.row.sesiones.length})
              </Button>
            ),
          },
          {
            field: "actions",
            headerName: "Acciones",
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "sesiongroup") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "sesiongroup") && (
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

      {selectedRowForDetail && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Sesiones del grupo: {selectedRowForDetail.terapia} - {selectedRowForDetail.cliente}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            {selectedRowForDetail.sesiones.map((sesion, idx) => (
              <Box key={idx} p={2} borderRadius={2} boxShadow={1} bgcolor="#f9f9f9">
                <Typography variant="subtitle2" gutterBottom>
                  👨‍⚕️ {sesion.profesional?.usuario?.nombre || "Sin asignar"}
                </Typography>
                <Typography variant="body2">
                  📅 {dayjs(sesion.fecha_hora).format("DD/MM/YYYY HH:mm")}
                </Typography>
                <Typography variant="body2">
                  💰 ${formatnumber(sesion.precio)}
                </Typography>
                <Typography variant="body2">
                  🏷️ Estado: {sesion.estado}
                </Typography>
                {sesion.notas && (
                  <Typography variant="body2">📝 Notas: {sesion.notas}</Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default SesionGroupsTable;
