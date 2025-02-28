import axiosInstance from "./axiosConfig";

/**
 * Fetch all purchased products
 * @returns {Promise<Array>} List of purchased products
 */
export const getAllProductosComprados = async () => {
  try {
    const response = await axiosInstance.get("/api/productos-comprados");
    return response.data;
  } catch (error) {
    console.error("Error fetching purchased products:", error);
    throw error;
  }
};

/**
 * Fetch a purchased product by ID
 * @param {number} id - Purchased product ID
 * @returns {Promise<Object>} Purchased product details
 */
export const fetchProductoCompradoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/productos-comprados/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching purchased product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new purchased product
 * @param {Object} productoComprado - Purchased product data
 * @returns {Promise<Object>} Created purchased product
 */
export const createProductoComprado = async (productoComprado) => {
  try {
    const response = await axiosInstance.post("/api/productos-comprados", productoComprado);
    return response.data;
  } catch (error) {
    console.error("Error creating purchased product:", error);
    throw error;
  }
};

/**
 * Update an existing purchased product
 * @param {number} id - Purchased product ID
 * @param {Object} productoComprado - Updated purchased product data
 * @returns {Promise<Object>} Updated purchased product
 */
export const updateProductoComprado = async (id, productoComprado) => {
  try {
    const response = await axiosInstance.put(`/api/productos-comprados/${id}`, productoComprado);
    return response.data;
  } catch (error) {
    console.error(`Error updating purchased product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a purchased product by ID
 * @param {number} id - Purchased product ID
 */
export const deleteProductoComprado = async (id) => {
  try {
    await axiosInstance.delete(`/api/productos-comprados/${id}`);
  } catch (error) {
    console.error(`Error deleting purchased product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import purchased products
 * @param {Array} productosComprados - List of purchased products to create
 * @returns {Promise<Array>} List of created purchased products
 */
export const bulkCreateProductosComprados = async (productosComprados) => {
  try {
    const response = await axiosInstance.post("/api/productos-comprados/importar", productosComprados);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating purchased products:", error);
    throw error;
  }
};
