import React from "react";
import { Box, Grid, Paper, Stack, Typography, Button, Tooltip as MuiTooltip } from "@mui/material";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  AreaChart, Area
} from "recharts";

// --- ICONOS ---
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PublicIcon from '@mui/icons-material/Public';
import BadgeIcon from '@mui/icons-material/Badge';
import DateRangeIcon from '@mui/icons-material/DateRange'; // Icono para Cohortes

// --- COLORES ---
const PURPLE_ACTIVE = "#7367F0";
const PURPLE_LIGHT = "#E0E0FC";
const PRIMARY_TEAL = "#0d9488"; // Color principal
const COLORS_ROLES = ["#7367F0", "#FF9F43"]; 

// --- DATOS MOCK ---

// 1. NUEVOS USUARIOS
const dataNewUsersBar = [
  { name: 'Feb', value: 4500, active: false },
  { name: 'Mar', value: 5000, active: true },
  { name: 'Abr', value: 2600, active: false },
  { name: 'May', value: 4200, active: false },
  { name: 'Jun', value: 1800, active: false },
  { name: 'Jul', value: 3100, active: false },
];

// 2. SESIONES HOY
const dataSesionesHoy = [
  { hora: '00:00', usuarios: 120 },
  { hora: '04:00', usuarios: 45 },
  { hora: '08:00', usuarios: 350 },
  { hora: '10:00', usuarios: 890 },
  { hora: '12:00', usuarios: 1200 },
  { hora: '14:00', usuarios: 1100 },
  { hora: '16:00', usuarios: 950 },
  { hora: '18:00', usuarios: 1400 },
  { hora: '20:00', usuarios: 1100 },
  { hora: '22:00', usuarios: 600 },
];

// 3. ROLES Y GEO
const dataRoles = [
  { name: 'Clientes', value: 8500 },
  { name: 'Vendedores', value: 1200 },
];

const dataGeo = [
  { ciudad: 'Santiago', usuarios: 4500 },
  { ciudad: 'Viña', usuarios: 1200 },
  { ciudad: 'Conce', usuarios: 980 },
  { ciudad: 'Antof.', usuarios: 650 },
  { ciudad: 'Ext.', usuarios: 300 },
];

// 4. DATOS DE COHORTES (NUEVO)
const dataCohorts = [
  { month: 'Feb', users: 4500, rates: [100, 42, 35, 32, 28, 25] },
  { month: 'Mar', users: 5000, rates: [100, 38, 32, 28, 24] },
  { month: 'Abr', users: 2600, rates: [100, 35, 30, 25] },
  { month: 'May', users: 4200, rates: [100, 32, 28] },
  { month: 'Jun', users: 1800, rates: [100, 30] },
  { month: 'Jul', users: 3100, rates: [100] },
];

// --- ESTILOS COMUNES ---
const cardStyle = {
  borderRadius: "20px", boxShadow: "0px 5px 25px rgba(0, 0, 0, 0.05)",
  bgcolor: "#FFFFFF", p: 3, height: "100%", display: "flex", flexDirection: "column"
};

