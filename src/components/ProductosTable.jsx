import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProductosTable = ({ productos, onEdit, onDelete }) => {
  const rows = Array.isArray(productos) ? productos : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((producto) => ({
          id: producto?.id_producto, // ✅ Ensure `id_producto` is set
          nombre: producto?.nombre || "No especificado",
          descripcion: producto?.descripcion || "No especificado",
          precio: producto?.precio ? `$${producto.precio}` : "No especificado",
          stock: producto?.stock || "No especificado",
          proveedor: producto?.proveedor?.usuario?.nombre || "No especificado", // ✅ Fetch the provider's name
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "descripcion", headerName: "Descripción", flex: 1 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "stock", headerName: "Stock", flex: 1 },
          { field: "proveedor", headerName: "Proveedor", flex: 1 }, // ✅ Show provider's name
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
