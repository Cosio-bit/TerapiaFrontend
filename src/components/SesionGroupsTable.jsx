import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const SesionGroupsTable = ({ sesionGroups, onEdit, onDelete }) => {
  const rows = Array.isArray(sesionGroups) ? sesionGroups : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={rows.map((sesionGroup) => ({
          id: sesionGroup?.id_sesion_group ,  // ✅ Asegurar que `id_sesion_group` esté presente
          terapia: sesionGroup?.terapia?.nombre || "No especificado",
          variante: sesionGroup?.variante?.nombre || "No especificado",
          cliente: sesionGroup?.cliente?.usuario?.nombre || "No especificado",
          sesiones: Array.isArray(sesionGroup?.sesiones) ? sesionGroup.sesiones : []
        }))}
        columns={[
          { field: "terapia", headerName: "Terapia", flex: 1 },
          { field: "variante", headerName: "Variante", flex: 1 },
          { field: "cliente", headerName: "Cliente", flex: 1 },
          {
            field: "sesiones",
            headerName: "Sesiones",
            flex: 2,
            renderCell: (params) => {
              const sesiones = params.row?.sesiones || [];
              return sesiones.length > 0 ? (
                <Box component="ul" sx={{ paddingLeft: "15px", margin: 0 }}>
                  {sesiones.map((sesion, index) => (
                    <Typography component="li" key={index} variant="body2">
                      📅 {sesion.fecha_hora || "Sin fecha"} | 💰 {sesion.precio || "0"} | 🏷️ {sesion.estado || "Sin estado"} | 👨‍⚕️ {sesion.professional?.id_profesional ? `ID ${sesion.professional.id_profesional}` : "Sin asignar"}
                    </Typography>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Sin sesiones
                </Typography>
              );
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

export default SesionGroupsTable;
