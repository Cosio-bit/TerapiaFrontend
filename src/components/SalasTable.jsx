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

const SalasTable = ({ salas, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(salas)
    ? salas.map((sala) => ({
        id: sala?.id_sala,
        nombre: sala?.nombre || "No especificado",
        capacidad: sala?.capacidad || "No especificado",
        precio: sala?.precio ? `$${sala.precio}` : "No especificado",
        ubicacion: sala?.ubicacion || "No especificado",
        estado: sala?.estado || "No especificado",
        proveedor: sala?.proveedor?.usuario?.nombre || "No especificado",
      }))
    : []

  const columnas = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "capacidad", headerName: "Capacidad", flex: 1 },
    { field: "precio", headerName: "Precio", flex: 1 },
    { field: "ubicacion", headerName: "Ubicación", flex: 1 },
    { field: "estado", headerName: "Estado", flex: 1 },
    { field: "proveedor", headerName: "Proveedor", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "sala") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "sala") && (
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
          <Box sx={{ minWidth: "900px" }}>
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
              <Typography><strong>Nombre:</strong> {s.nombre}</Typography>
              <Typography><strong>Capacidad:</strong> {s.capacidad}</Typography>
              <Typography><strong>Precio:</strong> {s.precio}</Typography>
              <Typography><strong>Ubicación:</strong> {s.ubicacion}</Typography>
              <Typography><strong>Estado:</strong> {s.estado}</Typography>
              <Typography><strong>Proveedor:</strong> {s.proveedor}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "sala") && (
                  <Button size="small" onClick={() => onEdit(s)}>Editar</Button>
                )}
                {can(role, "delete", "sala") && (
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

export default SalasTable
