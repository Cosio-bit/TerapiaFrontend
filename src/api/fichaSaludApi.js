import axiosInstance from "./axiosConfig";

/**
 * Fetch all health records
 * @returns {Promise<Array>} List of health records
 */
export const getAllFichasSalud = async () => {
  try {
    const response = await axiosInstance.get("/fichas-salud");
    return response.data;
  } catch (error) {
    console.error("Error fetching health records:", error);
    throw error;
  }
};

/**
 * Fetch a health record by ID
 * @param {number} id - Health record ID
 * @returns {Promise<Object>} Health record details
 */
export const fetchFichaSaludById = async (id) => {
  try {
    const response = await axiosInstance.get(`/fichas-salud/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching health record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new health record
 * @param {Object} fichaSalud - Health record data
 * @returns {Promise<Object>} Created health record
 */
export const createFichaSalud = async (fichaSalud) => {
  try {
    const response = await axiosInstance.post("/fichas-salud", fichaSalud);
    return response.data;
  } catch (error) {
    console.error("Error creating health record:", error);
    throw error;
  }
};

/**
 * Update an existing health record
 * @param {number} id - Health record ID
 * @param {Object} fichaSalud - Updated health record data
 * @returns {Promise<Object>} Updated health record
 */
export const updateFichaSalud = async (id, fichaSalud) => {
  try {
    const response = await axiosInstance.put(`/fichas-salud/${id}`, fichaSalud);
    return response.data;
  } catch (error) {
    console.error(`Error updating health record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a health record by ID
 * @param {number} id - Health record ID
 */
export const deleteFichaSalud = async (id) => {
  try {
    await axiosInstance.delete(`/fichas-salud/${id}`);
  } catch (error) {
    console.error(`Error deleting health record with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import health records
 * @param {Array} fichasSalud - List of health records to create
 * @returns {Promise<Array>} List of created health records
 */
export const bulkCreateFichasSalud = async (fichasSalud) => {
  try {
    const response = await axiosInstance.post("/fichas-salud/importar", fichasSalud);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating health records:", error);
    throw error;
  }
};
