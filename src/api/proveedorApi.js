import axiosInstance from "./axiosConfig";

/**
 * Fetch all suppliers
 * @returns {Promise<Array>} List of suppliers
 */
export const getAllProveedores = async () => {
  try {
    const response = await axiosInstance.get("/api/proveedores");
    return response.data;
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

/**
 * Fetch a supplier by ID
 * @param {number} id - Supplier ID
 * @returns {Promise<Object>} Supplier details
 */
export const fetchProveedorById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/proveedores/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching supplier with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new supplier
 * @param {Object} proveedor - Supplier data
 * @returns {Promise<Object>} Created supplier
 */
export const createProveedor = async (proveedor) => {
  try {
    const response = await axiosInstance.post("/api/proveedores", {
      ...proveedor,
      usuario: { id_usuario: proveedor.id_usuario }, // Ensure nested user object
    });
    return response.data;
  } catch (error) {
    console.error("Error creating supplier:", error);
    throw error;
  }
};

/**
 * Update an existing supplier
 * @param {number} id - Supplier ID
 * @param {Object} proveedor - Updated supplier data
 * @returns {Promise<Object>} Updated supplier
 */
export const updateProveedor = async (id, proveedor) => {
  try {
    const response = await axiosInstance.put(`/api/proveedores/${id}`, {
      ...proveedor,
      usuario: { id_usuario: proveedor.id_usuario },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating supplier with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a supplier by ID
 * @param {number} id - Supplier ID
 */
export const deleteProveedor = async (id) => {
  try {
    await axiosInstance.delete(`/api/proveedores/${id}`);
  } catch (error) {
    console.error(`Error deleting supplier with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import suppliers
 * @param {Array} proveedores - List of suppliers to create
 * @returns {Promise<Array>} List of created suppliers
 */
export const bulkCreateProveedores = async (proveedores) => {
  try {
    const response = await axiosInstance.post("/api/proveedores/importar", proveedores);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating suppliers:", error);
    throw error;
  }
};
