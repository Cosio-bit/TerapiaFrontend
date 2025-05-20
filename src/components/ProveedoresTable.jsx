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

const ProveedoresTable = ({ proveedores, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(proveedores)
    ? proveedores.map((p) => ({
        id: p.id_proveedor,
        nombre: p.usuario?.nombre || "Sin usuario",
        email: p.usuario?.email || "No disponible",
        rut_empresa: p.rut_empresa || "No especificado",
        direccion: p.direccion || "No especificado",
        telefono: p.telefono || "No especificado",
      }))
    : []

  const columnas = [
    {
      field: "usuario",
      headerName: "Usuario",
      flex: 1,
      renderCell: (params) =>
        `${params.row.nombre} (${params.row.email})`,
    },
    { field: "rut_empresa", headerName: "RUT Empresa", flex: 1 },
    { field: "direccion", headerName: "Dirección", flex: 1 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },
    { field: "email", headerName: "Correo Electrónico", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "proveedor") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "proveedor") && (
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
          {rows.map((p) => (
            <Paper key={p.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Usuario:</strong> {p.nombre}</Typography>
              <Typography><strong>Correo:</strong> {p.email}</Typography>
              <Typography><strong>RUT Empresa:</strong> {p.rut_empresa}</Typography>
              <Typography><strong>Dirección:</strong> {p.direccion}</Typography>
              <Typography><strong>Teléfono:</strong> {p.telefono}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "proveedor") && (
                  <Button size="small" onClick={() => onEdit(p)}>Editar</Button>
                )}
                {can(role, "delete", "proveedor") && (
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

export default ProveedoresTable
