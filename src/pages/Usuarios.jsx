import React, { useState, useEffect } from "react";
import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";
import {
  getAllUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
} from "../api/usuarioApi";
import UsuariosTable from "../components/UsuariosTable";
import UsuarioFormDialog from "../components/UsuarioFormDialog";
import { useAuth } from "../components/authcontext";
import { can } from "../can";

const Usuarios = () => {
  const { role } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [currentUsuario, setCurrentUsuario] = useState(null);
  const [editing, setEditing] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const data = await getAllUsuarios();
        if (Array.isArray(data)) {
          setUsuarios(data);
        } else {
          setUsuarios([]);
        }
      } catch {
        setSnackbar({ open: true, message: "Error al cargar los usuarios.", severity: "error" });
      }
    };

    fetchUsuarios();
  }, []);

  const handleSaveUsuario = async (usuario) => {
    try {
      if (editing) {
        await updateUsuario(currentUsuario.id_usuario, usuario);
      } else {
        await createUsuario(usuario);
      }
      const updatedUsuarios = await getAllUsuarios();
      setUsuarios(updatedUsuarios);
      setOpenDialog(false);
      setSnackbar({
        open: true,
        message: editing ? "Usuario actualizado con éxito." : "Usuario creado con éxito.",
        severity: "success",
      });
    } catch {
      setSnackbar({ open: true, message: "Error al guardar el usuario.", severity: "error" });
    }
  };

  const handleEditUsuario = (usuario) => {
    setEditing(true);
    setCurrentUsuario(usuario);
    setOpenDialog(true);
  };

  const handleDeleteUsuario = async (id) => {
    try {
      await deleteUsuario(id);
      const updatedUsuarios = await getAllUsuarios();
      setUsuarios(updatedUsuarios);
      setSnackbar({ open: true, message: "Usuario eliminado con éxito.", severity: "success" });
    } catch {
      setSnackbar({ open: true, message: "Error al eliminar el usuario.", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar({ open: false, message: "", severity: "success" });

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>

      {can(role, "create", "usuario") && (
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
      )}

      <UsuariosTable usuarios={usuarios} onEdit={handleEditUsuario} onDelete={handleDeleteUsuario} />

      <UsuarioFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveUsuario}
        usuario={currentUsuario}
        editing={editing}
      />

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Usuarios;
