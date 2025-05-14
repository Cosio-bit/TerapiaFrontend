import axiosInstance from "./axiosConfig";

// Utilidad para limpiar parámetros nulos o undefined
const cleanParams = (params) => {
  const clean = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) clean[key] = value;
  });
  return clean;
};

// === RESUMEN ===

export const fetchTotalIngresos = async (startDate, endDate) => {
  const params = cleanParams({ startDate, endDate });
  console.log("📊 [fetchTotalIngresos] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/resumen/ingresos", { params });
    console.log("✅ [fetchTotalIngresos] Respuesta:", response.data);
    return response.data?.total ?? response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchTotalIngresos] Error:", error);
    return 0;
  }
};

export const fetchTotalGastos = async (startDate, endDate) => {
  const params = cleanParams({ startDate, endDate });
  console.log("📊 [fetchTotalGastos] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/resumen/gastos", { params });
    console.log("✅ [fetchTotalGastos] Respuesta:", response.data);
    return response.data?.total ?? response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchTotalGastos] Error:", error);
    return 0;
  }
};

export const fetchGananciaNeta = async (startDate, endDate) => {
  const params = cleanParams({ startDate, endDate });
  console.log("📊 [fetchGananciaNeta] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/resumen/neto", { params });
    console.log("✅ [fetchGananciaNeta] Respuesta:", response.data);
    return response.data?.total ?? response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchGananciaNeta] Error:", error);
    return 0;
  }
};

// === ARRIENDOS ===

export const fetchTotalArriendosFiltrado = async (startDate, endDate, estado, idCliente, idProveedor) => {
  const params = cleanParams({ startDate, endDate, estado, idCliente, idProveedor });
  console.log("📦 [fetchTotalArriendosFiltrado] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/arriendos/total", { params });
    console.log("✅ [fetchTotalArriendosFiltrado] Respuesta:", response.data);
    return response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchTotalArriendosFiltrado] Error:", error);
    return 0;
  }
};

export const fetchArriendosFiltrado = async (startDate, endDate, estado, idCliente, idProveedor) => {
  const params = cleanParams({ startDate, endDate, estado, idCliente, idProveedor });
  console.log("📦 [fetchArriendosFiltrado] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/arriendos", { params });
    console.log("✅ [fetchArriendosFiltrado] Respuesta:", response.data);
    return response.data ?? [];
  } catch (error) {
    console.error("❌ [fetchArriendosFiltrado] Error:", error);
    return [];
  }
};

// === COMPRAS ===

export const fetchAmountBetweenDates = async (startDate, endDate) => {
  const params = cleanParams({ startDate, endDate });
  console.log("🛒 [fetchAmountBetweenDates] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/amount", { params });
    console.log("✅ [fetchAmountBetweenDates] Respuesta:", response.data);
    return response.data?.total ?? response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchAmountBetweenDates] Error:", error);
    return 0;
  }
};

export const fetchComprasBetweenDates = async (startDate, endDate) => {
  const params = cleanParams({ startDate, endDate });
  console.log("🛒 [fetchComprasBetweenDates] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/compras", { params });
    console.log("✅ [fetchComprasBetweenDates] Respuesta:", response.data);
    return response.data ?? [];
  } catch (error) {
    console.error("❌ [fetchComprasBetweenDates] Error:", error);
    return [];
  }
};

// === GASTOS ===

export const fetchGastosFiltrado = async (startDate, endDate, nombre, idProveedor) => {
  const params = cleanParams({ startDate, endDate, nombre, idProveedor });
  console.log("💸 [fetchGastosFiltrado] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/gastos", { params });
    console.log("✅ [fetchGastosFiltrado] Respuesta:", response.data);
    return response.data ?? [];
  } catch (error) {
    console.error("❌ [fetchGastosFiltrado] Error:", error);
    return [];
  }
};

export const fetchTotalGastosFiltrado = async (startDate, endDate, nombre, idProveedor) => {
  const params = cleanParams({ startDate, endDate, nombre, idProveedor });
  console.log("💸 [fetchTotalGastosFiltrado] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/gastos/total", { params });
    console.log("✅ [fetchTotalGastosFiltrado] Respuesta:", response.data);
    return response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchTotalGastosFiltrado] Error:", error);
    return 0;
  }
};

// === SESIONES INDIVIDUALES ===

export const fetchTotalSesionesIndividuales = async (startDate, endDate, estado, idProfesional) => {
  const params = cleanParams({ startDate, endDate, estado, idProfesional }); // ✅ limpia valores undefined o null
  console.log("🧑‍⚕️ [fetchTotalSesionesIndividuales] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/sesiones/total", { params });
    console.log("✅ [fetchTotalSesionesIndividuales] Respuesta:", response.data);
    return response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchTotalSesionesIndividuales] Error:", error);
    return 0;
  }
};



export const fetchSesionesIndividuales = async (startDate, endDate, estado, idProfesional) => {
  const params = cleanParams({ startDate, endDate, estado, idProfesional });
  console.log("🧑‍⚕️ [fetchSesionesIndividuales] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/sesiones", { params });
    console.log("✅ [fetchSesionesIndividuales] Respuesta:", response.data);
    return response.data ?? [];
  } catch (error) {
    console.error("❌ [fetchSesionesIndividuales] Error:", error);
    return [];
  }
};

// === SESIONES GRUPALES ===

export const fetchTotalSesionesByEstadoAndFecha = async (startDate, endDate, estado) => {
  const params = cleanParams({ startDate, endDate, estado });
  console.log("👥 [fetchTotalSesionesByEstadoAndFecha] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/gruposesiones/total", { params });
    console.log("✅ [fetchTotalSesionesByEstadoAndFecha] Respuesta:", response.data);
    return response.data ?? 0;
  } catch (error) {
    console.error("❌ [fetchTotalSesionesByEstadoAndFecha] Error:", error);
    return 0;
  }
};

export const fetchSesionesByEstadoAndFecha = async (startDate, endDate, estado) => {
  const params = cleanParams({ startDate, endDate, estado });
  console.log("👥 [fetchSesionesByEstadoAndFecha] Enviando:", params);
  try {
    const response = await axiosInstance.get("/business/gruposesiones", { params });
    console.log("✅ [fetchSesionesByEstadoAndFecha] Respuesta:", response.data);
    return response.data ?? [];
  } catch (error) {
    console.error("❌ [fetchSesionesByEstadoAndFecha] Error:", error);
    return [];
  }
};
