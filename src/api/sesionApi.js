import axiosInstance from "./axiosConfig";

/**
 * Fetch all sessions
 * @returns {Promise<Array>} List of sessions
 */
export const getAllSesiones = async () => {
  try {
    const response = await axiosInstance.get("/api/sesiones");
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
};

/**
 * Fetch a session by ID
 * @param {number} id - Session ID
 * @returns {Promise<Object>} Session details
 */
export const fetchSesionById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/sesiones/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching session with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new session
 * @param {Object} sesion - Session data
 * @returns {Promise<Object>} Created session
 */
export const createSesion = async (sesion) => {
  try {
    const response = await axiosInstance.post("/api/sesiones", sesion);
    return response.data;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

/**
 * Update an existing session
 * @param {number} id - Session ID
 * @param {Object} sesion - Updated session data
 * @returns {Promise<Object>} Updated session
 */
export const updateSesion = async (id, sesion) => {
  try {
    const response = await axiosInstance.put(`/api/sesiones/${id}`, sesion);
    return response.data;
  } catch (error) {
    console.error(`Error updating session with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a session by ID
 * @param {number} id - Session ID
 */
export const deleteSesion = async (id) => {
  try {
    await axiosInstance.delete(`/api/sesiones/${id}`);
  } catch (error) {
    console.error(`Error deleting session with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch all professionals to associate with a session
 * @returns {Promise<Array>} List of professionals
 */
export const getAllProfesionales = async () => {
  try {
    const response = await axiosInstance.get("/api/profesionales");
    return response.data;
  } catch (error) {
    console.error("Error fetching professionals:", error);
    throw error;
  }
};
