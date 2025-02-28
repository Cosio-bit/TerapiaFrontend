import axiosInstance from "./axiosConfig";

/**
 * Fetch all categories
 * @returns {Promise<Array>} List of categories
 */
export const getAllCategorias = async () => {
  try {
    const response = await axiosInstance.get("/api/categorias");
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

/**
 * Fetch a category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Category details
 */
export const fetchCategoriaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/categorias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new category
 * @param {Object} categoria - Category data
 * @returns {Promise<Object>} Created category
 */
export const createCategoria = async (categoria) => {
  try {
    const response = await axiosInstance.post("/api/categorias", categoria);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

/**
 * Update an existing category
 * @param {number} id - Category ID
 * @param {Object} categoria - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategoria = async (id, categoria) => {
  try {
    const response = await axiosInstance.put(`/api/categorias/${id}`, categoria);
    return response.data;
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a category by ID
 * @param {number} id - Category ID
 */
export const deleteCategoria = async (id) => {
  try {
    await axiosInstance.delete(`/api/categorias/${id}`);
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import categories
 * @param {Array} categorias - List of categories to create
 * @returns {Promise<Array>} List of created categories
 */
export const bulkCreateCategorias = async (categorias) => {
  try {
    const response = await axiosInstance.post("/api/categorias/importar", categorias);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating categories:", error);
    throw error;
  }
};

/**
 * Fetch therapies for a specific category
 * @param {number} id - Category ID
 * @returns {Promise<Array>} List of therapies in the category
 */
export const fetchTerapiasByCategoria = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/categorias/${id}/terapias`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching therapies for category ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch rooms for a specific category
 * @param {number} id - Category ID
 * @returns {Promise<Array>} List of rooms in the category
 */
export const fetchSalasByCategoria = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/categorias/${id}/salas`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching rooms for category ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch products for a specific category
 * @param {number} id - Category ID
 * @returns {Promise<Array>} List of products in the category
 */
export const fetchProductosByCategoria = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/categorias/${id}/productos`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ID ${id}:`, error);
    throw error;
  }
};
