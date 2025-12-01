import { api } from "../config/api";
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

    // Guardamos el token correcto
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    return data;
  },

  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", payload);

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
    }

    return data;
  },

  logout: (): void => {
    localStorage.removeItem("token");
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<User>("/auth/me");
    return data;
  },
};
