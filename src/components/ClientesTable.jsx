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

const ClientesTable = ({ clientes, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(clientes)
    ? clientes.map((c) => ({
        id: c.id_cliente,
        usuario: c.usuario?.nombre || "No especificado",
        email: c.usuario?.email || "No especificado",
        fecha_registro: c.fecha_registro || "No disponible",
        saldo: typeof c.saldo === "number" ? `$${c.saldo}` : "No disponible",
      }))
    : []

  const columnas = [
    {
      field: "usuario",
      headerName: "Usuario",
      flex: 1,
      renderCell: (params) => `${params.row.usuario} (${params.row.email})`,
    },
    { field: "fecha_registro", headerName: "Fecha Registro", flex: 1 },
    { field: "saldo", headerName: "Saldo", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "cliente") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "cliente") && (
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
          {rows.map((c) => (
            <Paper key={c.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Usuario:</strong> {c.usuario}</Typography>
              <Typography><strong>Email:</strong> {c.email}</Typography>
              <Typography><strong>Fecha Registro:</strong> {c.fecha_registro}</Typography>
              <Typography><strong>Saldo:</strong> {c.saldo}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "cliente") && (
                  <Button size="small" onClick={() => onEdit(c)}>Editar</Button>
                )}
                {can(role, "delete", "cliente") && (
                  <Button size="small" color="error" onClick={() => onDelete(c.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default ClientesTable
