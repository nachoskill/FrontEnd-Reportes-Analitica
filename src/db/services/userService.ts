import { api } from "../config/api";
import type { User } from "../models/user";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  getUserById: async (id: string): Promise<User> => {
    const { data } = await api.get<User>(`/users/${id}`);
    return data;
  },

  createUser: async (userData: Partial<User>): Promise<User> => {
    const { data } = await api.post<User>("/users", userData);
    return data;
  },

  // añade más métodos según necesites (update, delete...)
};