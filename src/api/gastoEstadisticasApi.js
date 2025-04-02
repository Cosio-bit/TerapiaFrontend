import axiosInstance from "./axiosConfig";
export const fetchGastosFiltrado = async (startDate, endDate, nombre, idProveedor) => {
    try {
      const params = {
        startDate,
        endDate,
        nombre: nombre || "",
        idProveedor: idProveedor || "",
      };
  
      console.log("📤 Enviando parámetros gastos:", params);
  
      const response = await axiosInstance.get("/api/business/gastos", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching expenses:", error);
      throw error;
    }
  };
  
  export const fetchTotalGastosFiltrado = async (startDate, endDate, nombre, idProveedor) => {
    try {
      const params = {
        startDate,
        endDate,
        nombre: nombre || "",
        idProveedor: idProveedor || "",
      };
  
      console.log("📤 Enviando parámetros total gastos:", params);
  
      const response = await axiosInstance.get("/api/business/gastos/total", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching total expenses:", error);
      throw error;
    }
  };
  