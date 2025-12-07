// src/db/services/analiticasService.ts
import { api } from "../config/api";

// --- INTERFACES ---

// Para el Gráfico de envios por Region
export interface DistribucionRegional {
  name: string;  // Ej: "Valparaíso"
  value: number; // Ej: 5
}

// [NUEVO] Para el Gráfico de Barras (Tendencia Semestral)
export interface TendenciaSemestral {
  mes: string;    // Ej: "Ene", "Feb"
  ventas: number; // El cálculo de precio * cantidad
  meta: number;   // La meta simulada
}

// [NUEVO] Interfaz para la respuesta de Ingresos
export interface KpiIngresos {
  ingresos: number;
  porcentaje: number;
}

// [NUEVO] Interfaz para Mejor Región
export interface KpiMejorRegion {
  mejorRegion: string;
  porcentajeRegion: number;
}

export const analiticasService = {
  
  // 1. Obtener Distribución Regional
  obtenerDistribucionRegional: async (): Promise<DistribucionRegional[]> => {
    const { data } = await api.get<DistribucionRegional[]>("/analiticas/tendencia/regiones");
    return data;
  },

  // 2. Obtener Tendencia Semestral
  obtenerTendenciaSemestral: async (): Promise<TendenciaSemestral[]> => {
    const { data } = await api.get<TendenciaSemestral[]>("/analiticas/venta_productos");
    return data;
  },

  // 3. [NUEVO] Obtener KPI Ingresos
  // Endpoint: GET /api/analiticas/estadisticas/ingresos
  obtenerKpiIngresos: async (): Promise<KpiIngresos> => {
    const { data } = await api.get<KpiIngresos>("/analiticas/estadisticas/ingresos");
    return data;
  },

  // 4. [NUEVO] Obtener KPI Mejor Región
  // Endpoint: GET /api/analiticas/estadisticas/Mejor_Region
  obtenerKpiMejorRegion: async (): Promise<KpiMejorRegion> => {
    const { data } = await api.get<KpiMejorRegion>("/analiticas/estadisticas/Mejor_Region");
    return data;
  }

  // Aquí seguiremos agregando los KPIs restantes...
};