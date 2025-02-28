import axiosInstance from "./axiosConfig";

/**
 * Fetch all service variants
 * @returns {Promise<Array>} List of service variants
 */
export const fetchVariantes = async () => {
  try {
    const response = await axiosInstance.get("/api/variantes");
    return response.data;
  } catch (error) {
    console.error("Error fetching service variants:", error);
    throw error;
  }
};

/**
 * Fetch variants by therapy ID
 * @param {number} idTerapia - Therapy ID
 * @returns {Promise<Array>} List of variants for the therapy
 */
export const fetchVariantesByTerapiaId = async (idTerapia) => {
  try {
    const response = await axiosInstance.get(`/api/variantes/terapia/${idTerapia}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching variants for therapy with ID ${idTerapia}:`, error);
    throw error;
  }
};

/**
 * Fetch a variant by ID
 * @param {number} id - Variant ID
 * @returns {Promise<Object>} Variant details
 */
export const fetchVarianteById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/variantes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching variant with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new service variant
 * @param {Object} varianteServicio - Service variant data
 * @returns {Promise<Object>} Created service variant
 */
export const createVariante = async (varianteServicio) => {
  try {
    const response = await axiosInstance.post("/api/variantes", varianteServicio);
    return response.data;
  } catch (error) {
    console.error("Error creating service variant:", error);
    throw error;
  }
};

/**
 * Update an existing service variant
 * @param {number} id - Variant ID
 * @param {Object} varianteServicio - Updated variant data
 * @returns {Promise<Object>} Updated variant
 */
export const updateVariante = async (id, varianteServicio) => {
  try {
    const response = await axiosInstance.put(`/api/variantes/${id}`, varianteServicio);
    return response.data;
  } catch (error) {
    console.error(`Error updating variant with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a service variant by ID
 * @param {number} id - Variant ID
 */
export const deleteVariante = async (id) => {
  try {
    await axiosInstance.delete(`/api/variantes/${id}`);
  } catch (error) {
    console.error(`Error deleting variant with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import service variants
 * @param {Array} variantes - List of service variants to create
 * @returns {Promise<Array>} List of created service variants
 */
export const bulkCreateVariantes = async (variantes) => {
  try {
    const response = await axiosInstance.post("/api/variantes/importar", variantes);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating service variants:", error);
    throw error;
  }
};
