import axiosInstance from "./axiosConfig";

export const getCompras = async () => {
    const response = await axiosInstance.get("/api/compras");
    return response.data;
};

export const getCompraById = async (id) => {
    const response = await axiosInstance.get(`/api/compras/${id}`);
    return response.data;
};

export const createCompra = async (compra) => {
    const response = await axiosInstance.post("/api/compras", compra);
    return response.data;
};

export const updateCompra = async (id, compra) => {
    const response = await axiosInstance.put(`/api/compras/${id}`, compra);
    return response.data;
};

export const deleteCompra = async (id) => {
    await axiosInstance.delete(`/api/compras/${id}`);
};
