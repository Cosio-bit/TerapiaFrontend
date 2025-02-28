import axiosInstance from "./axiosConfig";

/**
 * Fetch all therapies
 * @returns {Promise<Array>} List of therapies
 */
export const getAllTerapias = async () => {
  try {
    const response = await axiosInstance.get("/api/terapias");
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching therapies:", error);
    throw error;
  }
};

/**
 * Fetch a therapy by ID
 * @param {number} id - Therapy ID
 * @returns {Promise<Object>} Therapy details
 */
export const fetchTerapiaById = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/terapias/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Error fetching therapy with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new therapy with variants
 * @param {Object} terapia - Therapy data
 * @returns {Promise<Object>} Created therapy
 */
export const createTerapia = async (terapia) => {
  try {
    const formattedTerapia = formatTerapiaPayload(terapia);

    console.log("🛠️ Sending Create Terapia Payload:", JSON.stringify(formattedTerapia, null, 2));

    const response = await axiosInstance.post("/api/terapias", formattedTerapia);
    return response.data;
  } catch (error) {
    console.error("❌ Error creating therapy:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Update an existing therapy
 * @param {number} id - Therapy ID
 * @param {Object} terapia - Updated therapy data
 * @returns {Promise<Object>} Updated therapy
 */
export const updateTerapia = async (id, terapia) => {
  try {
    const formattedTerapia = formatTerapiaPayload(terapia);

    console.log(`🛠️ Sending Update Terapia (ID: ${id}) Payload:`, JSON.stringify(formattedTerapia, null, 2));

    const response = await axiosInstance.put(`/api/terapias/${id}`, formattedTerapia);
    return response.data;
  } catch (error) {
    console.error(`❌ Error updating therapy with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Delete a therapy by ID
 * @param {number} id - Therapy ID
 */
export const deleteTerapia = async (id) => {
  try {
    await axiosInstance.delete(`/api/terapias/${id}`);
  } catch (error) {
    console.error(`❌ Error deleting therapy with ID ${id}:`, error.response?.data || error.message);
    throw error;
  }
};

/**
 * Format Terapia Payload Before Sending to Backend
 * @param {Object} terapia - Raw therapy data
 * @returns {Object} Formatted therapy data
 */
const formatTerapiaPayload = (terapia) => {
  return {
    id_terapia: terapia.id_terapia || undefined, // Ensure it's only sent when updating
    nombre: terapia.nombre || "Terapia sin nombre",
    descripcion: terapia.descripcion || "Sin descripción",
    presencial: formatPresencial(terapia.presencial),

    // ✅ Ensure profesionales are full objects, not just IDs
    profesionales: Array.isArray(terapia.profesionales)
      ? terapia.profesionales.map((prof) => (
          typeof prof === "object" ? prof : { id_profesional: prof }
        )) // ✅ Ensure object format
      : [],

    // ✅ Ensure variantes are formatted correctly
    variantes: terapia.variantes?.length > 0
      ? terapia.variantes.map((v) => ({
          id_variante: v.id_variante > 0 ? v.id_variante : null, 
          nombre: v.nombre || "Variante sin nombre",
          precio: Number(v.precio),
          duracion: Number(v.duracion),
          cantidad: Number(v.cantidad),
        }))
      : [],
  };
};

/**
 * Ensure Presencial is always formatted correctly
 * @param {string|boolean} value - Presencial value
 * @returns {string} "Sí" or "No"
 */
const formatPresencial = (value) => {
  if (typeof value === "boolean") {
    return value ? "Sí" : "No";
  }
  return value === "Sí" || value === "No" ? value : "No";
};
