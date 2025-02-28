import axiosInstance from "./axiosConfig";

/**
 * Fetch all expenses
 * @returns {Promise<Array>} List of expenses
 */
export const fetchGastos = async () => {
  try {
    const response = await axiosInstance.get("/api/gastos");
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

/**
 * Fetch an expense by ID
 * @param {number} id - Expense ID
 * @returns {Promise<Object>} Expense details
 */
export const fetchGastoById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/gastos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching expense with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new expense
 * @param {Object} gasto - Expense data
 * @returns {Promise<Object>} Created expense
 */
export const createGasto = async (gasto) => {
  try {
    const response = await axiosInstance.post("/api/gastos", gasto);
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

/**
 * Update an existing expense
 * @param {number} id - Expense ID
 * @param {Object} gasto - Updated expense data
 * @returns {Promise<Object>} Updated expense
 */
export const updateGasto = async (id, gasto) => {
  try {
    const response = await axiosInstance.put(`/api/gastos/${id}`, gasto);
    return response.data;
  } catch (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an expense by ID
 * @param {number} id - Expense ID
 */
export const deleteGasto = async (id) => {
  try {
    await axiosInstance.delete(`/api/gastos/${id}`);
  } catch (error) {
    console.error(`Error deleting expense with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Bulk import expenses
 * @param {Array} gastos - List of expenses to create
 * @returns {Promise<Array>} List of created expenses
 */
export const bulkCreateGastos = async (gastos) => {
  try {
    const response = await axiosInstance.post("/api/gastos/importar", gastos);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating expenses:", error);
    throw error;
  }
};

/**
 * Search expenses by name and date range
 * @param {string} nombre - Expense name
 * @param {string} fechaInicio - Start date (YYYY-MM-DD)
 * @param {string} fechaFin - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} List of matching expenses
 */
export const searchGastosByNombreAndFecha = async (nombre, fechaInicio, fechaFin) => {
  try {
    const response = await axiosInstance.get("/api/gastos/buscar", {
      params: { nombre, fechaInicio, fechaFin },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching expenses for "${nombre}" between ${fechaInicio} and ${fechaFin}:`, error);
    throw error;
  }
};

/**
 * Get average expense amount by name and date range
 * @param {string} nombre - Expense name
 * @param {string} fechaInicio - Start date (YYYY-MM-DD)
 * @param {string} fechaFin - End date (YYYY-MM-DD)
 * @returns {Promise<number>} Average expense amount
 */
export const fetchAverageGastoByNombreAndFecha = async (nombre, fechaInicio, fechaFin) => {
  try {
    const response = await axiosInstance.get("/api/gastos/promedio", {
      params: { nombre, fechaInicio, fechaFin },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching average expense for "${nombre}" between ${fechaInicio} and ${fechaFin}:`, error);
    throw error;
  }
};

/**
 * Get total expenses for a date range
 * @param {string} fechaInicio - Start date (YYYY-MM-DD)
 * @param {string} fechaFin - End date (YYYY-MM-DD)
 * @returns {Promise<number>} Total expense amount
 */
export const fetchTotalGastosByFecha = async (fechaInicio, fechaFin) => {
  try {
    const response = await axiosInstance.get("/api/gastos/total", {
      params: { fechaInicio, fechaFin },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching total expenses between ${fechaInicio} and ${fechaFin}:`, error);
    throw error;
  }
};
