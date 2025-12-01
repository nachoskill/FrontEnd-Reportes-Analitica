// src/db/services/analiticasServices.ts

import { api } from "../config/api";

// --- INTERFACES ---

// [CORREGIDO] Agregamos [key: string]: any; para satisfacer a Recharts
export interface EnviosPorRegion {
  name: string;
  value: number;
  [key: string]: any; // <--- ESTA LÍNEA ES LA SOLUCIÓN
}

export interface IngresosMensuales {
  mes: string;
  ventas: number;
  meta: number;
  [key: string]: any; // <--- Recomendado agregarlo aquí también
}

export interface KpiIngresos {
  ingresos: number;
  porcentaje: number;
}

export interface KpiMejorRegion {
  mejorRegion: string;
  porcentajeRegion: number;
}

export interface EstadoCarrito {
  name: string;
  value: number;
  [key: string]: any; // <--- Recomendado agregarlo aquí también
}

export interface ProductoTop {
  name: string;
  value: number;
  [key: string]: any; // <--- Recomendado agregarlo aquí también
}

export interface TendenciaProductos {
  completado: ProductoTop[];
  abandonado: ProductoTop[];
  cancelado: ProductoTop[];
}

export const analiticasService = {
  // ... (El resto del código de las funciones se queda exactamente igual)
  
  // 1. Envios por Region
  obtenerEnviosPorRegion: async (): Promise<EnviosPorRegion[]> => {
    const { data } = await api.get<EnviosPorRegion[]>("/analiticas/tendencia/regiones");
    return data;
  },

  // 2. Ingresos Mensuales
  obtenerIngresosMensuales: async (): Promise<IngresosMensuales[]> => {
    const { data } = await api.get<IngresosMensuales[]>("/analiticas/venta_productos");
    return data;
  },

  // 3. KPI Ingresos
  obtenerKpiIngresos: async (): Promise<KpiIngresos> => {
    const { data } = await api.get<KpiIngresos>("/analiticas/estadisticas/ingresos");
    return data;
  },

  // 4. KPI Mejor Región
  obtenerKpiMejorRegion: async (): Promise<KpiMejorRegion> => {
    const { data } = await api.get<KpiMejorRegion>("/analiticas/estadisticas/Mejor_Region");
    return data;
  },

  // 5. Estado de Carritos
  obtenerEstadoCarritos: async (): Promise<EstadoCarrito[]> => {
    const { data } = await api.get<EstadoCarrito[]>("/analiticas/estadisticas/estado_carrito");
    return data;
  },

  // 6. Tendencia de Productos
  obtenerTendenciaProductos: async (): Promise<TendenciaProductos> => {
    try {
        const { data } = await api.get<TendenciaProductos>("/analiticas/estadisticas/productos_tendencia");
        return data;
    } catch (error) {
        console.error("Error obteniendo productos:", error);
        return { completado: [], abandonado: [], cancelado: [] };
    }
  }
};