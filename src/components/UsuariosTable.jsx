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

const UsuariosTable = ({ usuarios, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(usuarios)
    ? usuarios.map((u) => ({
        id: u.id_usuario,
        nombre: u.nombre || "No especificado",
        rut: u.rut || "No especificado",
        email: u.email || "No especificado",
        telefono: u.telefono || "No especificado",
        direccion: u.direccion || "No especificado",
        sexo: u.sexo || "No especificado",
        fecha_nacimiento: u.fecha_nacimiento || "No especificado",
        saldo: u.saldo ?? "0",
      }))
    : []

  const columnas = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "rut", headerName: "RUT", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "telefono", headerName: "Teléfono", flex: 1 },
    { field: "direccion", headerName: "Dirección", flex: 1 },
    { field: "sexo", headerName: "Sexo", flex: 1 },
    { field: "fecha_nacimiento", headerName: "Fecha de Nacimiento", flex: 1 },
    { field: "saldo", headerName: "Saldo", flex: 1, type: "number" },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "usuario") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "usuario") && (
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
          <Box sx={{ minWidth: "1000px" }}>
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
          {rows.map((u) => (
            <Paper key={u.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Nombre:</strong> {u.nombre}</Typography>
              <Typography><strong>RUT:</strong> {u.rut}</Typography>
              <Typography><strong>Email:</strong> {u.email}</Typography>
              <Typography><strong>Teléfono:</strong> {u.telefono}</Typography>
              <Typography><strong>Dirección:</strong> {u.direccion}</Typography>
              <Typography><strong>Sexo:</strong> {u.sexo}</Typography>
              <Typography><strong>Fecha de Nacimiento:</strong> {u.fecha_nacimiento}</Typography>
              <Typography><strong>Saldo:</strong> ${u.saldo}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "usuario") && (
                  <Button size="small" onClick={() => onEdit(u)}>Editar</Button>
                )}
                {can(role, "delete", "usuario") && (
                  <Button size="small" color="error" onClick={() => onDelete(u.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default UsuariosTable
