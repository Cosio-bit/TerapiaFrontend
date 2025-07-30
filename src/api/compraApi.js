import axiosInstance from "./axiosConfig";

/**
 * Fetch all purchases
 * @returns {Promise<Array>} List of purchases
 */
export const fetchCompras = async () => {
  try {
    const response = await axiosInstance.get("/compras");
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
    const response = await axiosInstance.get(`/compras/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching purchase with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new purchase
 * @param {Object} compra - Purchase data
 * @returns {Promise<Object>} Created purchase
 */
export const createCompra = async (compra) => {
  try {
    console.log("📤 Sending purchase data to backend:", JSON.stringify(compra, null, 2)); // 🐛 Debug request payload
    const response = await axiosInstance.post("/compras", compra);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating purchase:", error.response?.data || error.message);
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
    console.log(`🛠 Actualizando compra con ID: ${id}`);
    const response = await axiosInstance.put(`/compras/${id}`, compra);
    return response.data;
  } catch (error) {
    console.error(`❌ Error actualizando compra con ID ${id}:`, error);
    throw error;
  }
};


/**
 * Delete a purchase by ID
 * @param {number} id - Purchase ID
 */
export const deleteCompra = async (id) => {
  try {
    await axiosInstance.delete(`/compras/${id}`);
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
    const response = await axiosInstance.post("/compras/importar", compras);
    return response.data;
  } catch (error) {
    console.error("Error bulk creating purchases:", error);
    throw error;
  }
};

export const fetchComprasByCliente = async (idCliente) => {
  try {
    const response = await axiosInstance.get(`/compras/cliente/${idCliente}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching compras por cliente:", error);
    throw error;
  }
};

