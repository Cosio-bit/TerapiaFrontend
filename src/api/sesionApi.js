import axiosInstance from "./axiosConfig";

export const getSesiones = async () => {
    const response = await axiosInstance.get("/api/sesiones");
    return response.data;
};

export const getSesionById = async (id) => {
    const response = await axiosInstance.get(`/api/sesiones/${id}`);
    return response.data;
};

export const createSesion = async (sesion) => {
    const response = await axiosInstance.post("/api/sesiones", sesion);
    return response.data;
};

export const updateSesion = async (id, sesion) => {
    const response = await axiosInstance.put(`/api/sesiones/${id}`, sesion);
    return response.data;
};

export const deleteSesion = async (id) => {
    await axiosInstance.delete(`/api/sesiones/${id}`);
};
