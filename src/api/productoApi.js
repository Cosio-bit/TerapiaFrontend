import axiosInstance from "./axiosConfig";

/**
 * Fetch all products
 * @returns {Promise<Array>} List of products
 */
export const getAllProductos = async () => {
  try {
    const response = await axiosInstance.get("/api/productos");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Fetch a product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object>} Product details
 */
export const fetchProductoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/productos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new product
 * @param {Object} producto - Product data
 * @returns {Promise<Object>} Created product
 */
export const createProducto = async (producto) => {
  try {
    const response = await axiosInstance.post("/api/productos", producto);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param {number} id - Product ID
 * @param {Object} producto - Updated product data
 * @returns {Promise<Object>} Updated product
 */
export const updateProducto = async (id, producto) => {
  try {
    const response = await axiosInstance.put(`/api/productos/${id}`, producto);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a product by ID
 * @param {number} id - Product ID
 */
export const deleteProducto = async (id) => {
  try {
    await axiosInstance.delete(`/api/productos/${id}`);
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import products
 * @param {Array} productos - List of products to create
 * @returns {Promise<Array>} List of created products
 */
export const bulkCreateProductos = async (productos) => {
  try {
    const response = await axiosInstance.post("/api/productos/importar", productos);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating products:", error);
    throw error;
  }
};
