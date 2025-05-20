import React, { useState } from "react"
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useAuth } from "../components/authcontext"
import { can } from "../utils/can"

const ProfesionalesTable = ({ profesionales, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(profesionales)
    ? profesionales.map((p) => ({
        id: p.id_profesional,
        nombre: p.usuario?.nombre || "No asignado",
        especialidad: p.especialidad || "No especificado",
        banco: p.banco || "No especificado",
      }))
    : []

  const columnas = [
    { field: "nombre", headerName: "Nombre Usuario", flex: 1 },
    { field: "especialidad", headerName: "Especialidad", flex: 1 },
    { field: "banco", headerName: "Banco", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "profesional") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "profesional") && (
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
          <Box sx={{ minWidth: "600px" }}>
            <DataGrid
              rows={rows}
              columns={columnas}
              pageSize={5}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {rows.map((p) => (
            <Paper key={p.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Nombre Usuario:</strong> {p.nombre}</Typography>
              <Typography><strong>Especialidad:</strong> {p.especialidad}</Typography>
              <Typography><strong>Banco:</strong> {p.banco}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "profesional") && (
                  <Button size="small" onClick={() => onEdit(p)}>Editar</Button>
                )}
                {can(role, "delete", "profesional") && (
                  <Button size="small" color="error" onClick={() => onDelete(p.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default ProfesionalesTable
