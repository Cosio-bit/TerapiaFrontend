import axiosInstance from "./axiosConfig";

/**
 * Fetch all rooms
 * @returns {Promise<Array>} List of rooms
 */
export const getAllSalas = async () => {
  try {
    const response = await axiosInstance.get("/api/salas");
    return response.data;
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw error;
  }
};

/**
 * Fetch a room by ID
 * @param {number} id - Room ID
 * @returns {Promise<Object>} Room details
 */
export const fetchSalaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/salas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching room with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new room
 * @param {Object} sala - Room data
 * @returns {Promise<Object>} Created room
 */
export const createSala = async (sala) => {
  try {
    const response = await axiosInstance.post("/api/salas", sala);
    return response.data;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

/**
 * Update an existing room
 * @param {number} id - Room ID
 * @param {Object} sala - Updated room data
 * @returns {Promise<Object>} Updated room
 */
export const updateSala = async (id, sala) => {
  try {
    const response = await axiosInstance.put(`/api/salas/${id}`, sala);
    return response.data;
  } catch (error) {
    console.error(`Error updating room with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a room by ID
 * @param {number} id - Room ID
 */
export const deleteSala = async (id) => {
  try {
    await axiosInstance.delete(`/api/salas/${id}`);
  } catch (error) {
    console.error(`Error deleting room with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import rooms
 * @param {Array} salas - List of rooms to create
 * @returns {Promise<Array>} List of created rooms
 */
export const bulkCreateSalas = async (salas) => {
  try {
    const response = await axiosInstance.post("/api/salas/importar", salas);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating rooms:", error);
    throw error;
  }
};
