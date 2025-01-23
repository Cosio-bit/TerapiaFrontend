import axiosInstance from "./axiosConfig";

export const getClientes = async () => {
    const response = await axiosInstance.get("/api/clientes");
    return response.data;
};

export const getClienteById = async (id) => {
    const response = await axiosInstance.get(`/api/clientes/${id}`);
    return response.data;
};

export const createCliente = async (cliente) => {
    const response = await axiosInstance.post("/api/clientes", cliente);
    return response.data;
};

export const updateCliente = async (id, cliente) => {
    const response = await axiosInstance.put(`/api/clientes/${id}`, cliente);
    return response.data;
};

export const deleteCliente = async (id) => {
    await axiosInstance.delete(`/api/clientes/${id}`);
};
