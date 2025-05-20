import React, { useState, useEffect } from "react"
import {
  Box, Button, Typography, TextField, Autocomplete, MenuItem,
  Stack, Paper, ButtonGroup, useMediaQuery, useTheme
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import dayjs from "dayjs"
import { fetchGastosFiltrado } from "../api/gastoEstadisticasApi"
import { getAllProveedores } from "../api/proveedorApi"
import { formatnumber } from '../utils/formatnumber'
import { useAuth } from "../components/authcontext"
import { can } from "../utils/can"

const descripcionOpciones = ["Gastos Fijos", "Insumos", "Productos", "Sueldos"]

const GastosTable = ({ onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const [gastos, setGastos] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [nombre, setNombre] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [startDate, setStartDate] = useState(dayjs().startOf('month').format("YYYY-MM-DD"))
  const [endDate, setEndDate] = useState(dayjs().endOf('month').format("YYYY-MM-DD"))
  const [proveedor, setProveedor] = useState(null)
  const [proveedores, setProveedores] = useState([])
  const [rows, setRows] = useState([])

  const loadGastos = async () => {
    try {
      const data = await fetchGastosFiltrado(
        startDate,
        endDate,
        nombre || null,
        proveedor?.id_proveedor || null
      )

      let filteredData = data
      if (descripcion) {
        filteredData = data.filter((gasto) => gasto.descripcion === descripcion)
      }

      const processedRows = filteredData.map((gasto) => ({
        id: gasto.id_gasto,
        nombre: gasto.nombre,
        descripcion: gasto.descripcion,
        monto: gasto.monto,
        fecha: dayjs(gasto.fecha).format("DD/MM/YYYY"),
        proveedor: gasto.proveedor?.usuario?.nombre || "No especificado",
        montoFormateado: formatnumber(gasto.monto || 0),
      }))

      setGastos(filteredData)
      setRows(processedRows)

      const total = processedRows.reduce((acc, gasto) => acc + (gasto.monto || 0), 0)
      setTotalAmount(total)
    } catch (error) {
      console.error("❌ Error al cargar gastos filtrados:", error)
    }
  }

  const loadProveedores = async () => {
    try {
      const data = await getAllProveedores()
      setProveedores(data)
    } catch (error) {
      console.error("Error fetching proveedores:", error)
    }
  }

  useEffect(() => {
    loadProveedores()
  }, [])

  useEffect(() => {
    loadGastos()
  }, [startDate, endDate, nombre, proveedor, descripcion])

  return (
    <Box mt={3}>
      {/* Filtros */}
      <Box display="flex" gap={2} mb={2} alignItems="center" flexWrap="wrap">
        <TextField label="Fecha inicio" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Fecha fin" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <Autocomplete
          sx={{ width: 250 }}
          options={proveedores}
          getOptionLabel={(o) => o.usuario?.nombre || ""}
          renderInput={(params) => <TextField {...params} label="Proveedor" />}
          value={proveedor}
          onChange={(e, nv) => setProveedor(nv)}
          isOptionEqualToValue={(o, v) => o.id_proveedor === v.id_proveedor}
        />
        <TextField
          select
          label="Tipo de Gasto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">Todos</MenuItem>
          {descripcionOpciones.map((opcion) => (
            <MenuItem key={opcion} value={opcion}>{opcion}</MenuItem>
          ))}
        </TextField>
        <Typography variant="h6">Total: ${formatnumber(totalAmount)}</Typography>
        <Button variant="contained" onClick={loadGastos}>Actualizar</Button>
      </Box>

      {/* Toggle */}
      <Box mb={2}>
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={() => setModo("tabla")} disabled={modo === "tabla"}>Tabla</Button>
          <Button onClick={() => setModo("tarjeta")} disabled={modo === "tarjeta"}>Tarjetas</Button>
        </ButtonGroup>
      </Box>

      {/* Tabla o Tarjetas */}
      {modo === "tabla" ? (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: "800px" }}>
            <DataGrid
              rows={rows}
              columns={[
                { field: "nombre", headerName: "Nombre", flex: 1 },
                { field: "descripcion", headerName: "Tipo de Gasto", flex: 1 },
                {
                  field: "monto",
                  headerName: "Monto",
                  flex: 1,
                  renderCell: (params) => `$${params.row.montoFormateado}`
                },
                { field: "fecha", headerName: "Fecha", flex: 1 },
                { field: "proveedor", headerName: "Proveedor", flex: 1 },
                {
                  field: "actions",
                  headerName: "Acciones",
                  sortable: false,
                  flex: 1,
                  renderCell: (params) => (
                    <Box display="flex" gap={1}>
                      {can(role, "edit", "gasto") && (
                        <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
                      )}
                      {can(role, "delete", "gasto") && (
                        <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>Eliminar</Button>
                      )}
                    </Box>
                  ),
                },
              ]}
              pageSize={5}
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {rows.map((g) => (
            <Paper key={g.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Nombre:</strong> {g.nombre}</Typography>
              <Typography><strong>Tipo de Gasto:</strong> {g.descripcion}</Typography>
              <Typography><strong>Monto:</strong> ${g.montoFormateado}</Typography>
              <Typography><strong>Fecha:</strong> {g.fecha}</Typography>
              <Typography><strong>Proveedor:</strong> {g.proveedor}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "gasto") && (
                  <Button size="small" onClick={() => onEdit(g)}>Editar</Button>
                )}
                {can(role, "delete", "gasto") && (
                  <Button size="small" color="error" onClick={() => onDelete(g.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default GastosTable
