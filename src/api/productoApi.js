import axiosInstance from "./axiosConfig";

/**
 * Fetch all productos
 * @returns {Promise<Array>} List of productos
 */
export const fetchProductos = async () => {
  try {
    const response = await axiosInstance.get("/api/productos");
    return response.data;
  } catch (error) {
    console.error("Error fetching productos:", error);
    throw error;
  }
};

export const getAllProductos = async () => {
  try {
    const response = await axiosInstance.get("/api/productos");
    return response.data;
  } catch (error) {
    console.error("Error fetching productos:", error);
    throw error;
  }
};

/**
 * Fetch a producto by ID
 * @param {number} id - Producto ID
 * @returns {Promise<Object>} Producto details
 */
export const fetchProductoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching producto with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new producto
 * @param {Object} producto - Producto data
 * @returns {Promise<Object>} Created producto
 */
export const createProducto = async (producto) => {
  try {
    console.log("📤 Sending data to backend:", JSON.stringify(producto, null, 2)); // 🐛 Debug request payload
    const response = await axiosInstance.post("/api/productos", producto);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating producto:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing producto
 * @param {number} id - Producto ID
 * @param {Object} producto - Updated producto data
 * @returns {Promise<Object>} Updated producto
 */
export const updateProducto = async (id, producto) => {
  try {
    const response = await axiosInstance.put(`/api/productos/${id}`, producto);
    return response.data;
  } catch (error) {
    console.error(`Error updating producto with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a producto by ID
 * @param {number} id - Producto ID
 */
export const deleteProducto = async (id) => {
  try {
    await axiosInstance.delete(`/api/productos/${id}`);
  } catch (error) {
    console.error(`Error deleting producto with ID ${id}:`, error);
    throw error;
  }
};
