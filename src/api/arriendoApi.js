import axiosInstance from "./axiosConfig";

export const getArriendos = async () => {
    const response = await axiosInstance.get("/api/arriendos");
    return response.data;
};

export const getArriendoById = async (id) => {
    const response = await axiosInstance.get(`/api/arriendos/${id}`);
    return response.data;
};

export const createArriendo = async (arriendo) => {
    const response = await axiosInstance.post("/api/arriendos", arriendo);
    return response.data;
};

export const updateArriendo = async (id, arriendo) => {
    const response = await axiosInstance.put(`/api/arriendos/${id}`, arriendo);
    return response.data;
};

export const deleteArriendo = async (id) => {
    await axiosInstance.delete(`/api/arriendos/${id}`);
};
