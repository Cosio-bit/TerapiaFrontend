import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SalasTable = ({ salas, onEdit, onDelete }) => {
  return (
    <Box mt={3}>
      <DataGrid
        rows={salas.map((sala) => ({
          ...sala,
          id: sala.id_sala,
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "capacidad", headerName: "Capacidad", flex: 1 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "ubicacion", headerName: "Ubicación", flex: 1 },
          { field: "estado", headerName: "Estado", flex: 1 },
          { field: "id_proveedor", headerName: "ID Proveedor", flex: 1 },
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

export default SalasTable;
