import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProductosCompradosTable = ({ productosComprados, onEdit, onDelete }) => {
  return (
    <Box mt={3}>
      <DataGrid
        rows={productosComprados.map((producto) => ({
          ...producto,
          id: producto.id_productocomprado,
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "cantidad", headerName: "Cantidad", flex: 1 },
          { field: "id_producto", headerName: "ID Producto", flex: 1 },
          { field: "id_compra", headerName: "ID Compra", flex: 1 },
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
