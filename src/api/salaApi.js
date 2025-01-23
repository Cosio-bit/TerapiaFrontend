import axiosInstance from "./axiosConfig";

export const getSalas = async () => {
    const response = await axiosInstance.get("/api/salas");
    return response.data;
};

export const getSalaById = async (id) => {
    const response = await axiosInstance.get(`/api/salas/${id}`);
    return response.data;
};

export const createSala = async (sala) => {
    const response = await axiosInstance.post("/api/salas", sala);
    return response.data;
};

export const updateSala = async (id, sala) => {
    const response = await axiosInstance.put(`/api/salas/${id}`, sala);
    return response.data;
};

export const deleteSala = async (id) => {
    await axiosInstance.delete(`/api/salas/${id}`);
};
