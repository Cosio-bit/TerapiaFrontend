import axios from "axios";

// Leer las variables de entorno desde Vite
const terapiaServer = import.meta.env.VITE_TERAPIA_SERVER;
const terapiaPort = import.meta.env.VITE_TERAPIA_PORT;

// Mostrar las variables en consola para verificar que se están cargando correctamente
console.log("Servidor de Terapia:", terapiaServer);
console.log("Puerto de Terapia:", terapiaPort);

// Crear instancia de Axios con la base URL dinámica
const axiosInstance = axios.create({
    baseURL: `http://${terapiaServer}:${terapiaPort}`,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
