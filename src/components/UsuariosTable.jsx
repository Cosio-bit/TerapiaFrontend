import React from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const UsuariosTable = ({ usuarios, onEdit, onDelete }) => {
  const { role } = useAuth();
  const usuarioRows = Array.isArray(usuarios) ? usuarios : [];

  return (
    <Box mt={3}>
      <DataGrid
        rows={usuarioRows.map((usuario) => ({
          ...usuario,
          id: usuario.id_usuario,
        }))}
        columns={[
          { field: "nombre", headerName: "Nombre", flex: 1 },
          { field: "rut", headerName: "RUT", flex: 1 },
          { field: "email", headerName: "Email", flex: 1 },
          { field: "telefono", headerName: "Teléfono", flex: 1 },
          { field: "direccion", headerName: "Dirección", flex: 1 },
          { field: "sexo", headerName: "Sexo", flex: 1 },
          { field: "fecha_nacimiento", headerName: "Fecha de Nacimiento", flex: 1 },
          { field: "saldo", headerName: "Saldo", flex: 1, type: "number" },
          {
            field: "actions",
            headerName: "Acciones",
            sortable: false,
            flex: 1,
            renderCell: (params) => (
              <Box display="flex" gap={1}>
                {can(role, "edit", "usuario") && (
                  <Button size="small" onClick={() => onEdit(params.row)}>
                    Editar
                  </Button>
                )}
                {can(role, "delete", "usuario") && (
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

export default UsuariosTable;
