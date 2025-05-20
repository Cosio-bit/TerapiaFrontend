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

const TerapiasTable = ({ terapias, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(terapias)
    ? terapias.map((t) => ({
        id: t.id_terapia || Math.random(),
        nombre: t.nombre || "No especificado",
        descripcion: t.descripcion || "No especificado",
        presencial: t.presencial === "Sí" ? "Sí" : "No",
        variantes: Array.isArray(t.variantes) ? t.variantes.map((v) => v.nombre).join(", ") : "Sin variantes",
      }))
    : []

  const columnas = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "presencial", headerName: "Presencial", flex: 1 },
    { field: "variantes", headerName: "Variantes", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "terapia") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "terapia") && (
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
          {rows.map((t) => (
            <Paper key={t.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Nombre:</strong> {t.nombre}</Typography>
              <Typography><strong>Descripción:</strong> {t.descripcion}</Typography>
              <Typography><strong>Presencial:</strong> {t.presencial}</Typography>
              <Typography><strong>Variantes:</strong> {t.variantes}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "terapia") && (
                  <Button size="small" onClick={() => onEdit(t)}>Editar</Button>
                )}
                {can(role, "delete", "terapia") && (
                  <Button size="small" color="error" onClick={() => onDelete(t.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default TerapiasTable
