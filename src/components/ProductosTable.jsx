import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProductosTable = ({ productos, onEdit, onDelete }) => {
  return (
    <Box mt={3}>
      <DataGrid
        rows={productos.map((producto) => ({
          ...producto,
          id: producto.id_producto,
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "descripcion", headerName: "Descripción", flex: 2 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "stock", headerName: "Stock", flex: 1 },
          { field: "fecha_creacion", headerName: "Fecha de Creación", flex: 1 },
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

export default ProductosTable;
