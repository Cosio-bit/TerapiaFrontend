import axiosInstance from "./axiosConfig";

export const getProductos = async () => {
    const response = await axiosInstance.get("/api/productos");
    return response.data;
};

export const getProductoById = async (id) => {
    const response = await axiosInstance.get(`/api/productos/${id}`);
    return response.data;
};

export const createProducto = async (producto) => {
    const response = await axiosInstance.post("/api/productos", producto);
    return response.data;
};

export const updateProducto = async (id, producto) => {
    const response = await axiosInstance.put(`/api/productos/${id}`, producto);
    return response.data;
};

export const deleteProducto = async (id) => {
    await axiosInstance.delete(`/api/productos/${id}`);
};
