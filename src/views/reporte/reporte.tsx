import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Paper,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  InputAdornment
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Papa from "papaparse";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { reportesService, VentaBackend, FiltrosReporte, Tienda } from "../../db/services/reportesService";

// --- ICONOS ---
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InventoryIcon from '@mui/icons-material/Inventory';
import StoreIcon from '@mui/icons-material/Store'; // Nuevo icono para Tienda

// --- CONSTANTES DE ESTILO ---
const PRIMARY_COLOR = "#0d9488";
const CLEAN_BTN_COLOR = "#f97316";
const BACKGROUND_COLOR = "#f8f9fa";

const cardStyle = {
  borderRadius: "20px",
  boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)",
  bgcolor: "#FFFFFF",
  p: 3,
  mb: 3
};

// --- COLUMNAS ACTUALIZADAS ---
const columns: GridColDef[] = [
  { field: "_id", headerName: "ID", width: 70 },
  {
    field: "nombre", headerName: "Producto", width: 200,
    renderCell: (params) => (
      <Typography variant="body2" fontWeight={600} color="#333">
        {params.value}
      </Typography>
    )
  },
  {
    field: "stock", headerName: "Stock", width: 100, type: "number",
    renderCell: (params) => (
      <Box sx={{ bgcolor: params.value < 10 ? '#ffebee' : '#e8f5e9', color: params.value < 10 ? '#c62828' : '#2e7d32', px: 1, borderRadius: 1, fontWeight: 700 }}>
        {params.value}
      </Box>
    )
  },
  {
    field: "precio", headerName: "Precio", width: 120, type: "number",
    valueFormatter: (value: any) => {
      if (value == null) return "";
      return `$${Number(value).toLocaleString('es-CL')}`;
    }
  },
  { field: "veces_vendido", headerName: "Vendidos", width: 100, type: "number" },
  { field: "categoria", headerName: "Categoría", width: 130 },
  // === NUEVA COLUMNA TIENDA ===
  {
    field: "tienda", headerName: "Tienda", width: 150,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
        <StoreIcon sx={{ fontSize: 16, color: '#aaa' }} />
        <Typography variant="body2">{params.value || "General"}</Typography>
      </Stack>
    )
  },
];

