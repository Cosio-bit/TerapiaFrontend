/**import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import UsuarioRolesForm from "../components/UsuarioRolesForm";
import{ createCliente} from "../api/clienteApi";
import {createProfesional } from "../api/profesionalApi";
import {createProveedor} from "../api/proveedorApi";

const UsuarioRoles = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { usuario, roles } = location.state; // Datos pasados desde Usuarios.js
    const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

    const handleSaveRole = async (role, data) => {
        try {
            if (role === "Proveedor") await createProveedor(data);
            if (role === "Cliente") await createCliente(data);
            if (role === "Profesional") await createProfesional(data);

            setSnackbar({ open: true, message: `${role} guardado con éxito.`, severity: "success" });
        } catch {
            setSnackbar({ open: true, message: `Error al guardar ${role}.`, severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Asignar Roles al Usuario: {usuario.nombre}
            </Typography>

            <UsuarioRolesForm usuario={usuario} roles={roles} onSave={handleSaveRole} />

            <Button
                variant="contained"
                color="secondary"
                onClick={() => navigate("/usuarios")}
            >
                Finalizar
            </Button>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default UsuarioRoles;
*/