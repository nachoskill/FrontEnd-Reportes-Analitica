// src/db/config/api.ts
import axios from "axios";

<<<<<<< HEAD
// ============================================================
// ALMACENAMIENTO DE TOKEN EN MEMORIA (Recomendación de Auth)
// ============================================================
let authToken: string | null = null;

export const tokenManager = {
  setToken: (token: string) => {
    authToken = token;
  },
  getToken: (): string | null => {
    return authToken;
  },
  clearToken: () => {
    authToken = null;
  },
};

// ============================================================
// API PARA EL BACKEND (Puerto 3350)
// El backend actúa como proxy hacia los microservicios
// ============================================================
=======
// Crear instancia de axios para comunicarse con el backend de NestJS
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:3350/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use((config) => {
<<<<<<< HEAD
  const token = tokenManager.getToken();
=======
  const token = localStorage.getItem("token");
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
<<<<<<< HEAD
});
=======
});
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
