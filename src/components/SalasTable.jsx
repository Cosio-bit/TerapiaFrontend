import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SalasTable = ({ salas, onEdit, onDelete }) => {
  const rows = Array.isArray(salas) ? salas : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((sala) => ({
          id: sala?.id_sala, // ✅ Ensure `id_sala` is set
          nombre: sala?.nombre || "No especificado",
          capacidad: sala?.capacidad || "No especificado",
          precio: sala?.precio ? `$${sala.precio}` : "No especificado",
          ubicacion: sala?.ubicacion || "No especificado",
          estado: sala?.estado || "No especificado",
          proveedor: sala?.proveedor?.usuario?.nombre || "No especificado", // ✅ Fetch the provider's name
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "capacidad", headerName: "Capacidad", flex: 1 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "ubicacion", headerName: "Ubicación", flex: 1 },
          { field: "estado", headerName: "Estado", flex: 1 },
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

export default SalasTable;
