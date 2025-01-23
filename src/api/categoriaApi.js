import axiosInstance from "./axiosConfig";

export const getCategorias = async () => {
    const response = await axiosInstance.get("/api/categorias");
    return response.data;
};

export const getCategoriaById = async (id) => {
    const response = await axiosInstance.get(`/api/categorias/${id}`);
    return response.data;
};

export const createCategoria = async (categoria) => {
    const response = await axiosInstance.post("/api/categorias", categoria);
    return response.data;
};

export const updateCategoria = async (id, categoria) => {
    const response = await axiosInstance.put(`/api/categorias/${id}`, categoria);
    return response.data;
};

export const deleteCategoria = async (id) => {
    await axiosInstance.delete(`/api/categorias/${id}`);
};
