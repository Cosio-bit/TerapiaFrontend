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

const FichasSaludTable = ({ fichasSalud, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(fichasSalud)
    ? fichasSalud.map((f) => ({
        id: f.id_fichasalud,
        fecha: f.fecha || "No especificado",
        descripcion: f.descripcion || "Sin descripción",
        id_cliente: f.id_cliente || "No especificado",
      }))
    : []

  const columnas = [
    { field: "fecha", headerName: "Fecha", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 2 },
    { field: "id_cliente", headerName: "ID Cliente", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "fichasalud") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "fichasalud") && (
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
              rowsPerPageOptions={[5]}
              autoHeight
              disableSelectionOnClick
            />
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {rows.map((f) => (
            <Paper key={f.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Fecha:</strong> {f.fecha}</Typography>
              <Typography><strong>Descripción:</strong> {f.descripcion}</Typography>
              <Typography><strong>ID Cliente:</strong> {f.id_cliente}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "fichasalud") && (
                  <Button size="small" onClick={() => onEdit(f)}>Editar</Button>
                )}
                {can(role, "delete", "fichasalud") && (
                  <Button size="small" color="error" onClick={() => onDelete(f.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default FichasSaludTable
