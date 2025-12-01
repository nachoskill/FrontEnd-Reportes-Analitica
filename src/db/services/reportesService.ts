// src/db/services/reportesService.ts
import { api } from "../config/api";

export interface VentaBackend {
  _id: string;
  nombre: string;
  precio: number;
  categoria: string;
  stock: number;
  veces_vendido: number;
  veces_buscado: number;
  fecha_creacion: string;
  tienda?: string;
}

export interface Tienda {
  id_tienda: number;
  nombre_tienda: string;
}

export interface TiendasResponse {
  tiendas: Tienda[];
  tienda_default: Tienda;
}

export interface ProductosResponse {
  productos: VentaBackend[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  id_tienda: number;
  nombre_tienda: string;
}

export interface FiltrosReporte {
  nombre?: string;
  categoria?: string;
  minPrecio?: number;
  maxPrecio?: number;
  fechaInicio?: string;
  fechaFin?: string;
  ordenarPor?: string;
  orden?: 'asc' | 'desc';
  id_tienda?: number;
}

export const reportesService = {
  // Obtener tiendas del vendedor autenticado
  obtenerTiendasVendedor: async (): Promise<TiendasResponse> => {
    const { data } = await api.get<TiendasResponse>("/reportes/vendedor/tiendas");
    return data;
  },

  // Obtener todos los productos SIN filtros - usa /reportes/productos
  obtenerProductos: async (): Promise<ProductosResponse> => {
    const { data } = await api.get<ProductosResponse>("/reportes/productos");
    return data;
  },

  // Obtener productos CON filtros - usa /reportes/productos/filtrados
  obtenerProductosFiltrados: async (filtros: FiltrosReporte): Promise<VentaBackend[]> => {
    const filtrosLimpios: any = {};

    if (filtros.nombre) filtrosLimpios.nombre = filtros.nombre;
    if (filtros.categoria) filtrosLimpios.categoria = filtros.categoria;
    if (filtros.minPrecio) filtrosLimpios.minPrecio = filtros.minPrecio;
    if (filtros.maxPrecio) filtrosLimpios.maxPrecio = filtros.maxPrecio;
    if (filtros.fechaInicio) filtrosLimpios.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) filtrosLimpios.fechaFin = filtros.fechaFin;
    if (filtros.ordenarPor) filtrosLimpios.ordenarPor = filtros.ordenarPor;
    if (filtros.orden) filtrosLimpios.orden = filtros.orden;
    if (filtros.id_tienda) filtrosLimpios.id_tienda = filtros.id_tienda;

    console.log("Enviando filtros al backend:", filtrosLimpios);

    const { data } = await api.get<VentaBackend[]>("/reportes/productos/filtrados", {
      params: filtrosLimpios,
    });
    return data;
  },

  // Generar PDF con filtros - usa /reportes/productos/pdf
  generarPDF: async (filtros: FiltrosReporte): Promise<Blob> => {
    const filtrosLimpios: any = {};

    if (filtros.nombre) filtrosLimpios.nombre = filtros.nombre;
    if (filtros.categoria) filtrosLimpios.categoria = filtros.categoria;
    if (filtros.minPrecio) filtrosLimpios.minPrecio = filtros.minPrecio;
    if (filtros.maxPrecio) filtrosLimpios.maxPrecio = filtros.maxPrecio;
    if (filtros.fechaInicio) filtrosLimpios.fechaInicio = filtros.fechaInicio;
    if (filtros.fechaFin) filtrosLimpios.fechaFin = filtros.fechaFin;
    if (filtros.ordenarPor) filtrosLimpios.ordenarPor = filtros.ordenarPor;
    if (filtros.orden) filtrosLimpios.orden = filtros.orden;
    if (filtros.id_tienda) filtrosLimpios.id_tienda = filtros.id_tienda;

    const response = await api.get("/reportes/productos/pdf", {
      params: filtrosLimpios,
      responseType: 'blob'
    });
    return response.data;
  }
};