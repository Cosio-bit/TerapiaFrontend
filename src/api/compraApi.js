import axiosInstance from "./axiosConfig";

/**
 * Fetch all purchases
 * @returns {Promise<Array>} List of purchases
 */
export const getAllCompras = async () => {
  try {
    const response = await axiosInstance.get("/api/compras");
    return response.data;
  } catch (error) {
    console.error("Error fetching purchases:", error);
    throw error;
  }
};

/**
 * Fetch a purchase by ID
 * @param {number} id - Purchase ID
 * @returns {Promise<Object>} Purchase details
 */
export const fetchCompraById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/compras/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching purchase with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new purchase
 * @param {Object} compra - Purchase data
 * @param {boolean} usarSaldo - Whether to use client balance
 * @returns {Promise<Object>} Created purchase
 */
export const createCompra = async (compra, usarSaldo = false) => {
  try {
    const response = await axiosInstance.post("/api/compras", {
      compra,
      usarSaldo,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
};

/**
 * Update an existing purchase
 * @param {number} id - Purchase ID
 * @param {Object} compra - Updated purchase data
 * @returns {Promise<Object>} Updated purchase
 */
export const updateCompra = async (id, compra) => {
  try {
    const response = await axiosInstance.put(`/api/compras/${id}`, compra);
    return response.data;
  } catch (error) {
    console.error(`Error updating purchase with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a purchase by ID
 * @param {number} id - Purchase ID
 */
export const deleteCompra = async (id) => {
  try {
    await axiosInstance.delete(`/api/compras/${id}`);
  } catch (error) {
    console.error(`Error deleting purchase with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import purchases
 * @param {Array} compras - List of purchases to create
 * @returns {Promise<Array>} List of created purchases
 */
export const bulkCreateCompras = async (compras) => {
  try {
    const response = await axiosInstance.post("/api/compras/importar", compras);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating purchases:", error);
    throw error;
  }
};
