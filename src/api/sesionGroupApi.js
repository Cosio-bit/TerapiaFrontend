import axiosInstance from "./axiosConfig";

/**
 * Fetch all session groups
 * @returns {Promise<Array>} List of session groups
 */
export const fetchSesionGroups = async () => {
  try {
    const response = await axiosInstance.get("/sesion-groups");
    return response.data;
  } catch (error) {
    console.error("Error fetching session groups:", error);
    throw error;
  }
};

/**
 * Fetch a session group by ID
 * @param {number} id - Session group ID
 * @returns {Promise<Object>} Session group details
 */
export const fetchSesionGroupById = async (id) => {
  try {
    const response = await axiosInstance.get(`/sesion-groups/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching session group with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new session group
 * @param {Object} sesionGroup - Session group data
 * @returns {Promise<Object>} Created session group
 */
export const createSesionGroup = async (sesionGroup) => {
  try {
    console.log("📤 Sending data to backend:", JSON.stringify(sesionGroup, null, 2)); // 🐛 Debug request payload
    const response = await axiosInstance.post("/sesion-groups", sesionGroup);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating session group:", error.response?.data || error.message);
    throw error;
  }
};


/**
 * Update an existing session group
 * @param {number} id - Session group ID
 * @param {Object} sesionGroup - Updated session group data
 * @returns {Promise<Object>} Updated session group
 */
export const updateSesionGroup = async (id, sesionGroup) => {
  try {
    const response = await axiosInstance.put(`/sesion-groups/${id}`, sesionGroup);
    return response.data;
  } catch (error) {
    console.error(`Error updating session group with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a session group by ID
 * @param {number} id - Session group ID
 */
export const deleteSesionGroup = async (id) => {
  try {
    await axiosInstance.delete(`/sesion-groups/${id}`);
  } catch (error) {
    console.error(`Error deleting session group with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import session groups
 * @param {Array} sesionGroups - List of session groups to create
 * @returns {Promise<Array>} List of created session groups
 */
export const bulkCreateSesionGroups = async (sesionGroups) => {
  try {
    const response = await axiosInstance.post("/sesion-groups/importar", sesionGroups);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating session groups:", error);
    throw error;
  }
};



/**
 * Fetch total amount of sessions filtered by date range and state
 * @param {string} startDate - ISO datetime (e.g. '2025-01-01T00:00:00')
 * @param {string} endDate - ISO datetime (e.g. '2025-12-31T23:59:59')
 * @param {string} estado - Estado de la sesión
 * @returns {Promise<number>} Total amount
 */
export const fetchTotalSesionesByEstadoAndFecha = async (startDate, endDate, estado) => {
  try {
    const response = await axiosInstance.get("/business/gruposesiones/total", {
      params: { startDate, endDate, estado },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total sesiones by estado and fecha:", error);
    throw error;
  }
};

/**
 * Fetch session groups filtered by date range and state
 * @param {string} startDate - ISO datetime (e.g. '2025-01-01T00:00:00')
 * @param {string} endDate - ISO datetime (e.g. '2025-12-31T23:59:59')
 * @param {string} estado - Estado de la sesión
 * @returns {Promise<Array>} List of session groups
 */
export const fetchSesionesByEstadoAndFecha = async (startDate, endDate, estado) => {
  try {
    const response = await axiosInstance.get("/business/gruposesiones", {
      params: { startDate, endDate, estado },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching sesiones by estado and fecha:", error);
    throw error;
  }
  
};

/**
 * Fetch session groups by client ID
 * @param {number} idCliente - Client ID
 * @returns {Promise<Array>} List of session groups for the client
 */ 
export const fetchSesionGroupsByCliente = async (idCliente) => {
  try {
    const response = await axiosInstance.get(`/sesion-groups/cliente/${idCliente}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session groups by client:", error);
    throw error;
  }
}
