import React, { useState, useEffect } from "react";
import ClientFormDialog from "../components/Cliente2FormDialog";
import { getAllClientes as fetchClients } from "../api/clienteApi";

import { Box, Button, Snackbar, Alert, Typography } from "@mui/material";

const ManageCliente = () => {
  const [clients, setClients] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const getClients = async () => {
      const clientData = await fetchClients(); // Fetch all clients
      setClients(clientData);
    };
    getClients();
  }, []);

  return (
    <div>
      <Button variant="contained" onClick={() => setOpenDialog(true)}>
        Manage Client
      </Button>

      <ClientFormDialog
        open={openDialog}
        setOpen={setOpenDialog}
        clientList={clients}  // Pass the client list to the dialog
      />
    </div>
  );
};

export default ManageCliente;
