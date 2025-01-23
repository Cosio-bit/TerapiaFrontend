import axiosInstance from "./axiosConfig";

export const getProfesionales = async () => {
    const response = await axiosInstance.get("/api/profesionales");
    return response.data;
};

export const getProfesionalById = async (id) => {
    const response = await axiosInstance.get(`/api/profesionales/${id}`);
    return response.data;
};

export const createProfesional = async (profesional) => {
    const response = await axiosInstance.post("/api/profesionales", profesional);
    return response.data;
};

export const updateProfesional = async (id, profesional) => {
    const response = await axiosInstance.put(`/api/profesionales/${id}`, profesional);
    return response.data;
};

export const deleteProfesional = async (id) => {
    await axiosInstance.delete(`/api/profesionales/${id}`);
};
