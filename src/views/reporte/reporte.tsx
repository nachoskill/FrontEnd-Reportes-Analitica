import React, { useState, useEffect, useCallback, useRef } from "react";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { reportesService, VentaBackend, FiltrosReporte, Tienda } from "../../db/services/reportesService";

// --- NUEVOS IMPORTS PARA LA PANTALLA DE ACCESO DENEGADO ---
import { Box, Typography, Button, CircularProgress } from "@mui/material";

// --- ESTILOS MEJORADOS (Tu código CSS existente) ---
const PRIMARY_COLOR = "#0d9488";
const BACKGROUND_COLOR = "#f8f9fa";

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: BACKGROUND_COLOR,
    padding: '2rem',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#333'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    padding: '1.5rem',
    marginBottom: '2rem',
    border: '1px solid #e5e7eb'
  },
  filterRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
    alignItems: 'flex-end'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.375rem',
    flex: 1,
    minWidth: '200px'
  },
  inputGroupSmall: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.375rem',
    width: '120px'
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#4b5563',
    marginLeft: '2px'
  },
  input: {
    padding: '0.625rem',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '0.95rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.2s',
    backgroundColor: '#f9fafb'
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '0.75rem',
    flexWrap: 'wrap' as const,
    marginTop: '1rem',
    borderTop: '1px solid #f3f4f6',
    paddingTop: '1.5rem'
  },
  button: {
    padding: '0.6rem 1.2rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
  },
  btnPrimary: {
    backgroundColor: PRIMARY_COLOR,
    color: 'white',
    boxShadow: '0 2px 4px rgba(13, 148, 136, 0.2)'
  },
  btnOutline: {
    backgroundColor: 'white',
    border: `1px solid ${PRIMARY_COLOR}`,
    color: PRIMARY_COLOR
  },
  tableContainer: {
    overflowX: 'auto' as const,
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    backgroundColor: 'white'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '0.9rem',
    textAlign: 'left' as const
  },
  th: {
    backgroundColor: '#f8fafc',
    color: '#64748b',
    padding: '1rem',
    fontWeight: 600,
    borderBottom: '1px solid #e2e8f0',
    textTransform: 'uppercase' as const,
    fontSize: '0.75rem',
    letterSpacing: '0.05em'
  },
  td: {
    padding: '1rem',
    borderBottom: '1px solid #f1f5f9',
    color: '#334155'
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center'
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    padding: '3rem',
    color: PRIMARY_COLOR,
    fontWeight: 600
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem'
  },
  snackbar: {
    position: 'fixed' as const,
    bottom: '24px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#1f2937',
    color: 'white',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    zIndex: 50,
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  }
};

// --- ICONOS ---
const Icons = {
  Inventory: <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>,
  Filter: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
  Check: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
  Download: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
  Refresh: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>,
  Store: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h18v18H3zM3 9h18M9 21V9"></path></svg>,
  Search: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
};

