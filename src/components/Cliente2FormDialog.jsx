import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Select, MenuItem, FormControl, InputLabel, List, ListItem
} from "@mui/material";
import { fetchCompras } from "../api/compraApi";
import { fetchSesionGroups } from "../api/sesionGroupApi";
import { fetchArriendosByCliente } from "../api/arriendoApi";
import { fetchArriendos } from "../api/arriendoApi";
import { getAllProductos } from "../api/productoApi";
import { getAllSalas } from "../api/salaApi";
import { getAllTerapias } from "../api/terapiaApi";
import { fetchVariantes } from "../api/varianteApi";

import CompraFormDialog from "./CompraFormDialog";
import ArriendoFormDialog from "./ArriendoFormDialog";
import SesionGroupFormDialog from "./SesionGroupFormDialog";

const Cliente2FormDialog = ({ open, setOpen, clientList }) => {
  const [selectedClient, setSelectedClient] = useState(null);
  const [compras, setCompras] = useState([]);
  const [sesionGroups, setSesionGroups] = useState([]);
  const [arriendos, setArriendos] = useState([]);

  const [productos, setProductos] = useState([]);
  const [salas, setSalas] = useState([]);
  const [terapias, setTerapias] = useState([]);
  const [variantes, setVariantes] = useState([]);

  const [openCompraDialog, setOpenCompraDialog] = useState(false);
  const [openArriendoDialog, setOpenArriendoDialog] = useState(false);
  const [openSesionGroupDialog, setOpenSesionGroupDialog] = useState(false);

  useEffect(() => {
    if (open) {
      fetchProductosData();
      fetchSalasData();
      fetchTerapiasData();
      fetchVariantesData();
    }
  }, [open]);

  useEffect(() => {
    if (selectedClient?.id_cliente) {
      fetchComprasByClient(selectedClient.id_cliente);
      fetchSesionGroupsByClient(selectedClient.id_cliente);
      fetchArriendosByClient(selectedClient.id_cliente);
    }
  }, [selectedClient]);

  const fetchComprasByClient = async (clientId) => {
    try {
      const allCompras = await fetchCompras();
      const filtered = Array.isArray(allCompras)
        ? allCompras.filter(c => Number(c.cliente?.id_cliente) === Number(clientId))
        : [];
      setCompras(filtered);
    } catch (error) {
      console.error("❌ Error fetching compras:", error);
      setCompras([]);
    }
  };
  
  const fetchSesionGroupsByClient = async (clientId) => {
    try {
      const allGroups = await fetchSesionGroups();
      const filtered = Array.isArray(allGroups)
        ? allGroups.filter(g => Number(g.cliente?.id_cliente) === Number(clientId))
        : [];
      setSesionGroups(filtered);
    } catch (error) {
      console.error("❌ Error fetching sesión groups:", error);
      setSesionGroups([]);
    }
  };
  
  const fetchArriendosByClient = async (clientId) => {
    try {
      const allArriendos = await fetchArriendos();
      console.log("🧾 Todos los arriendos:", allArriendos); // <--- AGREGA ESTO
  
      const filtered = Array.isArray(allArriendos)
        ? allArriendos.filter(a => Number(a.cliente?.id_cliente) === Number(clientId))
        : [];
  
      console.log("🔍 Arriendos filtrados por cliente", clientId, ":", filtered); // <--- Y ESTO
  
      setArriendos(filtered);
    } catch (error) {
      console.error("❌ Error fetching arriendos:", error);
      setArriendos([]);
    }
  };
  
  

  const fetchProductosData = async () => {
    try {
      const data = await getAllProductos();
      setProductos(data || []);
    } catch (error) {
      console.error("Error fetching productos:", error);
    }
  };

  const fetchSalasData = async () => {
    try {
      const data = await getAllSalas();
      setSalas(data || []);
    } catch (error) {
      console.error("Error fetching salas:", error);
    }
  };

  const fetchTerapiasData = async () => {
    try {
      const data = await getAllTerapias();
      setTerapias(data || []);
    } catch (error) {
      console.error("Error fetching terapias:", error);
    }
  };

  const fetchVariantesData = async () => {
    try {
      const data = await fetchVariantes();
      setVariantes(data || []);
    } catch (error) {
      console.error("Error fetching variantes:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedClient(null);
  };

  const validClientList = selectedClient ? [selectedClient] : [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Client History and Management</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="client-select-label">Select Client</InputLabel>
          <Select
            labelId="client-select-label"
            value={selectedClient?.id_cliente || ""}
            onChange={(e) => {
              const selected = clientList.find(c => c.id_cliente === e.target.value);
              setSelectedClient(selected);
            }}
            label="Select Client"
          >
            {clientList && clientList.length > 0 ? (
              clientList.map((client) => (
                <MenuItem key={client.id_cliente} value={client.id_cliente}>
                  {client.usuario?.nombre || "Unnamed Client"}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No clients available</MenuItem>
            )}
          </Select>
        </FormControl>

        {selectedClient && (
          <div>
            <h3>Client History</h3>

            <List>
              <h4>Compras</h4>
              {compras.map((compra) => (
                <ListItem key={compra.id_compra}>
                  {compra.productosComprados?.length > 0 ? (
                    compra.productosComprados.map((pc, index) => (
                      <div key={index}>
                        {pc.producto?.nombre || "No name"} - {pc.cantidad} unidad(es)
                      </div>
                    ))
                  ) : (
                    <div>No hay productos</div>
                  )}
                </ListItem>
              ))}
            </List>

            <List>
              <h4>Session Groups</h4>
              {sesionGroups.map((group) => (
                <ListItem key={group.id_sesion_group}>
                  {group.terapia?.nombre || "No name"} - {group.descripcion}
                </ListItem>
              ))}
            </List>

            <List>
              <h4>Arriendos</h4>
              {arriendos.map((arriendo) => (
                <ListItem key={arriendo.id_arriendo}>
                  {arriendo.sala?.nombre || "No name"} - {arriendo.fecha} - ${arriendo.monto_pagado}
                </ListItem>
              ))}
            </List>

            <div>
              <Button variant="contained" onClick={() => setOpenCompraDialog(true)} sx={{ mt: 2, mr: 1 }}>
                Crear Compra
              </Button>
              <Button variant="contained" onClick={() => setOpenSesionGroupDialog(true)} sx={{ mt: 2, mr: 1 }}>
                Crear Grupo de Sesiones
              </Button>
              <Button variant="contained" onClick={() => setOpenArriendoDialog(true)} sx={{ mt: 2 }}>
                Crear Arriendo
              </Button>
            </div>
          </div>
        )}

        {/* FORM DIALOGS */}
        <CompraFormDialog
          open={openCompraDialog && selectedClient !== null}
          onClose={() => setOpenCompraDialog(false)}
          onSave={() => {
            if (selectedClient?.id_cliente) {
              fetchComprasByClient(selectedClient.id_cliente);
              setOpenCompraDialog(false);
            }
          }}
          clientes={validClientList}
          productos={productos}
          editing={false}
          setSnackbar={() => {}}
        />

        <SesionGroupFormDialog
          open={openSesionGroupDialog && selectedClient !== null}
          onClose={() => setOpenSesionGroupDialog(false)}
          onSave={() => {
            if (selectedClient?.id_cliente) {
              fetchSesionGroupsByClient(selectedClient.id_cliente);
              setOpenSesionGroupDialog(false);
            }
          }}
          clientes={validClientList}
          terapias={terapias}
          variantes={variantes}
          editing={false}
          setSnackbar={() => {}}
        />

        <ArriendoFormDialog
          open={openArriendoDialog && selectedClient !== null}
          onClose={() => setOpenArriendoDialog(false)}
          onSave={() => {
            if (selectedClient?.id_cliente) {
              fetchArriendosByClient(selectedClient.id_cliente);
              setOpenArriendoDialog(false);
            }
          }}
          salas={salas}
          clientes={validClientList}
          editing={false}
          setSnackbar={() => {}}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Cliente2FormDialog;
