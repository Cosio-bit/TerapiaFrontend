import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

const SesionesTable = ({ sesiones = [], onEdit, onDelete }) => {
  // Ensure sesiones is always an array
  const rows = Array.isArray(sesiones)
    ? sesiones.map((sesion) => ({
        ...sesion,
        id: sesion.id_sesion,
        fecha_hora: dayjs(sesion.fecha_hora).format("DD/MM/YYYY HH:mm"),
        profesional: sesion.profesional?.usuario?.nombre || "Sin profesional",
      }))
    : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows}
        columns={[
          { field: "fecha_hora", headerName: "Fecha y Hora", flex: 1 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "estado", headerName: "Estado", flex: 1 },
          { field: "profesional", headerName: "Profesional", flex: 1 },
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

export default SesionesTable;
