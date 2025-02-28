import axiosInstance from "./axiosConfig";

/**
 * Fetch all arriendos
 * @returns {Promise<Array>} List of arriendos
 */
export const getAllArriendos = async () => {
  try {
    const response = await axiosInstance.get("/api/arriendos");
    return response.data;
  } catch (error) {
    console.error("Error fetching arriendos:", error);
    throw error;
  }
};

/**
 * Fetch an arriendo by ID
 * @param {number} id - ID of the arriendo
 * @returns {Promise<Object>} Arriendo details
 */
export const fetchArriendoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/arriendos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching arriendo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch arriendos by estado
 * @param {string} estado - Estado of the arriendo
 * @returns {Promise<Array>} List of arriendos with given estado
 */
export const fetchArriendosByEstado = async (estado) => {
  try {
    const response = await axiosInstance.get(`/api/arriendos/estado/${estado}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching arriendos with estado "${estado}":`, error);
    throw error;
  }
};

/**
 * Fetch available schedules for a given sala on a specific date
 * @param {number} idSala - ID of the sala
 * @param {string} fecha - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} List of available hours
 */
export const fetchAvailableSchedules = async (idSala, fecha) => {
  try {
    const response = await axiosInstance.get(`/api/arriendos/disponibles/${idSala}/${fecha}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching available schedules for sala ${idSala} on ${fecha}:`, error);
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
    const response = await axiosInstance.post("/api/arriendos", arriendo);
    return response.data;
  } catch (error) {
    console.error("Error creating arriendo:", error);
    throw error;
  }
};

/**
 * Update an existing arriendo
 * @param {number} id - ID of the arriendo
 * @param {Object} arriendo - Updated arriendo data
 * @returns {Promise<Object>} Updated arriendo
 */
export const updateArriendo = async (id, arriendo) => {
  try {
    const response = await axiosInstance.put(`/api/arriendos/${id}`, arriendo);
    return response.data;
  } catch (error) {
    console.error(`Error updating arriendo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an arriendo by ID
 * @param {number} id - ID of the arriendo
 */
export const deleteArriendo = async (id) => {
  try {
    await axiosInstance.delete(`/api/arriendos/${id}`);
  } catch (error) {
    console.error(`Error deleting arriendo with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import arriendos
 * @param {Array} arriendos - List of arriendos to be created
 * @returns {Promise<Array>} List of created arriendos
 */
export const bulkCreateArriendos = async (arriendos) => {
  try {
    const response = await axiosInstance.post("/api/arriendos/importar", arriendos);
    return response.data;
  } catch (error) {
    console.error("Error creating multiple arriendos:", error);
    throw error;
  }
};
