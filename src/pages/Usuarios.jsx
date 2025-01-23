import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Snackbar, Alert, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from "../api/usuarioApi";
import UsuariosTable from "../components/UsuariosTable";
import UsuarioFormDialog from "../components/UsuarioFormDialog";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editing, setEditing] = useState(false);
    const [currentUsuario, setCurrentUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                setLoading(true);
                const data = await getUsuarios();
                setUsuarios(data);
            } catch (err) {
                setError("Error al cargar los usuarios.");
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    const handleSaveUsuario = async (usuario, roles) => {
        try {
            let usuarioId;
            if (editing) {
                await updateUsuario(usuario.id_usuario, usuario);
                usuarioId = usuario.id_usuario;
            } else {
                const newUsuario = await createUsuario(usuario);
                usuarioId = newUsuario.id_usuario;
            }

            setUsuarios(await getUsuarios());
            setSnackbar({ open: true, message: "Usuario guardado con éxito.", severity: "success" });
            setOpenDialog(false);

            // Redirigir a UsuarioRoles si hay roles seleccionados
            if (roles.proveedor || roles.cliente || roles.profesional) {
                navigate("/usuario-roles", {
                    state: {
                        usuario: { id_usuario: usuarioId, ...usuario },
                        roles,
                    },
                });
            }
        } catch {
            setSnackbar({ open: true, message: "Error al guardar el usuario.", severity: "error" });
        }
    };

    const handleDeleteUsuario = async (id) => {
        try {
            await deleteUsuario(id);
            setUsuarios(await getUsuarios());
            setSnackbar({ open: true, message: "Usuario eliminado con éxito.", severity: "success" });
        } catch {
            setSnackbar({ open: true, message: "Error al eliminar el usuario.", severity: "error" });
        }
    };

    const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                Gestión de Usuarios
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => {
                    setEditing(false);
                    setCurrentUsuario(null);
                    setOpenDialog(true);
                }}
            >
                Crear Usuario
            </Button>

            <UsuariosTable
                usuarios={usuarios}
                onEdit={(usuario) => {
                    setEditing(true);
                    setCurrentUsuario(usuario);
                    setOpenDialog(true);
                }}
                onDelete={handleDeleteUsuario}
            />

            <UsuarioFormDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onSave={handleSaveUsuario}
                usuario={currentUsuario}
                editing={editing}
            />

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

export default Usuarios;
