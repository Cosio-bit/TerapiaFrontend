import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const FichasSaludTable = ({ fichasSalud, onEdit, onDelete }) => {
  const { role } = useAuth();

  return (
    <Box mt={3}>
      <DataGrid
        rows={fichasSalud.map((ficha) => ({
          ...ficha,
          id: ficha.id_fichasalud,
        }))}
        columns={[
          { field: "fecha", headerName: "Fecha", flex: 1 },
          { field: "descripcion", headerName: "Descripción", flex: 2 },
          { field: "id_cliente", headerName: "ID Cliente", flex: 1 },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "fichasalud") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>Editar</Button>
                )}
                {can(role, "delete", "fichasalud") && (
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

export default FichasSaludTable;
