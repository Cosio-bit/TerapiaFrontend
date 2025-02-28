import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const TerapiasTable = ({ terapias, onEdit, onDelete }) => {
  const rows = Array.isArray(terapias) ? terapias : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((terapia) => ({
          ...terapia,
          id: terapia?.id_terapia || Math.random(), // Ensure each row has an ID
          presencial: terapia?.presencial || "No especificado", // Handle missing values
          variantes: terapia?.variantes || [], // Ensure variantes is always an array
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

export default TerapiasTable;
