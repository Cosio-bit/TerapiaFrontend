import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ArriendosTable = ({ arriendos, salas, clientes, onEdit, onDelete }) => (
  <Box mt={3}>
    <DataGrid
      rows={arriendos.map((arriendo) => ({
        ...arriendo,
        id: arriendo.id_arriendo,
        salaNombre: salas.find((sala) => sala.id_sala === arriendo.id_sala)?.nombre || "No asignada",
        clienteNombre: clientes.find((cliente) => cliente.id_cliente === arriendo.id_cliente)?.nombre || "No asignado",
      }))}
      columns={[
        { field: "fecha", headerName: "Fecha", flex: 1 },
        { field: "hora_inicio", headerName: "Hora Inicio", flex: 1 },
        { field: "hora_fin", headerName: "Hora Fin", flex: 1 },
        { field: "estado", headerName: "Estado", flex: 1 },
        { field: "salaNombre", headerName: "Sala", flex: 1 },
        { field: "clienteNombre", headerName: "Cliente", flex: 1 },
        {
          field: "actions",
          headerName: "Acciones",
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

export default ArriendosTable;