export const ReporteVentas: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ventas, setVentas] = useState<VentaBackend[]>([]);
  const [ventasFiltradas, setVentasFiltradas] = useState<VentaBackend[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" });
  const [tiendas, setTiendas] = useState<Tienda[]>([]);

  const [filtros, setFiltros] = useState<FiltrosReporte>({
    fechaInicio: "",
    fechaFin: "",
    categoria: "",
    nombre: "",
    id_tienda: undefined,
    minPrecio: undefined,
    maxPrecio: undefined,
    ordenarPor: "precio",
    orden: "asc"
  });

  const tienePermiso = user && (user.role === "gerente" || user.role === "admin");

  const fetchTiendas = async () => {
    try {
      const data = await reportesService.obtenerTiendasVendedor();
      setTiendas(data.tiendas);
    } catch (error) {
      console.error("Error al obtener tiendas:", error);
    }
  };

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const data = await reportesService.obtenerProductos();
      setVentas(data.productos);  // Extrae el array de productos del objeto
      setVentasFiltradas(data.productos);
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
      a.style.display = "none"; a.href = url; a.download = "reporte_ventas.pdf";
      document.body.appendChild(a); a.click();
      window.URL.revokeObjectURL(url); document.body.removeChild(a);
      showSnackbar("PDF generado correctamente", "success");
    } catch (error) {
      showSnackbar("Error al generar PDF", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    if (tienePermiso) {
      fetchTiendas();
      fetchProductos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: "", fechaFin: "",
      categoria: "", nombre: "", id_tienda: undefined,
      minPrecio: undefined, maxPrecio: undefined,
      ordenarPor: "precio", orden: "asc"
    });
    fetchProductos();
  };

  const exportarCSV = () => {
    const csv = Papa.unparse(ventasFiltradas);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "reporte_ventas.csv";
    a.click(); URL.revokeObjectURL(url);
  };

  // Extraemos las categorías únicas de los datos cargados
  const categoriasDisponibles = Array.from(new Set(ventas.map((v) => v.categoria).filter(Boolean)));

  const handleFiltroChange = (campo: keyof typeof filtros, valor: any) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  // --- RENDER GUARDS ---
  if (!user) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress sx={{ color: PRIMARY_COLOR }} /></Box>;

  if (!tienePermiso) {
    return (
      <Box sx={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", px: 2, bgcolor: BACKGROUND_COLOR }}>
        <Paper sx={{ ...cardStyle, maxWidth: 400, textAlign: "center" }}>
          <Typography variant="h4" color="error" sx={{ fontWeight: "bold", mb: 2 }}>Acceso Denegado</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>No tienes permisos. Solo <strong>Gerente</strong> o <strong>Admin</strong>.</Typography>
          <Button variant="contained" onClick={() => navigate('/')} sx={{ bgcolor: PRIMARY_COLOR }}>Volver al Inicio</Button>
        </Paper>
      </Box>
    );
  }

  // --- RENDER PRINCIPAL ---
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: BACKGROUND_COLOR, p: 4 }}>
      <Box sx={{ maxWidth: 1200, margin: "auto" }}>

        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <InventoryIcon sx={{ fontSize: 40, color: PRIMARY_COLOR }} />
          <Box>
            <Typography variant="h4" fontWeight={800} color="#333">Reporte de Productos</Typography>
            <Typography variant="body2" color="textSecondary">Gestión de inventario y ventas</Typography>
          </Box>
        </Stack>

        {/* Tarjeta de Filtros */}
        <Paper sx={cardStyle}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
            <FilterListIcon sx={{ color: PRIMARY_COLOR }} />
            <Typography variant="h6" fontWeight={700} color={PRIMARY_COLOR}>
              Filtros de Búsqueda
            </Typography>
          </Stack>

          <Grid container spacing={3}>

            {/* Filtro Nombre */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Nombre del producto" fullWidth size="small"
                value={filtros.nombre} onChange={(e) => handleFiltroChange("nombre", e.target.value)}
                placeholder="Buscar..."
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: <InputAdornment position="end"><SearchIcon sx={{ color: '#ccc' }} /></InputAdornment>
                }}
              />
            </Grid>

            {/* Filtro Categoría */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select label="Categoría" fullWidth size="small"
                value={filtros.categoria} onChange={(e) => handleFiltroChange("categoria", e.target.value)}
                InputProps={{ sx: { borderRadius: 2 } }}
              >
                <MenuItem value=""><em>Todas</em></MenuItem>
                {categoriasDisponibles.map((cat) => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </TextField>
            </Grid>

            {/* === FILTRO: TIENDA === */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select label="Tienda" fullWidth size="small"
                value={filtros.id_tienda || ""} onChange={(e) => handleFiltroChange("id_tienda", e.target.value ? Number(e.target.value) : undefined)}
                InputProps={{ sx: { borderRadius: 2 } }}
              >
                <MenuItem value=""><em>Todas las tiendas</em></MenuItem>
                {tiendas.map((tienda) => (
                  <MenuItem key={tienda.id_tienda} value={tienda.id_tienda}>{tienda.nombre_tienda}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Filtros Precios */}
            <Grid item xs={6} sm={3} md={1.5}>
              <TextField
                label="Min $" type="number" fullWidth size="small"
                value={filtros.minPrecio || ""} onChange={(e) => handleFiltroChange("minPrecio", e.target.value ? Number(e.target.value) : undefined)}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={1.5}>
              <TextField
                label="Max $" type="number" fullWidth size="small"
                value={filtros.maxPrecio || ""} onChange={(e) => handleFiltroChange("maxPrecio", e.target.value ? Number(e.target.value) : undefined)}
                InputProps={{ sx: { borderRadius: 2 } }}
              />
            </Grid>

            {/* Ordenamiento */}
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select label="Ordenar por" fullWidth size="small"
                value={filtros.ordenarPor} onChange={(e) => handleFiltroChange("ordenarPor", e.target.value)}
                InputProps={{ sx: { borderRadius: 2 } }}
              >
                <MenuItem value="precio">Precio</MenuItem>
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="categoria">Categoría</MenuItem>
                <MenuItem value="stock">Stock</MenuItem>
                <MenuItem value="veces_vendido">Vendidos</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select label="Orden" fullWidth size="small"
                value={filtros.orden} onChange={(e) => handleFiltroChange("orden", e.target.value)}
                InputProps={{ sx: { borderRadius: 2 } }}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </TextField>
            </Grid>

            {/* BOTONES DE ACCIÓN */}
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", flexWrap: "wrap", mt: 1 }}>

                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={limpiarFiltros} disabled={loading}
                  sx={{
                    color: CLEAN_BTN_COLOR,
                    borderColor: CLEAN_BTN_COLOR,
                    borderRadius: 2,
                    textTransform: 'none',
                    '&:hover': { bgcolor: `${CLEAN_BTN_COLOR}10`, borderColor: CLEAN_BTN_COLOR }
                  }}
                >
                  Limpiar Filtros
                </Button>

                <Button
                  variant="contained"
                  startIcon={<CheckCircleIcon />}
                  onClick={aplicarFiltrosBackend} disabled={loading}
                  sx={{ bgcolor: PRIMARY_COLOR, borderRadius: 2, textTransform: 'none', '&:hover': { bgcolor: '#0b7a70' } }}
                >
                  {loading ? "Aplicando..." : "Aplicar Filtros"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportarCSV} disabled={loading}
                  sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, borderRadius: 2, textTransform: 'none' }}
                >
                  CSV
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={generarPDF} disabled={loading}
                  sx={{ color: PRIMARY_COLOR, borderColor: PRIMARY_COLOR, borderRadius: 2, textTransform: 'none' }}
                >
                  PDF
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Tarjeta de Resultados */}
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#555', ml: 1 }}>
          Resultados ({ventasFiltradas.length} productos)
        </Typography>

        <Paper sx={{ ...cardStyle, p: 0, overflow: 'hidden', height: 600 }}>
          <DataGrid
            rows={ventasFiltradas.map((v) => ({ ...v, id: v._id }))}
            columns={columns}
            loading={loading}
            pageSizeOptions={[10, 25, 50]}
            pagination
            initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            sortModel={[{ field: filtros.ordenarPor || "id", sort: filtros.orden as 'asc' | 'desc' }]}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                bgcolor: `${PRIMARY_COLOR}10`,
                color: PRIMARY_COLOR,
                fontWeight: 800,
              },
              '& .MuiDataGrid-row:hover': {
                bgcolor: `${PRIMARY_COLOR}05`,
              }
            }}
          />
        </Paper>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} sx={{ borderRadius: 3 }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </Box>
  );
};

export default ReporteVentas;