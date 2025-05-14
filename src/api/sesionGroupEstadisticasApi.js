
import axiosInstance from "./axiosConfig";


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
  