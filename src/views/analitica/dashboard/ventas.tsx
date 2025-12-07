import React, { useState } from "react";
import { Box, Grid, Paper, Typography, Stack, Tabs, Tab } from "@mui/material";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";

// --- IMPORTACIONES DE TUS COMPONENTES ---
import CarritosTab from "./Carrito";
import DescubrimientoTab from "./Descubrimiento";
import ActividadUsuarioTab from "./ActividadUsuario";

// --- ICONOS ---
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import TimelineIcon from '@mui/icons-material/Timeline';
import GroupIcon from '@mui/icons-material/Group';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ImageIcon from '@mui/icons-material/Image';
import CodeIcon from '@mui/icons-material/Code';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';

import { EnviosPorRegion, IngresosMensuales, EstadoCarrito } from "../../../db/services/analiticasServices";

interface DashboardProps {
  dataIngresosMensuales: IngresosMensuales[];
  dataRegiones: EnviosPorRegion[];
  dataEstadosCarrito: EstadoCarrito[];
}

// === COLORES SEPARADOS ===
const PRIMARY_COLOR = "#1F4D5D";       // Azul Oscuro (Para gráficos y textos)
const ACTIVE_TAB_COLOR = "#0d9488";    // Verde Azulado (SOLO para botones activos)

const MENU_TABS = [
  { label: "Ventas Generales", icon: <BarChartIcon fontSize="small" /> },
  { label: "Control de Carritos", icon: <ShoppingCartIcon fontSize="small" /> },
  { label: "Descubrimiento", icon: <SearchIcon fontSize="small" /> },
  { label: "Actividad de Usuario", icon: <TimelineIcon fontSize="small" /> }
];

// Mapa de colores original (regresamos al azul para el gráfico)
const MAPA_COLORES_REGIONES: Record<string, string> = {
  "Metropolitana": PRIMARY_COLOR,
  "Valparaíso": "#FF8042",
  "Biobío": "#00C49F",
  "Araucanía": "#FFBB28",
  "Maule": "#E91E63",
  "Los Lagos": "#8B5CF6",
  "Antofagasta": "#06B6D4",
  "Coquimbo": "#84CC16",
  "O'Higgins": "#F97316"
};
const COLORES_PALETA = [PRIMARY_COLOR, "#FF8042", "#00C49F", "#FFBB28", "#E91E63"];

// Helpers
const formatearDinero = (valor: number) => `$${valor.toLocaleString('es-CL')}`;
const formatearDineroEje = (valor: number) => valor >= 1000 ? `$${(valor / 1000).toFixed(0)}k` : `$${valor}`;

// Componente KPI
const KPICard = ({ title, value, period, percentage, isPositive, icon, colorIcon }: any) => (
  <Paper sx={{ p: 3, borderRadius: '20px', boxShadow: '0px 5px 25px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', position: 'relative', overflow: 'hidden', bgcolor: 'white' }}>
    <Box sx={{ position: 'absolute', top: 20, right: 20, p: 1, borderRadius: '12px', bgcolor: `${colorIcon}15`, color: colorIcon }}>{icon}</Box>
    <Box><Typography variant="body2" color="textSecondary" fontWeight={600} sx={{ mb: 0.5 }}>{title}</Typography><Typography variant="h4" fontWeight={800} sx={{ color: '#333', mb: 2 }}>{value}</Typography></Box>
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography variant="caption" color="#888" fontWeight={500}>{period}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: isPositive ? '#E5F8ED' : '#FFEBEB', color: isPositive ? '#28C76F' : '#EA5455', px: 1, py: 0.5, borderRadius: '6px' }}>
        {isPositive ? <NorthIcon sx={{ fontSize: 12, mr: 0.5 }} /> : <SouthIcon sx={{ fontSize: 12, mr: 0.5 }} />}<Typography variant="caption" fontWeight={700}>{percentage}</Typography>
      </Box>
    </Stack>
  </Paper>
);

const Ventas: React.FC<DashboardProps> = ({ dataIngresosMensuales, dataRegiones, dataEstadosCarrito }) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const kpiDataTop = [
    { title: 'Users', value: '430', period: 'Last 30 days', percentage: '32.5%', isPositive: true, icon: <GroupIcon />, color: '#7367F0' },
    { title: 'Subscriptions', value: '360', period: 'Last 30 days', percentage: '12.2%', isPositive: false, icon: <MonetizationOnIcon />, color: '#FF9F43' },
    { title: 'Generated Images', value: '43.5k', period: 'Last 30 days', percentage: '45.1%', isPositive: true, icon: <ImageIcon />, color: '#28C76F' },
    { title: 'Generated Codes', value: '34.3k', period: 'Last 30 days', percentage: '25.8%', isPositive: true, icon: <CodeIcon />, color: '#00CFE8' },
  ];

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh', p: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ mb: 3 }}><Typography variant="h5" sx={{ fontWeight: 700, color: '#333' }}>Overview</Typography></Box>

      {/* KPIS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpiDataTop.map((kpi, index) => (<Grid item xs={12} sm={6} md={3} key={index}><KPICard {...kpi} /></Grid>))}
      </Grid>

      {/* TABS DE NAVEGACIÓN */}
      <Box sx={{ bgcolor: 'rgba(31, 77, 93, 0.05)', borderRadius: '30px', p: 0.5, display: 'inline-flex', mb: 1, maxWidth: '100%', overflowX: 'auto' }}>
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
                // === AQUÍ: SI ESTÁ ACTIVO USA ACTIVE_TAB_COLOR (#0d9488), SI NO TRANSPARENTE ===
                color: tabValue === index ? 'white !important' : 'text.secondary',
                bgcolor: tabValue === index ? ACTIVE_TAB_COLOR : 'transparent',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* CONTENIDO */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pb: 2, pt: 3 }}>

        {/* PESTAÑA 0: VENTAS (Usa PRIMARY_COLOR azul) */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Paper sx={{ borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)", bgcolor: "#FFFFFF", p: 3, height: "100%" }}>
                <Typography variant="h6" color={PRIMARY_COLOR} fontWeight={700}>Ingresos Mensuales</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dataIngresosMensuales}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={formatearDineroEje} />
                    <Tooltip formatter={(val: number) => [formatearDinero(val)]} />
                    <Bar dataKey="ventas" fill={PRIMARY_COLOR} radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Paper sx={{ borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)", bgcolor: "#FFFFFF", p: 3, height: "100%" }}>
                <Typography variant="h6" color={PRIMARY_COLOR} fontWeight={700}>Regiones</Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={dataRegiones} dataKey="value" innerRadius={60} outerRadius={80}>
                      {dataRegiones.map((e, i) => <Cell key={i} fill={MAPA_COLORES_REGIONES[e.name] || COLORES_PALETA[i]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
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

export default Ventas;