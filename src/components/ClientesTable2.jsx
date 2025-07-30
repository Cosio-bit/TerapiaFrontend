// src/components/ClientesTable.jsx
import React, { useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Typography,
  Paper,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from "./authcontext";
import { can } from "../utils/can";
import ClienteGestionButton from "./ClienteGestionButton";

const ClientesTable = ({ clientes, onEdit, onDelete, proveedores = [] }) => {
  const { role } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [modo, setModo] = useState(isMobile ? "tarjeta" : "tabla");

  const rows = Array.isArray(clientes)
    ? clientes.map((c) => ({
        id: c.id_cliente,
        usuario: c.usuario?.nombre || "No especificado",
        email: c.usuario?.email || "No especificado",
        fecha_registro: c.fecha_registro || "No disponible",
        saldo: typeof c.saldo === "number" ? `$${c.saldo.toFixed(2)}` : "No disponible",
        raw: c, // Guardamos el cliente completo para pasar al modal
      }))
    : [];

  const columnas = [
    {
      field: "usuario",
      headerName: "Usuario",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {params.row.usuario}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.email}
          </Typography>
        </Box>
      ),
    },
    { 
      field: "fecha_registro", 
      headerName: "Fecha Registro", 
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.fecha_registro !== "No disponible" 
            ? new Date(params.row.fecha_registro).toLocaleDateString("es-ES")
            : "No disponible"
          }
        </Typography>
      ),
    },
    { 
      field: "saldo", 
      headerName: "Saldo", 
      flex: 0.8,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          fontWeight="medium"
          color={params.row.raw.saldo >= 0 ? "success.main" : "error.main"}
        >
          {params.row.saldo}
        </Typography>
      ),
    },
    {
      field: "acciones",
      headerName: "Acciones",
      sortable: false,
      flex: 1.5,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <ClienteGestionButton
            clientData={params.row.raw}
            proveedores={proveedores}
          />

          {can(role, "edit", "cliente") && (
            <Button 
              size="small" 
              variant="outlined"
              onClick={() => onEdit(params.row.raw)}
            >
              Editar
            </Button>
          )}

          {can(role, "delete", "cliente") && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onDelete(params.row.id)}
            >
              Eliminar
            </Button>
          )}
        </Stack>
      ),
    },
  ];

  return (
    <Box>
      <ButtonGroup sx={{ mb: 2 }} variant="outlined">
        <Button 
          onClick={() => setModo("tabla")} 
          variant={modo === "tabla" ? "contained" : "outlined"}
        >
          Vista Tabla
        </Button>
        <Button 
          onClick={() => setModo("tarjeta")} 
          variant={modo === "tarjeta" ? "contained" : "outlined"}
        >
          Vista Tarjetas
        </Button>
      </ButtonGroup>

      {modo === "tabla" ? (
        <Paper sx={{ height: 600, width: "100%" }}>
          <DataGrid 
            rows={rows} 
            columns={columnas} 
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Paper>
      ) : (
        <Stack spacing={2}>
          {rows.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                No hay clientes registrados
              </Typography>
            </Paper>
          ) : (
            rows.map((c) => (
              <Paper key={c.id} sx={{ p: 3 }} elevation={2}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {c.usuario}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.email}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={3}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Fecha Registro
                      </Typography>
                      <Typography variant="body2">
                        {c.fecha_registro !== "No disponible" 
                          ? new Date(c.fecha_registro).toLocaleDateString("es-ES")
                          : "No disponible"
                        }
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Saldo
                      </Typography>
                      <Typography 
                        variant="body2" 
                        fontWeight="medium"
                        color={c.raw.saldo >= 0 ? "success.main" : "error.main"}
                      >
                        {c.saldo}
                      </Typography>
                    </Box>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <ClienteGestionButton
                      clientData={c.raw}
                      proveedores={proveedores}
                    />

                    {can(role, "edit", "cliente") && (
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => onEdit(c.raw)}
                      >
                        Editar
                      </Button>
                    )}

                    {can(role, "delete", "cliente") && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => onDelete(c.id)}
                      >
                        Eliminar
                      </Button>
                    )}
                  </Stack>
                </Stack>
              </Paper>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

export default ClientesTable;