export const ReporteVentas: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Estados
  const [ventasFiltradas, setVentasFiltradas] = useState<VentaBackend[]>([]);
  const [todasCategorias, setTodasCategorias] = useState<string[]>([]);
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ show: boolean, msg: string, type: 'success' | 'error' }>({ show: false, msg: '', type: 'success' });

  // Paginación y Filtros
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [totalRows, setTotalRows] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [filtros, setFiltros] = useState<FiltrosReporte>({
    fechaInicio: "", fechaFin: "", categoria: "", nombre: "",
    id_tienda: undefined, minPrecio: undefined, maxPrecio: undefined,
    ordenarPor: "precio", orden: "asc"
  });

  const paginationRef = useRef(pagination);
  const initialLoadDone = useRef(false);

  useEffect(() => {
    paginationRef.current = pagination;
  }, [pagination]);

  const tienePermiso = user && (user.roles?.includes("gerente") || user.roles?.includes("admin"));

  // 1. CARGA DE DATOS (Blindada)
  const cargarDatos = useCallback(async (pageOverride?: number, filtrosOverride?: FiltrosReporte) => {
    try {
      setLoading(true);
      const currentPageFromRef = paginationRef.current.page;
      let rawPage;

      if (pageOverride !== undefined) {
        rawPage = pageOverride;
        paginationRef.current = { ...paginationRef.current, page: pageOverride - 1 };
      } else {
        rawPage = currentPageFromRef + 1;
      }

      if (rawPage < 1) rawPage = 1;

      const limit = paginationRef.current.pageSize;
      const filtrosToUse = filtrosOverride || filtros;

      console.log(`📡 Fetching | rawPage: ${rawPage}`);

      const hayFiltrosActivos = Boolean(
        filtrosToUse.nombre || filtrosToUse.categoria || filtrosToUse.id_tienda ||
        filtrosToUse.minPrecio || filtrosToUse.maxPrecio ||
        filtrosToUse.fechaInicio || filtrosToUse.fechaFin ||
        (filtrosToUse.ordenarPor && filtrosToUse.ordenarPor !== 'precio') ||
        (filtrosToUse.orden && filtrosToUse.orden !== 'asc')
      );

      let data;
      if (hayFiltrosActivos) {
        data = await reportesService.obtenerProductosFiltrados(filtrosToUse, rawPage, limit);
      } else {
        data = await reportesService.obtenerProductos(rawPage, limit);
      }

      setVentasFiltradas(data.productos);
      setTotalRows(data.total);
      setTotalPages(data.totalPages);

      if (!hayFiltrosActivos && todasCategorias.length === 0 && data.productos.length > 0) {
        const categoriasUnicas = Array.from(new Set(data.productos.map((v: any) => v.categoria).filter(Boolean)));
        setTodasCategorias(categoriasUnicas);
      }

    } catch (error) {
      console.error("❌ Error:", error);
      showToast("Error al cargar datos", "error");
    } finally {
      setLoading(false);
    }
  }, [filtros, todasCategorias]);

  useEffect(() => {
    if (tienePermiso && !initialLoadDone.current) {
      const fetchTiendas = async () => {
        try {
          const data = await reportesService.obtenerTiendasVendedor();
          setTiendas(data.tiendas);
        } catch (e) { console.error(e); }
      };
      fetchTiendas();
      cargarDatos();
      initialLoadDone.current = true;
    }
  }, [tienePermiso, cargarDatos]);

  const handlePageSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const paginaSeleccionada = Number(e.target.value);
    const newPagination = { ...pagination, page: paginaSeleccionada - 1 };
    setPagination(newPagination);
    paginationRef.current = newPagination;
    cargarDatos(paginaSeleccionada);
  };

  const aplicarFiltrosBackend = () => {
    const newPagination = { ...pagination, page: 0 };
    setPagination(newPagination);
    paginationRef.current = newPagination;
    cargarDatos(1, filtros);
    showToast("Filtros aplicados", "success");
  };

  const limpiarFiltros = () => {
    const filtrosLimpios: FiltrosReporte = {
      fechaInicio: "", fechaFin: "", categoria: "", nombre: "",
      id_tienda: undefined, minPrecio: undefined, maxPrecio: undefined,
      ordenarPor: "precio", orden: "asc"
    };
    setFiltros(filtrosLimpios);
    const newPagination = { ...pagination, page: 0 };
    setPagination(newPagination);
    paginationRef.current = newPagination;
    cargarDatos(1, filtrosLimpios);
  };

  const handleFiltroChange = (campo: keyof typeof filtros, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const generarPDF = async () => {
    setLoading(true);
    try {
      const pdfBlob = await reportesService.generarPDF(filtros);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url; a.download = "reporte_ventas.pdf"; a.click();
      window.URL.revokeObjectURL(url);
      showToast("PDF Generado", "success");
    } catch { showToast("Error al generar PDF", "error"); }
    finally { setLoading(false); }
  };

  const exportarCSV = () => {
    const csv = Papa.unparse(ventasFiltradas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reporte.csv"; a.click();
    window.URL.revokeObjectURL(url);
  };

  const showToast = (msg: string, type: 'success' | 'error') => {
    setSnackbar({ show: true, msg, type });
    setTimeout(() => setSnackbar({ show: false, msg: '', type: 'success' }), 3000);
  };

  const formatMoney = (val: number) => {
    return `$${Math.round(Number(val)).toLocaleString('es-CL')}`;
  };

  // --- RENDER GUARDS MODIFICADOS ---

  // 1. Cargando usuario (Opcional, si user es null/undefined inicial)
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: BACKGROUND_COLOR }}>
        <CircularProgress sx={{ color: PRIMARY_COLOR }} />
      </Box>
    );
  }

  // 2. AQUI ESTÁ TU NUEVA PANTALLA DE ACCESO DENEGADO
  if (!tienePermiso) {
    return (
      <Box sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", px: 2, bgcolor: BACKGROUND_COLOR }}>
        <Box sx={{ maxWidth: 400, width: "100%", textAlign: "center", p: 4, borderRadius: 3, boxShadow: 3, bgcolor: "background.paper" }}>
          <Typography variant="h4" color="error" sx={{ fontWeight: "bold", mb: 2 }}> Acceso Denegado </Typography>

          <Typography variant="body1" sx={{ mb: 3 }}>
            No tienes permisos para acceder a esta sección.
            Solo los usuarios con roles de <strong>Gerente</strong> o <strong>Administrador</strong> pueden continuar.
          </Typography>

          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mt: 1, bgcolor: PRIMARY_COLOR, '&:hover': { bgcolor: '#0b7a70' } }}
          >
            Volver al Inicio
          </Button>
        </Box>
      </Box>
    );
  }

  // --- RENDER PRINCIPAL (Si tiene permisos) ---
  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>

        {/* ENCABEZADO */}
        <div style={styles.header}>
          <div style={{ color: PRIMARY_COLOR }}>{Icons.Inventory}</div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>Reporte de Productos</h1>
            <p style={{ margin: 0, color: '#666' }}>Gestión de inventario y ventas</p>
          </div>
        </div>

        {/* TARJETA DE FILTROS ORGANIZADA */}
        <div style={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: PRIMARY_COLOR }}>
            {Icons.Filter}
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Filtros de Búsqueda</span>
          </div>

          {/* FILA 1: Búsqueda Principal + Contexto */}
          <div style={styles.filterRow}>
            {/* Nombre (Más ancho) */}
            <div style={{ ...styles.inputGroup, flex: 2 }}>
              <label style={styles.label}>Nombre del Producto</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={{ ...styles.input, paddingRight: '2rem' }}
                  placeholder="Ej. iPhone 15..."
                  value={filtros.nombre}
                  onChange={e => handleFiltroChange("nombre", e.target.value)}
                />
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
                  {Icons.Search}
                </div>
              </div>
            </div>

            {/* Categoría */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Categoría</label>
              <select
                style={styles.input}
                value={filtros.categoria}
                onChange={e => handleFiltroChange("categoria", e.target.value)}
              >
                <option value="">Todas</option>
                {todasCategorias.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Tienda */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Tienda</label>
              <select
                style={styles.input}
                value={filtros.id_tienda || ""}
                onChange={e => handleFiltroChange("id_tienda", e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">Todas</option>
                {tiendas.map(t => <option key={t.id_tienda} value={t.id_tienda}>{t.nombre_tienda}</option>)}
              </select>
            </div>
          </div>

          {/* FILA 2: Precios y Ordenamiento */}
          <div style={styles.filterRow}>
            {/* Grupo de Precios (Juntos) */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
              <div style={styles.inputGroupSmall}>
                <label style={styles.label}>Min $</label>
                <input type="number" style={styles.input} placeholder="0" value={filtros.minPrecio || ""} onChange={e => handleFiltroChange("minPrecio", e.target.value)} />
              </div>
              <div style={{ color: '#9ca3af', paddingBottom: '0.6rem' }}>—</div>
              <div style={styles.inputGroupSmall}>
                <label style={styles.label}>Max $</label>
                <input type="number" style={styles.input} placeholder="Sin límite" value={filtros.maxPrecio || ""} onChange={e => handleFiltroChange("maxPrecio", e.target.value)} />
              </div>
            </div>

            {/* Ordenar Por */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Ordenar por</label>
              <select style={styles.input} value={filtros.ordenarPor} onChange={e => handleFiltroChange("ordenarPor", e.target.value)}>
                <option value="precio">Precio</option>
                <option value="nombre">Nombre</option>
                <option value="stock">Stock</option>
                <option value="veces_vendido">Vendidos</option>
              </select>
            </div>

            {/* Orden (Asc/Desc) */}
            <div style={{ ...styles.inputGroupSmall, width: '140px' }}>
              <label style={styles.label}>Orden</label>
              <select style={styles.input} value={filtros.orden} onChange={e => handleFiltroChange("orden", e.target.value)}>
                <option value="asc">Ascendente</option>
                <option value="desc">Descendente</option>
              </select>
            </div>
          </div>

          {/* BOTONES */}
          <div style={styles.buttonGroup}>
            <button style={{ ...styles.button, ...styles.btnOutline, borderColor: '#f97316', color: '#f97316' }} onClick={limpiarFiltros}>
              {Icons.Refresh} Limpiar Filtros
            </button>
            <button style={{ ...styles.button, ...styles.btnOutline }} onClick={exportarCSV} disabled={loading}>
              {Icons.Download} Exportar CSV
            </button>
            <button style={{ ...styles.button, ...styles.btnOutline }} onClick={generarPDF} disabled={loading}>
              {Icons.Download} Exportar PDF
            </button>
            <button style={{ ...styles.button, ...styles.btnPrimary }} onClick={aplicarFiltrosBackend} disabled={loading}>
              {Icons.Check} Aplicar Filtros
            </button>
          </div>
        </div>

        {/* TABLA DE RESULTADOS */}
        <h3 style={{ marginLeft: '4px', marginBottom: '1rem', color: '#4b5563', fontSize: '1.1rem' }}>
          Resultados ({totalRows} productos)
        </h3>

        <div style={{ ...styles.card, padding: 0, overflow: 'hidden', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          {loading && <div style={styles.loader}>Cargando datos...</div>}

          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>PRODUCTO</th>
                  <th style={styles.th}>STOCK</th>
                  <th style={styles.th}>PRECIO</th>
                  <th style={styles.th}>VENDIDOS</th>
                  <th style={styles.th}>CATEGORÍA</th>
                  <th style={styles.th}>TIENDA</th>
                </tr>
              </thead>
              <tbody>
                {ventasFiltradas.length > 0 ? ventasFiltradas.map((venta, index) => (
                  <tr key={venta._id} style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f8fafc' }}>
                    <td style={{ ...styles.td, color: '#94a3b8', fontSize: '0.8rem' }}>#{venta._id}</td>
                    <td style={{ ...styles.td, fontWeight: 600, color: '#1e293b' }}>{venta.nombre}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: venta.stock < 10 ? '#fef2f2' : '#f0fdf4',
                        color: venta.stock < 10 ? '#dc2626' : '#16a34a'
                      }}>
                        {venta.stock} unidades
                      </span>
                    </td>
                    <td style={{ ...styles.td, fontFamily: 'monospace', fontWeight: 600 }}>{formatMoney(venta.precio)}</td>
                    <td style={styles.td}>{venta.veces_vendido}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                        {venta.categoria}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b' }}>
                        {Icons.Store}
                        {venta.tienda || "General"}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8' }}>
                      No se encontraron resultados para los filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINACIÓN */}
        {totalPages > 0 && (
          <div style={styles.paginationContainer}>
            <span style={{ fontWeight: 600, color: '#4b5563' }}>Página</span>
            <select
              style={{ ...styles.input, width: 'auto', textAlign: 'center', padding: '0.5rem 1rem', cursor: 'pointer' }}
              value={pagination.page + 1}
              onChange={handlePageSelectChange}
              disabled={loading}
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                <option key={pageNum} value={pageNum}>{pageNum}</option>
              ))}
            </select>
            <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>de {totalPages}</span>
          </div>
        )}

        {/* TOAST */}
        {snackbar.show && (
          <div style={{
            ...styles.snackbar,
            backgroundColor: snackbar.type === 'error' ? '#ef4444' : '#10b981'
          }}>
            {snackbar.type === 'error' ? '⚠️' : '✅'} {snackbar.msg}
          </div>
        )}

      </div>
    </div>
  );
};

export default ReporteVentas;