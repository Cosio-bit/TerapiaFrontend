import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api", // 👈 SOLO /api
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Necesario para manejar sesión (cookies)
});

export default axiosInstance;
