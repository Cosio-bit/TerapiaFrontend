import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const TerapiasTable = ({ terapias, onEdit, onDelete }) => {
  const { role } = useAuth();
  const rows = Array.isArray(terapias) ? terapias : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((terapia) => ({
          ...terapia,
          id: terapia?.id_terapia || Math.random(),
          presencial: terapia?.presencial || "No especificado",
          variantes: terapia?.variantes || [],
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "descripcion", headerName: "Descripción", flex: 1 },
          {
            field: "presencial",
            headerName: "Presencial",
            flex: 1,
            valueGetter: (params) => (params.row?.presencial === "Sí" ? "Sí" : "No"),
          },
          {
            field: "variantes",
            headerName: "Variantes",
            flex: 1,
            renderCell: (params) => {
              const variantes = params.row?.variantes || [];
              return variantes.length > 0
                ? variantes.map((v) => v.nombre).join(", ")
                : "Sin variantes";
            },
          },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "terapia") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "terapia") && (
                  <Button size="small" color="error" onClick={() => onDelete(params.row.id)}>
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

export default TerapiasTable;
