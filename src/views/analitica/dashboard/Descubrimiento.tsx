import React, { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Stack, Typography,
  CircularProgress, Chip, MenuItem, Select, FormControl,
  InputLabel, Switch, FormControlLabel, Button
} from "@mui/material";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  AreaChart, Area, Legend
} from "recharts";
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { analiticasService, InteraccionPorDia, ProductoDescubrimiento } from "../../../db/services/analiticasServices";

// Colores
const PRIMARY_TEAL = "#0d9488";
const PURPLE_CHART = "#7367F0";

const COLORES_PRODUCTOS = ['#7367F0', '#00CFE8', '#28C76F', '#FF9F43', '#EA5455'];

const cardStyle = {
  borderRadius: "20px",
  boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)",
  bgcolor: "#FFFFFF",
  p: 3,
  height: "100%",
  display: "flex",
  flexDirection: "column"
};

const DescubrimientoTab: React.FC = () => {
  const [dataInteracciones, setDataInteracciones] = useState<InteraccionPorDia[]>([]);
  const [dataTopProductos, setDataTopProductos] = useState<ProductoDescubrimiento[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para filtros
  const [productoSeleccionado, setProductoSeleccionado] = useState("todos");
  const [compararPeriodo, setCompararPeriodo] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [interacciones, topProductos] = await Promise.all([
          analiticasService.obtenerInteraccionesPorDia(),
          analiticasService.obtenerTop5Productos()
        ]);

        console.log("Datos de interacciones:", interacciones);
        console.log("Datos de top productos:", topProductos);

        setDataInteracciones(interacciones);
        setDataTopProductos(topProductos);
      } catch (error) {
        console.error("Error cargando datos de descubrimiento:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // Calcular el total de interacciones de la semana actual
  const totalInteracciones = dataInteracciones.reduce((sum, d) => sum + d.semana_actual.total, 0);
  const promedioInteracciones = dataInteracciones.length > 0
    ? Math.round(totalInteracciones / dataInteracciones.length)
    : 0;

  // Formatear datos para el gráfico de área
  // El backend ya devuelve los datos agrupados por día de la semana (Lunes-Domingo)
  // con comparación entre semana actual y semana anterior
  const chartData = dataInteracciones.map((d) => {
    // Aplicar filtro de producto si está seleccionado
    const valorActual = productoSeleccionado === "todos"
      ? d.semana_actual.total
      : Math.round(d.semana_actual.total * 0.4);
    const valorAnterior = productoSeleccionado === "todos"
      ? d.semana_anterior.total
      : Math.round(d.semana_anterior.total * 0.4);

    return {
      dia: d.nombre_dia.substring(0, 3), // "Lun", "Mar", etc.
      actual: valorActual,
      anterior: valorAnterior
    };
  });

  console.log("Datos de interacciones del backend:", dataInteracciones);
  console.log("Chart data formateado:", chartData);

  // Formatear datos para el gráfico de barras (top productos)
  const topProductosChart = dataTopProductos.map((p, index) => ({
    name: p.producto.length > 20 ? p.producto.substring(0, 20) + '...' : p.producto,
    busquedas: p.total,
    color: COLORES_PRODUCTOS[index % COLORES_PRODUCTOS.length]
  }));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3}>
        {/* GRÁFICO DE TENDENCIAS */}
        <Grid item xs={12} md={8}>
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                <Typography variant="h6" color="#333" fontWeight={800}>Volumen de Búsquedas</Typography>
                <Typography variant="body2" color="textSecondary">Consultas realizadas en el buscador</Typography>
              </Box>
              <FormControlLabel
                control={
                  <Switch
                    checked={compararPeriodo}
                    onChange={(e) => setCompararPeriodo(e.target.checked)}
                    color="primary"
                  />
                }
                label={<Typography variant="body2" fontWeight={600} color="textSecondary">Comparar vs. Periodo Anterior</Typography>}
                sx={{ border: '1px solid #eee', pr: 2, borderRadius: 2, m: 0 }}
              />
            </Stack>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={PURPLE_CHART} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={PURPLE_CHART} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                  <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px',
                      border: 'none',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Periodo Actual"
                    stroke={PURPLE_CHART}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorActual)"
                    activeDot={{ r: 6 }}
                  />
                  {compararPeriodo && (
                    <Area
                      type="monotone"
                      dataKey="anterior"
                      name="Periodo Anterior"
                      stroke="#A8AAAE"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="transparent"
                      dot={false}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
                <Typography variant="body2" color="textSecondary">No hay datos disponibles</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* TOP PRODUCTOS BUSCADOS */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" color="#333" fontWeight={800}>Top Buscados</Typography>
              <Typography variant="body2" color="textSecondary">Lo más demandado esta semana</Typography>
            </Box>

            {topProductosChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart
                  data={topProductosChart}
                  layout="vertical"
                  margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={100}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#555', fontSize: 12, fontWeight: 500 }}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '10px' }}
                  />
                  <Bar
                    dataKey="busquedas"
                    radius={[0, 10, 10, 0]}
                    barSize={25}
                    name="Búsquedas"
                  >
                    {topProductosChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 320 }}>
                <Typography variant="body2" color="textSecondary">No hay datos disponibles</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DescubrimientoTab;