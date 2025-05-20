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

const ProductosCompradosTable = ({ productosComprados = [], onEdit, onDelete }) => {
  const { role } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla")

  const rows = Array.isArray(productosComprados)
    ? productosComprados.map((productoComprado) => ({
        id: productoComprado.id_producto_comprado,
        producto: productoComprado.producto?.nombre || "Desconocido",
        cantidad: productoComprado.cantidad,
      }))
    : []

  const columnas = [
    { field: "producto", headerName: "Producto", flex: 1 },
    { field: "cantidad", headerName: "Cantidad", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          {can(role, "edit", "productocomprado") && (
            <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
          )}
          {can(role, "delete", "productocomprado") && (
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
          {rows.map((item) => (
            <Paper key={item.id} sx={{ p: 2, borderRadius: 2 }}>
              <Typography><strong>Producto:</strong> {item.producto}</Typography>
              <Typography><strong>Cantidad:</strong> {item.cantidad}</Typography>
              <Box mt={1} display="flex" gap={1}>
                {can(role, "edit", "productocomprado") && (
                  <Button size="small" onClick={() => onEdit(item)}>Editar</Button>
                )}
                {can(role, "delete", "productocomprado") && (
                  <Button size="small" color="error" onClick={() => onDelete(item.id)}>Eliminar</Button>
                )}
              </Box>
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export default ProductosCompradosTable
