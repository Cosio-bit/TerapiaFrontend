import axiosInstance from "./axiosConfig";

/**
 * Fetch all arriendos
 * @returns {Promise<Array>} List of arriendos
 */
export const fetchArriendos = async () => {
  try {
    const response = await axiosInstance.get("/arriendos");
    return response.data;
  } catch (error) {
    console.error("Error fetching arriendos:", error);
    throw error;
  }
};

export const getAllArriendos = async () => {
  try {
    const response = await axiosInstance.get("/arriendos");
    return response.data;
  } catch (error) {
    console.error("Error fetching arriendos:", error);
    throw error;
  }
};

/**
 * Fetch an arriendo by ID
 * @param {number} id - Arriendo ID
 * @returns {Promise<Object>} Arriendo details
 */
export const fetchArriendoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/arriendos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching arriendo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new arriendo
 * @param {Object} arriendo - Arriendo data
 * @returns {Promise<Object>} Created arriendo
 */
export const createArriendo = async (arriendo) => {
  try {
    console.log("📤 Sending data to backend:", JSON.stringify(arriendo, null, 2)); // 🐛 Debug request payload
    const response = await axiosInstance.post("/arriendos", arriendo);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating arriendo:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing arriendo
 * @param {number} id - Arriendo ID
 * @param {Object} arriendo - Updated arriendo data
 * @returns {Promise<Object>} Updated arriendo
 */
export const updateArriendo = async (id, arriendo) => {
  try {
    const response = await axiosInstance.put(`/arriendos/${id}`, arriendo);
    return response.data;
  } catch (error) {
    console.error(`Error updating arriendo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an arriendo by ID
 * @param {number} id - Arriendo ID
 */
export const deleteArriendo = async (id) => {
  try {
    await axiosInstance.delete(`/arriendos/${id}`);
  } catch (error) {
    console.error(`Error deleting arriendo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch arriendos filtrados por id_cliente
 * @param {number} idCliente
 * @returns {Promise<Array>} Lista de arriendos
 */
export const fetchArriendosByCliente = async (idCliente) => {
  try {
    const response = await axiosInstance.get(`/arriendos/cliente/${idCliente}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching arriendos por cliente:", error);
    return [];
  }
};
