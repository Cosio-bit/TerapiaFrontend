import axiosInstance from "./axiosConfig";

export const getTerapias = async () => {
    const response = await axiosInstance.get("/api/terapias");
    return response.data;
};

export const getTerapiaById = async (id) => {
    const response = await axiosInstance.get(`/api/terapias/${id}`);
    return response.data;
};

export const createTerapia = async (terapia) => {
    const response = await axiosInstance.post("/api/terapias", terapia);
    return response.data;
};

export const updateTerapia = async (id, terapia) => {
    const response = await axiosInstance.put(`/api/terapias/${id}`, terapia);
    return response.data;
};

export const deleteTerapia = async (id) => {
    await axiosInstance.delete(`/api/terapias/${id}`);
};
