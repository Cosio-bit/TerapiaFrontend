import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const CategoriasTable = ({ categorias, onEdit, onDelete }) => {
  const { role } = useAuth();

  return (
    <Box mt={3}>
      <DataGrid
        rows={categorias.map((categoria) => ({
          ...categoria,
          id: categoria.id_categoria,
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "descripcion", headerName: "Descripción", flex: 2 },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "categoria") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "categoria") && (
                  <Button
                    size="small"
                    color="error"
                    onClick={() => onDelete(params.row.id)}
                  >
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

export default CategoriasTable;
