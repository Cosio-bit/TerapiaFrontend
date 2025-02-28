import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProveedoresTable = ({ proveedores, onEdit, onDelete }) => {
  return (
    <Box mt={3}>
      <DataGrid
        rows={proveedores.map((proveedor) => ({
          ...proveedor,
          id: proveedor.id_proveedor,
        }))}
        columns={[
          {
            field: "usuario",
            headerName: "Usuario",
            flex: 1,
            renderCell: (params) => {
              const usuario = params.row.usuario;
              return usuario ? `${usuario.nombre} (${usuario.email})` : "Sin usuario";
            },
          },
          
          { field: "rut_empresa", headerName: "RUT Empresa", flex: 1 },
          { field: "direccion", headerName: "Dirección", flex: 1 },
          { field: "telefono", headerName: "Teléfono", flex: 1 },
          { field: "email", headerName: "Correo Electrónico", flex: 1 },
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

export default ProveedoresTable;
