import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../components/authcontext";
import { can } from "../utils/can";

const ProductosTable = ({ productos, onEdit, onDelete }) => {
  const { role } = useAuth();
  const rows = Array.isArray(productos) ? productos : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((producto) => ({
          id: producto?.id_producto,
          nombre: producto?.nombre || "No especificado",
          descripcion: producto?.descripcion || "No especificado",
          precio: producto?.precio ? `$${producto.precio}` : "No especificado",
          stock: producto?.stock || "No especificado",
          proveedor: producto?.proveedor?.usuario?.nombre || "No especificado",
        }))}
        columns={[
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
        ]}
        pageSize={5}
        rowsPerPageOptions={[5]}
        autoHeight
      />
    </Box>
  );
};

export default ProductosTable;
