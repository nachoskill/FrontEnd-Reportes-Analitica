import { useState, useCallback } from "react";
import { api } from "../db/config/api";

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const call = useCallback(
    async <T,>(request: Promise<T>): Promise<T | null> => {
      setLoading(true);
      setError(null);
      try {
        const res = await request;
        setLoading(false);
        return res as unknown as T;
      } catch (err) {
        setError(err);
        setLoading(false);
        return null;
      }
    },
    []
  );

  const get = useCallback(
    async <T,>(url: string) => call(api.get<T>(url).then((r) => r.data)),
    [call]
  );

  const post = useCallback(
    async <T, D = any>(url: string, data?: D) => call(api.post<T>(url, data).then((r) => r.data)),
    [call]
  );

  return { loading, error, get, post, call };
}