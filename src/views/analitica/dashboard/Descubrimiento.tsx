import React, { useState } from "react";
import { 
  Box, Grid, Paper, Stack, Typography, Button, 
  MenuItem, Select, FormControl, InputLabel, Switch, FormControlLabel, Chip
} from "@mui/material";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  AreaChart, Area, Legend
} from "recharts";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

// Colores
const PRIMARY_TEAL = "#0d9488"; // Tu color principal
const PURPLE_CHART = "#7367F0";

// Datos Mock de Búsquedas
const dataTendenciaBusquedas = [
  { dia: 'Lun', actual: 120, anterior: 100 },
  { dia: 'Mar', actual: 180, anterior: 130 },
  { dia: 'Mie', actual: 150, anterior: 160 }, 
  { dia: 'Jue', actual: 220, anterior: 170 },
  { dia: 'Vie', actual: 290, anterior: 200 },
  { dia: 'Sab', actual: 350, anterior: 280 },
  { dia: 'Dom', actual: 310, anterior: 300 },
];

const dataTopProductos = [
  { name: 'Auriculares', busquedas: 450, color: '#7367F0' },
  { name: 'iPhone 15', busquedas: 380, color: '#00CFE8' },
  { name: 'Monitor', busquedas: 320, color: '#28C76F' },
  { name: 'Silla Gamer', busquedas: 290, color: '#FF9F43' },
  { name: 'Teclado', busquedas: 150, color: '#EA5455' },
];

const cardStyle = {
  borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)",
  bgcolor: "#FFFFFF", p: 3, height: "100%", display: "flex", flexDirection: "column"
};

const DescubrimientoTab: React.FC = () => {
  const [productoSeleccionado, setProductoSeleccionado] = useState("todos");
  const [compararPeriodo, setCompararPeriodo] = useState(true);

  const chartData = productoSeleccionado === "todos" 
    ? dataTendenciaBusquedas 
    : dataTendenciaBusquedas.map(d => ({ ...d, actual: Math.round(d.actual * 0.4), anterior: Math.round(d.anterior * 0.3) }));

  return (
    <Box>
      {/* FILTROS Y CONTROLES */}
      <Paper sx={{ ...cardStyle, p: 2, flexDirection: 'row', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: 'auto' }}>
            <Box sx={{ bgcolor: '#E0F2F1', p: 1, borderRadius: 2, color: PRIMARY_TEAL }}>
                <SearchIcon />
            </Box>
            <Box>
                <Typography variant="subtitle2" fontWeight={800} color="#333">Motor de Descubrimiento</Typography>
                <Typography variant="caption" color="textSecondary">Análisis de intención de búsqueda</Typography>
            </Box>
        </Stack>

        <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Producto / Categoría</InputLabel>
            <Select value={productoSeleccionado} label="Producto / Categoría" onChange={(e) => setProductoSeleccionado(e.target.value)} sx={{ borderRadius: 2 }}>
                <MenuItem value="todos">Todo el catálogo</MenuItem>
                <MenuItem value="iphone">Tecnología (iPhone)</MenuItem>
                <MenuItem value="sony">Audio (Sony)</MenuItem>
            </Select>
        </FormControl>

        <FormControlLabel
            control={<Switch checked={compararPeriodo} onChange={(e) => setCompararPeriodo(e.target.checked)} color="primary" />}
            label={<Typography variant="body2" fontWeight={600} color="textSecondary">Comparar vs. Periodo Anterior</Typography>}
            sx={{ border: '1px solid #eee', pr: 2, borderRadius: 2, mr: 0 }}
        />
        
        <Button startIcon={<CalendarMonthIcon />} variant="outlined" sx={{ textTransform: 'none', borderRadius: 2, borderColor: '#ddd', color: '#666' }}>Esta Semana</Button>
      </Paper>

      <Grid container spacing={3}>
        {/* GRÁFICO DE TENDENCIAS */}
        <Grid item xs={12} md={8}>
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                  <Typography variant="h6" color="#333" fontWeight={800}>Volumen de Búsquedas</Typography>
                  <Typography variant="body2" color="textSecondary">Consultas realizadas en el buscador</Typography>
              </Box>
              <Chip icon={<TrendingUpIcon />} label="+12.5% interés" sx={{ bgcolor: '#E5F8ED', color: '#28C76F', fontWeight: 700 }} />
            </Stack>
            <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={PURPLE_CHART} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={PURPLE_CHART} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle"/>
                    <Area type="monotone" dataKey="actual" name="Periodo Actual" stroke={PURPLE_CHART} strokeWidth={3} fillOpacity={1} fill="url(#colorActual)" activeDot={{ r: 6 }} />
                    {compararPeriodo && <Area type="monotone" dataKey="anterior" name="Periodo Anterior" stroke="#A8AAAE" strokeWidth={2} strokeDasharray="5 5" fill="transparent" dot={false} />}
                </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* TOP PRODUCTOS BUSCADOS */}
        <Grid item xs={12} md={4}>
          <Paper sx={cardStyle}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" color="#333" fontWeight={800}>Top Buscados</Typography>
                <Typography variant="body2" color="textSecondary">Lo más demandado hoy</Typography>
            </Box>
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={dataTopProductos} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fill: '#555', fontSize: 12, fontWeight: 500 }} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px' }} />
                    <Bar dataKey="busquedas" radius={[0, 10, 10, 0]} barSize={25} name="Búsquedas">
                        {dataTopProductos.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DescubrimientoTab;