// src/pages/reportes/ReporteVentas.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Divider,
  Grid,
  Alert,
  Snackbar,
  CircularProgress // Agregado
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom"; // Agregado
import { useAuth } from "../../hooks/useAuth"; // Agregado: Hook de autenticación
import { reportesService, VentaBackend, FiltrosReporte, Tienda } from "../../db/services/reportesService";

// Columnas del DataGrid
const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 70 },
  { field: "fecha_creacion", headerName: "Fecha", width: 130 },
  { field: "nombre", headerName: "Producto", width: 150 },
  { field: "stock", headerName: "Stock", width: 100, type: "number" },
  { field: "precio", headerName: "Precio", width: 100, type: "number" },
  { field: "veces_vendido", headerName: "Veces vendido", width: 120, type: "number" },
  { field: "veces_buscado", headerName: "Veces buscado", width: 120, type: "number" },
  { field: "categoria", headerName: "Categoría", width: 150 },
];

const ReporteVentas: React.FC = () => {
  // --- 1. HOOKS DE AUTENTICACIÓN ---
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- ESTADOS EXISTENTES ---
  const [ventas, setVentas] = useState<VentaBackend[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<VentaBackend[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });

  // --- NUEVOS ESTADOS PARA TIENDAS Y PAGINACIÓN ---
  const [tiendas, setTiendas] = useState<Tienda[]>([]);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState<number | undefined>(undefined);
  const [paginacion, setPaginacion] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [filtros, setFiltros] = useState<FiltrosReporte>({
    categoria: "",
    nombre: "",
    minPrecio: undefined,
    maxPrecio: undefined,
    ordenarPor: "precio",
    orden: "asc"
  });

  // --- 2. LÓGICA DE SEGURIDAD ---
  // Define aquí qué roles pueden ver este reporte
  const tienePermiso = user && (user.role === "gerente" || user.role === "admin" || user.role === "vendedor");

  // Cargar tiendas del vendedor
  const fetchTiendas = async () => {
    try {
      const data = await reportesService.obtenerTiendasVendedor();
      setTiendas(data.tiendas);
      setTiendaSeleccionada(data.tienda_default.id_tienda);
      return data.tienda_default.id_tienda;
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
      showSnackbar("Error al cargar las tiendas", "error");
      return undefined;
    }
  };

  const fetchProductos = async (page: number = 1, id_tienda?: number) => {
    try {
      setLoading(true);
      const data = await reportesService.obtenerProductos(page, paginacion.limit, id_tienda || tiendaSeleccionada);
      setVentas(data.productos);
      setVentasFiltradas(data.productos);
      setPaginacion({
        page: data.page,
        limit: data.limit,
        total: data.total,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error("Error al obtener productos:", error);
      showSnackbar("Error al cargar los productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltrosBackend = async () => {
    try {
      setLoading(true);
      const data = await reportesService.obtenerProductosFiltrados(filtros);
      setVentasFiltradas(data);
      showSnackbar("Filtros aplicados correctamente", "success");
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
      showSnackbar("Error al aplicar filtros", "error");
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = async () => {
    try {
      setLoading(true);
      const pdfBlob = await reportesService.generarPDF(filtros);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "reporte_ventas.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSnackbar("PDF generado correctamente", "success");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      showSnackbar("Error al generar PDF", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    // Solo cargamos datos si el usuario está autenticado y tiene permiso
    if (tienePermiso) {
      const inicializar = async () => {
        const id_tienda_default = await fetchTiendas();
        if (id_tienda_default) {
          await fetchProductos(1, id_tienda_default);
        }
      };
      inicializar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Agregamos user como dependencia por si cambia

  // Manejar cambio de tienda
  const handleCambioTienda = async (id_tienda: number) => {
    setTiendaSeleccionada(id_tienda);
    await fetchProductos(1, id_tienda);
  };

  // Manejar cambio de página
  const handleCambioPagina = async (nuevaPagina: number) => {
    await fetchProductos(nuevaPagina, tiendaSeleccionada);
  };

  const limpiarFiltros = () => {
    setFiltros({
      categoria: "",
      nombre: "",
      minPrecio: undefined,
      maxPrecio: undefined,
      ordenarPor: "precio",
      orden: "asc"
    });
    fetchProductos();
  };

  const exportarCSV = () => {
    const csv = Papa.unparse(ventasFiltradas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reporte_ventas.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const categoriasDisponibles = Array.from(new Set(Array.isArray(ventas) ? ventas.map((v) => v.categoria) : []));

  const handleFiltroChange = (campo: keyof FiltrosReporte, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  // --- 3. RENDER GUARDS (Bloqueos de vista) ---

  // Caso A: Aún no sabemos quién es el usuario (Cargando auth)
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Caso B: El usuario existe pero NO tiene permisos
  if (!tienePermiso) {
    return (
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        gap: 2
      }}>
        <Typography variant="h4" color="error" sx={{ fontWeight: 'bold' }}>
          Acceso Denegado
        </Typography>
        <Typography variant="body1" color="textSecondary">
          No tienes los permisos para ver reporte.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')}>
          Volver al Inicio
        </Button>
      </Box>
    );
  }

  // Caso C: Usuario autorizado -> Renderiza el componente normal
  return (
    <Box sx={{ p: 4, maxWidth: 1200, margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Reporte de Productos
      </Typography>

      {/* Selector de Tienda */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Seleccionar Tienda
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Tienda"
              fullWidth
              value={tiendaSeleccionada || ""}
              onChange={(e) => handleCambioTienda(Number(e.target.value))}
              disabled={loading}
            >
              {tiendas.map((tienda) => (
                <MenuItem key={tienda.id_tienda} value={tienda.id_tienda}>
                  {tienda.nombre_tienda}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={8}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Mostrando {ventasFiltradas.length} de {paginacion.total} productos (Página {paginacion.page} de {paginacion.totalPages})
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Filtros */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filtros
        </Typography>

        <Grid container spacing={2} alignItems="center">

          {/* Filtro de categoría */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Categoría"
              fullWidth
              value={filtros.categoria}
              onChange={(e) => handleFiltroChange("categoria", e.target.value)}
            >
              <MenuItem value="">
                <em>Todas las categorías</em>
              </MenuItem>
              {categoriasDisponibles.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Filtro de nombre */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Nombre del producto"
              fullWidth
              value={filtros.nombre}
              onChange={(e) => handleFiltroChange("nombre", e.target.value)}
              placeholder="Buscar por nombre..."
            />
          </Grid>

          {/* Filtros de precio */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Precio mínimo"
              type="number"
              fullWidth
              value={filtros.minPrecio || ""}
              onChange={(e) => handleFiltroChange("minPrecio", e.target.value ? Number(e.target.value) : undefined)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Precio máximo"
              type="number"
              fullWidth
              value={filtros.maxPrecio || ""}
              onChange={(e) => handleFiltroChange("maxPrecio", e.target.value ? Number(e.target.value) : undefined)}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          {/* Ordenamiento */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Ordenar por"
              fullWidth
              value={filtros.ordenarPor}
              onChange={(e) => handleFiltroChange("ordenarPor", e.target.value)}
            >
              <MenuItem value="precio">Precio</MenuItem>
              <MenuItem value="nombre">Nombre</MenuItem>
              <MenuItem value="categoria">Categoría</MenuItem>
              <MenuItem value="stock">Stock</MenuItem>
              <MenuItem value="fecha_creacion">Fecha</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              label="Orden"
              fullWidth
              value={filtros.orden}
              onChange={(e) => handleFiltroChange("orden", e.target.value)}
            >
              <MenuItem value="asc">Ascendente</MenuItem>
              <MenuItem value="desc">Descendente</MenuItem>
            </TextField>
          </Grid>

          {/* Botones de acción */}
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="success"
                onClick={limpiarFiltros}
                disabled={loading}
              >
                Limpiar
              </Button>
              <Button
                variant="contained"
                onClick={aplicarFiltrosBackend}
                disabled={loading}
              >
                {loading ? "Aplicando..." : "Aplicar Filtros"}
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={exportarCSV}
                disabled={loading}
              >
                Exportar CSV
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={generarPDF}
                disabled={loading}
              >
                {loading ? "Generando..." : "Generar PDF"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">
          Resultados ({ventasFiltradas.length} productos)
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCambioPagina(paginacion.page - 1)}
            disabled={loading || paginacion.page === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleCambioPagina(paginacion.page + 1)}
            disabled={loading || paginacion.page >= paginacion.totalPages}
          >
            Siguiente
          </Button>
        </Box>
      </Box>

      {/* Tabla */}
      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={ventasFiltradas.map((v) => ({ ...v, id: v._id }))}
          columns={columns}
          loading={loading}
          pageSizeOptions={[5, 10, 25]}
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 10, page: 0 } },
          }}
          sortModel={[
            {
              field: filtros.ordenarPor || "id",
              sort: filtros.orden as 'asc' | 'desc',
            },
          ]}
        />
      </Paper>

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReporteVentas;