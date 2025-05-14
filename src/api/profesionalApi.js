import axiosInstance from "./axiosConfig";

/**
 * Fetch all professionals
 * @returns {Promise<Array>} List of professionals
 */
export const getAllProfesionales = async () => {
  try {
    const response = await axiosInstance.get("/profesionales");

    console.log("Raw response from API (Profesionales):", response.data); // Debugging log

    // Ensure response is an array before mapping
    if (!Array.isArray(response.data)) {
      console.error("Expected an array but got:", response.data);
      return [];
    }

    return response.data.map(profesional => ({
      ...profesional,
      usuario: profesional.usuario || { id_usuario: "", nombre: "Usuario no asignado" }, // Prevent undefined
    }));
  } catch (error) {
    console.error("Error fetching professionals:", error);
    return [];
  }
};



/**
 * Fetch a professional by ID
 */
export const fetchProfesionalById = async (id) => {
  try {
    const response = await axiosInstance.get(`/profesionales/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching professional with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new professional
 */
export const createProfesional = async (profesional) => {
  try {
    console.log("Creating Profesional with:", profesional); // Debugging log

    const response = await axiosInstance.post("/profesionales", {
      ...profesional,
      usuario: { id_usuario: profesional.id_usuario }, // Ensure correct structure
    });

    console.log("API Response:", response.data); // Check if usuario is returned
    return response.data;
  } catch (error) {
    console.error("Error creating professional:", error);
    throw error;
  }
};


/**
 * Update an existing professional
 */
export const updateProfesional = async (id, profesional) => {
  try {
    console.log(`Updating Profesional ID ${id} with:`, profesional); // Debugging log

    const response = await axiosInstance.put(`/profesionales/${id}`, {
      ...profesional,
      usuario: { id_usuario: profesional.id_usuario }, // Ensure usuario is structured properly
    });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating professional with ID ${id}:`, error);
    throw error;
  }
};


/**
 * Delete a professional by ID
 */
export const deleteProfesional = async (id) => {
  try {
    await axiosInstance.delete(`/profesionales/${id}`);
  } catch (error) {
    console.error(`Error deleting professional with ID ${id}:`, error);
    throw error;
  }
};
