import axiosInstance from "./axiosConfig";

/**
 * Fetch all salas
 * @returns {Promise<Array>} List of salas
 */
export const fetchSalas = async () => {
  try {
    const response = await axiosInstance.get("/salas");
    return response.data;
  } catch (error) {
    console.error("Error fetching salas:", error);
    throw error;
  }
};

export const getAllSalas = async () => {
  try {
    const response = await axiosInstance.get("/salas");
    return response.data;
  } catch (error) {
    console.error("Error fetching salas:", error);
    throw error;
  }
};

/**
 * Fetch a sala by ID
 * @param {number} id - Sala ID
 * @returns {Promise<Object>} Sala details
 */
export const fetchSalaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/salas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sala with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new sala
 * @param {Object} sala - Sala data
 * @returns {Promise<Object>} Created sala
 */
export const createSala = async (sala) => {
  try {
    console.log("📤 Sending data to backend:", JSON.stringify(sala, null, 2)); // 🐛 Debug request payload
    const response = await axiosInstance.post("/salas", sala);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating sala:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing sala
 * @param {number} id - Sala ID
 * @param {Object} sala - Updated sala data
 * @returns {Promise<Object>} Updated sala
 */
export const updateSala = async (id, sala) => {
  try {
    const response = await axiosInstance.put(`/salas/${id}`, sala);
    return response.data;
  } catch (error) {
    console.error(`Error updating sala with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a sala by ID
 * @param {number} id - Sala ID
 */
export const deleteSala = async (id) => {
  try {
    await axiosInstance.delete(`/salas/${id}`);
  } catch (error) {
    console.error(`Error deleting sala with ID ${id}:`, error);
    throw error;
  }
};
