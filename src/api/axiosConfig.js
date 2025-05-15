import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // Todas las llamadas se harán a rutas que inician con /api
  headers: {
    "Content-Type": "application/json", // JSON para cuerpo de peticiones
  },
  withCredentials: true, // Muy importante para enviar cookies (como JSESSIONID)
});

export default axiosInstance;
