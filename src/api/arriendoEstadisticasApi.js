import axiosInstance from "./axiosConfig";

/**
 * Fetch total arriendos filtered
 */
export const fetchTotalArriendosFiltrado = async (startDate, endDate, estado, idCliente, idProveedor) => {
  try {
    const response = await axiosInstance.get("/business/arriendos/total", {
      params: { startDate, endDate, estado, idCliente, idProveedor },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching total arriendos:", error);
    throw error;
  }
};

/**
 * Fetch arriendos filtered
 */
export const fetchArriendosFiltrado = async (startDate, endDate, estado, idCliente, idProveedor) => {
  try {
    const response = await axiosInstance.get("/business/arriendos", {
      params: { startDate, endDate, estado, idCliente, idProveedor },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching arriendos:", error);
    throw error;
  }
};
