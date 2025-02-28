import axiosInstance from "./axiosConfig";

/**
 * Fetch all users
 * @returns {Promise<Array>} List of users
 */
export const getAllUsuarios = async () => {
  try {
    const response = await axiosInstance.get("/api/usuarios");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Fetch a user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} User details
 */
export const fetchUsuarioById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new user
 * @param {Object} usuario - User data
 * @returns {Promise<Object>} Created user
 */
export const createUsuario = async (usuario) => {
  try {
    const response = await axiosInstance.post("/api/usuarios", usuario);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

/**
 * Update an existing user
 * @param {number} id - User ID
 * @param {Object} usuario - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUsuario = async (id, usuario) => {
  try {
    const response = await axiosInstance.put(`/api/usuarios/${id}`, usuario);
    return response.data;
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a user by ID
 * @param {number} id - User ID
 */
export const deleteUsuario = async (id) => {
  try {
    await axiosInstance.delete(`/api/usuarios/${id}`);
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import users
 * @param {Array} usuarios - List of users to create
 * @returns {Promise<Array>} List of created users
 */
export const bulkCreateUsuarios = async (usuarios) => {
  try {
    const response = await axiosInstance.post("/api/usuarios/importar", usuarios);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating users:", error);
    throw error;
  }
};
