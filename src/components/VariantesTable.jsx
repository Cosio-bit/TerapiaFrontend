import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const VariantesTable = ({ variantes = [], onEdit, onDelete }) => {
  const { role } = useAuth();
  const rows = Array.isArray(variantes) ? variantes : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((variante, index) => ({
          ...variante,
          id: variante.id_variante || index,
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "precio", headerName: "Precio", flex: 1 },
          { field: "duracion", headerName: "Duración (min)", flex: 1 },
          { field: "cantidad", headerName: "Cantidad", flex: 1 },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "variante") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "variante") && (
                  <Button size="small" color="error" onClick={() => onDelete(params.row.id_variante)}>
                    Eliminar
                  </Button>
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

export default VariantesTable;
