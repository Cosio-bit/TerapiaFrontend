import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ArriendosTable = ({ arriendos, onEdit, onDelete }) => {
  const rows = Array.isArray(arriendos) ? arriendos : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((arriendo) => ({
          id: arriendo?.id_arriendo, // ✅ Ensure `id_arriendo` is set
          sala: arriendo?.sala?.nombre || "No especificado",
          cliente: arriendo?.cliente?.usuario?.nombre || "No especificado",
          fecha: arriendo?.fecha || "No especificado",
          hora_inicio: arriendo?.hora_inicio || "No especificado",
          hora_fin: arriendo?.hora_fin || "No especificado",
          estado: arriendo?.estado || "No especificado",
          monto_pagado: arriendo?.monto_pagado ? `$${arriendo.monto_pagado}` : "No especificado",
        }))}
        columns={[
          { field: "sala", headerName: "Sala", flex: 1 },
          { field: "cliente", headerName: "Cliente", flex: 1 },
          { field: "fecha", headerName: "Fecha", flex: 1 },
          { field: "hora_inicio", headerName: "Hora Inicio", flex: 1 },
          { field: "hora_fin", headerName: "Hora Fin", flex: 1 },
          { field: "estado", headerName: "Estado", flex: 1 },
          { field: "monto_pagado", headerName: "Monto Pagado", flex: 1 },
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

export default ArriendosTable;
