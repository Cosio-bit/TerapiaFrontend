import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ClientesTable = ({ clientes, onEdit, onDelete }) => {
  // Ensure clientes is always an array
  const clienteRows = Array.isArray(clientes) ? clientes : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={clienteRows.map((cliente) => ({
          ...cliente,
          id: cliente.id_cliente, // Ensure correct ID mapping for DataGrid
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
          { field: "fecha_registro", headerName: "Fecha Registro", flex: 1 },
          { field: "saldo", headerName: "Saldo", flex: 1, type: "number" },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
                <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>Eliminar</Button>
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

export default ClientesTable;
