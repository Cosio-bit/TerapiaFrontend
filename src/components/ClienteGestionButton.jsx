// src/components/ClienteGestionButton.jsx
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Divider,
  Stack,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccountBalance as BalanceIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  LocalHospital as LocalHospitalIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useQuery } from "@tanstack/react-query";

// API imports - ajustar las rutas según tu estructura
import { fetchComprasByCliente } from "../api/compraApi";
import { fetchArriendosByCliente } from "../api/arriendoApi"; 
import { fetchSesionGroupsByCliente } from "../api/sesionGroupApi";
import { fetchProveedores } from "../api/proveedorApi";
import { getAllTerapias } from "../api/terapiaApi";
import { getAllProfesionales } from "../api/sesionApi";
import { getAllProductos } from "../api/productoApi";
import { getAllSalas } from "../api/salaApi";

/**
 * Componente para mostrar la información detallada y gestión de un cliente
 * Props:
 *  - clientData  : objeto cliente con todos sus campos
 *  - onClose     : función para cerrar el modal (opcional)
 */
const ClienteGestionButton = ({ clientData, onClose }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (onClose) onClose();
  };

  // Queries para obtener datos del cliente
  const { data: compras = [], isLoading: loadingCompras } = useQuery({
    queryKey: ["compras", clientData?.id_cliente],
    queryFn: () => fetchComprasByCliente(clientData.id_cliente),
    enabled: open && !!clientData?.id_cliente,
  });

  const { data: arriendos = [], isLoading: loadingArriendos } = useQuery({
    queryKey: ["arriendos", clientData?.id_cliente],
    queryFn: () => fetchArriendosByCliente(clientData.id_cliente),
    enabled: open && !!clientData?.id_cliente,
  });

  const { data: sesionGroups = [], isLoading: loadingSesiones } = useQuery({
    queryKey: ["sesionGroups", clientData?.id_cliente],
    queryFn: () => fetchSesionGroupsByCliente(clientData.id_cliente),
    enabled: open && !!clientData?.id_cliente,
  });

  // Queries para datos de referencia
  const { data: proveedores = [] } = useQuery({
    queryKey: ["proveedores"],
    queryFn: fetchProveedores,
    enabled: open,
  });

  const { data: terapias = [] } = useQuery({
    queryKey: ["terapias"],
    queryFn: getAllTerapias,
    enabled: open,
  });

  const { data: profesionales = [] } = useQuery({
    queryKey: ["profesionales"],
    queryFn: getAllProfesionales,
    enabled: open,
  });

  const { data: productos = [] } = useQuery({
    queryKey: ["productos"],
    queryFn: getAllProductos,
    enabled: open,
  });

  const { data: salas = [] } = useQuery({
    queryKey: ["salas"],
    queryFn: getAllSalas,
    enabled: open,
  });

  // Helper functions para encontrar nombres por ID
  const getProveedorNombre = (id) => {
    const proveedor = proveedores.find(p => p.id === id);
    return proveedor?.nombre || `Proveedor ID: ${id}`;
  };

  const getTerapiaNombre = (id) => {
    const terapia = terapias.find(t => t.id_terapia === id);
    return terapia?.nombre || `Terapia ID: ${id}`;
  };

  const getProfesionalNombre = (id) => {
    const profesional = profesionales.find(p => p.id_profesional === id);
    return profesional?.nombre || `Profesional ID: ${id}`;
  };

  const getSalaNombre = (id) => {
    const sala = salas.find(s => s.id === id);
    return sala?.nombre || `Sala ID: ${id}`;
  };

  // Componentes de render para cada sección
  const renderClientInfo = () => (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardHeader
        avatar={<PersonIcon color="primary" />}
        title="Información del Cliente"
        titleTypographyProps={{ variant: "h6", fontWeight: "bold" }}
      />
      <CardContent>
        <Stack spacing={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="body1">
              <strong>Nombre:</strong> {clientData?.usuario?.nombre || clientData?.name || "No especificado"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <EmailIcon fontSize="small" color="action" />
            <Typography variant="body1">
              <strong>Email:</strong> {clientData?.usuario?.email || clientData?.email || "No especificado"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <CalendarIcon fontSize="small" color="action" />
            <Typography variant="body1">
              <strong>Registro:</strong>{" "}
              {clientData?.fecha_registro 
                ? new Date(clientData.fecha_registro).toLocaleDateString("es-ES")
                : "No disponible"}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <BalanceIcon fontSize="small" color="action" />
            <Typography variant="body1">
              <strong>Saldo:</strong> ${typeof clientData?.saldo === "number" ? clientData.saldo.toFixed(2) : "0.00"}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );

  const renderCompras = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h6">Compras ({compras.length})</Typography>
          {loadingCompras && <CircularProgress size={20} />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {loadingCompras ? (
          <CircularProgress />
        ) : compras.length === 0 ? (
          <Typography color="text.secondary">No hay compras registradas</Typography>
        ) : (
          <Stack spacing={2}>
            {compras.map((compra, idx) => (
              <Card key={compra.id || idx} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total: ${compra.total?.toFixed(2)} - Fecha:{" "}
                    {new Date(compra.fecha_compra).toLocaleDateString("es-ES")}
                  </Typography>
                  {compra.metodo_pago && (
                    <Typography variant="body2" color="text.secondary">
                      Método de pago: {compra.metodo_pago}
                    </Typography>
                  )}
                  {compra.id_proveedor && (
                    <Typography variant="body2" color="text.secondary">
                      Proveedor: {getProveedorNombre(compra.id_proveedor)}
                    </Typography>
                  )}
                  {compra.estado && (
                    <Chip 
                      label={compra.estado} 
                      size="small" 
                      color={compra.estado === "completado" ? "success" : "default"}
                      sx={{ mt: 1 }}
                    />
                  )}
                  {compra.notas && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      📝 {compra.notas}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderArriendos = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <HomeIcon color="primary" />
          <Typography variant="h6">Arriendos ({arriendos.length})</Typography>
          {loadingArriendos && <CircularProgress size={20} />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {loadingArriendos ? (
          <CircularProgress />
        ) : arriendos.length === 0 ? (
          <Typography color="text.secondary">No hay arriendos registrados</Typography>
        ) : (
          <Stack spacing={2}>
            {arriendos.map((arriendo, idx) => (
              <Card key={arriendo.id || idx} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {arriendo.horas_reservadas} hora(s) - ${arriendo.precio_total?.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {new Date(arriendo.fecha_inicio).toLocaleString("es-ES")}
                  </Typography>
                  {arriendo.id_sala && (
                    <Typography variant="body2" color="text.secondary">
                      Sala: {getSalaNombre(arriendo.id_sala)}
                    </Typography>
                  )}
                  {arriendo.id_proveedor && (
                    <Typography variant="body2" color="text.secondary">
                      Proveedor: {getProveedorNombre(arriendo.id_proveedor)}
                    </Typography>
                  )}
                  {arriendo.estado && (
                    <Chip 
                      label={arriendo.estado} 
                      size="small" 
                      color={arriendo.estado === "completado" ? "success" : "default"}
                      sx={{ mt: 1 }}
                    />
                  )}
                  {arriendo.notas && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      📝 {arriendo.notas}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );

  const renderSesiones = () => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Box display="flex" alignItems="center" gap={1}>
          <LocalHospitalIcon color="primary" />
          <Typography variant="h6">Grupos de Sesiones ({sesionGroups.length})</Typography>
          {loadingSesiones && <CircularProgress size={20} />}
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        {loadingSesiones ? (
          <CircularProgress />
        ) : sesionGroups.length === 0 ? (
          <Typography color="text.secondary">No hay sesiones registradas</Typography>
        ) : (
          <Stack spacing={2}>
            {sesionGroups.map((grupo, idx) => (
              <Card key={grupo.id || idx} variant="outlined">
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {grupo.cantidad_sesiones} sesiones
                  </Typography>
                  {grupo.id_terapia && (
                    <Typography variant="body2" color="text.secondary">
                      Terapia: {getTerapiaNombre(grupo.id_terapia)}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {new Date(grupo.fecha_inicio).toLocaleDateString("es-ES")}
                  </Typography>
                  {grupo.precio_total && (
                    <Typography variant="body2" color="text.secondary">
                      Precio Total: ${grupo.precio_total.toFixed(2)}
                    </Typography>
                  )}
                  {grupo.estado && (
                    <Chip 
                      label={grupo.estado} 
                      size="small" 
                      color={grupo.estado === "completado" ? "success" : "default"}
                      sx={{ mt: 1 }}
                    />
                  )}
                  {grupo.notas && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      📝 {grupo.notas}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </AccordionDetails>
    </Accordion>
  );

  if (!clientData) {
    return (
      <Button variant="outlined" size="small" disabled>
        Gestionar Cliente
      </Button>
    );
  }

  return (
    <>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        Gestionar Cliente
      </Button>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ pr: 4 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="primary" />
            <Typography variant="h5" component="span">
              Gestión de Cliente
            </Typography>
          </Box>
          <IconButton
            aria-label="cerrar"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            {renderClientInfo()}

            <Stack spacing={2}>
              {renderCompras()}
              {renderArriendos()}
              {renderSesiones()}
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClienteGestionButton;