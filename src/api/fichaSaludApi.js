import axiosInstance from "./axiosConfig";

export const getFichasSalud = async () => {
    const response = await axiosInstance.get("/api/fichasalud");
    return response.data;
};

export const getFichaSaludById = async (id) => {
    const response = await axiosInstance.get(`/api/fichasalud/${id}`);
    return response.data;
};

export const createFichaSalud = async (fichaSalud) => {
    const response = await axiosInstance.post("/api/fichasalud", fichaSalud);
    return response.data;
};

export const updateFichaSalud = async (id, fichaSalud) => {
    const response = await axiosInstance.put(`/api/fichasalud/${id}`, fichaSalud);
    return response.data;
};

export const deleteFichaSalud = async (id) => {
    await axiosInstance.delete(`/api/fichasalud/${id}`);
};
