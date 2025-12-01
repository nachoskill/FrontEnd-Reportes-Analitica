// src/db/config/api.ts
import axios from "axios";

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
export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:3350/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use((config) => {
  const token = tokenManager.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
