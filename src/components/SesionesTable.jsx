import React, { useState } from "react"
import {
  Box,
  Button,
  Typography,
  TextField,
  MenuItem,
  Autocomplete,
  Paper,
  Stack,
  ButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"
import { useAuth } from "../components/authcontext"
import { can } from "../utils/can"

const estadoOpciones = [
  "Pagado y Realizado",
  "Pagado y No Realizado",
  "No Pagado y Realizado",
  "No Pagado y No Realizado"
]

const SesionesTable = ({
  sesiones = [],
  onEdit,
  onDelete,
  totalAmount,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  estado,
  setEstado,
  profesional,
  setProfesional,
  profesionales,
  loadSesiones
}) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(sesiones)
    ? sesiones.map((sesion) => ({
        id: sesion.id_sesion,
        fecha_hora: dayjs(sesion.fecha_hora).format("DD/MM/YYYY HH:mm"),
        estado: sesion.estado || "No especificado",
        precio: sesion.precio || 0,
        precioFormateado: new Intl.NumberFormat("es-CL").format(sesion.precio || 0),
        profesional: sesion.profesional?.usuario?.nombre || "Sin profesional",
      }))
    : []

  const columnas = [
    { field: "fecha_hora", headerName: "Fecha y Hora", flex: 1 },
    {
      field: "precio",
      headerName: "Precio",
      flex: 1,
      renderCell: (params) => `$${params.row.precioFormateado}`,
    },
    { field: "estado", headerName: "Estado", flex: 1 },
    { field: "profesional", headerName: "Profesional", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "sesion") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "sesion") && (
            <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>Eliminar</Button>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Box mt={3}>
      {/* Filtros */}
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
          <MenuItem value="">Todos</MenuItem>
          {estadoOpciones.map((opcion) => (
            <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
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
        />
        <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 250 }}>
          <Typography variant="h6" sx={{ whiteSpace: "nowrap" }}>
            Total: ${new Intl.NumberFormat("es-CL").format(totalAmount)}
          </Typography>
          <Button variant="contained" onClick={loadSesiones}>
            Actualizar
          </Button>
        </Box>
      </Box>

      {/* Toggle tabla/tarjeta */}
      <Box mb={2}>
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={() => setModo("tabla")} disabled={modo === "tabla"}>Tabla</Button>
          <Button onClick={() => setModo("tarjeta")} disabled={modo === "tarjeta"}>Tarjetas</Button>
        </ButtonGroup>
      </Box>

      {/* Tabla o tarjetas */}
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
          {rows.map((s) => (
            <Paper key={s.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Fecha y Hora:</strong> {s.fecha_hora}</Typography>
              <Typography><strong>Estado:</strong> {s.estado}</Typography>
              <Typography><strong>Precio:</strong> ${s.precioFormateado}</Typography>
              <Typography><strong>Profesional:</strong> {s.profesional}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "sesion") && (
                  <Button size="small" onClick={() => onEdit(s)}>Editar</Button>
                )}
                {can(role, "delete", "sesion") && (
                  <Button size="small" color="error" onClick={() => onDelete(s.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default SesionesTable
