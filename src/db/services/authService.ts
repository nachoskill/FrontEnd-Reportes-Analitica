import { api, tokenManager } from "../config/api";
import type { User } from "../models/user";

type LoginPayload = { email: string; password: string };

// El backend devuelve access_token, no token
type LoginResponse = { access_token: string; user?: User };

type RegisterPayload = { name: string; lastName: string; email: string; password: string };
type RegisterResponse = {
  token: User | undefined; access_token: string; user?: User
};

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", payload);

    // Guardamos el token en MEMORIA (no en localStorage)
    if (data.access_token) {
      tokenManager.setToken(data.access_token);
    }

    return data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);

    // Guardamos el token en MEMORIA (no en localStorage)
    if (data.access_token) {
      tokenManager.setToken(data.access_token);
    }

    return data;
  },

  logout: (): void => {
    // Limpiamos el token de la memoria
    tokenManager.clearToken();
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },

  // Método auxiliar para verificar si hay token
  isAuthenticated: (): boolean => {
    return tokenManager.getToken() !== null;
  },
};
