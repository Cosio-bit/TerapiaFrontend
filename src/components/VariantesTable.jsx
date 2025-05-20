import React, { useState } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Paper,
  Typography,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useAuth } from "../components/authcontext"
import { can } from "../utils/can"

const VariantesTable = ({ variantes = [], onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(variantes)
    ? variantes.map((v, index) => ({
        id: v.id_variante || index,
        nombre: v.nombre || "No especificado",
        precio: v.precio ?? "No especificado",
        duracion: v.duracion ?? "No especificado",
        cantidad: v.cantidad ?? "No especificado",
      }))
    : []

  const columnas = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "precio", headerName: "Precio", flex: 1 },
    { field: "duracion", headerName: "Duración (min)", flex: 1 },
    { field: "cantidad", headerName: "Cantidad", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "variante") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "variante") && (
            <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>Eliminar</Button>
          )}
        </Box>
      ),
    },
  ]

  return (
    <Box mt={3}>
      <Box mb={2}>
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={() => setModo("tabla")} disabled={modo === "tabla"}>Tabla</Button>
          <Button onClick={() => setModo("tarjeta")} disabled={modo === "tarjeta"}>Tarjetas</Button>
        </ButtonGroup>
      </Box>

      {modo === "tabla" ? (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: "700px" }}>
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
          {rows.map((v) => (
            <Paper key={v.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Nombre:</strong> {v.nombre}</Typography>
              <Typography><strong>Precio:</strong> ${v.precio}</Typography>
              <Typography><strong>Duración:</strong> {v.duracion} min</Typography>
              <Typography><strong>Cantidad:</strong> {v.cantidad}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "variante") && (
                  <Button size="small" onClick={() => onEdit(v)}>Editar</Button>
                )}
                {can(role, "delete", "variante") && (
                  <Button size="small" color="error" onClick={() => onDelete(v.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default VariantesTable
