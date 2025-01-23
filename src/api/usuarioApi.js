import axiosInstance from "./axiosConfig";

export const getUsuarios = async () => {
    const response = await axiosInstance.get("/api/usuarios");
    return response.data;
};

export const getUsuarioById = async (id) => {
    const response = await axiosInstance.get(`/api/usuarios/${id}`);
    return response.data;
};

export const createUsuario = async (usuario) => {
    const response = await axiosInstance.post("/api/usuarios", usuario);
    return response.data;
};

export const updateUsuario = async (id, usuario) => {
    const response = await axiosInstance.put(`/api/usuarios/${id}`, usuario);
    return response.data;
};

export const deleteUsuario = async (id) => {
    await axiosInstance.delete(`/api/usuarios/${id}`);
};
