import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProfesionalesTable = ({ profesionales, onEdit, onDelete }) => {
  const profesionalRows = Array.isArray(profesionales) ? profesionales : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={profesionalRows.map(profesional => ({
          ...profesional,
          id: profesional.id_profesional,
          usuario_nombre: profesional.usuario ? profesional.usuario.nombre : "No asignado",
        }))}
        columns={[
          { field: "usuario_nombre", headerName: "Nombre Usuario", flex: 1 },
          { field: "especialidad", headerName: "Especialidad", flex: 1 },
          { field: "banco", headerName: "Banco", flex: 1 },
          { field: "actions", headerName: "Acciones", flex: 1, renderCell: (params) => (
              <Box display="flex" gap={1}>
                <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
                <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>Eliminar</Button>
              </Box>
            ),
          },
        ]}
        pageSize={5}
        autoHeight
      />
    </Box>
  );
};

export default ProfesionalesTable;
