import axiosInstance from "./axiosConfig";
/**
 * Realiza login con nombre de usuario y contraseña.
 * @param {string} nombre - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Promise<string>} Mensaje de éxito o error del backend
 */
export const login = async (nombre, password) => {
  try {
    const response = await axiosInstance.post("/auth/login", { nombre, password });
    return response.data; // "Login successful"
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cierra la sesión actual.
 * @returns {Promise<string>} Mensaje de éxito del backend
 */
export const logout = async () => {
  try {
    const response = await axiosInstance.post("/auth/logout");
    return response.data; // "Logged out successfully"
  } catch (error) {
    console.error("Logout error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Consulta la sesión actual para obtener el rol del usuario autenticado.
 * @returns {Promise<{ role: string | null }>} Objeto con rol o null si no autenticado
 */
export const getSession = async () => {
  try {
    const response = await axiosInstance.get("/auth/session");
    const roleRaw = response.data.role;

    // Opcional: normalizar el rol recibido para evitar inconsistencias
    const role = roleRaw ? roleRaw.toLowerCase() : null;

    return { ...response.data, role };
  } catch (error) {
    console.error("Session check error:", error.response?.data || error.message);
    return { role: null };
  }
};

