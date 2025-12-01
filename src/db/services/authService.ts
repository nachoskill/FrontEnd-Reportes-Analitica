<<<<<<< HEAD
import { api, tokenManager } from "../config/api";
=======
import { api } from "../config/api";
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
import type { User } from "../models/user";

type LoginPayload = { email: string; password: string };

// El backend devuelve access_token, no token
type LoginResponse = { access_token: string; user?: User };

type RegisterPayload = { name: string; lastName: string; email: string; password: string };
type RegisterResponse = {
<<<<<<< HEAD
  token: User | undefined; access_token: string; user?: User
=======
  token: User | undefined; access_token: string; user?: User 
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
};

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);

<<<<<<< HEAD
    // Guardamos el token en MEMORIA (no en localStorage)
    if (data.access_token) {
      tokenManager.setToken(data.access_token);
=======
    // Guardamos el token correcto
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
    }

    return data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);

<<<<<<< HEAD
    // Guardamos el token en MEMORIA (no en localStorage)
    if (data.access_token) {
      tokenManager.setToken(data.access_token);
=======
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
    }

    return data;
  },

  logout: (): void => {
<<<<<<< HEAD
    // Limpiamos el token de la memoria
    tokenManager.clearToken();
=======
    localStorage.removeItem("token");
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
<<<<<<< HEAD

  // Método auxiliar para verificar si hay token
  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null;
  },
=======
>>>>>>> 51ae5e0228ddfbc6bc1f50aed23baf869c0c044d
};