// --- SUB-COMPONENTE: HEATMAP DE RETENCIÓN ---
const RetentionCohort = () => {
    // Escala de color basada en el porcentaje
    const getBgColor = (percent: number) => {
        if (percent === 100) return '#f0fdfa'; // Base muy clara
        const opacity = Math.max(0.2, percent / 60); 
        return `rgba(13, 148, 136, ${opacity})`; // PRIMARY_TEAL dinámico
    };

    const getTextColor = (percent: number) => {
        return percent > 45 ? '#ffffff' : '#1f2937';
    };

    return (
        <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                 <Stack direction="row" spacing={1} alignItems="center">
                    <Box sx={{ p: 1, bgcolor: '#f0fdfa', borderRadius: '10px' }}>
                        <DateRangeIcon sx={{ color: PRIMARY_TEAL }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" color="#333" fontWeight={800}>Retención de Usuarios (Cohortes)</Typography>
                        <Typography variant="body2" color="textSecondary">¿Vuelven los usuarios después del primer mes?</Typography>
                    </Box>
                 </Stack>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ minWidth: 600 }}>
                    {/* Header Tabla */}
                    <Stack direction="row" spacing={1} sx={{ mb: 1.5, px: 1 }}>
                        <Typography variant="caption" sx={{ width: 80, fontWeight: 700, color: '#999' }}>COHORTE</Typography>
                        <Typography variant="caption" sx={{ width: 80, fontWeight: 700, color: '#999' }}>USUARIOS</Typography>
                        {dataCohorts[0].rates.map((_, i) => (
                            <Typography key={i} variant="caption" sx={{ flex: 1, textAlign: 'center', fontWeight: 700, color: '#999' }}>
                                {i === 0 ? "MES 0" : `+${i} MES`}
                            </Typography>
                        ))}
                    </Stack>

                    {/* Filas */}
                    {dataCohorts.map((row, idx) => (
                        <Stack key={idx} direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center', px: 1 }}>
                            {/* Nombre Mes */}
                            <Typography variant="body2" fontWeight={700} sx={{ width: 80, color: '#444' }}>
                                {row.month}
                            </Typography>
                            {/* Total Usuarios */}
                            <Typography variant="caption" sx={{ width: 80, color: '#666' }}>
                                {row.users.toLocaleString()}
                            </Typography>
                            
                            {/* Celdas Heatmap */}
                            {row.rates.map((rate, i) => (
                                <MuiTooltip key={i} title={`${rate}% retenido (${Math.round(row.users * (rate/100))} usuarios)`} arrow>
                                    <Box sx={{ 
                                        flex: 1, 
                                        height: 35, 
                                        bgcolor: getBgColor(rate),
                                        borderRadius: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: getTextColor(rate),
                                        fontWeight: 600,
                                        fontSize: '0.8rem',
                                        cursor: 'default',
                                        transition: 'all 0.2s',
                                        '&:hover': { transform: 'scale(1.05)', boxShadow: 2 }
                                    }}>
                                        {rate}%
                                    </Box>
                                </MuiTooltip>
                            ))}
                            
                            {/* Relleno para efecto escalera */}
                            {Array.from({ length: 6 - row.rates.length }).map((_, i) => (
                                <Box key={`empty-${i}`} sx={{ flex: 1 }} />
                            ))}
                        </Stack>
                    ))}
                </Box>
            </Box>
        </Paper>
    );
};

// --- COMPONENTE PRINCIPAL ---
const ActividadUsuarioTab: React.FC = () => {
  return (
    <Box>
      {/* SECCIÓN 1: GRÁFICOS SUPERIORES */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        
        {/* GRÁFICO 1: NUEVOS USUARIOS */}
        <Grid item xs={12} md={6}>
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                  <Typography variant="h6" color="#333" fontWeight={800}>Nuevos Usuarios</Typography>
                  <Typography variant="body2" color="textSecondary">Registros mensuales</Typography>
              </Box>
              <Button endIcon={<KeyboardArrowDownIcon />} sx={{ color: '#888', textTransform: 'none', bgcolor: '#F5F5F5', borderRadius: 2, px: 2 }}>6 Meses</Button>
            </Stack>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dataNewUsersBar}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}/>
                    <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={30}>
                      {dataNewUsersBar.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.active ? PURPLE_ACTIVE : PURPLE_LIGHT} />
                      ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* GRÁFICO 2: USUARIOS ACTIVOS HOY */}
        <Grid item xs={12} md={6}>
          <Paper sx={cardStyle}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="h6" color="#333" fontWeight={800}>Actividad Diaria</Typography>
                  </Stack>
                  <Typography variant="body2" color="textSecondary">Usuarios activos por hora (Promedio)</Typography>
              </Box>
              <Typography variant="h4" fontWeight={800} color={PRIMARY_TEAL}>1.4k</Typography>
            </Stack>
            
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={dataSesionesHoy}>
                    <defs>
                        <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={PRIMARY_TEAL} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={PRIMARY_TEAL} stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: '#888' }} dy={10} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} />
                    <Area 
                        type="monotone" 
                        dataKey="usuarios" 
                        stroke={PRIMARY_TEAL} 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorUsuarios)" 
                    />
                </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* SECCIÓN 2: SEGMENTACIÓN */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: PRIMARY_TEAL }}>
          Segmentación y Calidad
      </Typography>

      <Grid container spacing={3}>
        {/* 1. ROLES */}
        <Grid item xs={12} md={6}>
            <Paper sx={cardStyle}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <BadgeIcon sx={{ color: PRIMARY_TEAL }} />
                    <Typography variant="subtitle1" fontWeight={700}>Roles (Comparativa)</Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dataRoles} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px' }} />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                            {dataRoles.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS_ROLES[index % COLORS_ROLES.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>

        {/* 2. GEOGRAFÍA */}
        <Grid item xs={12} md={6}>
            <Paper sx={cardStyle}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <PublicIcon sx={{ color: PRIMARY_TEAL }} />
                    <Typography variant="subtitle1" fontWeight={700}>Top Geografía</Typography>
                </Stack>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart layout="vertical" data={dataGeo} margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="ciudad" type="category" width={70} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '10px' }} />
                        <Bar dataKey="usuarios" fill="#00CFE8" radius={[0, 10, 10, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Grid>

     

      </Grid>
    </Box>
  );
};

export default ActividadUsuarioTab;