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

const ProductosTable = ({ productos, onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(productos) ? productos : []

  const columnas = [
    { field: "nombre", headerName: "Nombre", flex: 1 },
    { field: "descripcion", headerName: "Descripción", flex: 1 },
    { field: "precio", headerName: "Precio", flex: 1 },
    { field: "stock", headerName: "Stock", flex: 1 },
    { field: "proveedor", headerName: "Proveedor", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "producto") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "producto") && (
            <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>Eliminar</Button>
          )}
        </Box>
      ),
    },
  ]

  const dataFormateada = rows.map((p) => ({
    id: p.id_producto,
    nombre: p.nombre || "No especificado",
    descripcion: p.descripcion || "No especificado",
    precio: p.precio ? `$${p.precio}` : "No especificado",
    stock: p.stock ?? "No especificado",
    proveedor: p.proveedor?.usuario?.nombre || "No especificado",
  }))

  const noData = dataFormateada.length === 0

  return (
    <Box mt={3}>
      <Box mb={2}>
        <ButtonGroup variant="outlined" size="small">
          <Button onClick={() => setModo("tabla")} disabled={modo === "tabla"}>Tabla</Button>
          <Button onClick={() => setModo("tarjeta")} disabled={modo === "tarjeta"}>Tarjetas</Button>
        </ButtonGroup>
      </Box>

      {noData ? (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          No hay productos disponibles.
        </Typography>
      ) : modo === "tabla" ? (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: "800px", height: "70vh" }}>
            <DataGrid
              rows={dataFormateada}
              columns={columnas}
              pageSize={10}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
              sx={{
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: theme.palette.background.paper,
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Stack spacing={2}>
          {dataFormateada.map((p) => (
            <Paper
              key={p.id}
              sx={{
                p: 2,
                borderRadius: 2,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              }}
            >
              <Stack spacing={1}>
                <Typography><strong>Nombre:</strong> {p.nombre}</Typography>
                <Typography><strong>Descripción:</strong> {p.descripcion}</Typography>
                <Typography><strong>Precio:</strong> {p.precio}</Typography>
                <Typography><strong>Stock:</strong> {p.stock}</Typography>
                <Typography><strong>Proveedor:</strong> {p.proveedor}</Typography>
              </Stack>
              <Box mt={2} display="flex" gap={1}>
                {can(role, "edit", "producto") && (
                  <Button size="small" onClick={() => onEdit(p)}>Editar</Button>
                )}
                {can(role, "delete", "producto") && (
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

export default ProductosTable
