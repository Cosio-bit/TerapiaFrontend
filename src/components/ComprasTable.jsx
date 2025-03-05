import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

const ComprasTable = ({ compras, onEdit, onDelete }) => {
  const rows = Array.isArray(compras) ? compras : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((compra) => ({
          id: compra.id_compra,
          fecha: dayjs(compra.fecha).format("DD/MM/YYYY HH:mm"),
          cliente: compra.cliente?.usuario?.nombre || "No especificado",
          productosComprados: Array.isArray(compra.productosComprados) ? compra.productosComprados : [],
        }))}
        columns={[
          { field: "fecha", headerName: "Fecha de Compra", flex: 1 },
          { field: "cliente", headerName: "Cliente", flex: 1 },
          {
            field: "productosComprados",
            headerName: "Productos Comprados",
            flex: 2,
            renderCell: (params) => {
              const productos = params.row?.productosComprados || [];
              return productos.length > 0 ? (
                <Box component="ul" sx={{ paddingLeft: "15px", margin: 0 }}>
                  {productos.map((producto, index) => (
                    <Typography component="li" key={index} variant="body2">
                      🏷️ {producto.producto?.nombre || "Desconocido"} | 🔢 {producto.cantidad}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sin productos
                </Typography>
              );
            },
          },
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

export default ComprasTable;
