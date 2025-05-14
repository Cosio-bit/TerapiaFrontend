import axiosInstance from "./axiosConfig"; // adjust path if needed

/**
 * Login with role name and password
 * @param {string} nombre - Role name (like "admin", "viewer", etc.)
 * @param {string} password - Password
 * @returns {Promise<string>} Backend login response (string)
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
 * Logout the current session
 * @returns {Promise<string>} Backend logout response (string)
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
 * Get current session info
 * @returns {Promise<{ role: string | null }>} Current session data
 */
export const getSession = async () => {
  try {
    const response = await axiosInstance.get("/auth/session");
    return response.data;  // { role: "admin" } or { role: null }
  } catch (error) {
    console.error("Session check error:", error.response?.data || error.message);
    return { role: null };  // Si la sesión falla, devuelve null
  }
};
