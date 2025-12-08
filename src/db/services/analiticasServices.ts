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

// --- INTERFACES PARA DESCUBRIMIENTO ---
export interface InteraccionPorDia {
  dia_semana: number; // 1=Domingo, 2=Lunes, ..., 7=Sábado
  nombre_dia: string;
  semana_actual: {
    clicks: number;
    busquedas: number;
    total: number;
  };
  semana_anterior: {
    clicks: number;
    busquedas: number;
    total: number;
  };
}

export interface ProductoDescubrimiento {
  producto: string;
  total: number;
  clicks: number;
  busquedas: number;
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
  },

  // 7. Descubrimiento: Interacciones por día
  obtenerInteraccionesPorDia: async (): Promise<InteraccionPorDia[]> => {
    try {
      const { data } = await api.get<InteraccionPorDia[]>("/analiticas/descubrimiento/interacciones-por-dia");
      return data;
    } catch (error) {
      console.error("Error obteniendo interacciones por día:", error);
      return [];
    }
  },

  // 8. Descubrimiento: Top 5 productos
  obtenerTop5Productos: async (): Promise<ProductoDescubrimiento[]> => {
    try {
      const { data } = await api.get<ProductoDescubrimiento[]>("/analiticas/descubrimiento/top-productos");
      return data;
    } catch (error) {
      console.error("Error obteniendo top productos:", error);
      return [];
    }
  },

  // 9. Actividad Usuarios: Conteo de roles
  obtenerRolesCount: async (): Promise<{ clientes: number; vendedores: number }> => {
    try {
      const { data } = await api.get<{ clientes: number; vendedores: number }>("/analiticas/actividad-usuarios/roles-count");
      return data;
    } catch (error) {
      console.error("Error obteniendo conteo de roles:", error);
      return { clientes: 0, vendedores: 0 };
    }
  }
};