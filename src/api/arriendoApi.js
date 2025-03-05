import axiosInstance from "./axiosConfig";

/**
 * Fetch all arriendos
 * @returns {Promise<Array>} List of arriendos
 */
export const fetchArriendos = async () => {
  try {
    const response = await axiosInstance.get("/api/arriendos");
    return response.data;
  } catch (error) {
    console.error("Error fetching arriendos:", error);
    throw error;
  }
};

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
 * @param {number} id - Arriendo ID
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
 * Create a new arriendo
 * @param {Object} arriendo - Arriendo data
 * @returns {Promise<Object>} Created arriendo
 */
export const createArriendo = async (arriendo) => {
  try {
    console.log("📤 Sending data to backend:", JSON.stringify(arriendo, null, 2)); // 🐛 Debug request payload
    const response = await axiosInstance.post("/api/arriendos", arriendo);
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
    const response = await axiosInstance.put(`/api/arriendos/${id}`, arriendo);
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
    await axiosInstance.delete(`/api/arriendos/${id}`);
  } catch (error) {
    console.error(`Error deleting arriendo with ID ${id}:`, error);
    throw error;
  }
};
