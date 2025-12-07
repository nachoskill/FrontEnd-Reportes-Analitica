import { useState, useEffect } from "react";
import { authService } from "../db/services/authService";
import type { User } from "../db/models/user";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Verifica si hay token y obtiene info del usuario al iniciar la app
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const me = await authService.me();
          setUser(me);
        } catch (error) {
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await authService.login({ email, password });

    if (resp.user && resp.access_token) {
      localStorage.setItem("token", resp.access_token); // asegura que el token se guarde
      setUser(resp.user);
    }

    return resp;
  };

  const register = async (payload: { name: string; lastName: string; email: string; password: string }) => {
  const resp = await authService.register(payload);
  if (resp.user && resp.access_token) {
    localStorage.setItem("token", resp.access_token);
    setUser(resp.user);
  }
  return resp;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return { user, loading, login, logout, setUser, register};
}
