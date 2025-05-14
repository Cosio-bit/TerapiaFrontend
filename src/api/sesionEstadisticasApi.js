import axiosInstance from "./axiosConfig";

export const fetchTotalSesionesIndividuales = async (startDate, endDate, estado, idProfesional) => {
    try {
      const response = await axiosInstance.get("/business/sesiones/total", {
        params: { startDate, endDate, estado, idProfesional },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching total individual sessions:", error);
      throw error;
    }
  };
  

  export const fetchSesionesIndividuales = async (startDate, endDate, estado, idProfesional) => {
    try {
      const response = await axiosInstance.get("/business/sesiones", {
        params: { startDate, endDate, estado, idProfesional },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching individual sessions:", error);
      throw error;
    }
  };
  