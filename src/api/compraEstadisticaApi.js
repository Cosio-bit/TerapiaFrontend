import axiosInstance from "./axiosConfig";
/**
 * Fetch total amount of purchases between dates
 * @param {string} startDate - ISO datetime (e.g. '2025-01-01T00:00:00')
 * @param {string} endDate - ISO datetime (e.g. '2025-12-31T23:59:59')
 * @returns {Promise<number>} Total amount
 */
export const fetchAmountBetweenDates = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get("/api/business/amount", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching total amount:", error);
      throw error;
    }
  };
  
  /**
   * Fetch purchases between dates
   * @param {string} startDate - ISO datetime (e.g. '2025-01-01T00:00:00')
   * @param {string} endDate - ISO datetime (e.g. '2025-12-31T23:59:59')
   * @returns {Promise<Array>} List of purchases
   */
  export const fetchComprasBetweenDates = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get("/api/business/compras", {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching purchases between dates:", error);
      throw error;
    }
  };
  