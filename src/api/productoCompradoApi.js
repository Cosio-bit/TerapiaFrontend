import axiosInstance from "./axiosConfig";

export const getProductosComprados = async () => {
    const response = await axiosInstance.get("/api/productoscomprados");
    return response.data;
};

export const getProductoCompradoById = async (id) => {
    const response = await axiosInstance.get(`/api/productoscomprados/${id}`);
    return response.data;
};

export const createProductoComprado = async (productoComprado) => {
    const response = await axiosInstance.post("/api/productoscomprados", productoComprado);
    return response.data;
};

export const updateProductoComprado = async (id, productoComprado) => {
    const response = await axiosInstance.put(`/api/productoscomprados/${id}`, productoComprado);
    return response.data;
};

export const deleteProductoComprado = async (id) => {
    await axiosInstance.delete(`/api/productoscomprados/${id}`);
};
