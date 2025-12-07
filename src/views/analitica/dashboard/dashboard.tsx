import React, { useState } from "react";
import { Box, Grid, Paper, Typography, Stack, Tabs, Tab, Chip, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

// --- IMPORTACIONES DE TUS COMPONENTES ---
import CarritosTab from "./Carrito";
import DescubrimientoTab from "./Descubrimiento";
import ActividadUsuarioTab from "./ActividadUsuario";

// --- ICONOS ---
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PublicIcon from '@mui/icons-material/Public';
import ShowChartIcon from '@mui/icons-material/ShowChart';

import { EnviosPorRegion, IngresosMensuales, EstadoCarrito } from "../../../db/services/analiticasServices";

interface KPIData {
  ingresos: number;
  porcentajeIngresos: number;
  mejorRegion: string;
  porcentajeRegion: number;
}

interface DashboardProps {
  dataIngresosMensuales: IngresosMensuales[];
  dataRegiones: EnviosPorRegion[];
  dataEstadosCarrito: EstadoCarrito[];
  kpis: KPIData;
}

// === COLORES Y ESTILOS GLOBALES ===
const PRIMARY_COLOR = "#1F4D5D";
const ACTIVE_TAB_COLOR = "#0d9488";
const CARD_SHADOW = "0px 5px 25px rgba(0, 0, 0, 0.05)";
const CARD_RADIUS = "20px";

const MENU_TABS = [
  { label: "Ventas Generales", icon: <BarChartIcon fontSize="small" /> },
  { label: "Control de Carritos", icon: <ShoppingCartIcon fontSize="small" /> },
  { label: "Descubrimiento", icon: <SearchIcon fontSize="small" /> },
  { label: "Actividad de Usuario", icon: <TimelineIcon fontSize="small" /> }
];

// === NUEVA PALETA DE 16 COLORES ===
const COLORES_16 = [
  "#1F4D5D", // 1. Azul Oscuro (Brand) - Metropolitana
  "#FF8042", // 2. Naranja Vivo - Valparaíso
  "#00C49F", // 3. Verde Agua - Biobío
  "#FFBB28", // 4. Amarillo - Araucanía
  "#E91E63", // 5. Rosa Fuerte - Maule
  "#8B5CF6", // 6. Violeta - Los Lagos
  "#06B6D4", // 7. Cian - Antofagasta
  "#84CC16", // 8. Lima - Coquimbo
  "#F97316", // 9. Naranja Rojizo - O'Higgins
  "#3B82F6", // 10. Azul Brillante - Ñuble
  "#10B981", // 11. Esmeralda - Los Ríos
  "#F43F5E", // 12. Rosa Coral - Tarapacá
  "#6366F1", // 13. Índigo - Atacama
  "#D946EF", // 14. Fucsia - Arica y Parinacota
  "#EAB308", // 15. Mostaza - Aysén
  "#64748B"  // 16. Gris Azulado - Magallanes
];

// Mapeo explícito para las regiones de Chile
const MAPA_COLORES_REGIONES: Record<string, string> = {
  "Metropolitana": COLORES_16[0],
  "Valparaíso": COLORES_16[1],
  "Biobío": COLORES_16[2],
  "Araucanía": COLORES_16[3],
  "Maule": COLORES_16[4],
  "Los Lagos": COLORES_16[5],
  "Antofagasta": COLORES_16[6],
  "Coquimbo": COLORES_16[7],
  "O'Higgins": COLORES_16[8],
  "Ñuble": COLORES_16[9],
  "Los Ríos": COLORES_16[10],
  "Tarapacá": COLORES_16[11],
  "Atacama": COLORES_16[12],
  "Arica y Parinacota": COLORES_16[13],
  "Aysén": COLORES_16[14],
  "Magallanes": COLORES_16[15]
};

const formatearDinero = (valor: number) => `$${valor.toLocaleString('es-CL')}`;
const formatearDineroEje = (valor: number) => valor >= 1000 ? `$${(valor / 1000).toFixed(0)}k` : `$${valor}`;
const obtenerMesActual = () => new Date().toLocaleString('es-CL', { month: 'long' });

const Dashboard: React.FC<DashboardProps> = ({
  dataIngresosMensuales,
  dataRegiones,
  dataEstadosCarrito,
  kpis
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [tipoGrafico, setTipoGrafico] = useState<'bar' | 'line'>('bar');
  const [activeIndexRegion, setActiveIndexRegion] = useState<number | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const handleTipoGraficoChange = (event: React.MouseEvent<HTMLElement>, newAlignment: 'bar' | 'line' | null) => {
    if (newAlignment !== null) setTipoGrafico(newAlignment);
  };

  const onPieEnter = (_: any, index: number) => setActiveIndexRegion(index);
  const onPieLeave = () => setActiveIndexRegion(null);

  const totalEnviosRegiones = dataRegiones.reduce((acc, cur) => acc + cur.value, 0);
  const centerData = activeIndexRegion !== null
    ? { label: dataRegiones[activeIndexRegion].name, value: dataRegiones[activeIndexRegion].value }
    : { label: "Total Envíos", value: totalEnviosRegiones };

  const commonPaperStyle = {
    p: 3,
    borderRadius: CARD_RADIUS,
    boxShadow: CARD_SHADOW,
    bgcolor: 'white',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh', p: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      {/* HEADER */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>Overview</Typography>
      </Box>

      {/* TABS */}
      <Box sx={{ bgcolor: 'rgba(31, 77, 93, 0.05)', borderRadius: '30px', p: 0.5, display: 'inline-flex', mb: 3, maxWidth: '100%', overflowX: 'auto' }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" TabIndicatorProps={{ sx: { display: 'none' } }}>
          {MENU_TABS.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              iconPosition="start"
              label={tab.label}
              sx={{
                borderRadius: '25px',
                minHeight: '40px',
                px: 3,
                textTransform: 'none',
                fontWeight: 600,
                color: tabValue === index ? 'white !important' : 'text.secondary',
                bgcolor: tabValue === index ? ACTIVE_TAB_COLOR : 'transparent',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 2 }}>

        {/* === PESTAÑA 0: VENTAS GENERALES === */}
        {tabValue === 0 && (
          <Grid container spacing={3}>

            {/* 1. KPIs */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ ...commonPaperStyle, justifyContent: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Ingresos ({obtenerMesActual()})
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: PRIMARY_COLOR, mt: 1 }}>
                      {formatearDinero(kpis.ingresos)}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(31, 77, 93, 0.1)', color: PRIMARY_COLOR }}>
                    <AttachMoneyIcon />
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                  <Chip
                    icon={kpis.porcentajeIngresos >= 0 ? <NorthIcon sx={{ fontSize: '12px !important' }} /> : <SouthIcon sx={{ fontSize: '12px !important' }} />}
                    label={`${Math.abs(kpis.porcentajeIngresos)}%`}
                    size="small"
                    sx={{
                      fontWeight: 700,
                      borderRadius: '6px',
                      bgcolor: kpis.porcentajeIngresos >= 0 ? '#E5F8ED' : '#FFEBEB',
                      color: kpis.porcentajeIngresos >= 0 ? '#28C76F' : '#EA5455',
                      '& .MuiChip-icon': { color: 'inherit' }
                    }}
                  />
                  <Typography variant="caption" color="textSecondary" fontWeight={500}>
                    Respecto al mes anterior
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ ...commonPaperStyle, justifyContent: 'center' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="caption" color="textSecondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Mejor Región de Distribución
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ color: PRIMARY_COLOR, mt: 1 }}>
                      {kpis.mejorRegion}
                    </Typography>
                  </Box>
                  <Box sx={{ p: 1, borderRadius: '12px', bgcolor: 'rgba(255, 128, 66, 0.1)', color: '#FF8042' }}>
                    <PublicIcon />
                  </Box>
                </Stack>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2 }}>
                  <Chip
                    label={`${kpis.porcentajeRegion}% Vol.`}
                    size="small"
                    sx={{ fontWeight: 700, borderRadius: '6px', bgcolor: '#E3F2FD', color: '#1976D2' }}
                  />
                  <Typography variant="caption" color="textSecondary" fontWeight={500}>
                    Total de envíos este mes
                  </Typography>
                </Stack>
              </Paper>
            </Grid>

            {/* 2. SECCIÓN GRÁFICOS: INGRESOS (CON MARGEN PARA VER LOS MESES) */}
            <Grid item xs={12} lg={8}>
              <Paper sx={commonPaperStyle}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6" color={PRIMARY_COLOR} fontWeight={700}>
                    Ingresos Mensuales 2025
                  </Typography>
                  <ToggleButtonGroup
                    value={tipoGrafico}
                    exclusive
                    onChange={handleTipoGraficoChange}
                    aria-label="tipo de grafico"
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        border: 'none', borderRadius: '8px !important', mx: 0.5, color: 'text.secondary',
                        '&.Mui-selected': { bgcolor: 'rgba(31, 77, 93, 0.1)', color: PRIMARY_COLOR }
                      }
                    }}
                  >
                    <ToggleButton value="bar"><BarChartIcon /></ToggleButton>
                    <ToggleButton value="line"><ShowChartIcon /></ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                <Box sx={{ flexGrow: 1, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {tipoGrafico === 'bar' ? (
                      <BarChart
                        data={dataIngresosMensuales}
                        // IMPORTANTE: Agregamos margen inferior (bottom) para que quepan las etiquetas
                        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

                        <XAxis
                          dataKey="mes"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#888', fontSize: 12 }}
                          dy={10} // Empuja el texto un poco hacia abajo
                          interval={0} // Fuerza a mostrar TODOS los meses
                          tickFormatter={(mes) => mes.slice(0, 3)} // Abrevia a 3 letras
                          minTickGap={0}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#888', fontSize: 11 }}
                          tickFormatter={(valor) => `$${valor.toLocaleString('es-CL')}`}
                          width={80}
                        />

                        <Tooltip
                          cursor={{ fill: 'transparent' }}
                          contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }}
                          formatter={(val: number) => [formatearDinero(val), "Ventas"]}
                        />
                        <Bar dataKey="ventas" fill={PRIMARY_COLOR} radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    ) : (
                      <LineChart
                        data={dataIngresosMensuales}
                        // IMPORTANTE: El mismo margen aquí
                        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />

                        <XAxis
                          dataKey="mes"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#888', fontSize: 12 }}
                          dy={10}
                          interval={0}
                          tickFormatter={(mes) => mes.slice(0, 3)}
                          minTickGap={0}
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: '#888', fontSize: 11 }}
                          tickFormatter={(valor) => `$${valor.toLocaleString('es-CL')}`}
                          width={80}
                        />

                        <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0px 4px 20px rgba(0,0,0,0.1)' }} formatter={(val: number) => [formatearDinero(val), "Ventas"]} />
                        <Line type="monotone" dataKey="ventas" stroke={PRIMARY_COLOR} strokeWidth={3} dot={{ r: 4, fill: PRIMARY_COLOR, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* 3. GRÁFICOS: DISTRIBUCIÓN REGIONAL (ESPACIADO MEJORADO) */}
            <Grid item xs={12} lg={4}>
              <Paper sx={commonPaperStyle}>
                <Typography variant="h6" color={PRIMARY_COLOR} fontWeight={700} sx={{ mb: 2 }}>
                  Distribución Regional
                </Typography>

                {/* CAMBIO 1: Aumentamos minHeight de 300 a 400 para dar espacio vertical real */}
                <Box sx={{ flexGrow: 1, minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dataRegiones}
                        dataKey="value"
                        // CAMBIO 2: Reducimos un poco los radios para que el gráfico no se vea gigante comparado con el texto
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        onMouseEnter={onPieEnter}
                        onMouseLeave={onPieLeave}
                      >
                        {dataRegiones.map((e, i) => (
                          <Cell
                            key={i}
                            fill={MAPA_COLORES_REGIONES[e.name] || COLORES_16[i % COLORES_16.length]}
                            stroke="none"
                            style={{
                              transition: 'all 0.3s ease',
                              opacity: activeIndexRegion === null || activeIndexRegion === i ? 1 : 0.3,
                              cursor: 'pointer'
                            }}
                          />
                        ))}
                      </Pie>
                      <Tooltip active={false} />

                      {/* CAMBIO 3: Ajustes a la leyenda para separarla */}
                      <Legend
                        verticalAlign="bottom"
                        height={100} // Reservamos más altura para que las filas no se corten
                        iconType="circle"
                        // paddingTop aleja la leyenda del círculo. lineHeight separa las filas de texto.
                        wrapperStyle={{ fontSize: '11px', paddingTop: '40px', lineHeight: '20px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Texto central ajustado un poco hacia arriba por el nuevo espacio */}
                  <Box sx={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                    <Typography variant="body2" color="textSecondary" fontWeight={600}>
                      {centerData.label}
                    </Typography>
                    <Typography variant="h5" color={PRIMARY_COLOR} fontWeight={800}>
                      {centerData.value}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && <CarritosTab dataEstadosCarrito={dataEstadosCarrito} />}
        {tabValue === 2 && <DescubrimientoTab />}
        {tabValue === 3 && <ActividadUsuarioTab />}

      </Box>
    </Box>
  );
};

export default Dashboard;