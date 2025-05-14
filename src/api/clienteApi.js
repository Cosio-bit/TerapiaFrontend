import axiosInstance from "./axiosConfig";

/**
 * Fetch all clients
 * @returns {Promise<Array>} List of clients
 */
export const getAllClientes = async () => {
  try {
    const response = await axiosInstance.get("/clientes");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching clients:", error);
    throw error;
  }
};

/**
 * Fetch a client by ID
 * @param {number} id - Client ID
 * @returns {Promise<Object>} Client details
 */
export const fetchClienteById = async (id) => {
  try {
    const response = await axiosInstance.get(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching client with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new client
 * @param {Object} cliente - Client data
 * @returns {Promise<Object>} Created client
 */
export const createCliente = async (cliente) => {
  try {
    const formattedCliente = formatClientePayload(cliente);

    console.log("🛠️ Sending Create Cliente Payload:", JSON.stringify(formattedCliente, null, 2));

    const response = await axiosInstance.post("/clientes", formattedCliente);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating client:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing client
 * @param {number} id - Client ID
 * @param {Object} cliente - Updated client data
 * @returns {Promise<Object>} Updated client
 */
export const updateCliente = async (id, cliente) => {
  try {
    const formattedCliente = formatClientePayload(cliente);

    console.log(`🛠️ Sending Update Cliente (ID: ${id}) Payload:`, JSON.stringify(formattedCliente, null, 2));

    const response = await axiosInstance.put(`/clientes/${id}`, formattedCliente);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating client with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a client by ID
 * @param {number} id - Client ID
 */
export const deleteCliente = async (id) => {
  try {
    await axiosInstance.delete(`/clientes/${id}`);
  } catch (error) {
    console.error(`❌ Error deleting client with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Format Cliente Payload Before Sending to Backend
 * @param {Object} cliente - Raw client data
 * @returns {Object} Formatted client data
 */
const formatClientePayload = (cliente) => {
  return {
    usuario: { id_usuario: cliente.usuario?.id_usuario || cliente.usuarioSeleccionado || 1 }, // ✅ Ensure correct user ID
    fecha_registro: cliente.fecha_registro ? formatDate(cliente.fecha_registro) : new Date().toISOString().split("T")[0],
    saldo: Number(cliente.saldo) || 0,

    // ✅ Ensure `fichasSalud` updates correctly
    fichasSalud: cliente.fichasSalud?.length > 0
      ? cliente.fichasSalud.map((ficha) => ({
          id_fichasalud: ficha.id_fichasalud > 0 ? ficha.id_fichasalud : null, // ✅ Keep ID for existing, null for new
          fecha: ficha.fecha ? formatDate(ficha.fecha) : new Date().toISOString().split("T")[0], // Ensure valid date
          descripcion: ficha.descripcion || "Sin descripción",
        }))
      : [], // ✅ Ensure empty array if no fichas
  };
};

/**
 * Format Date to YYYY-MM-DD
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date
 */
const formatDate = (dateStr) => {
  return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
};
