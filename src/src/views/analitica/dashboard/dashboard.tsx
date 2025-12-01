import React from "react";
import { 
  Box, Grid, Paper, Typography, Card, CardContent, 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Divider, Chip, Stack 
} from "@mui/material"; // <--- Importamos Stack
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";

// Definimos qué datos necesita este dashboard para funcionar
interface DashboardProps {
  kpis: {
    ingresos: number;
    porcentajeIngresos: number;
    pedidos: number;
    mejorRegion: string;
    porcentajeRegion: number;
  };
  dataTendencias: { mes: string; ventas: number; meta: number }[];
  dataRegiones: { name: string; value: number }[];
}

const COLORES_REGIONES = [
  "#1F4D5D", "#FF8042", "#00C49F", "#FFBB28", "#E91E63", 
  "#9C27B0", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", 
  "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFC107", 
  "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B"
];

// --- FUNCIONES AUXILIARES DE FORMATO ---
const formatearDineroEje = (valor: number) => {
  if (valor >= 1000000) return `$${(valor / 1000000).toFixed(1)}M`;
  if (valor >= 1000) return `$${(valor / 1000).toFixed(0)}k`;
  return `$${valor}`;
};

const formatearTooltip = (valor: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(valor);
};

// Función para obtener el nombre del mes actual
const obtenerMesActual = () => {
  const fecha = new Date();
  return fecha.toLocaleString('es-CL', { month: 'long' });
};

const Dashboard: React.FC<DashboardProps> = ({ kpis, dataTendencias, dataRegiones }) => {
  
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F4D5D' }}>
          Analíticas de Ventas
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Visualización de rendimiento global y regional.
        </Typography>
      </Box>

      {/* --- SECCIÓN DE KPIs --- */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* 1. INGRESOS TOTALES (CON LÓGICA DINÁMICA Y TEXTO DE MES) */}
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              {/* Título dinámico: EJ "INGRESOS (NOVIEMBRE)" */}
              <Typography color="textSecondary" gutterBottom variant="overline" sx={{ textTransform: 'uppercase' }}>
                Ingresos ({obtenerMesActual()})
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                ${kpis.ingresos.toLocaleString()}
              </Typography>
              
              {/* Lógica para color, signo (+/-) y texto explicativo */}
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Chip 
                  label={`${kpis.porcentajeIngresos > 0 ? '+' : ''}${kpis.porcentajeIngresos}%`} 
                  color={kpis.porcentajeIngresos >= 0 ? "success" : "error"} 
                  size="small" 
                />
                <Typography variant="caption" color="textSecondary">
                  Respecto al mes anterior
                </Typography>
              </Stack>

            </CardContent>
          </Card>
        </Grid>

        {/* 2. PEDIDOS ACTIVOS */}
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="overline">Pedidos Activos</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {kpis.pedidos}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                En proceso de envío
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* 3. MEJOR REGIÓN */}
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="overline">Mejor Región de envios</Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{kpis.mejorRegion}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {kpis.porcentajeRegion}% del volumen total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- GRÁFICOS --- */}
      <Grid container spacing={3}>
        
        {/* TENDENCIA SEMESTRAL */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3, height: 450, borderRadius: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Tendencia Semestral
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={dataTendencias} margin={{ top: 5, right: 5, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="mes" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  width={60} 
                  tickFormatter={formatearDineroEje} 
                  tick={{ fill: '#666', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  formatter={(value: number) => [formatearTooltip(value), "Ventas"]}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="ventas" fill="#1F4D5D" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* DISTRIBUCIÓN REGIONAL */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3, height: 450, borderRadius: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Envios por Region
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: '85%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dataRegiones}
                    cx="45%" 
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dataRegiones.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES_REGIONES[index % COLORES_REGIONES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend 
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ 
                      maxHeight: '320px', 
                      overflowY: 'auto',
                      paddingLeft: '20px',
                      width: '150px'
                    }}
                    formatter={(value) => (
                      <span title={value} style={{ fontSize: '12px', color: '#555' }}>
                        {value.length > 14 ? `${value.substring(0, 14)}...` : value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* DETALLE REGIONAL (TABLA) */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Detalle Regional
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Región</TableCell>
                    <TableCell align="right">Ventas Totales</TableCell>
                    <TableCell align="right">Estado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dataRegiones.map((row) => (
                    <TableRow key={row.name} hover>
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="right">${row.value.toLocaleString()}</TableCell>
                      <TableCell align="right">
                         <Chip label="Activo" color="success" size="small" variant="outlined"/>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default Dashboard;