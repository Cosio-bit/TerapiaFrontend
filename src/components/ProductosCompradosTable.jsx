import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProductosCompradosTable = ({ productosComprados = [], onEdit, onDelete }) => {
  const rows = Array.isArray(productosComprados)
    ? productosComprados.map((productoComprado) => ({
        ...productoComprado,
        id: productoComprado.id_producto_comprado,
        producto: productoComprado.producto?.nombre || "Desconocido",
        cantidad: productoComprado.cantidad,
      }))
    : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows}
        columns={[
          { field: "producto", headerName: "Producto", flex: 1 },
          { field: "cantidad", headerName: "Cantidad", flex: 1 },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <Button size="small" onClick={() => onEdit(params.row)}>
                  Editar
                </Button>
                <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>
                  Eliminar
                </Button>
              </Box>
            ),
          },
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
      />
    </Box>
  );
};

export default ProductosCompradosTable;
